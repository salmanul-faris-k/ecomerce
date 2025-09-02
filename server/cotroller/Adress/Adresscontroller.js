const Address = require("../../model/AdressModel");


// Add Address
exports.addAddress = async (req, res) => {
  try {
    const { Name, phone, city, state, country, pincode, address } = req.body;
    const addressDoc = new Address({
      userId: req.user._id, // assuming req.user is set (authentication middleware)
      Name,
      phone,
      city,
      state,
      country,
      pincode,
      address,
    });
    const savedAddress = await addressDoc.save();
    res.status(200).json(savedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Edit Address
exports.editAddress = async (req, res) => {
  try {
    // Only allow user to modify their own address
    const addressDoc = await Address.findOne({ _id: req.params.id, userId: req.user._id });
    if (!addressDoc)
      return res.status(404).json({ message: "Address not found" });

    // Update fields if provided, else keep existing
    [
      "Name", "phone", "city", "state", "country", "pincode", "address"
    ].forEach((key) => {
      if (req.body[key] !== undefined) addressDoc[key] = req.body[key];
    });

    const updatedAddress = await addressDoc.save();
    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const addressDoc = await Address.findOne({ _id: req.params.id, userId: req.user._id });
    if (!addressDoc)
      return res.status(404).json({ message: "Address not found" });
    await addressDoc.deleteOne();
    res.status(200).json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Get all addresses for logged-in user
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Get single address
exports.getSingleAddress = async (req, res) => {
  try {
    const addressDoc = await Address.findOne({ _id: req.params.id, userId: req.user._id });
    if (!addressDoc)
      return res.status(404).json({ message: "Address not found" });
    res.status(200).json(addressDoc);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};
