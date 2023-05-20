import { Request, Response } from "express";
import db from "../src/DataBaseConnection";
import IUserData from "../src/Types/TUserData";
import IAlterRoom from "../src/Types/TAlterRoom";
import auth from "../Middlewares/Auth";

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
    const rooms = await db.getRoomsCreatedBy(req.session.user?.userName as string)
    const usersMember = await db.getAllUsersMember()
    const allUsers = await db.getUsersNotAdm()
    res.render("roomsManager", {
        rooms: rooms,
        msg_error: req.session.msg_error,
        usersMember: usersMember,
        users: allUsers,
        user: req.session.user
    })
    delete req.session.msg_error
})
router.post("/roomsManager",auth, async (req: Request, res: Response) => {
    if (req.body.action == "alterar") {
        const room: IAlterRoom = {
            description: req.body.description.trim(),
            newName: req.body.nameRoom.trim(),
            oldName: req.body.oldName.trim()
        } 
        const usersMember = await db.getAllUsersMember()
        const newUsers = req.body.usersMember || []
        usersMember.filter(async (user:any)=>{
            if(newUsers.indexOf(user) == -1){
                await db.delMemberRoom(user.userName, req.body.nameRoom)
            }
        })
        if( !(newUsers instanceof(Array))){
            await db.addUsersMember(newUsers, req.body.nameRoom)
        }
        else if(newUsers.length > 1){
            newUsers.forEach(async (newUser:any) => {
                await db.addUsersMember(newUser, req.body.nameRoom)
            });
        }
        let message: string
        if (room.newName != room.oldName) {
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


export default router