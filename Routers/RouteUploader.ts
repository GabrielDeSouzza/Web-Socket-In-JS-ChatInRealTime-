import { Request, Response } from "express";
import auth from "../Middlewares/Auth";

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

router.post("/uploads", auth, upload.single('userUpload'), async(req: Request, res: Response) => {
  const filename = req.file?.originalname
  if (filename) {
    const extesionFile = filename.split('.').pop()
    if (extesionFile == "png" || extesionFile == "jpg") {
      uploadImage(filename)
    }
    else{
      uploadFile(filename)
    }
  }
})

function uploadImage(file:any){
  cloudinary.uploader.upload("public/uploads/" + file.replace(/[^a-zA-Z0-9\.]/g, ""), {
    folder: "uploadsImage",
    use_filename: true,
    unique_filename: false,
    timeout: 50000
  }, (erro:any,result:any)=>{
    console.log(erro,+"  "+result)
    if(erro){
      uploadImage(file)
    }
    console.log(result)
  })
}

function uploadFile(file:any){
  cloudinary.uploader.upload("public/uploads/" + file.replace(/[^a-zA-Z0-9\.]/g, ""), {
    folder: "uploadsFiles",
    use_filename: true,
    unique_filename: false,
    resource_type: "raw",
    public_id: file.replace(/[^a-zA-Z0-9\.]/g, ""),
    timeout: 50000
  }, (erro:any,result:any)=>{
    if(erro){
      uploadFile(file)
    }
    console.log(result)
  })
}

export default router