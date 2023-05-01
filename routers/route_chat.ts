import { Request, Response } from "express";
import auth from "../middlewares/auth";
const express = require('express');
const router = express.Router();

router.get('/chat',auth,(req: Request, res:Response)=>{
    if(!req.session.room && req.session.user?.username){
        req.session.msg_error = "Erro ao Carregar Chat"
        res.redirect("/socialArea")
        return
    }
    res.render('chat',{
        room: req.session.room,
        username: req.session.user?.username,
        setor: req.session.user?.setor,
        cargo: req.session.user?.cargo,
        nome: req.session.user?.nomeFuncionario
    })
})

export default router