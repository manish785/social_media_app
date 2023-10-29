const express = require('express');
const router = express.Router();
const passport = require('passport');


const postsController = require('../controllers/posts_controller');

// the purpose to use checkAuthentication is that if the user is signed in then only he/she will be allowed to do post
router.get('/create-post', postsController.usersCreatePost);
router.post('/users-create-post', postsController.postCreated);
router.get('/find/:id', postsController.fetchPostDetails);
router.get('/find', postsController.fetchAllPostDetails);
router.put('/update/:id',postsController.updatePost);
router.get('/destroy/:id', postsController.destroyPost);
router.get('/destroy', postsController.destroyAllPost);


module.exports = router;