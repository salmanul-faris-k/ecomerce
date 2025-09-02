const express = require("express");
const razorpayRoutes  = express.Router();
const razorpayController=require('../../cotroller/razorpayController/razorpayController');
const { jwtmiddilware } = require("../../midilware/jwtmiddileware");

razorpayRoutes.post("/create-order",jwtmiddilware,razorpayController.createOrder);
razorpayRoutes.post("/verify-payment",jwtmiddilware, razorpayController.verifyPayment);



module.exports = razorpayRoutes ;
