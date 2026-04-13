const authService = require('./auth.service');

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    const { password, ...userData } = user._doc;

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    const { password, ...userData } = data.user._doc;

    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token: data.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};