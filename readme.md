# HR Management System Backend

This is a backend implementation of an HR Management System with role-based authentication (Employee and Admin roles).

## Features

### Employee Features:
- Edit Password
- Upload Profile Picture
- View Monthly Attendance
- View Previous Payslips

### Admin/HR Features:
- Register Employees & Assign Passwords
- Create & Manage Employee Credentials
- Generate & Upload Payslips
- Update Employee Attendance
- Manage Employee Details

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT & Role-based access control (RBAC)
- **File Uploads:** Multer (for profile pictures & payslips)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/update-password` - Update user password
- `POST /api/auth/register` - Register new user (Admin only)

### Employee Routes
- `POST /api/employee/profile-picture` - Upload profile picture
- `GET /api/employee/attendance` - View monthly attendance
- `GET /api/employee/payslips` - Get all employee payslips
- `GET /api/employee/payslips/:id` - Get specific payslip

### Admin Routes
- `GET /api/admin/employees` - Get all employees
- `GET /api/admin/employees/:id` - Get employee details
- `PUT /api/admin/employees/:id` - Update employee details
- `POST /api/admin/employees/:id/reset-password` - Reset employee password
- `POST /api/admin/attendance` - Record employee attendance
- `GET /api/admin/employees/:id/attendance` - Get employee attendance
- `POST /api/admin/payslips` - Create/update payslip
- `POST /api/admin/payslips/:id/upload` - Upload payslip document
- `GET /api/admin/payslips` - Get all payslips
- `GET /api/admin/employees/:id/payslips` - Get employee payslips

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hr-management
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Project Structure

```
hr-management-backend/
│── controllers/
│   ├── authController.js
│   ├── employeeController.js
│   ├── adminController.js
│── models/
│   ├── User.js
│   ├── Attendance.js
│   ├── Payslip.js
│── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── adminRoutes.js
│── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│── utils/
│   ├── helpers.js
│── uploads/
│   ├── profiles/
│   ├── payslips/
│── .env
│── server.js
│── package.json
```