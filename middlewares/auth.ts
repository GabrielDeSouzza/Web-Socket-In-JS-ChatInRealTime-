import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type } from "os";
import { env } from "process";
import "express-session";
import {verifyToken} from '../src/tokens/tokens/controller_Tokens'
import IUserData from "../src/types/IUserData";



declare module "express-session" {
    interface SessionData  {
        msg_error: string;
        token: string;
        user: IUserData
        room: string;
        rooms: [];
  
        isatv?: number;
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
            const user =  verifyToken(token)
            if(user.isdeleted ==1){
                req.session.msg_error = "Este usuario não possui mais acesso ao sistema"
                res.redirect("/")
                delete req.session.msg_error
                return
            }
            req.session.user =  user
            return next()
        }
        catch(e){
            req.session.msg_error = "erro de autentificação"
            res.redirect("/")
            
        }
}