const express = require('express');
const router = express.Router();
const parents = require('../controller/parentsController');
const { AuthGuard } = require('../middlewares/authGuard');

router.get('/all', parents.allParents);
router.patch('/:email', parents.blockedParent);
router.patch('/:id', parents.updateParent);
router.post('/email/:email', parents.sendEmailToParent);
router.delete('/:id', parents.deleteParent);
router.post('/emails', parents.sendEmailToActiveParents);

exports.router = router;
