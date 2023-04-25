import db from '../src/db'
import bcrtypt from 'bcryptjs'
import auth from '../middlewares/auth'
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { env } from 'process';
import IUserData from '../src/types/IUserData';
import { createToken } from '../src/tokens/tokens/controller_Tokens';
declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     username: string;
     room: string;
     rooms: []
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
    const rooms = await db.getRooms()
    console.log(rooms)
    if(req.body.select_room == -1){
        res.render("index",{
            msg_error: "Escolha uma Sala",
            rooms: rooms
        })
        return
    }
    

    if(req.body.username ==="" || req.body.password === ""){
        res.render("index",{
            msg_error : "Preencha todos os campos",
            rooms: rooms
        })
        return
    }
    const userData:IUserData[] = await db.getUser(req.body.username)

    const user:IUserData|undefined= userData.find(element=> element.username ==req.body.username)

    if(user == undefined ){
        res.render("index",{
            msg_error: "Usuario não encontrado",
            rooms: rooms
        })
        return
    }
    else if(!(await bcrtypt.compare(req.body.password, user.password))){
        res.render("index",{
            msg_error: "Senha invalida ou usuario não encontrado",
            rooms: rooms
        })
        return
    }

    const token = createToken(user)
    res.cookie("token",token, {httpOnly: true})
    if (req.body.select_room == "Criar Sala"){
        console.log(req.body)
        req.session.username = req.body.username
        res.redirect("/createRoom")
        console.log(res.cookie)
        return;
    }

    req.session.username = req.body.username
    console.log(req.body.room)
    req.session.room = req.body.select_room
    res.redirect('/chat')
 
})

export default router