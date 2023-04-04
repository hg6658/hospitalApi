"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
var chatSocketInstance = function (httpServer) {
    //console.log(httpServer);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*'
        }
    });
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let token = socket.handshake.auth.jwt;
            let username = socket.handshake.auth.username;
            let person = jsonwebtoken_1.default.verify(token, process.env.secret_key);
            let user = yield user_1.User.findOne({ email: person.user.email });
            if ((user === null || user === void 0 ? void 0 : user.userName) != username) {
                throw "invalid token";
            }
            next();
        }
        catch (err) {
            return next(new Error("invalid token"));
        }
    }));
    io.on('connection', (socket) => {
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
        socket.on("private_message", (sender) => {
            socket.to(sender.to).emit("private_message", {
                content: sender.content,
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
};
module.exports = {
    chatSocketInstance
};
