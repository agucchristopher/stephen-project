// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or use your email provider's SMTP server
  port: 465,
  auth: {
    user: "aguchris740@gmail.com",
    pass: "lgnvomqfztdqcwnq",
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Signup route with OTP generation and email
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email exists
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      throw new Error(`Email ${email} already exists`);
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Create user with OTP and hashed password
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp, // Store OTP temporarily
    });
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: "aguchris740@gmail.com",
      to: email,
      subject: "Your OTP for Verification",
      text: `Hello ${firstName},\n\nYour OTP for account verification is: ${otp}\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Signin route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // // Check if user is verified
    // if (!user.isVerified) {
    //   return res
    //     .status(403)
    //     .json({ error: "Account not verified. Please verify your OTP." });
    // }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (isMatch) {
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify OTP route
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.otp === otp) {
      user.isVerified = true; // Mark user as verified
      user.otp = null; // Clear OTP after verification
      await user.save();
      res.json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP or email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
