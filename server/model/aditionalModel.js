const mongoose = require("mongoose");

const aditionalschema = new mongoose.Schema({
   


    images: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })


const Aditional = mongoose.model('Aditional', aditionalschema)
module.exports = Aditional
