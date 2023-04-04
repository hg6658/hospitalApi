import express from 'express';

let router = express.Router();
router.use('/api',require('./api'));

export = router;