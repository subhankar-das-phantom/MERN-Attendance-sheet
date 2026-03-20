const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Look up the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the securely hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: { role: user.role, name: user.name, id: user._id }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
