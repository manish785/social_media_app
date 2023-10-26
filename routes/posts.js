const express = require('express');
const router = express.Router();
const passport = require('passport');


const postsController = require('../controllers/posts_controller');

// the purpose to use checkAuthentication is that if the user is signed in then only he/she will be allowed to do post
router.get('/create-post', postsController.usersCreatePost);
router.post('/users-create-post', postsController.postCreate);
router.get('/destroy/:id', postsController.destroy);





module.exports = router;