import { Request, Response } from "express";
import auth from "../middlewares/auth";
const express = require('express');
const router = express.Router();

router.get('/chat',auth,(req: Request, res:Response)=>{
    if(!req.session.room && req.session.username){
        req.session.msg_error = "Erro ao Carregar Chat"
        res.redirect("/")
        return
    }
    res.render('chat',{
        room: req.session.room,
        username: req.session.username
    })
})

export default router