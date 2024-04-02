const express = require('express')
const router = express.Router()
const auth = require('../controller/usersController')
router
.post('/signup',auth.signup)
.post('/otp',auth.verifyEmailAndGenerateToken)
.post('/login', auth.login)
.post('/email',auth.sendOtpToEmail)
.post('/password', auth.updatePassword)
module.exports = router