// Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import api from "./services/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const navigate = useNavigate();

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordCheck = password === confirmPassword ? password : "";
    // if passwordCheck is "" set wrongPassword to true
    if (!passwordCheck) {
      setWrongPassword(true);
      return;
    }
    try {
      await api.post("auth/signup", {
        username,
        password,
      });
      navigate("/login");
    } catch (err) {
      if (err.response?.data) {
        setUserExist(true);
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign Up</h2>
        {/* handle wrongPassword */}
        {wrongPassword && (
          <p className="signup-error">Passwords do not match</p>
        )}
        {/* handle userExist */}
        {userExist && <p className="signup-error">Username already exists</p>}
  
        <input
          type="text"
          placeholder="Username"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={6}
          maxLength={20}
          required
          autoFocus
        />

        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={20}
          pattern="^(?=.*[A-Z])(?=.*\d).{10,20}$"
          title={
            "Password must have: At least 8 characters, one uppercase letter and one number."
          }
          required
        />
        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="btn-login">
          Sign Up
        </button>
        <p>Already have an account?</p>
        <button
          type="button"
          className="btn-signup"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Signup;
