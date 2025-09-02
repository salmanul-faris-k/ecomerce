const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');

const jwtmiddilware = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // or req.get('Authorization')
  
  if (!authHeader) {
    return res.status(401).json({ message: "Token is missing" });
  }

  const tokenParts = authHeader.split(" ");
  
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Token format is invalid" });
  }

  const token = tokenParts[1];
  console.log("Token:", token);

  try {
    const jwtresponse = jwt.verify(token, process.env.jwtpass);
    console.log("JWT payload:", jwtresponse);

    req.user = await User.findById(jwtresponse.user.id).select("-Password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Authorization failed" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { jwtmiddilware, admin };
