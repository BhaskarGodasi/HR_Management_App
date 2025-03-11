import { createBrowserRouter } from 'react-router-dom';
import Login from '../Components/Auth/Login';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Profile from '../components/Dashboard/Profile';
import Attendance from '../components/Dashboard/Attendance';
import Payroll from '../components/Dashboard/Payroll';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Profile />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'payroll',
        element: <Payroll />,
      },
    ],
  },
]);

export default router; 