(function(){const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const register = async function(req ,res ){
    return res.status(200).json({
        message: 'Signup successful',
        user: req.user
    })
}

const validateCredentialsRegister = function(req ,res ,next ){
    try{
        const schema  = Joi.object({
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

const validateCredentialsLogin = function(req ,res ,next ){
    try{
        const schema  = Joi.object({
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
            email: "should be string should be of domain .com and .net",
            password: "should string minimum 2 special chars 2 lowercase 2 uppercase 2 numbers"
        })
    }
}

module.exports = {
    register,
    validateCredentialsRegister,
    validateCredentialsLogin
}
}());