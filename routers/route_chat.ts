import { Request, Response } from "express";
import auth from "../middlewares/auth";
const express = require('express');
const router = express.Router();

router.get('/chat',auth,(req: Request, res:Response)=>{
    res.render('chat',{
        room: req.session.room,
        username: req.session.username
    })
    console.log(req.session.room)
    delete req.session.room
    delete req.session.username
})

export default router