const express=require('express')
const Productcontroller=require('../../cotroller/Product/Productcontroller')

const {jwtmiddilware,admin}=require('../../midilware/jwtmiddileware')
const multerMiddileware = require('../../midilware/Multermidilware')
const Productrouter= new express.Router()

Productrouter.post("/addproduct",jwtmiddilware,admin,multerMiddileware.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),Productcontroller.addproduct)
Productrouter.put("/editproduct/:id",jwtmiddilware,admin,multerMiddileware.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),Productcontroller.editproduct)
Productrouter.delete("/deleteproduct/:id",jwtmiddilware,admin,Productcontroller.deleteproduct)
Productrouter.get('/getproduct',Productcontroller.getallproduct)
Productrouter.get('/getproduct/:id',Productcontroller.getsingleproduct)
Productrouter.get('/getsimilerproduct/:id',Productcontroller.getsimilerproduct)
Productrouter.get('/bestnsellerproduct',Productcontroller.bestsellerproduct)
Productrouter.get('/Newin',Productcontroller.newproduct)


module.exports=Productrouter