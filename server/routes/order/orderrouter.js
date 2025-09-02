const express = require("express");
const orderrouter  = express.Router();
const Ordercontroller = require('../../cotroller/ordercontroller/Ordercontroller')
const { jwtmiddilware, admin } = require("../../midilware/jwtmiddileware");

orderrouter.get("/my-order", jwtmiddilware, Ordercontroller.getmyorders);
orderrouter.get("/allorder", jwtmiddilware, admin, Ordercontroller.allorders);
orderrouter.put("/:id", jwtmiddilware, admin, Ordercontroller.updateorders);
orderrouter.delete("/:id", jwtmiddilware, admin, Ordercontroller.deleteorders);

module.exports = orderrouter;
