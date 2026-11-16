const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const password = await bcrypt.hash(req.body.password, 12);
    await User.create({ name, email, password });
    return res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
