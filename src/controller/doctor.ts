import Joi,{Root,StringSchema}  from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
import  express  from 'express';
interface PasswordSchema extends StringSchema<string> {
    minOfSpecialCharacters(limit: number): PasswordSchema;
    minOfLowercase(limit: number): PasswordSchema;
    minOfUppercase(limit: number): PasswordSchema;
    minOfNumeric(limit: number): PasswordSchema;
    noWhiteSpaces(): PasswordSchema;
    string(): PasswordSchema;
  }
  
  // Create the Joi schema
  const joiPassword = Joi.extend(
    joiPasswordExtendCore
  );

const register:(req: express.Request, res: express.Response) => Promise<void> = async function(req: express.Request, res: express.Response){
    res.status(200).json({
        message: 'Signup successful',
        user: req.user
    })
}

const validateCredentialsRegister:(req: express.Request, res: express.Response, next: express.NextFunction) => void = async function(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const schema:Joi.ObjectSchema<any>  = Joi.object({
            userName: Joi.string().min(5).max(200).required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: joiPassword.string()
                            .minOfSpecialCharacters(2)
                            .minOfLowercase(2)
                            .minOfUppercase(2)
                            .minOfNumeric(2)
                            .noWhiteSpaces()
                            .required(),
        });
        const {error,value} =schema.validate(req.body);
        if(error){
            throw "Invalid Credentials";
        }else{
            next();
        }
    }catch(err){
        res.status(403).json({
            message:"Credentials should follow certain rules:",
            userName:"should be string minimum 5 characters maximum 200 characters",
            email: "should be string should be of domain .com and .net",
            password: "should string minimum 2 special chars 2 lowercase 2 uppercase 2 numbers"
        })
    }
}

const validateCredentialsLogin:(req: express.Request, res: express.Response, next: express.NextFunction) => void = function(req: express.Request, res: express.Response,next: express.NextFunction ){
    try{
        const schema:Joi.ObjectSchema<any>  = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: joiPassword.string()
                            .minOfSpecialCharacters(2)
                            .minOfLowercase(2)
                            .minOfUppercase(2)
                            .minOfNumeric(2)
                            .noWhiteSpaces()
                            .required(),
        });
        const {error,value} =schema.validate(req.body);
        if(error){
            throw "Invalid Credentials";
        }else{
            next();
        }
    }catch(err: any){
        console.log(err.message);
        res.status(403).json({
            message:"Credentials should follow certain rules:",
            email: "should be string should be of domain .com and .net",
            password: "should string minimum 2 special chars 2 lowercase 2 uppercase 2 numbers"
        })
    }
}

export {
    register,
    validateCredentialsRegister,
    validateCredentialsLogin
}