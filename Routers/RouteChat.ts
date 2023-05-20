import { Request, Response } from "express";
import auth from "../Middlewares/Auth";
const express = require('express');
const router = express.Router();

router.get('/chat',auth,(req: Request, res:Response)=>{
    if(!req.session.room && req.session.user?.userName){
        req.session.msg_error = "Erro ao Carregar Chat"
        res.redirect("/socialArea")
        return
    }
    res.render('chat',{
        room: req.session.room,
        userName: req.session.user?.userName,
        setor: req.session.user?.setor,
        cargo: req.session.user?.cargo,
        nome: req.session.user?.nomeFuncionario,
        user:req.session.user
    })
    delete req.session.msg_error
})

export default router