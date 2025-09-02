const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true
    }
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact