// npx jest book.test.js
const request = require('supertest')
const app = require('../app')
const bookService = require('../services/book.service')
const getAdminToken = require('../helpers/getAdminToken')
const getUserToken = require('../helpers/getUserToken')
const getExpiredUserToken = require('../helpers/getExpiredUserToken')
const Book = require('../models/book.model')

describe("Request for /api/books", () => {
  let userToken
  const timestamp = Date.now()
  
  beforeAll(async() => {
    userToken = await getUserToken()
    await Book.create({
      title: 'Test Book',
      author: 'Author X',
      isbn: `isbn-${timestamp}`
    })
  })

  it('View all books in library', async() => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  // it('Invalid Token', async() => {
  //   const res = await request(app)
  //     .get('/api/books')
  //     .set('Authorization', `Bearer Invalid12457`)
    
  //   expect(res.statusCode).toBe(401)
  //   expect(res.body.status).not.toBeTruthy()
  // })

  // it('Expired Token', async() => {
  //     const expiredToken = await getExpiredUserToken()  
  //     const res = await request(app)
  //       .get('/api/books')
  //       .set('Authorization', `Bearer ${expiredToken}`)
        
  //     expect(res.statusCode).toBe(401)
  //     expect(res.body.status).not.toBeTruthy()
  //   })

   it('Failed to fetch all books', async() => {
    const spy = jest.spyOn(bookService, 'findAllBooks')
    spy.mockRejectedValue(new Error('Server Error'))

    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

})


describe("Request for /api/books/title/{title}", () => {
  let userToken
  beforeAll(async() => {
    userToken = await getUserToken()
  })

  it('Search a book by title', async() => {
    const result = await bookService.findLastInsertedBook()
    
    const res = await request(app)
      .get('/api/books/title/'+ result.title)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('No books found with the given title', async() => {
    const res = await request(app)
      .get('/api/books/title/not found')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to fetch the book with the given title', async() => {
    const spy = jest.spyOn(bookService, 'findBooksByTitle')
    spy.mockRejectedValue(new Error('Server Error'))

    const result = await bookService.findLastInsertedBook()
    const res = await request(app)
      .get('/api/books/title/'+ result.title)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  //  it('Invalid Token', async() => {
  //   const result = await bookService.findLastInsertedBook()
  //   const res = await request(app)
  //     .get('/api/books/title/'+ result.title)
  //     .set('Authorization', `Bearer Invalid12457`)
    
  //   expect(res.statusCode).toBe(401)
  //   expect(res.body.status).not.toBeTruthy()
  // })

  // it('Expired Token', async() => {
  //   const expiredToken = await getExpiredUserToken()  
  //   const result = await bookService.findLastInsertedBook()
  //   const res = await request(app)
  //     .get('/api/books/title/'+ result.title)
  //     .set('Authorization', `Bearer ${expiredToken}`)
      
  //   expect(res.statusCode).toBe(401)
  //   expect(res.body.status).not.toBeTruthy()
  // })
})

describe("Request for /api/books/author/{author}", () => {
  let userToken
  beforeAll(async() => {
    userToken = await getUserToken()
  })

  it('Search a book by author', async() => {
    const result = await bookService.findLastInsertedBook()
    
    const res = await request(app)
      .get('/api/books/author/'+ result.author)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('No books found with the given author', async() => {
    const res = await request(app)
      .get('/api/books/author/maria')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to fetch the books for the given author', async() => {
    const spy = jest.spyOn(bookService, 'findBooksByAuthor')
    spy.mockRejectedValue(new Error('Server Error'))

    const result = await bookService.findLastInsertedBook()
    const res = await request(app)
      .get('/api/books/author/'+ result.author)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  //  it('Invalid Token', async() => {
  //   const result = await bookService.findLastInsertedBook()
  //   const res = await request(app)
  //     .get('/api/books/author/'+ result.author)
  //     .set('Authorization', `Bearer Invalid12457`)
    
  //   expect(res.statusCode).toBe(401)
  //   expect(res.body.status).not.toBeTruthy()
  // })

  // it('Expired Token', async() => {
  //   const expiredToken = await getExpiredUserToken()  
  //   const result = await bookService.findLastInsertedBook()
  //   const res = await request(app)
  //     .get('/api/books/author/'+ result.author)
  //     .set('Authorization', `Bearer ${expiredToken}`)
      
  //   expect(res.statusCode).toBe(401)
  //   expect(res.body.status).not.toBeTruthy()
  // })
})

describe("Request /api/admin/books/google-search/:title/:author", () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Search a book using Google Books API', async() => {
    const title = 'Harry Potter and the Philosophers Stone'
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('Error fetching books from Google Library', async() => {
    const spy = jest.spyOn(bookService, 'findBook')
    spy.mockRejectedValue(new Error('Server Error'))

    const title = 'Harry Potter and the Philosophers Stone'
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Invalid Token', async() => {
    const title = 'Harry Potter and the Philosophers Stone'
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Expired Token', async() => {
    const expiredToken = await getExpiredUserToken()  
    const title = 'Harry Potter and the Philosophers Stone'
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer ${expiredToken}`)
      
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('User forbidden to view all users', async() => {
    let userToken = await getUserToken()
    const title = 'Harry Potter and the Philosophers Stone'
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Missing search query', async() => {
    const title = ' '
    const author = 'J. K. Rowling'
    const res = await request(app)
      .get(`/api/admin/books/google-search/${title}/${author}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

})

describe("Request /api/admin/books", () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Add a new book in library database', async() => {
    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

   it('Book already exists', async() => {
    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })

    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

  const missingFields = [
    { missingField: 'isbn', body: { isbn: '', title: 'booktest', author: 'authortest' } },
    { missingField: 'title', body: { title: '', author: '', isbn: '2545874587' } },,
    { missingField: 'author', body: { isbn: '8888888888', title: 'booktest', author: '' } },
  ]

  missingFields.forEach(({ missingField, body }) => {
    it(`Failed to add a new book. Required ${missingField} field is missing`, async() => {
      const res = await request(app)
                    .post('/api/admin/books')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    })
  })

  it('Error adding a new book', async() => {
    const spy = jest.spyOn(bookService, 'createBook')
    spy.mockRejectedValue(new Error('Server Error'))

    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Invalid Token', async() => {
    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer Invalid12457`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Expired Token', async() => {
    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })
      
      
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('User forbidden to add a new book', async() => {
    let userToken = await getUserToken()
    const res = await request(app)
      .post('/api/admin/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: "Harry Potter and the Philosopher's Stone",
        author: [
          "J. K. Rowling"
        ],
        publisher: "Bloomsbury Pub Limited",
        year: 1997,
        isbn: "9780747532699",
        description: "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal for someone like him who's parents have been killed in a 'car crash'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher's Stone! All this and muggles too. Now, what are they?",
        genre: [
          "Juvenile Fiction"
        ],
        page: 223,
        coverImage: "http://books.google.com/books/content?id=xYotngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
      })
      
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

})

describe("Request /api/admin/books/:isbn", () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Update a book in library database', async() => {
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .patch('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        genre: [
          "Fiction"
        ]
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

   it('Book not exists', async() => {
    const res = await request(app)
      .patch('/api/admin/books/888888')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        genre: [
          "Fiction"
        ]
      })

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  const missingFields = [
    { missingField: 'title', body: { title: ''} },,
    { missingField: 'author', body: { author: '' } },
  ]

  missingFields.forEach(({ missingField, body }) => {
    it(`Failed to update the book. Required ${missingField} field is missing`, async() => {
      const res = await request(app)
                    .post('/api/admin/books')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    })
  })

  it('Error updating the book', async() => {
    const spy = jest.spyOn(bookService, 'updateBookDetails')
    spy.mockRejectedValue(new Error('Server Error'))
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .patch('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        genre: [
          "Fiction"
        ]
      })

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Invalid Token', async() => {
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .patch('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer Invalid12457`)
      .send({
        genre: [
          "Fiction"
        ]
      })
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Expired Token', async() => {
    const result = await bookService.findLastInsertedBook()
    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .patch('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({
        genre: [
          "Fiction"
        ]
      })
     
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('User forbidden to update the book', async() => {
    let userToken = await getUserToken()
     const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .patch('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        genre: [
          "Fiction"
        ]
      })
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

})


describe("Request /api/admin/books/:isbn", () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Delete a book in library database', async() => {
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .delete('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

   it('Book not exists', async() => {
    const res = await request(app)
      .delete('/api/admin/books/888888')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })


  it('Error deleting the book', async() => {
    const spy = jest.spyOn(bookService, 'removeBookByIsbn')
    spy.mockRejectedValue(new Error('Server Error'))
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .delete('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${adminToken}`)
  
    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Invalid Token', async() => {
    const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .delete('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Expired Token', async() => {
    const result = await bookService.findLastInsertedBook()
    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .delete('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${expiredToken}`)
      
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('User forbidden to delete the book', async() => {
    let userToken = await getUserToken()
     const result = await bookService.findLastInsertedBook()

    const res = await request(app)
      .delete('/api/admin/books/'+ result.isbn)
      .set('Authorization', `Bearer ${userToken}`)
      
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

})



