const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.get('/create-comment/:id',  commentsController.usersCreateComment);
router.post('/create/:id',  commentsController.create);
router.get('/destroy/:id',  commentsController.destroy);

module.exports = router;