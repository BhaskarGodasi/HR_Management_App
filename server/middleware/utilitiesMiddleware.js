// utils/helpers.js
// Function to generate a random password
exports.generatePassword = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };
  
  // Function to generate employee ID
  exports.generateEmployeeId = (department, count) => {
    // Get department prefix (e.g., "HR" for Human Resources)
    const deptPrefix = department.substr(0, 2).toUpperCase();
    // Create a 6-digit number with leading zeros (e.g., "000042")
    const numPart = String(count).padStart(4, '0');
    // Combine to create the employee ID (e.g., "HR000042")
    return `${deptPrefix}${numPart}`;
  };
  
  // Function to format date to YYYY-MM-DD
  exports.formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  // Function to get month name from month number
  exports.getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[monthNumber - 1] || '';
  };