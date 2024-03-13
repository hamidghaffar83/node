const express = require('express')
const router = express.Router()
const auth = require('../controller/usersController')
router
.post('/signup',auth.signup)
.post('/otp',auth.verifyEmailAndGenerateToken)
module.exports = router