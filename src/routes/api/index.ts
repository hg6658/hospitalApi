import express from 'express';

let router = express.Router();
router.use('/v1',require('./v1'));

export = router;