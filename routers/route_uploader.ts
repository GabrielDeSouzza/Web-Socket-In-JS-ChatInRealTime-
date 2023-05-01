import { Request, Response } from "express";
import auth from "../middlewares/auth";

require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const express = require('express')
const router = express.Router()
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function (req:Request, file:Express.Multer.File, cb:any) {
      cb(null, file.originalname.replace(/[^a-zA-Z0-9\.]/g, ""))
    }
  })

const upload = multer({ 
    storage:storage

});

router.post("/uploads/images", auth, upload.single('userUpload'),(req:Request,res:Response)=>{
  const filename = req.file?.originalname
  
  if(filename ){
    cloudinary.uploader.upload("public/uploads/"+filename.replace(/[^a-zA-Z0-9\.]/g, ""),{
      folder:"wsChatAppUploads",
      use_filename:true,
      unique_filename:false
    })
  }
})


export default router