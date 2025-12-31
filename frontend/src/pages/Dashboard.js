import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  // 🔐 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🚫 Protect route
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // 📥 Load tasks
  const loadTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/tasks",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks(res.data);
    } catch {
      setMsg("❌ Failed to load tasks");
    }
  };

  // ➕ Add task
  const addTask = async () => {
    if (!title) {
      setMsg("❌ Task title required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/tasks",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMsg(res.data.message);
      setTitle("");
      loadTasks();
    } catch {
      setMsg("❌ Failed to add task");
    }
  };

  // ❌ Delete task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMsg(res.data.message);
      loadTasks();
    } catch {
      setMsg("❌ Failed to delete task");
    }
  };

  // 🔄 Auto load on page open / refresh
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{ backgroundColor: "#555", marginBottom: "15px" }}
      >
        Logout
      </button>

      {/* Add Task */}
      <div className="task-input">
        <input
          type="text"
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Message */}
      <p className="success">{msg}</p>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
