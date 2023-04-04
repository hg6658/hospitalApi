import passport from 'passport';
import Local, {Strategy, IVerifyOptions} from 'passport-local';
import {User} from '../models/user';
import express from 'express';    
passport.use('register', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async function(req :express.Request, email:string ,password: string ,done:any ){
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
    
    passport.use('login', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async function(req :express.Request, email:string ,password: string ,done:any){
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
    
    
    export = passport;
