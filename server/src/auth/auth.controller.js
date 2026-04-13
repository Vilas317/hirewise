const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({
        message: "User registered successfully",
      });
  
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// LOGIN
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }
      );
  
      res.status(200).json({ token });
  
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
module.exports = { register, login };