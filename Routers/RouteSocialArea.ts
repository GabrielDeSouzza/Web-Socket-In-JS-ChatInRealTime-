import { Request, Response } from "express";
import auth from "../Middlewares/Auth";
import dbConnection from "../src/DataBaseConnection";
import IUserData from "../src/Types/TUserData";

const express = require('express');
const router = express.Router();

router.get("/socialArea", auth, async (req: Request, res: Response) => {
    let dataRooms = [];
    if(req.session.user?.isadm ==1){
        dataRooms = await dbConnection.getRooms()
    }
    else{
        dataRooms = await dbConnection.getSpecificRoomUser(req.session.user?.userName as string)
    }
    res.render("socialArea", {
        dataRooms: dataRooms,
        msg_error: req.session.msg_error,
        user: req.session.user
    })
    delete req.session.msg_error
})

router.post("/socialArea", auth, (req: Request, res: Response) => {
    if (!req.session.user) {
        res.render("/socialArea",{
            msg_error: "erro ao carregar chat",
        })
        delete req.session.msg_error
    }
    else {
        req.session.user.userName = req.body.userName
        req.session.room = req.body.room
        res.redirect("/chat")
        return
    }
})

export default router