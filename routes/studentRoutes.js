const express = require('express');
const router = express.Router();
const students = require('../controller/studentController');
const {AuthGuard} = require('../middlewares/authGuard');
router
.post('/', students.createStudent)
.get('/all', students.allStudents)
.get('/',students.findAllStudents)
.patch('/fee/:email', students.StudentFees)
exports.router = router