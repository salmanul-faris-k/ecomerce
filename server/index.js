require('dotenv').config()
const express =require('express')
const cors=require('cors')

const userrouter=require('./routes/auth/auth-router')
const Productrouter = require('./routes/Product/Productrouter')
const connectCloudinary = require('./db/Cloudinary')
const cartrouter = require('./routes/cart/Cartrouter')
const Adressrouter = require('./routes/adress/Adressrouter')
const CheckOutrouter = require('./routes/checkout/CheckOutroute')
const razorpayRoutes = require('./routes/razorpay/razorpayRoutes')
const orderrouter = require('./routes/order/orderrouter')
const Newsletterrouter = require('./routes/Newsletter/Newsletterrouter')
const server=express()
server.use(cors())
server.use(express.json())
server.use('/api/auth',userrouter)
server.use('/api/product',Productrouter)
server.use('/api/cart',cartrouter)
server.use('/api/Adress',Adressrouter)
server.use('/api/checkout',CheckOutrouter)
server.use("/api/razorpay", razorpayRoutes);
server.use("/api/order", orderrouter);
server.use("/api/Newsletter", Newsletterrouter);

require('./db/db')
connectCloudinary()
const PORT=3000||process.env.PORT
server.listen(PORT,()=>{
    console.log("oka nuu");
    
})
server.get('/',(req,res)=>{
        res.status(200).send('<h1> server running sucessfully</h1>')

})




