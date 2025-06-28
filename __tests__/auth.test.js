// npx jest auth.test.js

const request = require('supertest')
const app = require('../app')
const userService = require('../services/user.service')
const authService = require('../services/auth.service')

jest.mock('../services/auth.service')



describe('Request for /api/auth/login', () => {

  it('Success in logging', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Test123!'
      })
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('User not found', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin12',
        password: 'Test123!'
      })
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Incorrect password', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Test12345!'
      })
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Problem in logging', async () => {
    const spy = jest.spyOn(userService,'findUserByUsername')
    spy.mockRejectedValue(new Error('Server error'))

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Test123!'
      })
  
    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()
  
    spy.mockRestore() 
  })

  it('Missing username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Test123!' })

    expect(res.statusCode).toBe(400) 
    expect(res.body.status).not.toBeTruthy()
})

  it('Missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' })

    expect(res.statusCode).toBe(400) 
    expect(res.body.status).not.toBeTruthy()
  })

})

describe('Request for /api/auth/google/callback', () => {

  it('No code is provided', async () => {
    const res = await request(app).get('/api/auth/google/callback')

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Login/register is successful', async () => {
    authService.googleAuth.mockResolvedValue({
      token: 'mocked_token',
      user: {
        userId: '123456',
        username: 'google_user',
        role: 'user'
      }
    })

    const res = await request(app)
      .get('/api/auth/google/callback')
      .query({ code: 'dummycode' })

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('Problem in Google login', async () => {
    authService.googleAuth.mockResolvedValue(null)

    const res = await request(app)
      .get('/api/auth/google/callback')
      .query({ code: 'dummycode' })

    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Email already registered with password', async () => {
    const err = new Error('Email already registered with password. Please login manually')
    err.status = 409
    authService.googleAuth.mockRejectedValue(err)

    const res = await request(app)
      .get('/api/auth/google/callback')
      .query({ code: 'dummycode' })

    expect(res.statusCode).toBe(409)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Unexpected error', async () => {
    authService.googleAuth.mockRejectedValue(new Error('Unexpected'))

    const res = await request(app)
      .get('/api/auth/google/callback')
      .query({ code: 'dummycode' })

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()
  })
})

