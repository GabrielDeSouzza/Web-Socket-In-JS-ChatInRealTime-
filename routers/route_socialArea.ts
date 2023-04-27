import { Request, Response } from "express";
import auth from "../middlewares/auth";

const express = require('express');
const router = express.Router();

router.get("/socialArea", auth, ( req:Request, res:Response)=>{
    res.render("socialArea")
})

router.post("/socialArea", auth, ( req:Request, res:Response)=>{
    res.redirect("/")
})

export default router