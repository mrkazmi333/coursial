const passport = require('passport');

const local = LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(email, password, done){
         //find a user and establish the identity
         User.findOne({email: email}, function(err, user){
             if(err){
                 console.log('Error in  finding user ---> passport');
                 return done(err);
             }
             if(!user ||user.password != password){
                 console.log('Invalid username/password');
                 return done(null, false);
             }

             return done(null, user);
         })
    }
));

//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//deserialzing the user from the key in the cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in  finding user ---> passport');
            return done(err);
        }

        return done(null, user);
    });
});


passport.checkAuthentication = function(req, res, next){
    //If the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current singed in user from the session cookie and we are just sending this to the locals or the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;


