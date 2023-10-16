const User = require('../models/user')

module.exports.profile = async function(req, res){
    try{
      let user = await User.findById(req.params.id)
      return res.render('user_profile',{
          title: 'User Profile',
          profile_user: user,
      });
    }catch(err){
      console.log(err);
      return res.redirect('back');
    }
}

module.exports.update = async function(req, res){
      if(req.user.id == req.params.id){
        try{
        // by passing the req.body, we can update the fields which we want to update
        let user = await User.findByIdAndUpdate(req.params.id, req.body);
           return res.redirect('back');
      }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
  }else{
      req.flash('error', 'Unauthorized!');
      return res.status(401).send('Unauthorized'); 
  }
}

// render the sign up page
module.exports.signUp = function(req, res){
    // If the user is signed in, then hittig this Sign Up route, will render to the users profile
    if(req.isAuthenticated()){
      return res.redirect('/users/profile/' + req.user._id);
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up',
   });
}

// render the sign in page
module.exports.signIn = async function(req, res){
        
    if(req.isAuthenticated()){
      return res.redirect('/users/profile/' + req.user._id);
    }
    return res.render('user_sign_in', {
        title: 'Codeial | Sign In',
   });
}

// get the sign up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
      return res.status(400).json({
        message: 'Password and confirm password do not match'
      })
    }
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if(user){
        return res.status(409).json(({
          message: 'User already exits in the DB'
        }))
      }
      // when we will create a new user, it will render towards the users's sign in page
      await User.create(req.body);
      return res.redirect('/users/sign-in');
    } catch (err) {
      console.log('error in signing up:', err);
      // Handle the error appropriately
      return res.redirect('back');
    }
}

// sign in and create a session for the user
module.exports.createSession = async function(req, res){
    const {email, password} = req.body;
   
    try{
      const user = await User.matchPasswordAndGenerateToken(email, password);
      req.flash('success', 'Logged in successfully');
      return res.redirect(`/users/profile/${user._id}`);
    }catch(err){
      console.log('error', err);
      return res.redirect('/users/sigin-in'); 

    }
}


module.exports.destroySession = function(req, res){
  //this functionality provides by passport.js (req.logout)
  req.logout(function(err){
    if(err){
      console.log('Error in logging out', err);
      return;
    }
    req.flash('success', 'You have logged out!');
    return res.redirect('/users/sign-up');
  });
}
