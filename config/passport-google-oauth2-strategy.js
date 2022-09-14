const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');


//tell passport to use strategy for google login
passport.use(new googleStrategy({
    clientID: "856451248049-amfh3l4foaj0nks2gobrvre71iqmmuvq.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",//http://localhost:8000/users/auth/google/callback
     }, 
     //find the user
     function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log('error in google strategy-passport', err);return;}


            console.log(profile);

            if(user){
                //if founfd , set this user sa req.user
                return done(null, user);

            }
            else{
                // if not, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log('error in  creating google strategy-passport', err);}

                    return done(null, user);

                });

            }
        });

     }
));

module.exports.passport;
