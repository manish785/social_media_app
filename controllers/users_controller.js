const User = require('../models/user');
const { validateToken } = require('../services/authentication')


module.exports.profile = async function(req, res){
   const token = req.cookies.token;

   try{
      validateToken(token);

      let user = await User.findById(req.params.id)
      return res.status(200).render('user_profile',{
          title: 'User Profile',
          profile_user: user,
      });
    }catch(err){
      console.log(err);
      return res.redirect('back');
    }
}


module.exports.updateProfile = async function(req, res){
      const token = req.cookies.token;
      validateToken(token);

      let user = await User.findById(req.params.id)

      return res.render('user_update_profile', {
          title: 'User Profile',
          profile_user: user
    });
}



module.exports.update = async function (req, res) {
  try {
      // Update the user based on the form data
      const user = await User.findById(req.params.id);

      // Check for user authorization here if needed

      user.name = req.body.name;
      user.email = req.body.email;
      
      console.log('manish thakur', user);
      if (req.file) {
          // Update the user's avatar if a new file is uploaded
          user.avatar = User.avatarPath + '/' + req.file.filename;
      }

      await user.save();
      req.flash('success', 'Profile updated successfully');
      return res.redirect('back');
  } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
  }
};

// render the sign up page
module.exports.signUp = function(req, res){
  
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
        message: 'Password and Confirm Password do not match'
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
      const token = await User.matchPasswordAndGenerateToken(email, password);
      return res.cookie("token", token).json({
        message: 'User Login in Successfully',
      })
    }catch(err){
      console.log('error', err);
      return res.redirect('/users/sigin-in'); 

    }
}


module.exports.destroySession = async function(req, res){

     // Clear the user's session data
    try{
        req.session.destroy(err => {
          if (err) {
            console.error('Error in logging out:', err);
            return;
          }
          res.clearCookie('token'); // Replace 'cookieName' with the actual name of your cookie

          // Redirect to the home page or any other destination after logout
          // req.flash('success', 'You have logged out!');
          return res.status(200).redirect('/users/sign-up');
        });
    }catch(err){
          console.log('error', err);
          return res.redirect('back');
    }
}
