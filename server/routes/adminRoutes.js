// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin, adminOrHR } = require('../middleware/authMiddleware');

// Import admin controller functions
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllHR,
  createHRUser,
  getDashboardStats,
 
} = require('../controllers/adminController');


const multer = require('multer');
const { uploadAttendanceSheet, calculateAttendance, getEmployeeAttendance } = require('../controllers/admin');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/attendance/');
  },
  filename: function(req, file, cb) {
    cb(null, `attendance-${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (
      file.mimetype === 'application/vnd.ms-excel' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Employee management routes
router.get('/employees', protect, admin, getAllEmployees);
router.get('/employees/:id', protect, admin, getEmployeeById);
router.post('/employees', protect, adminOrHR, createEmployee);
router.put('/employees/:id', protect, admin, updateEmployee);
router.delete('/employees/:id', protect, admin, deleteEmployee);

// HR management routes (admin only)
router.get('/hr-staff', protect, admin, getAllHR);
router.post('/hr-staff', protect, admin, createHRUser);

// Dashboard stats
router.get('/dashboard-stats', protect, admin, getDashboardStats);

// Comment out problematic routes for now
router.post('/attendance/upload', protect, adminOrHR, upload.single('attendanceSheet'),uploadAttendanceSheet);
router.post('/attendance/calculate', protect, adminOrHR, calculateAttendance);
router.get('/attendance/:employeeId', protect, adminOrHR, getEmployeeAttendance);


module.exports = router;





