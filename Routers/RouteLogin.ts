import dbConnection from '../src/DataBaseConnection'
import bcrtypt from 'bcryptjs'
import { Request, Response } from "express";
import TUserData from '../src/Types/TUserData';
import { createToken } from '../src/tokens/tokens/ControllerTokens';

declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     user: TUserData;
     room: string;
     rooms: [];
     [key: string]: any;
   } 
}
const express = require('express');
const router = express.Router();
router.get('/', async(req:Request,res:Response)=>{
    const rooms  = await dbConnection.getRooms()
    const msg_error = req.session.msg_error
    delete req.session.msg_error
    res.render("index",{
        rooms: rooms,
        msg_error: msg_error
    })
    delete req.session.msg_error
    bcrtypt.hash("1234" as string, 8)
})
router.post('/',async (req:Request,res:Response)=>{

    if(req.body.userName ==="" || req.body.password === ""){
        res.render("index",{
            msg_error : "Preencha todos os campos",
        })
        return
    }
    
    const userData:TUserData[] = await dbConnection.getUser(req.body.userName)

    const user:TUserData|undefined= userData.find(element=> element.userName.toLowerCase() ==req.body.userName.toLowerCase())
    if(user == undefined ){
        res.render("index",{
            msg_error: "Usuario não encontrado",
        })
        return
    }
    else if(!(await bcrtypt.compare(req.body.password, user.password as string))){
        res.render("index",{
            msg_error: "Senha invalida ou usuario não encontrado",
        })
        return
    }

    const token = createToken(user)
    res.cookie("token",token, {httpOnly: true})
    req.session.userName = req.body.userName
    res.redirect('/socialArea')
})

export default router