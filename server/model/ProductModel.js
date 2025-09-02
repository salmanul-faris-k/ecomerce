const mongoose = require("mongoose");

const produductschema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    Description: {
        type: String,
        required: true
    },
       gstPercentage: { // ⭐ GST Added
        type: Number,
        required: true,
        default: 0, // default no GST
        min: 0,
        max: 100
    },
    ProductType: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    PackageContain: {
        type: String,
        required: true,
    },
    Fit: {
        type: String,
        required: true,
    },
    Fabric: {
        type: String,
        required: true,
    },
    Pattern: {
        type: String,
        required: true,
    },

    Packof: {
        type: String,
        required: true,
    },
    sizes: {
        type: [String],
        required: true,
    },
    Bestsller: {
        type: Boolean,
        default: false

    },

    images: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })


const Product = mongoose.model('Product', produductschema)
module.exports = Product
