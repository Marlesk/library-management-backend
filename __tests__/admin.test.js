// npx jest admin.test.js
// npm test -- --runInBand

const request = require('supertest')
const app = require('../app')
const userService = require('../services/user.service')
const adminService = require('../services/admin.service')
const getAdminToken = require('../helpers/getAdminToken')
const getUserToken = require('../helpers/getUserToken')
const getExpiredUserToken = require('../helpers/getExpiredUserToken')

describe("Request for /api/admin/users", () => {
  let adminToken
  beforeAll(async() => {
    adminToken = await getAdminToken()
  })

  it('Admin can access to view all users', async() => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('User forbidden to view all users', async() => {
    let userToken = await getUserToken()
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Missing Token', async() => {
    const res = await request(app)
      .get('/api/admin/users')
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

   it('Invalid Token', async() => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Expired Token', async() => {
      const expiredToken = await getExpiredUserToken()  
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        
      expect(res.statusCode).toBe(401)
      expect(res.body.status).not.toBeTruthy()
    })

   it('Failed to fetch all users', async() => {
    const spy = jest.spyOn(adminService, 'findAllUsers')
    spy.mockRejectedValue(new Error('Server Error'))

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })
})

describe("Request for /api/admin/users/username/:username", () => {
  let adminToken
  beforeAll(async () => {
    adminToken = await getAdminToken()
  })

  it('Admin can access to view a specific user by username', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('User forbidden to view a specific user by username', async() => {
    let userToken = await getUserToken()
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Non-existent username', async() => {
    const res = await request(app)
      .get('/api/admin/users/username/user2')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to find the user', async() => {
    const spy = jest.spyOn(adminService, 'findByUsername')
    spy.mockRejectedValue(new Error('Server error'))

    const res = await request(app)
      .get('/api/admin/users/username/user100')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })


  it('Admin can delete a specific user by username', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

   it('User forbidden to delete a specific user by username', async() => {
    let userToken = await getUserToken()
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Non-existent username', async() => {
    const res = await request(app)
      .delete('/api/admin/users/username/user2')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to delete the user', async() => {
    const spy = jest.spyOn(adminService, 'findByUsernameAndDelete')
    spy.mockRejectedValue(new Error('Sever error'))

    const res = await request(app)
      .delete('/api/admin/users/username/user100')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Missing Token', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/username/'+ result.username)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Invalid Token', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Expired Token', async() => {
    const result = await userService.findLastInsertedUser()

    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .delete('/api/admin/users/username/'+ result.username)
      .set('Authorization', `Bearer ${expiredToken}`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

})

describe("Request for /api/admin/users/email/:email", () => {
  let adminToken
  beforeAll(async () => {
    adminToken = await getAdminToken()
  })

  it('Admin can access to view a specific user by email', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('User forbidden to view a specific user by email', async() => {
    let userToken = await getUserToken()
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .get('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Non-existent email', async() => {
    const res = await request(app)
      .get('/api/admin/users/email/user2@example.com')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to find the user', async() => {
    const spy = jest.spyOn(adminService, 'findByEmail')
    spy.mockRejectedValue(new Error('Server error'))

    const res = await request(app)
      .get('/api/admin/users/email/user100@example.com')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Admin can delete a specific user by email', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBeTruthy()
  })

  it('User forbidden to delete a specific user by email', async() => {
    let userToken = await getUserToken()
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer ${userToken}`)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Non-existent email', async() => {
    const res = await request(app)
      .delete('/api/admin/users/email/user2@gmail.com')
      .set('Authorization', `Bearer ${adminToken}`)
    
    expect(res.statusCode).toBe(404)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Failed to delete the user', async () => {
    const spy = jest.spyOn(adminService, 'findByEmailAndDelete')
    spy.mockRejectedValue(new Error('Server error'))

    const res = await request(app)
      .delete('/api/admin/users/email/user100')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(500)
    expect(res.body.status).not.toBeTruthy()

    spy.mockRestore() 
  })

  it('Missing Token', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/email/'+ result.email)
    
    expect(res.statusCode).toBe(403)
    expect(res.body.status).not.toBeTruthy()
  })

   it('Invalid Token', async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
      .delete('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer Invalid12457`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })

  it('Expired Token', async() => {
    const result = await userService.findLastInsertedUser()

    const expiredToken = await getExpiredUserToken()  
    const res = await request(app)
      .delete('/api/admin/users/email/'+ result.email)
      .set('Authorization', `Bearer ${expiredToken}`)
    
    expect(res.statusCode).toBe(401)
    expect(res.body.status).not.toBeTruthy()
  })
    
   
})







