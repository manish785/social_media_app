const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

// console.log('hiiii', passport);

router.get('/profile/:id', usersController.profile);
// router.get('/update/:id', usersController.update);
router.get('/update-profile/:id', usersController.updateProfile);
router.post('/update/:id', usersController.update);



router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


module.exports = router;