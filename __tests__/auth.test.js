// npx jest auth.test.js

const request = require('supertest')
const app = require('../app')
const userService = require('../services/user.service')

describe('Request for /api/auth/login', () => {

  it('Success in logging', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: '12345'
      })
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('User not found', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin12',
        password: '12345'
      })
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Incorrect password', async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: '1234568'
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
        password: '12345'
      })
  
    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()
  
    spy.mockRestore() 
  })

  it('Missing username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: '12345' })

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