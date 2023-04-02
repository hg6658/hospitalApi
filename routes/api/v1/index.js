const router = require('express').Router();
const passport = require('passport');
const {graphqlHTTP} = require('express-graphql');
const schema = require('../../../schema/schema')

router.use('/doctors',require('./doctors'));

router.use('/patients',passport.authenticate('jwt', { session: false ,failWithError: true}),require('./patient'));

router.use('/reports',passport.authenticate('jwt', { session: false ,failWithError: true }),require('./reports'));

router.use('/graphql',passport.authenticate('jwt', { session: false ,failWithError: true }),graphqlHTTP({schema,graphiql:true}));
//
module.exports = router;