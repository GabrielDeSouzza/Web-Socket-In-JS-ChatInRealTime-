import { Request, Response } from "express";
import auth from "../middlewares/auth";
import db from "../src/db";
import bcrtypt from 'bcryptjs'
import IUserData from "../src/types/IUserData";
const express = require('express');
const router = express.Router();


router.get("/editProfile", auth, (req:Request, res:Response)=>{
    res.render("editProfile",{
        username: req.session.user?.username,
        user: req.session.user,
        msg_error :req.session.msg_error
    })
    delete req.session.msg_error
})

router.post("/editProfile", auth, async(req:Request, res:Response)=>{
    if(!(req.session.user?.username)){
        req.session.msg_error = "erro tente novamente"
        res.redirect("/editProfile")
        return
    }
    if(await db.verifyUser(req.body.newUsername)){
        req.session.msg_error = "Usuario já em uso"
        res.redirect("/editProfile")
    }
   
    const user: IUserData = await db.getUser(req.session.user.username as string).then((response)=>{
        return response[0]
    })
    if(!(await bcrtypt.compare(req.body.oldPassword, user.password as string))){
        req.session.msg_error = "Digite sua antiga senha corretamente!"
        res.redirect("/editProfile")
        return
    }
    const username = req.body.newUsername? req.body.newUsername: req.session.user.username
    const password = req.body.newPassword? req.body.newPassword: req.body.oldPassword
    user.username = username
    user.password = await bcrtypt.hash(password, 8)
    const msgError = await db.updateUser(user)
    if(msgError ==false){
        req.session.msg_error = "Não foi possível atualizar perfil"
        res.redirect("/editProfile")
        return
    }
    else{
        req.session.msg_error = "Perfil atualizado com sucesso"
        res.redirect("/editProfile")
        return
    }
})

export default router