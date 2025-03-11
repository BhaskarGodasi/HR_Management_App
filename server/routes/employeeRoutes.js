// routes/employeeRoutes.js
const express = require('express');
const { protect, employee } = require('../middleware/authMiddleware');
const { 
  updateProfilePicture, 
  getMonthlyAttendance, 
  getPayslips, 
  getPayslipById 
} = require('../controllers/employeeController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only .jpeg, .jpg and .png files are allowed!'));
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

// Profile picture upload route
router.post('/profile-picture', protect, employee, upload.single('image'), updateProfilePicture);

// Attendance routes
router.get('/attendance', protect, employee, getMonthlyAttendance);

// Payslip routes
router.get('/payslips', protect, employee, getPayslips);
router.get('/payslips/:id', protect, employee, getPayslipById);

module.exports = router;