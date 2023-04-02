(function(){
    const jwt  = require('jsonwebtoken');
    const User = require('..')
    const isauthenticated = (req   ,res   ,next   ) => {
        const token = req.headers.authorization?.split(' ')[1] || "";
    
        try{
            const verified = jwt.verify(token,process.env.secret_key);
            req.user = verified;
            next();
        }catch(err){
            console.log('verification failed');
        }
    }
    
    module.exports = {isauthenticated};
})();
