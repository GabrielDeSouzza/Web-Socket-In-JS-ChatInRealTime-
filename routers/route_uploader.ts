import { Request, Response } from "express";
import { Multer } from "multer";

require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const express = require('express')
const router = express.Router()
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function (req:Request, file:Express.Multer.File, cb:any) {
        console.log(file)
      cb(null, file.originalname )
    }
  })

const upload = multer({ 
    storage:storage

});

router.post("/uploads/images", upload.single('userUpload'),(req:Request,res:Response)=>{
    cloudinary.uploader.upload("public/uploads/"+req.file?.originalname,{
      folder:"wsChatAppUploads",
      use_filename:true,
      unique_filename:false
    })
})


module.exports = "re"



module.exports = router