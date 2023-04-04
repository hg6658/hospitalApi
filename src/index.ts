import dotenv from "dotenv";
dotenv.config();
import express, {Application} from "express";
import passport from 'passport';
import db from "./config/mongoose";
import passportLocal from './config/passport-local';
import passportJwt from './config/passport-jwt';
import { createServer,Server } from "http";
import bodyParser from 'body-parser';
import chatSocketInstance from './config/websocket';
import rateLimit from 'express-rate-limit'
import cluster from 'node:cluster';
import { cpus } from 'os';
import process from 'node:process';

const numCPUs = cpus().length;


const limiter = rateLimit({
	windowMs: 1000, // 15 minutes
	max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all request

var pp = passportLocal
var ss = passportJwt;
var dbs = db;
var ps = passport;
if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);
  
	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
	  cluster.fork();
	}
  
	cluster.on('exit', (worker, code, signal) => {
	  console.log(`worker ${worker.process.pid} died`);
	});
  } else {
    
    const app: Application = express();
    const httpServer: Server = createServer(app);
    
    chatSocketInstance.chatSocketInstance(httpServer);
    app.use(limiter);
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    
    
    app.use('/',require('./routes'));
    
    
    const server:Server = httpServer.listen(8000,function(){
        console.log(`Server is running on port: 8000`);
    })

    server.on('error', e => console.error("Error in the running server", e));

    console.log(`Worker ${process.pid} started`);  

    module.exports = app;
    
  }	  
