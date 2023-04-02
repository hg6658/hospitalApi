(function(){
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const User = require('../models/user');
    
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async function(req ,email ,password ,done ){
        try{
            const user = await User.create({
                userName: req.body.userName,
                email: email,
                password: password
            });
            return done(null,user);
        }catch(err){
            done(err);
        }
    }));
    
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async function(req ,email ,password ,done ){
        try{
            const user = await User.findOne({ email: email});
            if(!user){
                return done(null,false,{message: 'user not found'});
            }
    
            const validate = await user.isValidPassword(password);
    
            if(!validate){
                return done(null,false,{message: 'password incorrct'});
            }
    
            return done(null,user,{message: 'Login successfully'});
    
        }catch(err){
            done(err);
        }
    }))
    
    
    module.exports = passport;
})();
