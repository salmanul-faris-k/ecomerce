import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function Product({product}) {
  const navigate=useNavigate()
    const handleScrollTop = () => window.scrollTo(0, 0);
  
  return (
    <>
    <Link onClick={() =>{
              handleScrollTop()
            }}
                        to={`/product/${product?._id}`}>
            <div key={product.id} className="text-center ">
            <div className="relative w-full h-[260px] md:h-[320px] lg:h-[500px] overflow-hidden group">
              <img
                src={product?.images[0]}
                alt={product?.productName}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
               src={product?.images[1]}
                alt={`${product?.productName} hover`}
                className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
            <h3 className="mt-3 text-sm md:text-base  font-normal">
              {product?.productName.length > 25
                ? product.productName.slice(0, 25) + "..."
                : product.productName}
            </h3>
            <p className="text-sm text-gray-700 mt-1 font-poppins">
              ₹ {product.Price.toLocaleString()} INR
            </p>
          </div>
          </Link>
    
      
    </>
  )
}

export default Product
