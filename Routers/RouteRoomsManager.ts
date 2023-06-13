import { Request, Response } from "express";
import dbConnection from "../src/DataBaseConnection";
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
router.get("/roomsManager", auth, async (req: Request, res: Response) => {
    const rooms = await dbConnection.getRoomsCreatedBy(req.session.user?.userName as string)
    const usersMember = await dbConnection.getAllUsersMember()
    const allUsers = await dbConnection.getUsersNotAdm()
    res.render("roomsManager", {
        rooms: rooms,
        msg_error: req.session.msg_error || "",
        usersMember: usersMember,
        users: allUsers,
        user: req.session.user
    })
    delete req.session.msg_error
})
router.post("/roomsManager", auth, async (req: Request, res: Response) => {
    console.log(req.body)
    if (req.body.action == "alterar") {
        const room: IAlterRoom = {
            description: req.body.description.trim(),
            newName: req.body.nameRoom.trim(),
            oldName: req.body.oldName.trim()
        }
        const usersMember = await dbConnection.getAllUsersMember()
        const newUsers = req.body.usersMemberAdd? req.body.usersMemberAdd instanceof(Array)? req.body.usersMemberAdd : [req.body.usersMemberAdd] : []
        const delUsers = req.body.usersMemberDel? req.body.usersMemberDel instanceof(Array)? req.body.usersMemberDel : [req.body.usersMemberDel] : []
        console.log("add")
        console.log(newUsers)
        console.log("del")
        console.log(delUsers)
        console.log(req.body)
        usersMember.filter(async (user: any) => {
            if (delUsers.indexOf(user.username) != -1) {
                await dbConnection.delMemberRoom(user.username, req.body.nameRoom)
            }
        })
            
        if (newUsers) {
            newUsers.forEach(async (newUser: any) => { 
                const contains =  usersMember.find((e: any) => {
                return e.username == newUser && e.nametable == req.body.nameRoom
            })
            if (!contains) {
                await dbConnection.addUsersMember(newUser, req.body.nameRoom)
            }
            });
        }
        let message: string
        if (room.newName != room.oldName) {
            message = await dbConnection.alterNameRoom(room)
            console.log(message)
        }
        else {
            message = await dbConnection.alterDescriptionRoom(room.oldName as string, room.description)
        }
        req.session.msg_error = message
        res.redirect("/roomsManager")
        return
    }
    else if (req.body.action == "excluir") {
        req.session.msg_error = await dbConnection.deleteRoom(req.body.nameRoom)
        res.redirect("/roomsManager")
        return
    }
})


export default router