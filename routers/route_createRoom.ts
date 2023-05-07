import { Request, Response } from "express";
import auth from "../middlewares/auth";
import IUserCreateRoom from "../src/types/IUserCreateRoom";
import db from "../src/db";
const express = require('express');
const router = express.Router();


router.get('/createRoom', auth, async (req: Request, res: Response) => {
    res.render('createRoom',{
        msg_error: req.session.msg_error,
        user: req.session.user
    })
})

router.post('/createRoom',auth, async (req: Request, res: Response) => {
    const roomsAlreadyCreated = await db.getRooms()
    if (req.session.user?.username && req.body.nameRoom && req.body.descriptionRoom) {
        const usedNameRoom = roomsAlreadyCreated.find((room:any)=>{
            return room.name_room.toLowerCase().trim() === req.body.nameRoom.toLowerCase().trim()
        })
        if (usedNameRoom) {
            return res.render("createRoom", {
                msg_error: "Nome da Sala já está em uso"
            })
        }
        const dataNewRoom: IUserCreateRoom = {
            username: req.session.user?.username as string,
            nameRoom: req.body.nameRoom.trim(),
            descriptionRoom: req.body.descriptionRoom.trim()
        }
        const erroCriate = await db.CreateRoom(dataNewRoom)
        if (erroCriate) {
            res.render("createRoom", {
                msg_error: "Não foi possivel criar a sala"
            })
            return
        }

        req.session.msg_error = "sala criado com sucesso"
        res.redirect("/socialArea")
        return
    }
    req.session.msg_error = ""
    res.redirect("/createRoom")

})



module.exports = router