import { Request, Response } from "express";
import dbConnection from '../src/DataBaseConnection'
import bcrtypt from 'bcryptjs'

import IUserData from "../src/Types/TUserData";
import auth from "../Middlewares/Auth";
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
    delete req.session.msg_error
})
router.post('/cadastro', async(req:Request,res:Response)=>{
    if(await dbConnection.verifyUser(req.body.userName)){
        res.render('cadastro',{
            result_msg: 'Usuario já cadastrado'
        })
        delete req.session.msg_error
        return
    }
    else{
        const user: IUserData= {
            userName : req.body.userName,
            password : req.body.password,
            nomeFuncionario: req.body.nomeFuncionario,
            setor: req.body.setor,
            cargo: req.body.cargo,
            isadm: req.body.isadm?1: 0,
            isdeleted: 0
        }
   
        if(user.userName === '' || user.password === ''){
            res.render('cadastro',{
                result_msg: "Preencha todos os campos"
            })
            delete req.session.msg_error
            return
        }
        const passwordEncry = await bcrtypt.hash(user.password as string, 8)
        user.password = passwordEncry
        const isSucess= await dbConnection.registerUser(user)
        if(isSucess== false){
            res.render('cadastro',{
                result_msg: "Erro ao cadastrar usuario"
            })
            delete req.session.msg_error
            return
        }
        req.session.msg_error=`Usuario ${user.userName} cadastrado com sucesso`
        res.redirect('/socialArea')
        return
    }
})

export default router