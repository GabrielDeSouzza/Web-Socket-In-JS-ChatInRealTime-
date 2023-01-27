import { io } from "./http";
const db = require('./db')
interface IRomUser{
    socketId: string,
    username: string,
    room: string
}

interface IMessage{
    room:string,
    creatDate:Date,
    message:string,
    username:string
}

const messages: IMessage[] = []

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
    socket.on("message", data=>{
        const message:IMessage = {
            room: data.room,
            creatDate: new Date(),
            message: data.message,
            username: data.username
        }

        messages.push(message)

        //enviando mensagem para todos os usuarios na sala
        //objervação caso eu quisesse mandar a mensagem penas para um usuario 
        //usa-se o socket não o io
        io.to(data.room).emit("message",message)
        
    })

    async function getMessagensRoom(room:string){
        const sql:string = `select rooms.message, users.username from rooms INNER join users on (rooms.usersId = users.id) where rooms.room = '${room}'` 
        const messageInRoom = await db.exec(sql)
        return messageInRoom
    }
})  