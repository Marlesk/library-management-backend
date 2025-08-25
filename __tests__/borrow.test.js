// npx jest borrow.test.js
const request = require('supertest')
const app = require('../app')
const getUserToken = require('../helpers/getUserToken')
const getUniqueUserToken = require('../helpers/getUniqueUserToken')
const Book = require('../models/book.model')
const User = require('../models/user.model')
const Borrow = require('../models/borrow.model')
const authService = require('../services/auth.service')
const getAdminToken = require('../helpers/getAdminToken')
const borrowService = require('../services/borrow.service')

describe('Requset for /api/borrows', () => {

  it('Borrow request submitted successfully', async() => {
    const userToken = await getUserToken()
    const timestamp = Date.now()
    const book = await Book.create({
      title: 'Test Book',
      author: 'Author A',
      isbn: `isbn-${timestamp}-1`
    })
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: book.isbn })

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('ISBN is a required field', async() => {
    const userToken = await getUniqueUserToken()
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: '' })

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Book not found', async() => {
    const userToken = await getUniqueUserToken()
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: '97819133' })

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('The book is currently unavailable (already borrowed)', async() => {
    const userToken = await getUniqueUserToken()
    const timestamp = Date.now()
    const book = await Book.create({
      title: 'Test Borrow Book',
      author: 'Author C',
      isbn: `isbn-${timestamp}-2`,
      available: false
    })
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: book.isbn })

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('You already have a pending borrow request', async() => {
    const userToken = await getUserToken()
    const timestamp = Date.now()
    const book = await Book.create({
      title: 'Test Book',
      author: 'Author D',
      isbn: `isbn-${timestamp}-3`
    })
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: book.isbn })

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('You already have a borrowed book. Return it before requesting another', async() => {
    const timestamp = Date.now()
    const user = await User.create({
      firstname: 'Borrowed',
      lastname: 'User',
      username: `borrowed_user_${timestamp}`,
      email: `borrowed_user_${timestamp}@test.com`,
      password: 'Test123!',
      role: 'user'
    })
    const book1 = await Book.create({
      title: 'Test Book 1',
      author: 'Author A',
      isbn: `isbn-${timestamp}-4`,
      available: false // < το έχει ήδη δανειστεί
    })

    // 3. Δημιουργία borrowed εγγραφής
    await Borrow.create({
      userId: user._id,
      bookId: book1._id,
      borrowCode: `BR-${timestamp}`,
      status: 'borrowed',
      borrowDate: new Date(),
      returnDate: null
    })

    // 4. Δημιουργία δεύτερου διαθέσιμου βιβλίου
    const book2 = await Book.create({
      title: 'Test Book 2',
      author: 'Author B',
      isbn: `isbn-${timestamp}-5`,
      available: true
    })

    // 5. Πάρε token
    const userToken = await authService.generateAccessToken(user)

    // 6. Κάνε αίτημα για το δεύτερο βιβλίο
    const res = await request(app)
      .post('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isbn: book2.isbn })

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Fetched borrow record succesfully', async() => {
    const userToken = await getUserToken()
    const res = await request(app)
      .get('/api/borrows')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('No borrowed records found', async() => {
    const userToken = await getUserToken()
    const res = await request(app)
      .get('/api/borrows/?status=borrowed')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('No returned records found', async() => {
    const userToken = await getUserToken()
    const res = await request(app)
      .get('/api/borrows/?status=returned')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })
 
})

describe('Request for /api/admin/borrows', () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Borrow records fetched successfully', async() => {
    const res = await request(app)
      .get('/api/admin/borrows')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('No returned records found', async() => {
    const res = await request(app)
      .get('/api/admin/borrows/?status=returned')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

})

describe('Request for /api/admin/borrows/accept/:code', () => {
  
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })
  
  it('Borrow request with code accepted successfully', async() => {
    const result = await borrowService.findBorrowCode()
    const res = await request(app)
      .post('/api/admin/borrows/accept/'+ result.borrowCode)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('Invalid borrow code', async () => {
    const invalidCode = 'INVALIDCODE123'

    const res = await request(app)
      .post('/api/admin/borrows/accept/' + invalidCode)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

})


describe('Request for /api/admin/borrows/returns/:isbn', () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })
  
  it('Book return completed successfully', async() => {
    const result = await borrowService.findBorrowIsbn()
    const res = await request(app)
      .post('/api/admin/borrows/returns/'+ result.isbn)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

   it('Invalid isbn', async () => {
    const invalidIsbn = '451258'

    const res = await request(app)
      .post('/api/admin/borrows/returns/' + invalidIsbn)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })


})