// models/attendance.js
const mongoose = require('mongoose');

// Check if the model exists before defining it
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  loginTime: {
    type: Date,
    required: true
  },
  logoutTime: {
    type: Date,
    required: true
  },
  hoursWorked: {
    type: Number,
    required: true
  },
  metRequirement: {
    type: Boolean,
    default: false
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
}));

// Create a compound index for employeeId and date to ensure uniqueness
if (!Attendance.schema.indexes().some(index => index[0].employeeId && index[0].date)) {
  Attendance.schema.index({ employeeId: 1, date: 1 }, { unique: true });
}

module.exports = Attendance;