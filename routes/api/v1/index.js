"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("../../../schema/schema"));
const router = express_1.default.Router();
router.use('/doctors', require('./doctors'));
router.use('/patients', passport_1.default.authenticate('jwt', { session: false, failWithError: true }), require('./patient'));
router.use('/reports', passport_1.default.authenticate('jwt', { session: false, failWithError: true }), require('./reports'));
router.use('/graphql', passport_1.default.authenticate('jwt', { session: false, failWithError: true }), (0, express_graphql_1.graphqlHTTP)({ schema: schema_1.default, graphiql: true }));
module.exports = router;
