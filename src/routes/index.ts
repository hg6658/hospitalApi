import express from 'express';

let router = express.Router();
router.get('/',(req,res)=>{res.send("<h1>Hello there please use postman to test this api.</h1>")});
router.use('/api',require('./api'));

export = router;