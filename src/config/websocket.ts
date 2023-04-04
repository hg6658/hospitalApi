import { Server,Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import {User} from '../models/user';
import { Application } from "express";
var chatSocketInstance = function(httpServer: any ){
    //console.log(httpServer);
    const io = new Server(httpServer,{
            cors:{
                origin: '*'
            }
        });
    io.use(async (socket:Socket ,next:(err?:any)=>void)=>{
        try{
            let token:string = socket.handshake.auth.jwt;
            let username:string = socket.handshake.auth.username;
            let person = jwt.verify(token,process.env.secret_key as string);
            let user = await User.findOne({email:(person as any).user.email});
            if(user?.userName!=username){
                throw "invalid token";
            }
            next();
        }catch(err){
            return next(new Error("invalid token"));
        }
    })    
    io.on('connection',(socket:Socket )=>{
        console.log('ChatSocket connection established');
        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
          users.push({
            userID: id,
            username: (socket as any).username,
          });
        }
        socket.emit("users", users);
        socket.broadcast.emit("user_connected", {
            userID: socket.id,
            username: (socket as any).username,
        });

        socket.on("private_message", (sender ) => {
            socket.to(sender.to).emit("private_message", {
              content:sender.content,
              from: socket.id,
            });
        });
    });

    io.use((socket: Socket , next:(err?:any)=>void ) => {
        const username = socket.handshake.auth.username;
        if (!username) {
          return next(new Error("invalid username"));
        }
        (socket as any).username = username;
        next();
    });
}

export ={
    chatSocketInstance
}
