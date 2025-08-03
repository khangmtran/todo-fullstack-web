import { useState, useEffect } from "react";
import axios from "axios";

function TodoApp({ token, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    api
      .get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const res = await api.post("/todos", {
        title,
        completed: false,
      });
      setTodos([...todos, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await api.put(`/todos/${id}`, {
        completed: !currentStatus,
        title: todos.find((t) => t.id === id).title,
      });
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
      <h2>Your To-Do List</h2>
      <input
        type="text"
        placeholder="New to-do"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleCreate}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleToggle(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
