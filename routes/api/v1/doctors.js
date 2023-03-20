const router = require('express').Router();
const passport = require('passport');
const doctorController = require('../../../controller/doctor');
const jwt = require('jsonwebtoken');


router.post('/register',doctorController.validateCredentialsRegister,passport.authenticate('register',{session: false, failWithError: true}),doctorController.register);



router.post(
    '/login',doctorController.validateCredentialsLogin,
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err) {
              return res.send(500).json({
                code: 500,
                message: err.message
              })
            }else if(!user){
              return res.status(500).json({
                code: 500,
                message: "User not found"
              })
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.secret_key);
  
                return res.json({ token });
              }
            );
          } catch (error) {
            return res.status(500).json({
              code: 500,
              message:err.message
            })
          }
        }
      )(req, res, next);
    }
  );



module.exports = router;