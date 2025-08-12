import { useState, useEffect, useRef } from "react";
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
  const [toggleDeleteTodo, setToggleDeleteTodo] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const [deleteTodoFolId, setDeleteTodoFolId] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [editTodoIds, setEditTodoIds] = useState({
    folderId: null,
    todoId: null,
  });
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");

  //load folders once after render
  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDeleteFolder(false);
        setDeleteFolderId(null);
        setToggleDeleteTodo(false);
        setDeleteTodoId(null);
        setDeleteTodoFolId(null);
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
    const dueDate = newDueDate || null;
    const priority = newPriority;
    const completed = false;

    try {
      const todoData = {
        title,
        note,
        folderId,
        dueDate,
        priority,
        completed,
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
    setNewDueDate("");
    setNewPriority("normal");
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

  const deleteTodo = async (todoId, folderId) => {
    try {
      await api.delete(`/todos/${todoId}`);
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId
            ? { ...f, todos: f.todos.filter((t) => t.id !== todoId) }
            : f
        )
      );
    } catch (err) {
      console.log(err);
    }
    setToggleDeleteTodo(false);
    setDeleteTodoId(null);
    setDeleteTodoFolId(null);
  };

  const changePriority = (folderId, todoId, newVal) => {
    const updated = {
      priority: newVal,
    };
    updateTodo(folderId, todoId, updated);
  };

  const updateTodo = async (folderId, todoId, updated) => {
    try {
      await api.put(`/todos/${todoId}`, updated);
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId
            ? {
                ...f,
                todos: f.todos.map((t) =>
                  t.id === todoId ? { ...t, ...updated } : t
                ),
              }
            : f
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCompleted = (folderId, todo) => {
    const updated = { completed: !todo.completed };
    updateTodo(folderId, todo.id, updated);
  };

  const changeDueDate = (folderId, todoId, newDate) => {
    const updated = { dueDate: newDate };
    updateTodo(folderId, todoId, updated);
  };

  const openEditTodo = (folderId, todo) => {
    setEditTodoIds({ folderId, todoId: todo.id });
    setEditTitle(todo.title || "Untitled");
    setEditNote(todo.note || "");
    setShowEditTodo(true);
  };

  const saveEditTodo = async () => {
    const title = editTitle.trim() || "Untitled";
    const note = editNote.trim();

    await updateTodo(editTodoIds.folderId, editTodoIds.todoId, { title, note });
    setShowEditTodo(false);
    setEditTodoIds({ folderId: null, todoId: null });
    setEditTitle("");
    setEditNote("");
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
                    type="text"
                    maxlength="50"
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

            <div className="todo-headers">
              <div></div>
              <div>Title and Note </div>
              <div>Due Date</div>
              <div>Priority</div>
              <div>Completed</div>
            </div>

            <div className="todo-block">
              {folder.todos
                ?.slice()
                .sort((a, b) => {
                  const priorityOrder = { high: 3, normal: 2, low: 1 };
                  const pa = priorityOrder[a?.priority] ?? 2;
                  const pb = priorityOrder[b?.priority] ?? 2;
                  return pb - pa;
                })
                .map((todo, idx) => {
                  const num = idx + 1;
                  return (
                    <div key={todo.id}>
                      <div className="todo-item">
                        <div className="todo-num">{num}</div>

                        <div className="todo-title-note">
                          <div className="todo-title-edit">
                            <p className="title">{todo.title}</p>
                            <button
                              type="button"
                              onClick={() => openEditTodo(folder.id, todo)}
                            >
                              ✏️
                            </button>
                          </div>
                          <p className="note">{todo.note}</p>
                        </div>

                        <input
                          type="date"
                          min="2000-01-01"
                          value={todo.dueDate}
                          onFocus={(e) => {
                            if (!e.target.value) {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0];
                              setNewDueDate(today);
                            }
                          }}
                          onChange={(e) =>
                            changeDueDate(folder.id, todo.id, e.target.value)
                          }
                        />

                        <div>
                          <select
                            value={todo.priority || "normal"}
                            onChange={(e) =>
                              changePriority(folder.id, todo.id, e.target.value)
                            }
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleCompleted(folder.id, todo)}
                          />
                        </div>

                        <div className="todo-item-button">
                          <button
                            onClick={() => {
                              setToggleDeleteTodo(true);
                              setDeleteTodoFolId(folder.id);
                              setDeleteTodoId(todo.id);
                            }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                })}
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
                maxLength={50}
                placeholder="Title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Note"
                maxLength={100}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />

              <label className="field-row">
                <span>Due date</span>
                <input
                  type="date"
                  min="2000-01-01"
                  value={newDueDate}
                  onFocus={(e) => {
                    if (!e.target.value) {
                      const today = new Date().toISOString().split("T")[0];
                      setNewDueDate(today);
                    }
                  }}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </label>

              <label className="field-row">
                <span>Priority</span>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setNewTodoTitle("Untitled");
                    setNewNote("");
                    setNewDueDate("");
                    setNewPriority("normal");
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

        {toggleDeleteTodo && (
          <div className="modal-overlay">
            <div className="modal-delete-folder">
              <h4>Delete Todo</h4>
              <p>Are you sure you want to delete this todo?</p>
              <div className="modal-delete-folder-button">
                <button
                  onClick={() => {
                    setToggleDeleteTodo(false);
                    setDeleteTodoId(null);
                    setDeleteTodoFolId(null);
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => deleteTodo(deleteTodoId, deleteTodoFolId)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditTodo && (
          <div className="modal-overlay">
            <div
              className="modal-content"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  saveEditTodo();
                } else if (e.key === "Escape") {
                  setShowEditTodo(false);
                }
              }}
            >
              <h3>Edit Todo</h3>

              <input
                type="text"
                placeholder="Title"
                value={editTitle}
                maxLength={50}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />

              <textarea
                placeholder="Note"
                value={editNote}
                maxLength={100}
                onChange={(e) => setEditNote(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowEditTodo(false);
                    setEditTodoIds({ folderId: null, todoId: null });
                    setEditTitle("");
                    setEditNote("");
                  }}
                >
                  Cancel
                </button>
                <button onClick={saveEditTodo}>Save</button>
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
