const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    }
  },
  { timestamps: true }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;