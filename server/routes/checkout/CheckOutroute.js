const express=require('express')
const Checkoutcontroller=require('../../cotroller/checkout/Checkoutcontroller')

const {jwtmiddilware,admin}=require('../../midilware/jwtmiddileware')
const CheckOutrouter= new express.Router()

CheckOutrouter.post('/',jwtmiddilware,Checkoutcontroller.createcheckout)
CheckOutrouter.put('/:id/pay',jwtmiddilware,Checkoutcontroller.updatecheckout)
CheckOutrouter.post('/:id/finalize',jwtmiddilware,Checkoutcontroller.convertorder)


module.exports=CheckOutrouter