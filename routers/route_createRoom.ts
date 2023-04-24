import { Request, Response } from "express";

const express = require('express');
const router = express.Router();


router.get('/createRoom', async(req:Request,res: Response)=>{
    res.render('createRoom')
})

router.post('/createRoom', async(req:Request,res: Response)=>{
    console.log('tetsa')
})



module.exports = router