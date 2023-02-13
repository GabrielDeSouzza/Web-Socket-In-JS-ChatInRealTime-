import { Request, Response } from "express";
import { Multer } from "multer";

require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const express = require('express')
const router = express.Router()
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wsChatAppUploads',
        public_id: (req:Request, file:Express.Multer.File) =>file.originalname,
        resourse_type: 'image',

    }
})

const upload = multer({ storage: storage });

router.post("/uploads/images", upload.single('userUpload'),(req:Request,res:Response)=>{
    
    console.log(req.file?.originalname)
})






module.exports = router