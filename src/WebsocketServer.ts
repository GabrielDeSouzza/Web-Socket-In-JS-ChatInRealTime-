
import { IO } from "./HttpServer";
import db from "./DataBaseConnection";
import IRomUser from "./Types/TRoomUser";
import IMessage from "./Types/TMessage";
const moment = require('moment')
require("dotenv").config();

import { v2 as cloudinary } from 'cloudinary'
//array de usuarios
const users: IRomUser[] = []

//conectando usuario ao servidor


IO.on("connection", (socket) => {
  socket.on("userData", async (data, callback) => {
    //jogando o usuario para sala que ele selecionou
    socket.join(data.room);
    //verificando se o usuario já está sala que entrou
    const userInRoom = users.find(
      (user) =>
        user.userName === data.userName && user.room === data.room
    );

    //caso o usuario já esteja na sala basta atualizar seu socketId
    //já que toda vez que usuario da um reload na pagina um novo Id é gerado
    if (userInRoom) {
      userInRoom.socketId == data.socketId;
    } else {
      //add novo usuario a sala
      users.push({
        room: data.room,
        userName: data.userName,
        socketId: socket.id,
      });
    }

    callback(await getMessagensRoom(data.room));
  });
  //recebendo messages dos usuarios
  socket.on("message", async (data: IMessage) => {
    let messagem: IMessage;
    if (data.nameFile) {
      messagem = {
        room: data.room,
        date: moment().format("YYYY/MM/DD HH:mm:ss"),
        messages: data.messages,
        userName: data.userName,
        setor: data.setor,
        cargo: data.cargo,
        nomeFuncionario: data.nomeFuncionario,
        nameFile: data.nameFile.replace(/[^a-zA-Z0-9\.]/g, ""),
      };
    } else {
      messagem = {
        room: data.room,
        date: moment().format("YYYY/MM/DD HH:mm:ss"),
        messages: data.messages,
        userName: data.userName,
        cargo: data.cargo,
        setor: data.setor,
        nomeFuncionario: data.nomeFuncionario,
      };
    }
    db.saveMessages(messagem);
    //enviando mensagem para todos os usuarios na sala
    //observação caso eu quisesse mandar a mensagem apenas para um usuario
    //usa-se o socket não o IO
    IO.to(data.room).emit("message", messagem);
  });

  async function getMessagensRoom(room: string) {
    const messageInRoom = await db.getMessagesRoom(room);
    const messages = new Array<IMessage>();
  
    messageInRoom.forEach((element: any) => {
      const extension = element.nameFile.split(".").pop().toLowerCase();
      let folderClodinary: string = "uploadsImage/";
      let typecontent = "image";
      if (extension != "png" && extension != "jpg") {
        folderClodinary = "uploadsFiles/";
        typecontent = "raw";
      }
      messages.push({
        userName: element.fk_name_user,
        messages: element.messages,
        nameFile: element.nameFile,
        url_file: cloudinary.url(folderClodinary + element.nameFile, {
          resource_type: typecontent,
        }),
        date: element.date,
        setor: element.setor,
        nomeFuncionario: element.nomeFuncionario,
        cargo: element.cargo,
        room: "",
      });
    });
    return messages;
  }
});
