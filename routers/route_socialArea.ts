import { Request, Response } from "express";
import auth from "../middlewares/auth";
import db from "../src/db";
import IUserData from "../src/types/IUserData";

const express = require('express');
const router = express.Router();

router.get("/socialArea", auth, async (req: Request, res: Response) => {
    const dataRooms = await db.getRooms()
    res.render("socialArea", {
        dataRooms: dataRooms,
        msg_error: req.session.msg_error,
        user: req.session.user
    })
})

router.post("/socialArea", auth, (req: Request, res: Response) => {
    if (!req.session.user) {
        res.render("/socialArea",{
            msg_error: "erro ao carregar chat",
        })
    }
    else {
        req.session.user.username = req.body.username
        req.session.room = req.body.room
        res.redirect("/chat")
        return
    }
})

export default router