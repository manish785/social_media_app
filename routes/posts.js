const express = require('express');
const router = express.Router();
const passport = require('passport');


const postsController = require('../controllers/posts_controller');

// the purpose to use checkAuthentication is that if the user is signed in then only he/she will be allowed to do post
router.post('/create', passport.checkAuthentication, postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);





module.exports = router;