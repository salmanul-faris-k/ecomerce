const express = require("express");
const addressController = require('../../cotroller/Adress/Adresscontroller');
const {jwtmiddilware}=require('../../midilware/jwtmiddileware')

// Suppose you have an authentication middleware that sets req.user._id
const Adressrouter = express.Router();

// Add address
Adressrouter.post("/", jwtmiddilware, addressController.addAddress);

// Edit address
Adressrouter.put("/:user", jwtmiddilware, addressController.editAddress);

// Delete address
Adressrouter.delete("/:id", jwtmiddilware, addressController.deleteAddress);

// Get all addresses for user
Adressrouter.get("/", jwtmiddilware, addressController.getAllAddresses);
//single
Adressrouter.get("/:id", jwtmiddilware, addressController.getSingleAddress);

module.exports = Adressrouter;
