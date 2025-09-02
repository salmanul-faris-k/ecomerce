const Aditional = require("../../model/aditionalModel");

const cloudinary = require("cloudinary").v2;

// Upload additional image
exports.addAditional = async (req, res) => {
  try {
    const imageFile = req.files?.image?.[0];
    if (!imageFile) return res.status(400).json({ message: "Image is required" });

    const result = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const aditional = new Aditional({
      images: result.secure_url,
      user: req.user._id,
    });

    const saved = await aditional.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Add Aditional Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all additional images (admin/user)
exports.getAditionals = async (req, res) => {
  try {
    const aditionals = await Aditional.find();
    res.status(200).json(aditionals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error });
  }
};

// Delete an additional image by ID
exports.deleteAditional = async (req, res) => {

    try {
    const product = await Aditional.findById(req.params.id)

    if (product) {
      await product.deleteOne()
      res.status(200).json(product)
    }
    else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });

  
  }
};
