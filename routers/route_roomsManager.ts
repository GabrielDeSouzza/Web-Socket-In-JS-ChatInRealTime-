import { Request, Response } from "express";
import db from "../src/db";
import IUserData from "../src/types/IUserData";
import IAlterRoom from "../src/types/IAlterRoom";
import auth from "../middlewares/auth";
import { json } from "body-parser";

const express = require('express');
const router = express.Router();
declare module "express-session" {
    interface SessionData {
        msg_error: string;
        token: string;
        user: IUserData;
        room: string;
        rooms: [];

        [key: string]: any;
    }
}
router.get("/roomsManager",auth, async (req: Request, res: Response) => {
    const rooms = await db.getRooms()
    res.render("roomsManager", {
        rooms: rooms,
        msg_error: req.session.msg_error
    })
    delete req.session.msg_error
})
router.post("/roomsManager",auth, async (req: Request, res: Response) => {
    
    if (req.body.action == "alterar") {
        const room: IAlterRoom = {
            description: req.body.description,
            newName: req.body.nameRoom,
            oldName: req.body.oldName
        }  
        let message: string
        if (room.newName !== room.oldName) {
            message = await db.alterNameRoom(room)
        }
        else {
            message = await db.alterDescriptionRoom(room.oldName as string, room.description)
        }
        req.session.msg_error = message
        res.redirect("/roomsManager")
        return
    }
    else if (req.body.action == "excluir"){
        req.session.msg_error =  await db.deleteRoom(req.body.nameRoom)
        res.redirect("/roomsManager")
        return
    }
})

router.get("/roomsManager/getUsers", auth, async(req: Request, res: Response)=>{
    console.log("Tste")
    const json =JSON.stringify(await db.getUserNames())
    console.log(json)
    res.json(json)
})
export default router