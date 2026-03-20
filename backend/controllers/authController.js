exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple hardcoded authentication for teacher/admin
    // In a real application, this should check a User model and use bcrypt/JWT
    if (username === 'admin' && password === 'admin123') {
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: { role: 'admin', name: 'Teacher' }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
