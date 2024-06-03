const route = require('express').Router()
const user = require('../controllers/user')

route.get('/user', user.getUser)
route.get('/user/:id', user.getUserId)
route.post('/user', user.create)
route.put('/user/:id', user.update)
route.delete('/user/:id', user.destroy)
route.post('/login-user', user.login)
route.get('/saya', user.authenticateToken, user.getUser)

module.exports = route