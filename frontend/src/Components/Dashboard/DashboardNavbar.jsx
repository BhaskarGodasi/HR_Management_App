import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.utils';
import styles from './Dashboard.module.css';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/dashboard" className={styles.logo}>
          HR Management
        </Link>
      </div>

      <div className={styles.navCenter}>
        <Link to="/dashboard/attendance" className={styles.navLink}>
          Attendance
        </Link>
        <Link to="/dashboard/payroll" className={styles.navLink}>
          Payroll
        </Link>
      </div>

      <div className={styles.navRight}>
        <div className={styles.profileDropdown}>
          <button 
            className={styles.profileButton}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img 
              src={user.profileImage || '/default-avatar.png'} 
              alt="Profile" 
              className={styles.profileImage}
            />
            <span className={styles.userName}>{user.name}</span>
          </button>

          {isProfileOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/dashboard/profile" className={styles.dropdownItem}>
                My Profile
              </Link>
              <Link to="/dashboard/settings" className={styles.dropdownItem}>
                Settings
              </Link>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 