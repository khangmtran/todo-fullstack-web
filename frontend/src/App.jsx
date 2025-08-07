import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import TodoApp from "./TodoApp";
import "./css/App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Routes>
      {/* 1. Login & Signup routes */}
      <Route path="/login" element={<Login onLogin={setToken} />} />
      <Route path="/signup" element={<Signup />} />
      {/* 2. Protected todos route */}
      <Route
        path="/todos"
        element={
          token ? (
            <TodoApp token={token} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* 3. Catch-all: send logged-in users to /todos, others to /login */}
      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/todos" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
