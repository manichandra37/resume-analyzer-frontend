import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  // <-- handleLogin -->
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log(response.data);
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      window.location.href = "/upload";
      alert("Login Successful");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not reachable");
      }
    }
  };

  // <-- Handle Register-->
  const handleRegister = async () => {
    try {
      const response = await registerUser(name, email, password, phoneNumber);
      console.log(response.data);
      alert("Registration Successful! Please login.");
      setIsLogin(true);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf6f1]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-['Playfair_Display'] text-[#2d3a2e] text-center mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          {isLogin ? "Login to analyze your resume" : "Sign up to get started"}
        </p>

        {isLogin ? (
          <>
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full p-3 bg-[#3d5a3e] text-white rounded-xl hover:bg-[#2d4a2e] transition font-['Playfair_Display']"
              onClick={handleLogin}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 outline-none focus:border-[#3d5a3e]"
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              className="w-full p-3 bg-[#3d5a3e] text-white rounded-xl hover:bg-[#2d4a2e] transition"
              onClick={handleRegister}
            >
              Register
            </button>
          </>
        )}

        <button
          className="w-full mt-4 text-[#3d5a3e] text-sm hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
