import { Request, Response } from "express";
import auth from "../middlewares/auth";
import db from "../src/db";

const express = require('express');
const router = express.Router();

router.get("/socialArea", auth, async ( req:Request, res:Response)=>{
    const dataRooms = await db.getRooms()
    console.log(dataRooms)
    res.render("socialArea",{
        dataRooms: dataRooms
    })
})

router.post("/socialArea", auth, ( req:Request, res:Response)=>{
    res.redirect("/")
})

export default router