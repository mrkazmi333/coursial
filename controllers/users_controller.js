const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile',{
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('****Multer Error', err)}
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                   
                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname, '..', user.avatar))){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }                      
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename; 
                }
                user.save();
                return res.redirect('back');
            });

        } catch (err) {
            req.flash('error', err);
            return res.redirect('back'); 
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

//Render the signup page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_up',{
        title: 'Codeial | SignUp'
    });
}


//Render the sign In page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: 'Codeial | SignIn'
    });
};

//get the signup data
module.exports.create = function(req, res){
    if(req.body.password!= req.body.confirm_password){
        req.flash('error', 'Passwords did not matched!');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){ req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            });
        }else{
            // req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


//signin and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged In Succesfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You Have Logged Out');
    return res.redirect('/');
}