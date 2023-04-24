import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type } from "os";
import { env } from "process";
import "express-session";
declare module "express-session" {
  interface SessionData {
    msg_error: string;
    token: string;
    username: string;
    room: string;
  }
}
export default  
     async(req: Request, res: Response, next: Function)=>{
        type msg_error = {
            msg_error:string
        }
        const token = req.session.token
        delete req.session.token
        if(!token){
            return res.status(400).json({
                erro: true,
                messagem: "usuario não autorizado"
            })
        }
        try{
            var decoded = jwt.verify(token as string, env.SECRET_TOKEN as string)
            return next()
        }
        catch(e){
            req.session.msg_error = "erro de autentificação"
            res.redirect("/")
            
        }
}