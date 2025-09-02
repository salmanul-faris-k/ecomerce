const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
    {
        userId: String,
        Name: String,
        phone: Number,
        city: String,
        state: String,
        country: String,
        pincode: Number,

        address: String,
    },
    { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address