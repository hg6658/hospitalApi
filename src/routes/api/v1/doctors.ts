import express from 'express';
const router = express.Router();
import {User,IUser} from '../../../models/user';
import passport from 'passport';
import {register,validateCredentialsRegister,validateCredentialsLogin} from '../../../controller/doctor';
import jwt from 'jsonwebtoken';


router.post('/register',validateCredentialsRegister,passport.authenticate('register',{session: false, failWithError: true}),register);



router.post(
    '/login',validateCredentialsLogin,
    async (req: express.Request, res: express.Response ,next: express.NextFunction): Promise<void> => {
      passport.authenticate(
        'login',
        async (err: any, user: IUser, info: any):Promise<void> => {
          try {
            if (err) {
              res.send(500).json({
                code: 500,
                message: err.message
              })
              return;
            }else if(!user){
              res.status(500).json({
                code: 500,
                message: "User not found"
              })
              return;
            }
  
            req.login(
              user,
              { session: false },
              async (error: any):Promise<void> => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.secret_key as string);
  
                res.json({ token });
                return;
              }
            );
          } catch (error: any) {
            res.status(500).json({
              code: 500,
              message:err.message
            })
            return;
          }
        }
      )(req, res, next);
    }
  );



export = router;