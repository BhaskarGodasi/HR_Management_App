// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  empId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['employee', 'admin'], 
    default: 'employee',
    required: true 
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  profileImage: { 
    type: String,
    default: 'default.png'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // This is the key change - sparse index ignores null values
  }
},
 {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);