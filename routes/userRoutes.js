const express = require('express');

const usercontroller = require('../controller/userController');

const router = express.Router()

router
.post('/user',usercontroller.createUser)
.get('/getAll',usercontroller.getUsers)
.get('/:email',usercontroller.getUser)
.patch('/:id',usercontroller.updateUser)
.delete('/:id',usercontroller.deleteUser)
module.exports = router