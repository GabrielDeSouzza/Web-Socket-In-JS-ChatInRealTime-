import db from '../src/db'
import bcrtypt from 'bcryptjs'
import auth from '../middlewares/auth'
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { env } from 'process';

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
    if(req.body.select_room == -1){
        res.render("index",{
            msg_error: "Escolha uma Sala"
        })
        return
    }
    interface IUserData{
        id: number;
        username:string,
        password:string
    }

    if(req.body.username ==="" || req.body.password === ""){
        res.render("index",{
            msg_error : "Preencha todos os campos"
        })
        return
    }
    const userData:IUserData[] = await db.getUser(req.body.username)

    const user:IUserData|undefined= userData.find(element=> element.username ==req.body.username)

    if(user == undefined ){
        res.render("index",{
            msg_error: "Usuario não encontrado"
        })
        return
    }
    else if(!(await bcrtypt.compare(req.body.password, user.password))){
        res.render("index",{
            msg_error: "Senha invalida ou usuario não encontrado"
        })
        return
    }
    const secret = env.SECRET_TOKEN
    const token = jwt.sign({id: user.id }, secret as string,{
        expiresIn: '6000'
    })
    if (req.body.select_room == "Criar Sala"){''
        res.redirect("/createRoom?"+req.body.username)
        return;
    }

    req.session.token = token
    req.session.username = req.body.username
    console.log(req.body.room)
    req.session.room = req.body.room
    res.redirect('/chat')
 
})
function transformObjInQueryStrinh(Obj:any){
    const keys = Object.keys(Obj);
    const keysMapped = keys.map((key)=>{
        return encodeURIComponent(key) + "=" + encodeURIComponent(Obj[key]);
    })
    const join = keysMapped.join('&');
    return join
}


export default router