// npx jest contact.test.js

const request = require('supertest')
const app = require('../app')
const getAdminToken = require('../helpers/getAdminToken')
const contactService = require('../services/contact.service')

describe('Request for /api/contact', () => {
  it('Message sent successfully', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        firstname: 'Maria',
        lastname: 'Papadopoulou',
        email: 'maria@example.com',
        message: 'Hello!'
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBeTruthy()
  })

  it('Email format is not correct', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        firstname: 'Maria',
        lastname: 'Papadopoulou',
        email: 'not-an-email',
        message: 'Hello!'
      })

    expect(res.statusCode).toBe(400)
    expect(res.body.status).not.toBeTruthy()
  })

  const invalidPayloads = [
    { missingField: 'firstname', body: { firtsname: '', lastname: 'usertest', 
      email: 'usertest@example.com', message: 'Hello!' } },
    { missingField: 'lastname', body: { firstname: 'usertest', lastname: '', 
      email: 'usertest@example.com', message: 'Hello!' } },
    { missingField: 'email', body: { firstname: 'usertest', lastname: 'usertest', 
      email: '', message: 'Hello!' } },
    { missingField: 'message', body: { firstname: 'usertest', lastname: 'usertest', username: 'usertest',
      email: 'usertest@example.com', message: '' } }
  ]

  invalidPayloads.forEach(({ missingField, body }) => {
    it(`Registration failed. Required ${missingField} field is missing`, async() => {
      const res = await request(app)
                    .post('/api/contact')
                    .send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).not.toBeTruthy()
    })
  })

})


describe('Request for /api/admin/messages', () => {
  let adminToken
  beforeAll(async () => {
    adminToken = await getAdminToken()
  })

  it('Admin can access to view all contact messages', async() => {
    const res = await request(app)
      .get('/api/admin/messages')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
    expect(res.body.data.length).toBeGreaterThan(0)
  })

   it('Failed to fetch all contact messages', async() => {
      const spy = jest.spyOn(contactService, 'getMessage')
      spy.mockRejectedValue(new Error('Server Error'))
  
      const res = await request(app)
        .get('/api/admin/messages')
        .set('Authorization', `Bearer ${adminToken}`)
  
      expect(res.statusCode).toBe(500)
      expect(res.body.status).not.toBeTruthy()
  
      spy.mockRestore() 
    })

})