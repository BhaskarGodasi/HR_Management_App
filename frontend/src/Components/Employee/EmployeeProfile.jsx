import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { employeeService } from '../../services/api';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendar } from 'react-icons/fa';
import '../../styles/employee-profile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const response = await employeeService.getEmployee(id);
      setEmployee(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employee data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!employee) return <div className="error-message">Employee not found</div>;

  return (
    <div className="employee-profile">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-avatar">
            {employee.name.charAt(0)}
          </div>
          <div className="profile-details">
            <h1>{employee.name}</h1>
            <p className="profile-title">{employee.position}</p>
            <div className="profile-badges">
              <span className="department-badge">{employee.department}</span>
              <span className={`status-badge ${employee.status?.toLowerCase()}`}>
                {employee.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-nav">
        <button
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`nav-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          className={`nav-button ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          Payroll
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-grid">
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <FaEnvelope />
                  <div>
                    <label>Email</label>
                    <p>{employee.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone />
                  <div>
                    <label>Phone</label>
                    <p>{employee.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt />
                  <div>
                    <label>Address</label>
                    <p>{employee.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Employment Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <FaBriefcase />
                  <div>
                    <label>Department</label>
                    <p>{employee.department}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendar />
                  <div>
                    <label>Join Date</label>
                    <p>{new Date(employee.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaBriefcase />
                  <div>
                    <label>Employee ID</label>
                    <p>{employee.employeeId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card full-width">
              <h3>Skills & Expertise</h3>
              <div className="skills-grid">
                {employee.skills?.map((skill) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-section">
            <h3>Performance Reviews</h3>
            {/* Add performance review content here */}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-section">
            <h3>Employee Documents</h3>
            {/* Add documents content here */}
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="payroll-section">
            <h3>Payroll History</h3>
            {/* Add payroll history content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile; 