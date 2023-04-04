import express from 'express';
import passport from 'passport';
import {graphqlHTTP} from 'express-graphql';
import schema from '../../../schema/schema';
const router = express.Router();

router.use('/doctors',require('./doctors'));

router.use('/patients',passport.authenticate('jwt', { session: false ,failWithError: true}),require('./patient'));

router.use('/reports',passport.authenticate('jwt', { session: false ,failWithError: true }),require('./reports'));

router.use('/graphql',passport.authenticate('jwt', { session: false ,failWithError: true }),graphqlHTTP({schema,graphiql:true}));
//
export = router;