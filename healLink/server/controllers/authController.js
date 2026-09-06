const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Create a new user
    const user = new User({
      name,
      email: normalizedEmail,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered. Please use another email or log in.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};