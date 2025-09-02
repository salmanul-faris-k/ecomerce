const Cart = require("../../model/CartModel");
const Checkout = require("../../model/checkout");
const Order = require("../../model/Order");
const Product = require("../../model/ProductModel");

const generateFlipkartStyleOrderId = () => {
  const prefix = "OD";
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}${timestamp}${randomSuffix}`;
};


exports.createcheckout = async (req, res) => {
    const {shippingAdress,checkoutItems,shippingMethod,paymentMethod,totalprice}=req.body
    if(!checkoutItems||checkoutItems===0){
        return res.status(400).json({message:"no item in checkout"})
    }
  try {
    const newCheckout = await Checkout.create({ user:req.user._id,orderId: generateFlipkartStyleOrderId(),
        checkoutItems:checkoutItems,shippingAdress,paymentMethod ,shippingMethod,totalprice,paymentStatus:"pending",isPaid:false});
  
    res.status(200).json(newCheckout);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.updatecheckout = async (req, res) => {
    const {paymentStatus,paymentDetails}=req.body

    
  try {
    const checkout = await Checkout.findById(req.params.id);
    
    
    
    if (!checkout){
              return res.status(404).json({ message: "checkout not found" });

    }
    if(paymentStatus==="paid"){
        checkout.isPaid=true
        checkout.paymentStatus=paymentStatus
        checkout.paymentDetails=paymentDetails
        checkout.paidAt=Date.now()
        await checkout.save()
    res.status(200).json(checkout);

    }
    else{
         res.status(400).json({ message: "invaild payment status" });
 
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.convertorder = async (req, res) => {
   
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout){
              return res.status(404).json({ message: "checkout not found" });

    }
   if(checkout.isPaid && !checkout.isFinalized){
    // create final order 
    const finalOrder=await Order.create({
        user:checkout.user,
        orderItems:checkout.checkoutItems,
        shippingAdress:checkout.shippingAdress,
          shippingMethod:checkout.shippingMethod,
 orderId: checkout.orderId,
        paymentMethod:checkout.paymentMethod,
        totalprice:checkout.totalprice,
        isPaid:true,
        paidAt:checkout.paidAt,
        isDelivered:false,
        paymentStatus:"paid",
        paymentDetails:checkout.paymentDetails
    })
      for (const item of checkout.checkoutItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { countInStock: -item.quantity }
        });
      }
    checkout.isFinalized=true
    checkout.finalizedAt=Date.now()
    await checkout.save()
    await Cart.findOneAndDelete({user:checkout.user})
    res.status(200).json(finalOrder);

   } else if(checkout.isFinalized){
         res.status(400).json({ message: "check out alreay finalized" });

   }

    else{
          res.status(400).json({ message: "check out not paid" });

    }
  } catch (err) {
    res.status(500).json(err);
  }
};

