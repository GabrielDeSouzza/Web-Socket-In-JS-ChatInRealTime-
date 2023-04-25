import { Request, Response } from "express";
import auth from "../middlewares/auth";
import IUserCreateRoom from "../src/types/IUserCreateRoom";
import db from "../src/db";
import { read } from "fs";
const express = require('express');
const router = express.Router();


router.get('/createRoom',auth, async(req:Request,res: Response)=>{
    res.render('createRoom')
})

router.post('/createRoom', async(req:Request,res: Response)=>{
    console.log("entrou")
    console.log(req.session.username+"sad",req.body.nameRoom, req.body.descriptionRoom, req.body)
    if( req.session.username && req.body.nameRoom && req.body.descriptionRoom){
        const dataNewRoom: IUserCreateRoom = {
            username : req.session.username,
            nameRoom : req.body.nameRoom,
            descriptionRoom: req.body.descriptionRoom
        }
        const erroCriate = await db.CreateRoom(dataNewRoom)
        console.log(erroCriate)
        if(erroCriate){
            res.render("createRoom",{
                msg_error: "Não foi possivel criar a sala"
            })
            return
        }
        
        req.session.msg_error= "sala criado com sucesso"
        res.redirect("/")
    }
    req.session.msg_error="Erro"
    res.redirect("/")
    
})



module.exports = router