import { Console } from "console";
import { httpServer } from "./http";
import './websocket'
const db= require('./db')
httpServer.listen(3000, '192.168.42.241')