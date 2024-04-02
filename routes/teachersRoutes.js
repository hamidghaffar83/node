const express = require('express');
const router = express.Router();
const teachers = require('../controller/teachersController');
const {AuthGuard} = require('../middlewares/authGuard')
router
.post('/',teachers.createTeacher)
.get('/all', teachers.allTeachers)
exports.router = router