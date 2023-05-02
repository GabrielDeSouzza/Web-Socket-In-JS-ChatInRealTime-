import { Request, Response } from "express";
import auth from "../middlewares/auth";
import db from "../src/db";

const express = require('express');
const router = express.Router();

router.get("/usersManager", auth, async(req:Request, res: Response)=>{
    if(req.session.user?.isadm !=1){
        req.session.msg_error = "Você não tem permissão para acessar essa área"
        res.redirect("/socialArea")
        delete req.session.msg_error
        return
    }
    const usersNotAdm = await db.getUsersNotAdm();
    res.render("usersManager", {
        msg_error: req.session.msg_error,
        user: req.session.user,
        usersNotAdm
    })
    delete req.session.msg_error
})

router.post("/usersManager", auth, async(req:Request, res: Response)=>{
    const usersNotAdm = await db.getUsersNotAdm();
    if(await db.desableUser(req.body.username) == false){
        res.render("usersManager", {
            msg_error: "Não foi possível deletar usuario",
            user: req.session.user,
            usersNotAdm
        })
        return
    }
    db.delMemberAllRoom(req.body.username)
    req.session.msg_error= `Funcionario ${req.body.nomeFuncionario} deletado com sucesso`
    res.redirect("/usersManager")
    delete req.session.msg_error
    return
})

export default router

