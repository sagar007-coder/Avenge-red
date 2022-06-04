const passport = require('passport');


const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// auth  using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
 function(email , password, done){
  // find user  and establish the identity
  User.findOne({email: email}, function(err, user){
      if (err){
          console.log('Error in finding user --> Passport');
          return done(err)
      }
      if (!user || user.password != password){
          console.log('Invalid Username or password');
          return done(null, false);
      }
      return done(null, user);
  });
 }
));

// serializing the user  to decide which key is to kept in the cookies
passport.serializeUser(function (user, done){
    done(null , user.id);
});


// deserializing thw user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err)
        }

        return done(null, user);

    });
});

 //check if the user is authenticated
 passport.checkAuthentication = function (req, res, next){
     // if user is signed in , then pass the req to the next 
     //function (controllers action)
     if (req.isAuthenticated()){
         return next()
        }
         // if the user is not signed in
         return res.redirect('/users/sign-in');
     }
     passport.setAuthenticatedUser = function(req, res, next){
         if (req.isAuthenticated()){
             // req.user contains current signed in userr from the session cookie and we
             // are just sending this to locals for the views
             res.locals.user = req.user;
         }
         next();
     }
 

module.exports = passport;