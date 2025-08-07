import { useState, useEffect } from "react";
import "./css/TodoApp.css";
import api from "./services/api";

function TodoApp({ onLogout }) {
  const [showModal, setShowModal] = useState(false); //edit todo modal
  const [newTodoTitle, setNewTodoTitle] = useState("Untitled"); //modifying todo title
  const [newNote, setNewNote] = useState(""); //adding note to todo
  const [folderId, setFolderId] = useState(null); //get current folder id to know which folder is being changed
  const [tempTitle, setTempTitle] = useState(""); //edited title when user changes folder title
  const [folders, setFolders] = useState([]);

  //load folders once after render
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await api.get("/folders");
      setFolders(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const saveEditedFolder = async (editedTitle) => {
    if (!editedTitle.trim()) {
      editedTitle = "Untitled";
    } else {
      editedTitle = editedTitle.trim();
    }
    try {
      await api.put("/folders/${folderId}", { title: editedTitle });
      setFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, title: editedTitle } : f))
      );
    } catch (err) {
      console.log(err);
    }
    setFolderId(null);
  };

  const addNewTodo = async (newTodoTitle, newNote) => {
    const title = newTodoTitle.trim() ? newTodoTitle.trim() : "Untitled";
    const note = newNote ? newNote.trim() : "";

    try {
      const todoData = {
        title,
        note,
        completed: false,
        folder: folderId,
      };
      const response = await api.post("/todos", todoData);
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, todos: [...f.todos, response.data] } : f
        )
      );
    } catch (err) {
      console.log(err);
    }

    setNewTodoTitle("Untitled");
    setNote("");
    setFolderId(null);
    setShowModal(false);
  };

  const addNewFolder = async () => {
    try {
      const folderData = {
        title: "Untitled",
      };
      const response = await api.post("/folders", folderData);
      const newFolder = { ...response.data, todos: [] };
      setFolders((prev) => {
        [...prev, newFolder];
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="todo-container">
      <div className="sidebar">
        <h2>Tasks</h2>
        <p>Current</p>
        <p>Completed</p>
      </div>

      <div className="main-content">
        <div className="main-header">
          <button onClick={onLogout} className="btn-logout">
            Log out
          </button>
        </div>

        {folders.map((folder) => (
          <div key={folder.id} className="folder-block">
            <div className="folder-header">
              {folderId === folder.id ? (
                <input
                  value={tempTitle}
                  onChange={(e) => {
                    setTempTitle(e.target.value);
                  }}
                  onBlur={() => saveEditedFolder(tempTitle)}
                  autoFocus
                />
              ) : (
                <>
                  <h3>{folder.title}</h3>
                  <button
                    onClick={() => {
                      setFolderId(folder.id);
                      setTempTitle(folder.title);
                    }}
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>

            <div className="todo-block">
              {folders.todos.map((todo) => (
                <div key={todo.id} className="todo-box">
                  <div className="todo-header">
                    <button>X</button>
                    <button>✅</button>
                  </div>
                  <div className="todo-main">
                    <h4>{todo.title}</h4>
                    <p>{todo.note}</p>
                  </div>
                </div>
              ))}
              <div className="new-todo">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setFolderId(folder.id);
                  }}
                >
                  New Todo
                </button>
              </div>
            </div>
          </div>
        ))}

        {showModal ? (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Todo</h3>
              <input
                type="text"
                placeholder="Title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="modal-actions">
                <button
                  onClick={() => {
                    addNewTodo(newTodoTitle, newNote);
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setNewTodoTitle("Untitled");
                    setNewNote("");
                    setFolderId(null);
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div>
          <button onClick={addNewFolder} className="add-folder-btn">
            ➕ New Folder
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
