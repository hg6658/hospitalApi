import passport from 'passport';
import passportJwt, { Strategy, ExtractJwt,JwtFromRequestFunction,StrategyOptions,VerifiedCallback } from 'passport-jwt';
import {User} from '../models/user';
var opts ={} as StrategyOptions;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret_key as string;
passport.use(new Strategy(opts, function(jwt_payload : any, done: VerifiedCallback ) {
    User.findOne({email: jwt_payload.user.email}, function(err: any , user: any ) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

export = passport;