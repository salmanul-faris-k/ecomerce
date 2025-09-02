import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getSingleAddress
} from "../../store/addressSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  createCheckout,
  updateCheckoutPayment,
  finalizeCheckout
} from "../../store/checkoutSlice";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  resetRazorpayState
} from "../../store/razorpaySlice";
import dtdc from'../../assets/dtdc-seeklogo.png'
import inpo from'../../assets/india-post-seeklogo.png'

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addresses, singleAddress, loading } = useSelector((state) => state.address);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
console.log(cart);

  const [form, setForm] = useState({
    Name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("indianpost");

  const shippingRates = {
    indianpost: 100,
    dtdc: 100,
  };

  const subtotal = cart?.products?.reduce((acc, item) => acc + item.Price * item.quantity, 0) || 0;
const gstamount = cart?.products?.reduce((acc, item) => acc + item.gstAmount * item.quantity, 0) || 0;
const shipping = shippingRates[shippingMethod] || 0;

const total = subtotal + gstamount + shipping;


  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddressId((prev) =>
        addresses.find((a) => a._id === prev)?._id || addresses[0]._id
      );
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses]);

  useEffect(() => {
    if (selectedAddressId) {
      dispatch(getSingleAddress(selectedAddressId));
    }
  }, [dispatch, selectedAddressId]);

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
    } else if (name === "pincode") {
      val = val.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

 const validateForm = () => {
  const trimmedForm = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
  );

  if (!trimmedForm.Name) {
    toast.error("Name is required.");
    return false;
  }
 if (!trimmedForm.phone || trimmedForm.phone.length !== 10) {
    toast.error("Phone number must be 10 digits.");
    return false;
  }
  if (!trimmedForm.address) {
    toast.error("Address is required.");
    return false;
  }
 if (!trimmedForm.city) {
    toast.error("city is required.");
    return false;
  }
  if (!trimmedForm.state) {
    toast.error("state is required.");
    return false;
  } if (!trimmedForm.country) {
    toast.error("country is required.");
    return false;
  }
  if (!trimmedForm.pincode || trimmedForm.pincode.length !== 6) {
    toast.error("Pincode must be 6 digits.");
    return false;
  }

  return true;
};

  const handleAddOrEdit = () => {
    if (!validateForm()) return;

    if (editId !== null) {
      dispatch(updateAddress({ id: editId, addressData: form })).then(() => {
        toast.success("Address updated successfully.");
      });
      setEditId(null);
    } else {
      dispatch(addAddress(form)).then(() => {
        toast.success("New address added successfully.");
      });
    }

    setForm({
      Name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
  };

  const handleEdit = (id) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setForm({
        Name: addr.Name || "",
        phone: String(addr.phone || ""),
        address: addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        country: addr.country || "",
        pincode: String(addr.pincode || ""),
      });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
    if (selectedAddressId === id && addresses.length > 1) {
      const filtered = addresses.filter((a) => a._id !== id);
      setSelectedAddressId(filtered.length > 0 ? filtered[0]._id : null);
    }
  };

const handleRazorpayPayment = async () => {
  const res = await loadRazorpayScript();
  if (!res) return toast.error("Failed to load Razorpay SDK");

  if (!selectedAddressId || !singleAddress) {
    return toast.error("Please select a delivery address");
  }

  // Step 1: Create checkout record in DB
  const checkoutData = {
    checkoutItems: cart.products,
    shippingAdress: singleAddress,
    shippingMethod,
    paymentMethod: "Razorpay",
    totalprice: subtotal + gstamount + shipping,
  };

  const result = await dispatch(createCheckout(checkoutData));
  if (!result.payload || !result.payload._id) {
    return toast.error("Failed to initiate checkout");
  }

  const checkout = result.payload;

  // Step 2: Create Razorpay order from backend
  const razorResult = await dispatch(createRazorpayOrder({ amount: checkout.totalprice }));
  const razorOrder = razorResult.payload;

  if (!razorOrder || !razorOrder.id) {
    return toast.error("Failed to create Razorpay order");
  }

  // Step 3: Initialize Razorpay payment
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: razorOrder.amount,
    currency: razorOrder.currency,
    name: "Your Brand",
    description: "Order Payment",
    order_id: razorOrder.id,
    handler: async function (response) {
      // Step 4: Optional Signature verification
      const verifyResult = await dispatch(
        verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
      );

      if (verifyResult.meta.requestStatus === "rejected") {
        return toast.error("Signature verification failed");
      }

      // Step 5: Update payment in DB
      const paymentData = {
        paymentStatus: "paid",
        paymentDetails: response,
        isPaid: true,
        paidAt: new Date(),
      };

      await dispatch(updateCheckoutPayment({ id: checkout._id, paymentData }));
      await dispatch(finalizeCheckout(checkout._id));

      toast.success("Payment successful and order placed!");
      dispatch(resetRazorpayState());
      navigate("/success");
    },
    prefill: {
      name: user?.FirstName || "",
      email: user?.email || "",
      contact: singleAddress?.phone || "",
    },
    notes: {
      address: `${singleAddress?.address}, ${singleAddress?.city}`,
    },
    theme: {
      color: "#1745A2",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};


  return (
    <div className="min-h-screen bg-white pt-20 font-sans px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADDRESS LIST */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  htmlFor={`address-${addr._id}`}
                  className={`block p-4 border rounded-md shadow-sm cursor-pointer transition ${
                    selectedAddressId === addr._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <input
                          id={`address-${addr._id}`}
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="form-radio text-blue-600 mr-2"
                        />
                        <span className="font-medium">
                          {addr.Name}
                          <span className="text-sm text-gray-500 ml-2">
                            {addr.phone}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                      </p>
                      {selectedAddressId === addr._id && (
                        <span className="text-xs text-green-600 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(addr._id);
                        }}
                        className="text-sm text-blue-600 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(addr._id);
                        }}
                        className="text-sm text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ADDRESS FORM */}
          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Address" : "Add Address"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Name", label: "Name" },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "address", label: "Address" },
                { name: "city", label: "City" },
                { name: "state", label: "State" },
                { name: "country", label: "Country" },
                { name: "pincode", label: "Pincode", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    name={field.name}
                    value={form[field.name] || ""}
                    type={field.type || "text"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAddOrEdit}
              className="mt-4 w-full bg-black text-white py-3 rounded"
              disabled={loading}
            >
              {editId ? "Update Address" : "Add Address"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-50 p-6 rounded border h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cart?.products.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded  relative">
                <img
                  src={item.images[0]}
                  className="w-full h-full rounded-md object-cover"
                  alt={item.productName}
                />
                <span  className={`absolute -top-1.5 -right-1.5
                    bg-gray-700 text-white
                    flex items-center justify-center
                      shadow
                    text-[10px] h-5
                    ${String(item.quantity).length > 1 ? 'min-w-[22px] h-5 px-1' : 'w-5'}
                    rounded-full`}> 
                  {item?.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">Size: {item.sizes}</p>
              </div>
              <div className="text-sm font-poppins font-medium whitespace-nowrap">
                ₹ {item.Price.toLocaleString("en-IN")}
              </div>
            </div>
          ))}

          {/* Shipping Options */}
          {/* Shipping Method */}

<div className="mb-8">
  <h3 className="text-sm font-medium text-gray-800 mb-4 uppercase tracking-wide">
    Shipping Method
  </h3>

  <div className="space-y-4">
    {[
      {
        id: "indianpost",
        label: "Indian Post",
        price: 100,
        eta: "Delivered in 3–6 business days",
        logo:inpo
      },
      {
        id: "dtdc",
        label: "DTDC Courier",
        price: 100,
        eta: "Delivered in 2–4 business days",
        logo:dtdc
      },
    ].map((option) => {
      const isSelected = shippingMethod === option.id;
      return (
        <label
          key={option.id}
          tabIndex={0}
          onClick={() => setShippingMethod(option.id)}
          className={`relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-black ${
            isSelected
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-500"
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={option.logo}
              alt={option.label}
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-500">{option.eta}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ₹{option.price.toLocaleString("en-IN")}
            </p>
            {isSelected && (
              <span className="text-xs text-green-600 font-medium">
                Selected
              </span>
            )}
          </div>

          <input
            type="radio"
            name="shipping"
            value={option.id}
            checked={isSelected}
            onChange={() => setShippingMethod(option.id)}
            className="hidden"
          />
        </label>
      );
    })}
  </div>
</div>


          <div className="flex justify-between text-sm mb-5">
            <span>Subtotal</span>
            <span className="font-poppins">
              ₹ {subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-gray-500">
            <span>Shipping</span>
            <span className="font-poppins">₹ {shipping}</span>
          </div>
          <div className="flex justify-between text-sm mb-5">
            <span>gst</span>
            <span className="font-poppins">
              ₹ {gstamount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold mb-6">
            <span>Total</span>
            <span className="font-poppins">
              ₹ {total.toLocaleString("en-IN")}
            </span>
          </div>
            <button
        onClick={handleRazorpayPayment}
        className="w-full bg-[#1745A2] text-white md:text-lg py-3 rounded"
      >
        Pay with Razorpay
      </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
