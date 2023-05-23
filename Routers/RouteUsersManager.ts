import { Request, Response } from "express";
import auth from "../Middlewares/Auth";
import dbConnection from "../src/DataBaseConnection";

const express = require('express');
const router = express.Router();

router.get("/usersManager", auth, async(req:Request, res: Response)=>{
    if(req.session.user?.isadm !=1){
        req.session.msg_error = "Você não tem permissão para acessar essa área"
        res.redirect("/socialArea")
        delete req.session.msg_error
        return
    }
    const usersNotAdm = await dbConnection.getUsersNotAdm();
    res.render("usersManager", {
        msg_error: req.session.msg_error,
        user: req.session.user,
        usersNotAdm
    })
    delete req.session.msg_error
})

router.post("/usersManager", auth, async(req:Request, res: Response)=>{
    const usersNotAdm = await dbConnection.getUsersNotAdm();
    if(await dbConnection.desableUser(req.body.userName) == false){
        res.render("usersManager", {
            msg_error: "Não foi possível deletar usuario",
            user: req.session.user,
            usersNotAdm
        })
        return
    }
    dbConnection.delMemberAllRoom(req.body.userName)
    req.session.msg_error= `Funcionario ${req.body.nomeFuncionario} deletado com sucesso`
    res.redirect("/usersManager")
    delete req.session.msg_error
    return
})

export default router

