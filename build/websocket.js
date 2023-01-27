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
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
const db = require('./db');
const messages = [];
//array de usuarios
const users = [];
//conectando usuario ao servidor
http_1.io.on("connection", (socket) => {
    socket.on("userData", (data, callbabk) => __awaiter(void 0, void 0, void 0, function* () {
        //jogando o usuario para sala que ele selecionou
        socket.join(data.room);
        //verificando se o usuario já está sala que entrou 
        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);
        //caso o usuario já esteja na sala basta atualizar seu socketId
        //já que toda vez que usuario da um reload na pagina um novo Id é gerado
        if (userInRoom) {
            userInRoom.socketId == data.socketId;
        }
        else {
            //add novo usuario a sala 
            users.push({
                room: data.room,
                username: data.username,
                socketId: socket.id
            });
        }
        callbabk(yield getMessagensRoom(data.room));
    }));
    //recebendo messages dos usuarios 
    socket.on("message", data => {
        const message = {
            room: data.room,
            creatDate: new Date(),
            message: data.message,
            username: data.username
        };
        messages.push(message);
        //enviando mensagem para todos os usuarios na sala
        //objervação caso eu quisesse mandar a mensagem penas para um usuario 
        //usa-se o socket não o io
        http_1.io.to(data.room).emit("message", message);
    });
    function getMessagensRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `select rooms.message, users.username from rooms INNER join users on (rooms.usersId = users.id) where rooms.room = '${room}'`;
            const messageInRoom = yield db.exec(sql);
            return messageInRoom;
        });
    }
});
