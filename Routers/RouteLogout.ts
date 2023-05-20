import { Request, Response, Router } from "express";
const express = require('express');
const router = express.Router();

router.post('/logout', async (req: Request, res: Response)=>{
    delete req.cookies.token
    res.clearCookie("token")
    res.redirect("/")
    return
})

export default router