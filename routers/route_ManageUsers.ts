import { Request, Response } from "express";

const express = require('express');
const router = express.Router();

router.get("/managerUsers", async(req:Request, res: Response)=>{
    res.render("managerUsers")
})

export default router

