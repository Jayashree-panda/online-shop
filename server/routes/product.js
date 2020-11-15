const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
//const { Product } = require("../models/Product");
const multer = require("multer");
const { auth } = require("../middleware/auth");
const path = require("path");
const { Product } = require("../models/Product");

//=================================
//             User
//=================================

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "/Documents/boilerplate-mern-stack/server/uploads/");
    cb(null, path.join(__dirname + "../../uploads"));
    // cb(null, "../../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/uploadImage", auth, (req, res) => {
    //after getting the image from client 
    //we need to save it node server
    upload(req, res, (err) => {
      if (err) {
        console.log("jaya here...."+ err +"jaya going...")
        return res.json({ success: false, err });
      }
      console.log("successfully sent to server")
      return res.json({
        success: true,
        image: res.req.file.path,
        fileName: res.req.file.filename,
      });
    });
});

router.post("/uploadProduct", auth, (req, res) => {
  //save all the data we got from client into the database
  const product = new Product(req.body);

  product.save((err)=>{
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({success:true})
  })
  
});

module.exports = router;
