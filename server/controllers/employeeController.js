// controllers/employeeController.js
const User = require('../model/UserScehma');
const Attendance = require('../model/attendence');
const Payslip = require('../model/Payroll');
const path = require('path');
const fs = require('fs');

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old profile picture if it exists (except default)
    if (user.profileImage && user.profileImage !== 'default.png') {
      const oldImagePath = path.join(__dirname, '../uploads/profiles', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Update with new image
    user.profileImage = req.file.filename;
    await user.save();
    
    res.json({ 
      message: 'Profile picture updated', 
      profileImage: user.profileImage 
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
};

// Get monthly attendance
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || isNaN(yearNum)) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }
    
    // Get month start and end dates
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0); // Last day of month
    
    const attendance = await Attendance.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });
    
    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get payslips
exports.getPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find({
      user: req.user._id,
      status: 'published'
    }).sort({ year: -1, month: -1 });
    
    res.json(payslips);
  } catch (error) {
    console.error('Get payslips error:', error);
    res.status(500).json({ message: 'Error fetching payslips', error: error.message });
  }
};

// Get specific payslip
exports.getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'published'
    });
    
    if (payslip) {
      res.json(payslip);
    } else {
      res.status(404).json({ message: 'Payslip not found' });
    }
  } catch (error) {
    console.error('Get payslip by ID error:', error);
    res.status(500).json({ message: 'Error fetching payslip', error: error.message });
  }
};