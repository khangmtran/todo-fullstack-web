// Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/signup", {
        username,
        password,
      });
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-login">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
