import { useState } from "react";
import axios from "axios";
import "./Login.css"; 

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      alert("Login failed: " + err.response.data);
    }
  };

  return (
    <div className="login-wrapper">
      {/* wrapper to center form */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="btn-login">Log In</button>
        <p>Or Sign Up Using</p>
        <button className="btn-signup">Sign Up</button> 
      </form>
    </div>
  );
}

export default Login;
