import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Payroll.module.css';

const Payroll = () => {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayslips();
  }, [selectedYear]);

  const fetchPayslips = async () => {
    try {
      // TODO: Implement API call to fetch payslip data
      // For now, using mock data
      const mockData = generateMockData();
      setPayslips(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payroll data');
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedYear, i, 1);
      return {
        id: `${selectedYear}${(i + 1).toString().padStart(2, '0')}`,
        month: date.toLocaleString('default', { month: 'long' }),
        basicSalary: 5000,
        overtime: Math.floor(Math.random() * 500),
        bonus: i === 11 ? 1000 : 0, // Year-end bonus
        deductions: {
          tax: 500,
          insurance: 200,
          pension: 300,
        },
        status: Math.random() > 0.2 ? 'paid' : 'pending',
      };
    });
    return months.reverse(); // Show latest months first
  };

  const calculateNetSalary = (payslip) => {
    const gross = payslip.basicSalary + payslip.overtime + payslip.bonus;
    const totalDeductions = Object.values(payslip.deductions).reduce((a, b) => a + b, 0);
    return gross - totalDeductions;
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  if (loading) {
    return <div className={styles.loading}>Loading payroll data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.payrollContainer}>
      <div className={styles.header}>
        <h1>Payroll History</h1>
        <div className={styles.yearSelector}>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Annual Salary</h3>
          <p>
            ${payslips.reduce((total, slip) => total + calculateNetSalary(slip), 0).toLocaleString()}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Bonus</h3>
          <p>
            ${payslips.reduce((total, slip) => total + slip.bonus, 0).toLocaleString()}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Deductions</h3>
          <p>
            ${payslips
              .reduce(
                (total, slip) =>
                  total + Object.values(slip.deductions).reduce((a, b) => a + b, 0),
                0
              )
              .toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.payrollTable}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Overtime</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((payslip) => (
              <tr key={payslip.id}>
                <td>{payslip.month}</td>
                <td>${payslip.basicSalary.toLocaleString()}</td>
                <td>${payslip.overtime.toLocaleString()}</td>
                <td>${payslip.bonus.toLocaleString()}</td>
                <td>${Object.values(payslip.deductions)
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString()}</td>
                <td>${calculateNetSalary(payslip).toLocaleString()}</td>
                <td>
                  <span className={`${styles.status} ${styles[payslip.status]}`}>
                    {payslip.status}
                  </span>
                </td>
                <td>
                  <button className={styles.downloadButton}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll; 