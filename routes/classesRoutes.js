const express = require('express');
const router = express.Router();
const Classes = require('../controller/classesController');
const {AuthGuard} = require('../middlewares/authGuard');
router
.post('/', Classes.createClass)
.get('/', Classes.getAllClasses)
exports.router = router