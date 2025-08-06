import { useState, useRef } from "react";
import "./css/TodoApp.css";

function TodoApp({ onLogout }) {
  const [folderId, setFolderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [folders, setFolders] = useState([
    {
      id: 1,
      title: "Untitled",
      edit: false,
      todos: [
        {
          id: Date.now(),
          title: "first",
          note: "this is a note",
        },
      ],
    },
  ]);
  const folderIdRef = useRef(2);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      title: newTitle,
      note: newNote,
    };

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, todos: [...folder.todos, newTodo] }
          : folder
      )
    );

    setNewTitle("");
    setNewNote("");
    setShowModal(false);
  };

  const addNewFolder = () => {
    const newFolder = {
      id: folderIdRef.current,
      title: "Untitled",
      edit: true,
      todos: [],
    };
    setFolders((prev) => [...prev, newFolder]);
    folderIdRef.current++;
  };

  return (
    <div className="todo-container">
      <div className="sidebar">
        <h2>Tasks</h2>
        <p>Current</p>
        <p>Completed</p>
      </div>

      <div className="main-content">
        <div classNamer="main-header">
          <button onClick={onLogout} className="btn-logout">
            Log out
          </button>
        </div>

        {folders.map((folder) => (
          <div key={folder.id} className="folder-block">
            <div className="folder-header">
              {folder.edit ? (
                <input
                  value={folder.title}
                  onChange={(e) =>
                    setFolders((prev) =>
                      prev.map((f) =>
                        f.id === folder.id ? { ...f, title: e.target.value } : f
                      )
                    )
                  }
                  onBlur={() =>
                    setFolders((prev) =>
                      prev.map((f) =>
                        f.id === folder.id ? { ...f, edit: false } : f
                      )
                    )
                  }
                  autoFocus
                />
              ) : (
                <>
                  <h3>{folder.title}</h3>
                  <button
                    onClick={() =>
                      setFolders((prev) =>
                        prev.map((f) =>
                          f.id === folder.id ? { ...f, edit: true } : f
                        )
                      )
                    }
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>

            <div className="todo-block">
              {folder.todos.map((todo) => (
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
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="modal-actions">
                <button onClick={addTodo}>Add</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
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
