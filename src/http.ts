//carregando e importando depedencias 
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path"
import login from "../routers/route_login"
import cadastrar from '../routers/route_cadastro'
import route_upload from '../routers/route_uploader'
import pageChat from '../routers/route_chat'
import rotaLogout from "../routers/route_logout";
import { env } from "process";


const cookieParser = require("cookie-parser")

const app = express();
const session = require('express-session')
const bodyParser = require('body-parser')
const db = require('./db')
const route_createRoom = require('../routers/route_createRoom')

app.use(cookieParser())
//configurando a sessões
app.use(session({
    secret:env.SECRET_SESSION,
    resave: true,
    saveUninitialized:true
}));


//configurando bodyParser para pegar dados enviados pelos clientes
app.use(bodyParser.urlencoded({extended:true}))

//setando e configurando paginas estaticas e a forma de utilizar views
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"..","public")))
app.set('public', path.join(__dirname, '/public'))
app.use("*/uploads",express.static(__dirname+"/public/uploads") )

app.use(rotaLogout)
app.use(pageChat)
app.use(cadastrar)
app.use("/",route_upload)
app.use(route_createRoom)
app.use(login)
const httpServer = http.createServer(app)
const io = new Server(httpServer)

export {httpServer,io}

