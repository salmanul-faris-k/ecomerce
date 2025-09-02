const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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
    }, sizes: {
        type: String
    },

    quantity: {
        type: Number,
        required: true

    },
}, {_id: false  })

const orderSchema=new mongoose.Schema({
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
      
          orderItems: [orderItemSchema],
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
          isDelivered:{
            type:Boolean,
            default:false
          },
          isDeliveredAt:{
            type:Date
          },
    paymentStatus:{type:String,default:"pending"},
    status:{
        type:String,
        enum:["Processing","Packing","Shipped","Outfordelivery","Delivered"],
        default:"Processing"
    }

},{timestamps:true})
const Order = mongoose.model('Order', orderSchema)
module.exports = Order
