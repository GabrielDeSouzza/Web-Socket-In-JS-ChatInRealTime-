import { Request, Response } from "express";
import db from '../src/db'
import bcrtypt from 'bcryptjs'

import IUserData from "../src/types/IUserData";
import auth from "../middlewares/auth";
declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     user: IUserData
     room: string;
     rooms: [];

     [key: string]: any;
   } 
 }
const express = require('express');
const router = express.Router();

router.get('/cadastro',auth, async(req:Request,res:Response)=>{
    if(req.session.user?.isadm != 1){
        req.session.msg_error="Você não tem permissão para cadastrar novo usuarios"
        res.redirect("/socialArea")
        return
    }
    res.render('cadastro',{
        user: req.session.user,
        msg_error: req.session.msg_error
    })
})
router.post('/cadastro', async(req:Request,res:Response)=>{
    if(await db.verifyUser(req.body.username)){
        res.render('cadastro',{
            result_msg: 'Usuario já cadastrado'
        })
        delete req.session.msg_error
        return
    }
    else{
        const user: IUserData= {
            username : req.body.username,
            password : req.body.password,
            nomeFuncionario: req.body.nomeFuncionario,
            setor: req.body.setor,
            cargo: req.body.cargo,
            isadm: req.body.isadm?1: 0,
            isdeleted: 0
        }
   
        if(user.username === '' || user.password === ''){
            res.render('cadastro',{
                result_msg: "Preencha todos os campos"
            })
            delete req.session.msg_error
            return
        }
        const passwordEncry = await bcrtypt.hash(user.password as string, 8)
        user.password = passwordEncry
        const isSucess= await db.registerUser(user)
        if(isSucess== false){
            res.render('cadastro',{
                result_msg: "Erro ao cadastrar usuario"
            })
            delete req.session.msg_error
            return
        }
        req.session.msg_error=`Usuario ${user.username} cadastrado com sucesso`
        res.redirect('/socialArea')
        return
    }
})

export default router