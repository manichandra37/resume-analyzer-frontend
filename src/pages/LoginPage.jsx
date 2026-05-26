import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // <-- handleLogin -->
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log(response.data);
      alert("Login Successful");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not reachable");
      }
    }
  };

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
    <div>
      {isLogin ? (
        <div>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br></br>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <br></br>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default LoginPage;
