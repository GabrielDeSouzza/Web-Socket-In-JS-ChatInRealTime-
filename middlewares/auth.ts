import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type } from "os";
import { env } from "process";
import "express-session";
import {verifyToken} from '../src/tokens/tokens/controller_Tokens'
declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     username: string;
     room: string;
     [key: string]: any;
   } 
 }
export default  

     async(req: Request, res: Response, next: Function)=>{

        type msg_error = {
            msg_error:string
        }
        const token = req.cookies.token
        if(!token){
            req.session.msg_error = "Acesso a area restrita, loga-se para acessar URL"
            res.redirect("/")
            return
        }
        try{
            verifyToken(token)
            return next()
        }
        catch(e){
            req.session.msg_error = "erro de autentificação"
            res.redirect("/")
            
        }
}