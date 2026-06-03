import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const resumeCount = parseInt(localStorage.getItem("resumeCount") || "0");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    padding: "6px 14px",
    borderRadius: 10,
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecoration: "none",
    background: isActive(path) ? "#EDE8DC" : "transparent",
    color: isActive(path) ? "#1B3320" : "#7A8A7A",
  });

  return (
    <nav
      className="flex items-center justify-between px-6 shrink-0"
      style={{ height: 56, background: "#FFFFFF", borderBottom: "1px solid #E8E4DC", zIndex: 10 }}
    >
      <Link
        to="/"
        className="flex items-center gap-2"
        style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1B3320", textDecoration: "none" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2C7 2 3 5 3 9c0 3 2 5.5 5 7 .5.3 1 .5 1.5.6C9 17 9 18 8 19h6c-1-1-1-2-.5-2.4.5-.1 1-.3 1.5-.6 3-1.5 5-4 5-7 0-4-4-7-9-7z"
            fill="#2D5A2D"
          />
          <path d="M11 7c0 0-2 2-2 4s2 3 2 3 2-1 2-3-2-4-2-4z" fill="#A0C870"/>
        </svg>
        Resume Analyzer
      </Link>

      <div className="flex items-center gap-1">
        <Link to="/" style={navLinkStyle("/")}>Home</Link>
        <Link to="/analysis" className="flex items-center gap-2" style={navLinkStyle("/analysis")}>
          Past resumes
          {resumeCount > 0 && (
            <span
              style={{
                background: "#C4963C",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 999,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {resumeCount}
            </span>
          )}
        </Link>
        <Link to="/tips" style={navLinkStyle("/tips")}>Tips</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5" style={{ fontSize: "0.82rem", color: "#7A8A7A" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4A9A4A", display: "inline-block" }} />
          free until 30 jun
        </span>
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              padding: "5px 16px",
              borderRadius: 999,
              border: "1.5px solid #1B3320",
              background: "transparent",
              color: "#1B3320",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              padding: "5px 16px",
              borderRadius: 999,
              border: "1.5px solid #1B3320",
              background: "transparent",
              color: "#1B3320",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
