const express=require('express')
const authcontroller=require('../../cotroller/auth-controller/authusercontroler')
const aditionalcontroller=require('../../cotroller/aditionalcontroller/aditionalcontroller')

const {jwtmiddilware, admin}=require('../../midilware/jwtmiddileware')
const multerMiddileware = require('../../midilware/Multermidilware')
const userrouter= new express.Router()

userrouter.post('/register',authcontroller.registercontroller)
userrouter.post('/login',authcontroller.logincontroller)
userrouter.get('/profile',jwtmiddilware,authcontroller.profile)
userrouter.post("/addimage",jwtmiddilware,admin,multerMiddileware.fields([{ name: "image", maxCount: 1 }]),aditionalcontroller.addAditional)
userrouter.get("/getimage",aditionalcontroller.getAditionals)
userrouter.delete("/delete/:id",jwtmiddilware,admin,aditionalcontroller.deleteAditional)
userrouter.post("/forgot-password", authcontroller.forgotPassword);
userrouter.post("/reset-password/:token", authcontroller.resetPassword);


module.exports=userrouter