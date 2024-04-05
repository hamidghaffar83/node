const express = require('express');
const router = express.Router();
const Subject = require('../controller/subjectController');
const {AuthGuard} = require('../middlewares/authGuard');
router
.post('/', Subject.createSubject)
.get('/', Subject.getAllSubjects)
exports.router = router