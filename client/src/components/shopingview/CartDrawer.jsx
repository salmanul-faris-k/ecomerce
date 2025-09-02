import React, { useEffect, useId, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCartItem, updateCartItem } from '../../store/cartSlice';
import { toast } from 'sonner';
import axios from 'axios';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart)
  const userId = user ? user._id : null
const dispatch=useDispatch()
  const handleScrollTop = () => window.scrollTo(0, 0);

  // 👇 Quantity change with auto-remove if quantity becomes 0
  
const handlecheckout = async () => {
  handleScrollTop();

  if (!user) {
    navigate("login?redirect=login/shop/checkout");
    onClose();
    return;
  }

  // Validate cart stock before checkout
  try {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/api/cart/validate-stock",
      {
        products: cart.products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          sizes: p.sizes,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    const { invalidItems } = response.data;

    if (invalidItems && invalidItems.length > 0) {
      // Compose error message
      let msg = "Some products are out of stock or have limited stock:\n";
      invalidItems.forEach(item => {
        msg += `- Product ID: ${item.productId}, ${item.message}\n`;
      });

      // Show toast or alert
      toast.error(msg, { autoClose: 7000 });

      // Update cart in UI by reducing items exceeding stock or removing out of stock
      invalidItems.forEach(item => {
        const cartItem = cart.products.find(p => p.productId === item.productId);
        if (!cartItem) return;

        if (item.availableStock !== undefined) {
          // Stock reduced - update quantity
          dispatch(updateCartItem({
            productId: cartItem.productId,
            quantity: item.availableStock,
            guestId,
            userId,
            sizes: cartItem.sizes,
          }));
        } else {
          // Out of stock or product deleted - remove item
          dispatch(deleteCartItem({
            productId: cartItem.productId,
            guestId,
            userId,
            sizes: cartItem.sizes,
          }));
        }
      });

      return; // Stop checkout as cart is invalid
    }

    // If no issues, navigate to checkout
    navigate("/shop/checkout");
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to validate cart stock. Please try again.");
  }
};

  const handleAddtocart=(productId, delta, quantity, sizes)=>{
    const newQuantity=quantity+delta
    if(newQuantity>=1){
      dispatch(updateCartItem({
        productId,quantity:newQuantity,guestId,userId,sizes
      }))

    }

  }

  const handleremovetocart=(productId,sizes)=>{
   dispatch(deleteCartItem({productId,guestId,userId,sizes}))

  }
  console.log(cart.products);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-[90%] max-w-[400px] h-full bg-white z-50 shadow-lg flex flex-col rounded-l-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Cart</h2>
              <button onClick={onClose} className="text-2xl">
                <IoCloseOutline />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              {cart && cart?.products?.length > 0 ? (
                cart?.products?.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-20 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item?.productName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item?.sizes}</p>
                      <p className="text-sm  font-poppins font-semibold mt-2">
                        ₹ {item?.Price.toLocaleString()} INR
                      </p>

                      {/* Quantity & Remove */}
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex border rounded px-2 items-center text-sm">
                          <button onClick={() => handleAddtocart(item?.productId,-1, item?.quantity,item?.sizes)} className="px-2">
                            −
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button onClick={() => handleAddtocart(item?.productId,1, item?.quantity,item?.sizes)} className="px-2">
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleremovetocart(item?.productId,item?.sizes)}
                          className="text-xs underline text-gray-500 hover:text-black"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              )}
            </div>

            {/* Footer */}
            {cart && cart?.products?.length > 0 && (<div className="p-4 border-t space-y-2 text-sm">

              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span className=' font-poppins'>                          ₹ {cart?.totalPrice.toLocaleString()} INR</span>
              </div>
              <p className="text-gray-500 text-xs">
                Tax included.{' '}
                <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>

              <button onClick={handlecheckout}
                className="w-full mt-2 bg-black text-white py-3 rounded text-sm uppercase hover:bg-gray-800 transition"
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>)}

            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
