const mongoose = require("mongoose")

const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    Price:
    {
        type: Number,
        required: true
    }
    ,
    images: {
        type: [String],
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity:{
    type:Number,
    required:true
}, sizes: {
        type: String,
        required: true,
    },
},

    {
        _id: false
    })


const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
orderId: {
  type: String,
  required: true,
  unique: true
},
    checkoutItems: [checkoutItemSchema],
    shippingAdress: {
        Name: { type: String, required: true },
        phone: { type: Number, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: Number, required: true },
        address: { type: String, required: true },
    },
    shippingMethod:{
        type:String,
        required:true
    },
    paymentMethod: {
        type: String, required: true
    },
    totalprice:{type:Number,required:true},
    isPaid:{type:Boolean,default:false},
        paidAt:{type:Date},
    paymentStatus:{type:String,default:"pending"},
    paymentDetails:{type:mongoose.Schema.Types.Mixed},
    isFinalized:{
        type:Boolean,
        default:false
    },
    finalizedAt:{
        type:Date
    }


},{timestamps:true})
const Checkout = mongoose.model('Checkout', checkoutSchema)
module.exports = Checkout