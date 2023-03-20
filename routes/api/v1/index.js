const router = require('express').Router();
const passport = require('passport');

router.use('/doctors',require('./doctors'));

router.use('/patients',passport.authenticate('jwt', { session: false ,failWithError: true}),require('./patient'));

router.use('/reports',passport.authenticate('jwt', { session: false ,failWithError: true }),require('./reports'));

module.exports = router;