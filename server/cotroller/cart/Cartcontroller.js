const { json } = require("express");
const Cart = require("../../model/CartModel");
const Product = require("../../model/ProductModel");
const getCart=async (userId,guestId)=>{
if(userId){
    return await Cart.findOne({user:userId})
}
else if(guestId){
        return await Cart.findOne({guestId})

}
return null
}

exports.addcart=async(req,res)=>{
    const {productId,quantity,sizes,guestId,userId}=req.body

    try {
const product=await Product.findById(productId)
if(!product) return  res.status(404).json({message:"product not found"})
const gstAmount = product.Price * (product.gstPercentage / 100);
  
let cart=await getCart(userId,guestId);
if(cart){
    const productIndex=cart.products.findIndex((p)=>p.productId.toString()===productId&&
p.sizes===sizes)
if(productIndex>-1){
    cart.products[productIndex].quantity+=quantity

}
else{
   cart.products.push ({
              productId,images:product.images[0],productName:product.productName,sizes,Price:product.Price,gstPercentage: product.gstPercentage,
                    gstAmount,quantity


        })
}

cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.Price*item.quantity,0)
cart.totalgstamount=cart.products.reduce((acc,item)=>acc+item.gstAmount*item.quantity,0)

await cart.save()
return res.status(200).json(cart)
}
else{
    const newCart=await Cart.create({
        user:userId?userId:undefined,
        guestId:guestId?guestId:"guest_"+new Date().getTime(),
        products:[{
              productId,images:product.images[0],productName:product.productName,sizes,Price:product.Price,gstPercentage: product.gstPercentage,
                    gstAmount,quantity


        },],
        totalPrice:product.Price*quantity,
        totalgstamount:gstAmount*quantity

    })
    return res.status(201).json(newCart)
}

        
    } catch (error) {
          res.status(500).json(error)
        
    }
}
exports.updatecart=async(req,res)=>{
const {productId,quantity,sizes,guestId,userId}=req.body
try {
    let cart=await getCart(userId,guestId)
    if(!cart) return  res.status(404).json({message:"product not found"})

 const productIndex=cart.products.findIndex((p)=>p.productId.toString()===productId&&
p.sizes===sizes)
if(productIndex>-1){
    if(quantity>0){
        cart.products[productIndex].quantity=quantity

    }
    else{
        cart.products.splice(productIndex,1)
    }
    cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.Price*item.quantity,0)
    
cart.totalgstamount=cart.products.reduce((acc,item)=>acc+item.gstAmount*item.quantity,0)

    await  cart.save()
    return res.status(200).json(cart)
}
else{
    return res.status(404).json("product not foundnin cart")
}
} catch (error) {
             return  res.status(500).json(error)

}
}



exports.deletecart=async(req,res)=>{
const {productId,quantity,sizes,guestId,userId}=req.body
try {
    let cart=await getCart(userId,guestId)
    if(!cart) return  res.status(404).json({message:"product not found"})

 const productIndex=cart.products.findIndex((p)=>p.productId.toString()===productId&&
p.sizes===sizes)
if(productIndex>-1){
    cart.products.splice(productIndex,1)
    cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.Price*item.quantity,0)
    cart.totalgstamount=cart.products.reduce((acc,item)=>acc+item.gstAmount*item.quantity,0)

    await cart.save()
    return res.status(200).json(cart)
}
else{
    return res.status(404).json({message:"product not found"})
}
} catch (error) {
             return  res.status(500).json(error)

}
}

exports.getcart=async(req,res)=>{
    const {userId,guestId}=req.query
try {
   const cart=await getCart(userId,guestId)
   if(cart){
    res.status(200).json(cart)
   } 
   else{
    res.status(404).json({message:"product not found"})
   }
} catch (error) {
  res.status(500).json(error)  
}
}

exports.mergecart=async(req,res)=>{
    const {guestId}=req.body
try {
  const guestcart= await Cart.findOne({guestId})
  const usercart=await Cart.findOne({user:req.user._id})
  if(guestcart){
    if (guestcart.products.length === 0) {
        return res.status(400).json({message:"guest cart is empty"});
      }
    if(usercart){
        guestcart.products.forEach((gustitem)=>{
            const productIndex=usercart.products.findIndex((item)=>
            item.productId.toString()===gustitem.productId.toString()&& item.sizes===gustitem.sizes)
            if(productIndex>-1){
                usercart.products[productIndex].quantity+=gustitem.quantity
            }
            else{
                usercart.products.push(gustitem)
            }
        })
        usercart.totalPrice=usercart.products.reduce((acc,item)=>acc+item.Price*item.quantity,0)
                usercart.totalgstamount=usercart.products.reduce((acc,item)=>acc+item.gstAmount*item.quantity,0)

        await usercart.save()
        try {
            await Cart.findOneAndDelete({guestId})
        } catch (error) {
            console.log("error deleting gust account");
            
        }
        res.status(200).json(usercart)
    }
    else{
        guestcart.user=req.user._id
        guestcart.guestId=undefined
        await guestcart.save()
    }
  }
  else{
    if(usercart){
        return res.status(200).json(usercart)
    }
    res.status(404).json({message:"guest cart not found"})
  }
} catch (error) {
    console.log(error);
    
  res.status(500).json(error)  
}
}
// POST /api/cart/validate-stock
exports.validateCartStock = async (req, res) => {
  try {
    const { products } = req.body; // [{ productId, quantity, sizes }]
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products array" });
    }

    // Fetch all products by IDs
    const productIds = products.map(p => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    // Map productId to product data
    const productMap = new Map();
    dbProducts.forEach(p => productMap.set(p._id.toString(), p));

    // Check items against stock
    const outOfStockItems = [];

    for (const item of products) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        outOfStockItems.push({ productId: item.productId, message: "Product not found" });
        continue;
      }
      if (prod.countInStock <= 0) {
        outOfStockItems.push({ productId: item.productId, message: "Out of stock" });
        continue;
      }
      if (item.quantity > prod.countInStock) {
        outOfStockItems.push({
          productId: item.productId,
          message: `Only ${prod.countInStock} left in stock`,
          availableStock: prod.countInStock,
        });
      }
    }

    return res.status(200).json({ invalidItems: outOfStockItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
