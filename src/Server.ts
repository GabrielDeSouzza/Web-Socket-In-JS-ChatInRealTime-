import { Console } from "console";
import { httpServer } from "./http";
import './websocket'
httpServer.listen(3000, ()=> console.log("running in port 3000"))