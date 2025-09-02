const express = require("express");
const Newsletterrouter  = express.Router();
const Newslettercontroller = require('../../cotroller/Newsletter/Newslettercontroller')
const { jwtmiddilware, admin } = require("../../midilware/jwtmiddileware");

Newsletterrouter.post("/newsletter",Newslettercontroller.subscribeNewsletter);
Newsletterrouter.get("/newsletter",jwtmiddilware,admin,Newslettercontroller.getNewsletterSubscribers);
Newsletterrouter.delete("/newsletter/:id",jwtmiddilware,admin,Newslettercontroller.deleteNewsletterSubscriber);

// Contact
Newsletterrouter.post("/contact", Newslettercontroller.createContactMessage );
Newsletterrouter.get("/contact",jwtmiddilware,admin, Newslettercontroller.getAllContactMessages );
Newsletterrouter.delete("/contact/:id",jwtmiddilware,admin, Newslettercontroller.deleteContactMessage);
module.exports = Newsletterrouter;
