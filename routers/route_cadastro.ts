import { Request, Response } from "express";
import db from '../src/db'
import bcrtypt from 'bcryptjs'
import { env } from "process";
import jwt from 'jsonwebtoken'


const express = require('express');
const router = express.Router();

router.get('/cadastro', async(req:Request,res:Response)=>{
    res.render('cadastro')
})
router.post('/cadastro', async(req:Request,res:Response)=>{
    if(await db.verifyUser(req.body.username)){
        res.render('cadastro',{
            result_msg: 'Usuario já cadastrado'
        })
        return
    }
    else{
        const username = req.body.username
        const password = req.body.password
   
        if(username === '' || password === ''){
            res.render('cadastro',{
                result_msg: "Preencha todos os campos"
            })
            return
        }
        const passwordEncry = await bcrtypt.hash(password, 8)
        await db.registerUser(username,passwordEncry)
        res.redirect('/')
    }
})

export default router