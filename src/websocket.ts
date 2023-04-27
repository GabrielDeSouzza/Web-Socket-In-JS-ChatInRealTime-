import { Module } from "module";
import { io } from "./http";
import db from "./db";
import IRomUser from "./types/IRoomUser";
import IMessage from "./types/IMessage";
const moment = require('moment')
require("dotenv").config();
const cloudinary = require('cloudinary').v2;


//array de usuarios
const users: IRomUser[] = []

//conectando usuario ao servidor
 io.on("connection",  (socket) =>{
    socket.on("userData", async(data, callbabk) =>{
        //jogando o usuario para sala que ele selecionou
        socket.join(data.room)
        //verificando se o usuario já está sala que entrou 
        const userInRoom = users.find(user=> user.username === data.username && user.room === data.room)

        //caso o usuario já esteja na sala basta atualizar seu socketId
        //já que toda vez que usuario da um reload na pagina um novo Id é gerado
        if(userInRoom){
            userInRoom.socketId == data.socketId
        }
        else{
        //add novo usuario a sala 
            users.push({
                room: data.room,
                username: data.username,
                socketId: socket.id
            })
        }

         callbabk(await getMessagensRoom(data.room))
  
    })
    //recebendo messages dos usuarios 
    socket.on("message", async (data: IMessage) =>{
        let messagem:IMessage;
        console.log(data)
        if(data.nameUpImage){
         messagem =  {
            room: data.room,
            date: moment().format("YYYY/MM/DD HH:mm:ss"),
            messages: data.messages,
            username: data.username,
            url_Image: await cloudinary.url('wsChatAppUploads/'+data.nameUpImage.replace(/[^a-zA-Z0-9\.]/g, ""), {transformation: [
                {height: 320, width: 320, crop: "limit"}
                ]}),
            nameUpImage: data.nameUpImage.replace(/[^a-zA-Z0-9\.]/g, "")
        }
        }
        else{
             messagem = {
                room:data.room,
                date: moment().format("YYYY/MM/DD HH:mm:ss"),
                messages: data.messages,
                username: data.username,
            } 
        }
        db.saveMessages(messagem)
        //enviando mensagem para todos os usuarios na sala
        //objervação caso eu quisesse mandar a mensagem penas para um usuario 
        //usa-se o socket não o io
        io.to(data.room).emit("message",messagem)
    })
   
    async function getMessagensRoom(room:string){
        
        const messageInRoom = await db.getMessagesRoom(room)
        const messages = new Array()
        messageInRoom.forEach((element: any) => {
            messages.push({
                username: element.fk_name_user,
                messages: element.messages,
                nameUpImage: element.nameUpimage,
                url_image: element.url_Image,
                date: element.date
            })
        });
        console.log(messages)
        return messages
    }
})  