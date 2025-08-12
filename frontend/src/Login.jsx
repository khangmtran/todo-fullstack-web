import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import api from "./services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongInfo, setWrongInfo] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      onLogin(token, username);
      navigate("/todos");
    } catch (err) {
      if (err.response?.data) {
        setWrongInfo(true);
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="login-form"
      >
        <h2>Login</h2>

        {wrongInfo && (
          <p className="signup-error">Incorrect Username or Password</p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          autoFocus
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="btn-login">
          Log In
        </button>
        <p>Or Sign Up Using</p>
        <button type="button" className="btn-signup" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Login;
