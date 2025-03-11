// Components/Navbar.js
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext.utils";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">HR Management</h1>
      {user && (
        <div>
          <Link className="mx-2" to="/dashboard">Dashboard</Link>
          <Link className="mx-2" to="/employees">Employees</Link>
          <Link className="mx-2" to="/payroll">Payroll</Link>
          <Link className="mx-2" to="/reports">Reports</Link>
          <button onClick={logout} className="ml-4 bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;