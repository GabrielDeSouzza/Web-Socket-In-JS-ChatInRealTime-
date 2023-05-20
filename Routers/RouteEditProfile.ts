import { Request, Response } from "express";
import auth from "../Middlewares/Auth";
import DbConnection from "../src/DataBaseConnection";
import bcrtypt from 'bcryptjs'
import IUserData from "../src/Types/TUserData";
const express = require('express');
const router = express.Router();


router.get("/editProfile", auth, (req:Request, res:Response)=>{
    res.render("editProfile",{
        userName: req.session.user?.userName,
        user: req.session.user,
        msg_error :req.session.msg_error
    })
    delete req.session.msg_error
})

router.post("/editProfile", auth, async(req:Request, res:Response)=>{
    if(!(req.session.user?.userName)){
        req.session.msg_error = "erro tente novamente"
        res.redirect("/editProfile")
        return
    }
    if(await DbConnection.verifyUser(req.body.newuserName)){
        req.session.msg_error = "Usuario já em uso"
        res.redirect("/editProfile")
    }
   
    const user: IUserData = await DbConnection.getUser(req.session.user.userName as string).then((response)=>{
        return response[0]
    })
    if(!(await bcrtypt.compare(req.body.oldPassword, user.password as string))){
        req.session.msg_error = "Digite sua antiga senha corretamente!"
        res.redirect("/editProfile")
        return
    }
    const userName = req.body.newuserName? req.body.newuserName: req.session.user.userName
    const password = req.body.newPassword? req.body.newPassword: req.body.oldPassword
    user.userName = userName
    user.password = await bcrtypt.hash(password, 8)
    const msgError = await DbConnection.updateUser(user)
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