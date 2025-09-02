const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  Lastname: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },    // <-- sparse allows nulls, email optional
  phone: { type: String, unique: true, sparse: true },    // <-- Added: phone field, unique, sparse
  Password: { type: String, required: true },
   resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  role: { type: String, enum: ["user", "admin"], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('Users', Userschema);

module.exports = User;
