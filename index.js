const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); 
const app = express();
const db = require('./config/mongoose');
const passportLocal = require('./config/passport-local');
const passportJwt = require('./config/passport-jwt');
const passport = require('passport');
const { createServer } = require("http");
var bodyParser = require('body-parser');
const httpServer = createServer(app);
const chatSocketInstance = require('./config/websocket')


chatSocketInstance.chatSocketInstance(httpServer);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/',require('./routes'));


httpServer.listen(8000,function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: 8000`);
})

module.exports = app;