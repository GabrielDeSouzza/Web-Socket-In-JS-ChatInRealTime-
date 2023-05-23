//carregando e importando depedencias 
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path"
import login from "../Routers/RouteLogin"
import cadastrar from '../Routers/RouteCadastro'
import routeUpload from '../Routers/RouteUploader'
import pageChat from '../Routers/RouteChat'
import routeLogout from "../Routers/RouteLogout";
import { env } from "process";
import pagSocialArea from "../Routers/RouteSocialArea";
import pagEditProfile from "../Routers/RouteEditProfile"
import pagManagerUsers from "../Routers/RouteUsersManager"
import pagRoomsManager from "../Routers/RouteRoomsManager"
import pagCreateRoom from "../Routers/RouteCreateRoom"
const cookieParser = require("cookie-parser")


const app = express();
const session = require('express-session')
const bodyParser = require('body-parser')


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

app.use(pagEditProfile)
app.use(routeLogout)
app.use(pageChat)
app.use(cadastrar)
app.use("/",routeUpload)
app.use(pagCreateRoom)
app.use(login)
app.use(pagSocialArea)
app.use(pagManagerUsers)
app.use(pagRoomsManager)
const HttpServer = http.createServer(app)
const IO = new Server(HttpServer)

export {HttpServer,IO}

