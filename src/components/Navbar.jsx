import { Link, useLocation, useNavigate } from "react-router-dom";

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
    <div style={{ backgroundColor: "lightgray", padding: "10px" }}>
      <Link to="/upload">Upload</Link>
      <Link to="/analysis">Dashboard</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default NavBar;
