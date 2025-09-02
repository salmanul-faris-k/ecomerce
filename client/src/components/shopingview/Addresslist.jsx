import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    resetAddressError,
} from "../../store/addressSlice"; // adjust this path!
import { toast } from "sonner";

function Addresslist() {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector(state => state.address);

    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        Name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });
console.log(newAddress);

    useEffect(() => {
        dispatch(getAddresses());
    }, [dispatch]);

    const handleOpenForm = (edit = false, addr = null) => {
        setShowForm(true);
        setIsEdit(edit);
        if (edit && addr) {
            setEditId(addr._id);
            setNewAddress({
                Name: addr.Name,
                phone: String(addr.phone || ""),
                address: addr.address,
                city: addr.city,
                state: addr.state,
                country: addr.country,
               pincode: String(addr.pincode || ""), 
            });
        } else {
            setEditId(null);
            setNewAddress({
                Name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                country: "",
                pincode: "",
            });
        }
    };

 const handleInputChange = (e, field) => {
    let value = e.target.value;
    if (field === "phone") {
        value = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pincode") {
        value = value.replace(/\D/g, "").slice(0, 6);
    }
    setNewAddress(prev => ({ ...prev, [field]: value }));
};

    const handleSubmit = () => {
        const { Name, phone, address, pincode } = newAddress;
        if (
            Name &&
            address &&
            phone.length === 10 &&
            pincode.length === 6
        ) 
        {
        
            if (isEdit && editId) {
                dispatch(updateAddress({ id: editId, addressData: newAddress }));
toast.success("Address Updated", {
  description: "Your changes have been saved successfully.",
});
            } else {
                dispatch(addAddress(newAddress));
toast.success(" New address saved successfully!");

            }
            setShowForm(false);
            setIsEdit(false);
            setEditId(null);
            setNewAddress({
                Name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                country: "",
                pincode: "",
            });
        } else {
            toast.error("Please fill all required fields with valid values.");
        }
    };

    const handleRemove = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            dispatch(deleteAddress(id));
        }
    };

    const fields = [
        { name: "Name", type: "text", label: "Name" },
        { name: "phone", type: "text", label: "Phone", maxLength: 10 },
        { name: "city", type: "text", label: "City/district/town" },
        { name: "state", type: "text", label: "State" },
        { name: "country", type: "text", label: "Country" },
        { name: "pincode", type: "text", label: "Pincode", maxLength: 6 },
    ];

    // UI below is nearly identical to your original version!
    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-4 ">
                    <h3 className="text-lg font-semibold">Your Addresses</h3>
                    <button
                        className="bg-[#1745A2] text-white text-sm px-4 py-2 rounded-sm tracking-wide"
                        onClick={() => handleOpenForm(false, null)}
                    >
                        + ADD ADDRESS
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(loading ? Array(1).fill({}) : addresses).map((addr, idx) => (
                        <div
                            key={addr._id || idx}
                            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all duration-300"
                        >
                            {loading ? (
                                <div className="animate-pulse h-24 bg-gray-100" />
                            ) : (
                                <>
                                    <h3 className="font-semibold text-lg">{addr.Name}</h3>
                                    <p className="text-sm text-gray-600">{addr.phone}</p>
                                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                                        <p>{addr.address}</p>
                                        <p>
                                            {addr.city}, {addr.state}
                                        </p>
                                        <p>
                                            {addr.country} - {addr.pincode}
                                        </p>
                                    </div>
                                    <div className="flex justify-end mt-4 gap-3">
                                        <button
                                            className="text-xs text-blue-600 hover:underline"
                                            onClick={() => handleOpenForm(true, addr)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-xs text-red-500 hover:underline"
                                            onClick={() => handleRemove(addr._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {error && (
                    <div className="text-red-500 mt-2">
                        {error.message || error}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEdit ? "Edit Address" : "Add New Address"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div key={field.name} className="relative">
                                    <input
                                        type={field.type}
                                        inputMode={["phone", "pincode"].includes(field.name) ? "numeric" : undefined}
                                        pattern={["phone", "pincode"].includes(field.name) ? "\\d*" : undefined}
                                        id={field.name}
                                        value={newAddress[field.name]}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                        className="peer w-full border p-2 pt-5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder=" "
                                        maxLength={field.maxLength}
                                    />
                                    <label
                                        htmlFor={field.name}
                                        className="absolute left-2 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
                                    >
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                            {/* Address Textarea */}
                            <div className="md:col-span-2 relative">
                                <textarea
                                    id="address"
                                    value={newAddress.address}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, address: e.target.value })
                                    }
                                    className="peer w-full border p-2 pt-5 rounded text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="address"
                                    className="absolute left-2 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                    Address
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm bg-[#1745A2] text-white rounded hover:bg-[#1745A2]"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {isEdit ? "Update Address" : "Save Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Addresslist;
