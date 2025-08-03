import { useState } from "react";
import Login from "./Login";
import TodoApp from "./TodoApp";
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div>
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <>
          <TodoApp token={token} />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default App;
