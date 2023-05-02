import db from '../src/db'
import bcrtypt from 'bcryptjs'
import { Request, Response } from "express";
import IUserData from '../src/types/IUserData';
import { createToken } from '../src/tokens/tokens/controller_Tokens';
declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     user: IUserData;
     room: string;
     rooms: [];

     [key: string]: any;
   } 
 }
const express = require('express');
const router = express.Router();
router.get('/', async(req:Request,res:Response)=>{
    const rooms  = await db.getRooms()

    const msg_error = req.session.msg_error
    delete req.session.msg_error
    res.render("index",{
        rooms: rooms,
        msg_error: msg_error
    })
})
router.post('/',async (req:Request,res:Response)=>{

    if(req.body.username ==="" || req.body.password === ""){
        res.render("index",{
            msg_error : "Preencha todos os campos",
        })
        return
    }
    const userData:IUserData[] = await db.getUser(req.body.username)
    const user:IUserData|undefined= userData.find(element=> element.username ==req.body.username)
    console.log(user?.nomeFuncionario+"test")
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
    console.log(user.nomeFuncionario+"+sdas")
    res.cookie("token",token, {httpOnly: true})
    req.session.username = req.body.username
    console.log(req.body.room)
    res.redirect('/socialArea')
})

export default router