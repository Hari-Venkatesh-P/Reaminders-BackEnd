const router = require('express').Router()
// const MiddlewareService = require('../Middleware/Tokencheck')

const UserService = require('../Services/UserService')

router.post("/",UserService.createUser)
router.post("/login",UserService.loginUser)

 
module.exports = router;