
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const User = require('../models/user')
var chatSocketInstance = function(httpServer){
    //console.log(httpServer);
    const io = new Server(httpServer,{
            cors:{
                origin: '*'
            }
        });
    io.use(async (socket,next)=>{
        try{
            let token = socket.handshake.auth.jwt;
            let username = socket.handshake.auth.username;
            let person = jwt.verify(token,process.env.secret_key);
            let user = await User.findOne({email:person.user.email});
            if(user.userName!=username){
                throw "invalid token";
            }
            next();
        }catch(err){
            return next(new Error("invalid token"));
        }
    })    
    io.on('connection',(socket)=>{
        console.log('ChatSocket connection established');
        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
          users.push({
            userID: id,
            username: socket.username,
          });
        }
        socket.emit("users", users);
        socket.broadcast.emit("user_connected", {
            userID: socket.id,
            username: socket.username,
        });

        socket.on("private_message", ({ content, to }) => {
            socket.to(to).emit("private_message", {
              content,
              from: socket.id,
            });
        });
    });

    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
          return next(new Error("invalid username"));
        }
        socket.username = username;
        next();
    });
}

module.exports={
    chatSocketInstance
}