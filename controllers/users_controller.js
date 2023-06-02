const User = require('../models/user')

module.exports.profile = function(req, res){
  if (req.cookies.user_id){
      User.findById(req.cookies.user_id)
        .then(user => {
          if (user){
              return res.render('user_profile', {
                  title: "User Profile",
                  user: user
              })
          } else {
              return res.redirect('/users/sign-in');
          }
        })
        .catch(err => {
          console.log('error in finding user in user_profile', err);
          return res.redirect('/users/sign-in');
        });
  } else {
      return res.redirect('/users/sign-in');
  }
}

// render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up',
   });
}

// render the sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: 'Codeial | Sign In',
   });
}

// get the sign up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect('back');
    }
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        await User.create(req.body);
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.log('error in signing up:', err);
      // Handle the error appropriately
      return res.redirect('back');
    }
  };
  

// sign in and create a session for the user
module.exports.createSession = async function(req, res){
   // steps to authenticate
   //find the user
   try{
       let user = await User.findOne({email: req.body.email});
       if(user){
            // handle password which does not match
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            //handle the session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
       }else{
            // handle user not found
            return res.redirect('back');
    }
   }catch(err){
    console.log('error in finding user in signing in', err);
    return;
   }
}



