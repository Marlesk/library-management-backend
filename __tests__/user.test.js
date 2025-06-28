// npx jest user.test.js
const request = require('supertest')
const app = require('../app')
const getUserToken = require('../helpers/getUserToken')
const getExpiredUserToken = require('../helpers/getExpiredUserToken')
const userService = require('../services/user.service')

describe('Request for /api/users/register', () => {

  it('User registered successfully', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Alexopoulos',
        username: 'fanis',
        email: 'fanisalex@gmail.com',
        password: 'Test123!'
      })
    
    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBeTruthy()
  })

  it('Username already exists', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Georgiou',
        username: 'fanis',
        email: 'fanisgeo@gmail.com',
        password: 'Test123!'
      })
    
    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

   it('Email already exists', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Alexiou',
        username: 'fanis.alex',
        email: 'fanisalex@gmail.com',
        password: 'Test123!'
      })
    
    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

  it('An admin user already exists', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Alexiou',
        username: 'fanis.alex',
        email: 'fanisalexiou@gmail.com',
        password: 'Test123!',
        role: 'admin'
      })
    
    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Email format is not correct', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Alexiou',
        username: 'fanis.alexiou',
        email: 'fanisalexiou@gmail',
        password: 'Test123!',
        role: 'admin'
      })
    
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Password format is not correct', async() => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fanis',
        lastname: 'Alexiou',
        username: 'fanis.alexiou',
        email: 'fanisalexiou@gmail',
        password: '12345',
        role: 'admin'
      })
    
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })


  const invalidPayloads = [
    { missingField: 'firstname', body: { firtsname: '', lastname: 'usertest', username: 'usertest', 
      email: 'usertest@example.com', password: 'Test123!' } },
    { missingField: 'lastname', body: { firstname: 'usertest', lastname: '', username: 'usertest', 
      email: 'usertest@example.com', password: 'Test123!' } },
    { missingField: 'username', body: { firstname: 'usertest', lastname: 'usertest', username: '',
      email: 'usertest@example.com', password: 'Test123!' } },
    { missingField: 'email', body: { firstname: 'usertest', lastname: 'usertest', 
      username: 'usertest', email: '', password: 'Test123!' } },
    { missingField: 'password', body: { firstname: 'usertest', lastname: 'usertest', username: 'usertest',
      email: 'usertest@example.com', password: '' } }
  ];

  invalidPayloads.forEach(({ missingField, body }) => {
    it(`Registration failed. Required ${missingField} field is missing`, async() => {
      const res = await request(app)
                    .post('/api/users/register')
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    })
  })

  it('Failed to create an account', async () => {
    const spy = jest.spyOn(userService, 'createUser')
    spy.mockRejectedValue(new Error('Service failure'))
  
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Fani',
        lastname: 'Alexopoulou',
        username: 'fani_al',
        email: 'fanial@gmail.com',
        password: 'Test123!'
      })

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

})

describe('Request for /api/users/profile', () => {
  let userToken
  beforeAll(async() => {
    userToken = await getUserToken()
  })

  it('User gets profile successfully', async() => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('Failed to fetch profile user', async () => {
    const spy = jest.spyOn(userService, 'getUserProfile')
    spy.mockRejectedValue(new Error('Service failure'))
  
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  const updatePayloads = [
    { updateField: 'email', body: { email: 'userupdated@example.com' } },
    { updateField: 'password', body: { password: 'Test1234!' } },
  ]

  updatePayloads.forEach(({ updateField, body }) => {
    it(`Update profile successfully for ${updateField} field`, async() => {
      const res = await request(app)
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(body)

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBeTruthy()
    })
  })

  it('This field cannot update', async() => { 
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ username: 'userupdate'})
      
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  const missingUpdateField = [
    { missingField: 'email', body: { email: '', password: 'Test1234!' } },
    { missingField: 'password', body: { email: 'usertestupdate@example.com', password: '' } }
  ];

  missingUpdateField.forEach(({ missingField, body }) => {
    it(`Failed to update account. Required ${missingField} field is missing`, async() => {
      const res = await request(app)
                    .patch('/api/users/profile')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    })
  })

  it('Email format is not correct', async() => {
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'fanisalexiou@gmail' })
    
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

   it('Paaword format is not correct', async() => {
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ password: '12345' })
    
    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Email already exists', async() => {
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'fanisalex@gmail.com' })
    
    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to update account', async () => {
    const spy = jest.spyOn(userService, 'updateUserProfile')
    spy.mockRejectedValue(new Error('Service failure'))
  
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: "testing@gmail.com" })

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Missing Token', async() => {
    const res = await request(app)
      .get('/api/users/profile')
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Invalid Token', async() => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
  
  it('Expired Token', async() => {
    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${expiredToken}`)
      
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Delete account successfully', async() => { 
    const res = await request(app)
      .delete('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('Failed to delete account', async () => {
    const spy = jest.spyOn(userService, 'deleteUserProfile')
    spy.mockRejectedValue(new Error('Service failure'))
  
    const res = await request(app)
      .delete('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })
})



