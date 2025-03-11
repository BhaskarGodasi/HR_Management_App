import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../../context/authContext.utils';
import styles from './Dashboard.module.css';

const DashboardLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(isAuthenticated);
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <DashboardNavbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 