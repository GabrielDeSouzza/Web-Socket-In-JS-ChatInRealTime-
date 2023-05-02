import { Request, Response } from "express";
import db from "../src/db";
import IUserData from "../src/types/IUserData";

const express = require('express');
const router = express.Router();
declare module "express-session" {
    interface SessionData  {
     msg_error: string;
     token: string;
     user: IUserData;
     room: string;
     rooms: [];

     [key: string]: any;
   } 
 }
router.get("/roomsManager", async(req:Request, res:Response)=>{
    const rooms = await db.getRooms()
    res.render("roomsManager",{
        rooms: rooms,
        msg_error: req.session.msg_error
    })
})
router.post("/roomsManager", async(req:Request, res:Response)=>{
    console.log(req.body)
})
export default router