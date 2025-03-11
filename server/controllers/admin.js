// controllers/adminController.js
const User = require('../model/UserScehma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// controllers/admin.js (add these new functions)
// require('xlsx')
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Employee = require('../model/employee');
const Attendance = require('../model/attendence'); // You'll need to create this model

// Upload attendance sheet
exports.uploadAttendanceSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel file' });
    }
    
    // Store file path in session or return it for next step
    const filePath = req.file.path;
    
    res.status(200).json({ 
      message: 'Attendance sheet uploaded successfully',
      filePath 
    });
  } catch (error) {
    console.error('Error uploading attendance sheet:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Calculate attendance from uploaded sheet
exports.calculateAttendance = async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'Invalid file path or file not found' });
    }
    
    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // Process attendance data
    const attendanceResults = [];
    
    for (const row of data) {
      // Ensure the row has all required fields
      if (!row.employeeId || !row.loginTime || !row.logoutTime || !row.date) {
        continue;
      }
      
      // Parse times
      const loginTime = new Date(`${row.date}T${row.loginTime}`);
      const logoutTime = new Date(`${row.date}T${row.logoutTime}`);
      
      // Calculate hours worked
      const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60);
      
      // Determine if employee worked required 9 hours
      const metRequirement = hoursWorked >= 9;
      
      // Create attendance record
      const attendance = {
        employeeId: row.employeeId,
        date: new Date(row.date),
        loginTime,
        logoutTime,
        hoursWorked,
        metRequirement
      };
      
      // Save to database
      const newAttendance = await Attendance.findOneAndUpdate(
        { employeeId: row.employeeId, date: new Date(row.date) },
        attendance,
        { new: true, upsert: true }
      );
      
      attendanceResults.push(newAttendance);
    }
    
    // Optional: Delete the file after processing
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      message: 'Attendance calculated successfully',
      count: attendanceResults.length,
      results: attendanceResults
    });
  } catch (error) {
    console.error('Error calculating attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance for a specific employee
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Build query
    const query = { employeeId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Find attendance records
    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
    
    // Get employee details
    const employee = await Employee.findById(employeeId).select('name email department');
    
    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this employee' });
    }
    
    res.status(200).json({
      employee,
      attendanceCount: attendanceRecords.length,
      attendance: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export these new functions along with existing ones

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees'
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findOne({ 
      _id: req.params.id, 
      role: 'employee' 
    }).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee'
    });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  const {empId, name, email, password, department, position, joinDate } = req.body;

  try {
    // Check if employee already exists
    console.log(empId,"empid")
    const employeeExists = await User.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create employee
    const employee = await User.create({
      empId,
      name,
      email,
      password: hashedPassword,
      role: 'employee',
      department,
      position,
      joinDate,
      createdBy: req.user.id,
      
    });

    res.status(201).json({
      success: true,
      data: {
        _id: employee._id,
        empId:employee.empId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        joinDate: employee.joinDate
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating employee'
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, department, position, status } = req.body;
    
    // Find employee and update
    const employee = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'employee' },
      { name, email, department, position, status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating employee'
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'employee'
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting employee'
    });
  }
};

// Get all HR staff
exports.getAllHR = async (req, res) => {
  try {
    const hrStaff = await User.find({ role: 'hr' }).select('-password');
    res.status(200).json({
      success: true,
      count: hrStaff.length,
      data: hrStaff
    });
  } catch (error) {
    console.error('Error fetching HR staff:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching HR staff'
    });
  }
};

// Create new HR user
exports.createHRUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if HR user already exists
    const hrExists = await User.findOne({ email });
    if (hrExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create HR user
    const hrUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'hr',
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: {
        _id: hrUser._id,
        name: hrUser.name,
        email: hrUser.email,
        role: hrUser.role
      }
    });
  } catch (error) {
    console.error('Error creating HR user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating HR user'
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalHR = await User.countDocuments({ role: 'hr' });
    const activeEmployees = await User.countDocuments({ role: 'employee', status: 'active' });
    const inactiveEmployees = await User.countDocuments({ role: 'employee', status: 'inactive' });

    // Get department distribution
    const departmentStats = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalHR,
        activeEmployees,
        inactiveEmployees,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};




