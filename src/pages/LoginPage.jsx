import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginFlower() {
  return (
    <svg width="260" height="260" viewBox="0 0 320 320" fill="none">
      <circle cx="160" cy="72"  r="62" fill="#E2AABB"/>
      <circle cx="217" cy="103" r="62" fill="#DDA6B7"/>
      <circle cx="217" cy="217" r="62" fill="#E2AABB"/>
      <circle cx="160" cy="248" r="62" fill="#DDA6B7"/>
      <circle cx="103" cy="217" r="62" fill="#E2AABB"/>
      <circle cx="103" cy="103" r="62" fill="#DDA6B7"/>
      <circle cx="160" cy="160" r="88" fill="#3D5228"/>
    </svg>
  );
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await loginUser(email, password);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server not reachable");
    }
  };

  const handleRegister = async () => {
    setError("");
    try {
      await registerUser(name, email, password, phoneNumber);
      setIsLogin(true);
      setError("Registration successful! Please log in.");
    } catch (err) {
      setError(err.response?.data?.message || "Server not reachable");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#FFFFFF",
    border: "1.5px solid #D4CFC5",
    borderRadius: 12,
    outline: "none",
    fontSize: "0.9rem",
    color: "#1B3320",
    fontFamily: "inherit",
    marginBottom: 12,
  };

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      <div className="w-1/2 flex flex-col justify-center px-16" style={{ background: "#EDE8DC" }}>
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 28, height: 1, background: "#2B3D2B" }}></div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#2B3D2B" }}>
              {isLogin ? "STEP 00 · SIGN IN" : "STEP 00 · SIGN UP"}
            </span>
          </div>

          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1B3320", lineHeight: 1.15, marginBottom: 8 }}>
            {isLogin ? "Welcome" : "Create your"}{" "}
            <em
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#1B3320",
              }}
            >
              {isLogin ? "back." : "account."}
            </em>
          </h1>
          <p style={{ color: "#4A5E3A", fontSize: "0.92rem", marginBottom: 28 }}>
            {isLogin
              ? "Sign in to keep growing your résumé."
              : "Start planting your résumé in under a minute."}
          </p>

          {!isLogin && (
            <input
              style={inputStyle}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              style={inputStyle}
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          )}

          {error && (
            <p style={{ color: "#B84040", fontSize: "0.82rem", marginBottom: 12 }}>{error}</p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={isLogin ? handleLogin : handleRegister}
              className="flex items-center gap-3"
              style={{
                background: "#1B3320",
                borderRadius: 16,
                padding: "13px 22px",
                border: "none",
                cursor: "pointer",
                color: "#FFFFFF",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {isLogin ? "Log in" : "Sign up"}
              </span>
              <span
                style={{
                  background: "#FFFFFF",
                  color: "#1B3320",
                  borderRadius: 10,
                  padding: "6px 10px",
                  fontSize: "0.9rem",
                }}
              >
                →
              </span>
            </button>

            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#4A5E3A",
                fontSize: "0.85rem",
                textDecoration: "underline",
              }}
            >
              {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="w-1/2 relative flex items-center justify-center overflow-hidden"
        style={{ background: "#C5DBA8" }}
      >
        <LoginFlower />
        <div
          className="absolute"
          style={{ bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "#1B3320",
              fontSize: "1.1rem",
            }}
          >
            grade like a fair-but-honest friend
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "#B0C898" }}
        >
          <div style={{ width: "10%", height: "100%", background: "#4A7A3A" }} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
