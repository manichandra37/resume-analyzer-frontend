// This component checks if the user is logged in
// If yes, show the page. If no, redirect to login.
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if token exists in localStorage
  const token = localStorage.getItem("token");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, show the actual page
  return children;
}

export default ProtectedRoute;
