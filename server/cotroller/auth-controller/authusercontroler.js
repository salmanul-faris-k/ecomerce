const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../../model/usermodel');

// Register
exports.registercontroller = async (req, res) => {
  const { FirstName, Lastname, email, phone, Password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(406).json({ message: "Email or phone number already exists, please login" });
    }

    const hashpassword = await bcrypt.hash(Password, 10);
    const newuser = new User({ FirstName, Lastname, email, phone, Password: hashpassword });
    await newuser.save();

    const payload = { user: { id: newuser._id, role: newuser.role } };
    jwt.sign(payload, process.env.jwtpass, { expiresIn: "40h" }, (error, token) => {
      if (error) throw error;
      return res.status(200).json({
        user: {
          _id: newuser._id,
          FirstName: newuser.FirstName,
          Lastname: newuser.Lastname,
          email: newuser.email,
          role: newuser.role
        },
        token
      });
    });

  } catch (error) {
    return res.status(500).json(error);
  }
};

// Login
exports.logincontroller = async (req, res) => {
  const { login, Password } = req.body;

  try {
    const existinguser = await User.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (!existinguser) {
      return res.status(404).json({ message: "Invalid email/phone or password" });
    }

    const ismatchpassword = await bcrypt.compare(Password, existinguser.Password);
    if (!ismatchpassword) {
      return res.status(404).json({ message: "Invalid email/phone or password" });
    }

    const payload = { user: { id: existinguser._id, role: existinguser.role } };
    jwt.sign(payload, process.env.jwtpass, { expiresIn: "24h" }, (error, token) => {
      if (error) throw error;
      return res.status(200).json({
        user: {
          _id: existinguser._id,
          FirstName: existinguser.FirstName,
          Lastname: existinguser.Lastname,
          email: existinguser.email,
          role: existinguser.role
        },
        token
      });
    });

  } catch (error) {
    return res.status(500).json(error);
  }
};

// Profile
exports.profile = async (req, res) => {
  res.json(req.user);
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found with this email" });

    const token = crypto.randomBytes(32).toString("hex");
    const expireTime = Date.now() + 1000 * 60 * 15; // 15 mins

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expireTime;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Hello ${user.FirstName},</h2>
        <p>You requested to reset your password.</p>
        <p>Click below to reset it:</p>
        <a href="${resetLink}" style="color:blue">${resetLink}</a>
        <p><i>This link expires in 15 minutes.</i></p>
      `
    });

    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.Password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error });
  }
};
