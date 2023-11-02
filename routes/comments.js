const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.get('/create-comment/:postId', commentsController.createComment);
router.post('/create/:postId', commentsController.commentsCreated);
router.get('/:id',  commentsController.getComment);
router.put('/update/:id',  commentsController.updateComment);
router.get('/destroy/:id',  commentsController.destroyComment);

module.exports = router;