// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../model/UserScehma');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// Register a new user (admin only)
exports.register = async (req, res) => {
  try {
    const { empId, name, email, password, role, department, position } = req.body;

    // Check if employee ID or email already exists
    const userExists = await User.findOne({ $or: [{ empId }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      empId,
      name,
      email,
      password,
      role,
      department,
      position
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          empId: user.empId,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { empId, password } = req.body;

    console.log(empId, password);

    // Find user by employee ID
    const user = await User.findOne({ empId });

    console.log(user);
    
    if (user && await user.matchPassword(password)) {
      console.log('User found and password matches');
      res.json({
        _id: user._id,
        empId: user.empId,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid employee ID or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user && await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Current password is incorrect' });
    }
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};