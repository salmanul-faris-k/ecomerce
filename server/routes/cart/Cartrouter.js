const express=require('express')
const Cartcontroller=require('../../cotroller/cart/Cartcontroller')

const {jwtmiddilware,admin}=require('../../midilware/jwtmiddileware')
const cartrouter= new express.Router()

cartrouter.post("/addCart",Cartcontroller.addcart)
cartrouter.put("/updateCart",Cartcontroller.updatecart)
cartrouter.delete("/deleteCart",Cartcontroller.deletecart)
cartrouter.get("/getCart",Cartcontroller.getcart)
cartrouter.post("/merge",jwtmiddilware,Cartcontroller.mergecart)

cartrouter.post("/validate-stock", Cartcontroller.validateCartStock);
module.exports=cartrouter