import { useState, useEffect } from "react";
import "./css/TodoApp.css";
import api from "./services/api";

function TodoApp({ onLogout, username }) {
  const [showModal, setShowModal] = useState(false); //edit todo modal
  const [newTodoTitle, setNewTodoTitle] = useState("Untitled"); //modifying todo title
  const [newNote, setNewNote] = useState(""); //adding note to todo
  const [folderId, setFolderId] = useState(null); //track folder for new todo
  const [tempTitle, setTempTitle] = useState(""); //edited title when user changes folder title
  const [folders, setFolders] = useState([]);
  const [editTitleId, setEditTitleId] = useState(null); //get current folder id to know which folder is being changed
  const [deleteFolder, setDeleteFolder] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState(null);

  //load folders once after render
  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDeleteFolder(false);
        setDeleteFolderId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    const title = editedTitle.trim() ? editedTitle.trim() : "Untitled";
    const folderData = {
      title: title,
    };
    try {
      await api.put(`/folders/${editTitleId}`, folderData);
      setFolders((prev) =>
        prev.map((f) => (f.id === editTitleId ? { ...f, title: title } : f))
      );
    } catch (err) {
      console.log(err);
    }
    setEditTitleId(null);
  };

  const addNewTodo = async () => {
    const title = newTodoTitle.trim() ? newTodoTitle.trim() : "Untitled";
    const note = newNote ? newNote.trim() : "";

    try {
      const todoData = {
        title: title,
        note: note,
        folderId: folderId,
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
    setNewNote("");
    setFolderId(null);
    setShowModal(false);
  };

  const addNewFolder = async () => {
    try {
      const folderData = {
        title: "Untitled",
      };
      const response = await api.post("/folders", folderData);

      setFolders((prev) => [...prev, response.data]);
      setEditTitleId(response.data.id);
      setTempTitle(response.data.title);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const folderData = {
        id: folderId,
      };
      await api.delete(`/folders/${folderId}`, folderData);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (err) {
      console.log(err);
    }
    setDeleteFolder(false);
    setDeleteFolderId(null);
  };

  return (
    <div className="todo-container">
      <div className="left-sidebar">
        <h2>Tasks</h2>
        <p>Current</p>
      </div>

      <div className="main-content">
        <div className="main-header">
          <h2 className="welcome-text">Welcome, {username}!</h2>
        </div>

        {folders?.map((folder) => (
          <div key={folder.id}>
            <div className="folder-header">
              <div className="folder-title-edit">
                {editTitleId === folder.id ? (
                  <input
                    value={tempTitle}
                    onChange={(e) => {
                      setTempTitle(e.target.value);
                    }}
                    onBlur={() => saveEditedFolder(tempTitle)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEditedFolder(tempTitle);
                      } else if (e.key === "Escape") {
                        setEditTitleId(null);
                        setTempTitle(folder.title);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <h3>{folder.title}</h3>
                    <button
                      onClick={() => {
                        setEditTitleId(folder.id);
                        setTempTitle(folder.title);
                      }}
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
              <div>Due Date</div>
              <div>Priority</div>
              <div>Completed</div>
              <div className="folder-deleter">
                <button
                  onClick={() => {
                    setDeleteFolder(true);
                    setDeleteFolderId(folder.id);
                  }}
                >
                  Remove Folder
                </button>
              </div>
            </div>

            <div className="todo-block">
              {folder.todos?.map((todo, idx) => {
                const num = idx + 1;
                return (
                  <div key={todo.id}>
                    <div className="todo-main">
                      <div className="todo-num">{num}</div>
                      <div className="todo-title-note">
                        <h4>{todo.title}</h4>
                        <p>{todo.note}</p>
                      </div>
                      <div className="todo-main-button">
                        <button> X </button>
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
              <div>
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
            <div
              className="modal-content"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNewTodo();
                } else if (e.key === "Escape") {
                  setNewTodoTitle("Untitled");
                  setNewNote("");
                  setFolderId(null);
                  setShowModal(false);
                }
              }}
            >
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
                    setNewTodoTitle("Untitled");
                    setNewNote("");
                    setFolderId(null);
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addNewTodo();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {deleteFolder && (
          <div className="modal-overlay">
            <div className="modal-delete-folder">
              <h4>Delete Folder</h4>
              <p>Are you sure you want to delete this folder?</p>
              <div className="modal-delete-folder-button">
                <button
                  onClick={() => {
                    setDeleteFolder(false);
                    setDeleteFolderId(null);
                  }}
                >
                  No
                </button>
                <button onClick={() => handleDeleteFolder(deleteFolderId)}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <button onClick={addNewFolder} className="add-folder-btn">
            ➕ New Folder
          </button>
        </div>
      </div>
      <div className="right-sidebar">
        <button onClick={onLogout} className="btn-logout">
          Log out
        </button>
      </div>
    </div>
  );
}

export default TodoApp;
