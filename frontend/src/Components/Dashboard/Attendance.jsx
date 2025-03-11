import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext.utils';
import styles from './Attendance.module.css';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);

  const fetchAttendance = async () => {
    try {
      // TODO: Implement API call to fetch attendance data
      // For now, using mock data
      const mockData = generateMockData();
      setAttendance(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance data');
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      return {
        date,
        status: isWeekend ? 'weekend' : Math.random() > 0.1 ? 'present' : 'absent',
        checkIn: isWeekend ? null : '09:00 AM',
        checkOut: isWeekend ? null : '05:00 PM',
      };
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  if (loading) {
    return <div className={styles.loading}>Loading attendance data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.attendanceContainer}>
      <div className={styles.header}>
        <h1>Attendance Record</h1>
        <div className={styles.monthSelector}>
          <button onClick={handlePreviousMonth}>&lt;</button>
          <span>
            {currentMonth.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Present Days</h3>
          <p>{attendance.filter(day => day.status === 'present').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Absent Days</h3>
          <p>{attendance.filter(day => day.status === 'absent').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Working Days</h3>
          <p>{attendance.filter(day => day.status !== 'weekend').length}</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((day) => (
              <tr
                key={day.date.toISOString()}
                className={styles[day.status]}
              >
                <td>{day.date.toLocaleDateString()}</td>
                <td>
                  <span className={styles.status}>{day.status}</span>
                </td>
                <td>{day.checkIn || '-'}</td>
                <td>{day.checkOut || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance; 