//carregando e importando depedencias 
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path"
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser')
const db =require('./db')

//configurando a sessões
app.use(session({
    secret:'dfdsfsdfd',
    resave: true,
    saveUninitialized:true
}))

//configurando bodyParser para pegar dados enviados pelos clientes
app.use(bodyParser.urlencoded({extended:true}))

//setando e configurando paginas estagicas e a forma de utilizar views
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"..","public")))
app.set('public', path.join(__dirname, '/public'))

//ajustando endpoint´s 
app.get('/',(req,res)=>{
    console.log(req, res)
    res.render("index")
})

app.get('/cadastro',(req,res)=>{
    res.render('cadastro')
})

app.post('/cadastro', async(req,res)=>{
    if(await db.verifyUser(req.body.username)){
        res.render('cadastro',{
            result_msg: 'Cadastro já cadastrado'
        })
    }
    else{
        const username = req.body.username
        const password = req.body.password
        console.log(username, 'dsf')
        if(username === '' || password === ''){
            res.render('cadastro',{
                result_msg: "Preencha todos os campos"
            })
        }
        await db.registerUser(username,password)
        res.render('cadastro',{
            result_msg : "Usuario Cadastrado"
        })
    }
})

app.post('/',async (req,res)=>{
    if(req.body.select_room == -1){
        res.render("index",{
            msg_error: "Escolha uma Sala"
        })
        return
    }
    interface IUserData{
        username:string,
        password:string
    }

    const userData:IUserData[] = await db.getUser(req.body.username)

    const user:IUserData|undefined= userData.find(element=> element.username ==req.body.username)
  
    if(user == undefined){
        res.render("index",{
            msg_error: "Usuario não encontrado"
        })
        return
    }
    else if(user.password != req.body.password){
        res.render("index",{
            msg_error: "Senha invalida ou usuario não encontrado"
        })
        return
    }
    res.render('chat', {
        room: req.body.select_room,
        username: req.body.username
    })
})

const httpServer = http.createServer(app)
const io = new Server(httpServer)



export{httpServer,io}

