import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const NavBar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Hide navbar if no token OR if on login page
  if (!token || location.pathname === "/") {
    return null;
  }

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }; // handleLogout ends HERE

  // return belongs to NavBar, NOT inside handleLogout
  return (
  <div className="bg-[#3d5a3e] p-4 flex justify-between items-center">
    <span className="text-white text-xl font-['Playfair_Display']">Resume Analyzer</span>
    <div>
      <Link className="text-white mr-6 hover:text-gray-200 font-['Playfair_Display']" to="/upload">Upload</Link>
      <Link className="text-white mr-6 hover:text-gray-200 font-['Playfair_Display']" to="/analysis">Dashboard</Link>
    </div>
    <button className="text-white border border-white rounded-lg px-4 py-2 hover:bg-[#2d4a2e] font-['Playfair_Display']" onClick={handleLogout}>
      Logout
    </button>
  </div>
);
};

export default NavBar;
