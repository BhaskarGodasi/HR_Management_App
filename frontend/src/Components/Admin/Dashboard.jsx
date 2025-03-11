import React, { useState, useEffect } from 'react';
import { adminService, employeeService } from '../../services/api';
import { FaUsers, FaMoneyBillWave, FaChartLine, FaUserTie } from 'react-icons/fa';
import '../../styles/admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    activeProjects: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, employeesResponse] = await Promise.all([
        adminService.getDashboardStats(),
        employeeService.getAllEmployees()
      ]);
      
      setStats(statsResponse.data);
      setRecentEmployees(employeesResponse.data.slice(0, 5)); // Get last 5 employees
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={fetchDashboardData}>
            Refresh Data
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUserTie />
          </div>
          <div className="stat-content">
            <h3>Departments</h3>
            <p className="stat-value">{stats.totalDepartments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Average Salary</h3>
            <p className="stat-value">${stats.averageSalary.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <p className="stat-value">{stats.activeProjects}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-employees">
          <h2>Recent Employees</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {employee.name.charAt(0)}
                        </div>
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.position}</td>
                    <td>{employee.department}</td>
                    <td>
                      <span className={`status-badge ${employee.status?.toLowerCase()}`}>
                        {employee.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button" onClick={() => window.location.href = '/employees/new'}>
              Add Employee
            </button>
            <button className="action-button" onClick={() => window.location.href = '/payroll'}>
              Process Payroll
            </button>
            <button className="action-button" onClick={() => window.location.href = '/reports'}>
              Generate Report
            </button>
            <button className="action-button" onClick={() => window.location.href = '/departments'}>
              Manage Departments
            </button>
          </div>
        </div>

        <div className="dashboard-card department-stats">
          <h2>Department Overview</h2>
          <div className="department-list">
            {stats.departmentStats?.map((dept) => (
              <div key={dept.name} className="department-item">
                <div className="department-info">
                  <h4>{dept.name}</h4>
                  <p>{dept.employeeCount} employees</p>
                </div>
                <div className="department-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(dept.employeeCount / stats.totalEmployees) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 