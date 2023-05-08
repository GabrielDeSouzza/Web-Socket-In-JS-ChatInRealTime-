import { Request, Response } from "express";
import auth from "../middlewares/auth";

require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const express = require('express')
const router = express.Router()
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: async function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, file.originalname.replace(/[^a-zA-Z0-9\.]/g, ""))
  }
})

const upload = multer({
  storage: storage

});

router.post("/uploads", auth, upload.single('userUpload'),async (req: Request, res: Response) => {
  const filename = req.file?.originalname
  console.log("Test")
  if (filename) {
    const extesionFile = filename.split('.').pop()
    console.log(extesionFile)
    if (extesionFile == "png" || extesionFile == "jpg") {
      cloudinary.uploader.upload("public/uploads/" + filename.replace(/[^a-zA-Z0-9\.]/g, ""), {
        folder: "uploadsImage",
        use_filename: true,
        unique_filename: false
      }).then((result: any) => console.log(result)).catch((e:any)=>{
        console.log(e)})
        console.log("merda")
    }
    else{
      cloudinary.uploader.upload("public/uploads/" + filename.replace(/[^a-zA-Z0-9\.]/g, ""), {
        folder: "uploadsFiles",
        use_filename: true,
        unique_filename: false,
        resource_type: "raw",
        public_id: filename.replace(/[^a-zA-Z0-9\.]/g, "")
      }).then((result: any) => console.log(result)).catch((e:any)=>{
        console.log(e)
      })
      
    }
  }
})




export default router