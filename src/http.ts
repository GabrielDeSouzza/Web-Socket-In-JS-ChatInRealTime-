import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path"

const app = express();
app.use(express.static(path.join(__dirname,"..","public")))
const httpServer = http.createServer(app)
const io = new Server(httpServer)

export{httpServer,io}

