const db = require("../config/db");

/**
 * CREATE TASK
 */
exports.createTask = (req, res) => {
  const { title } = req.body;

  // validation
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  db.query(
    "INSERT INTO tasks (title, user_id) VALUES (?, ?)",
    [title, req.user.id],
    (err, result) => {
      if (err) {
        console.error("CREATE TASK ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId
      });
    }
  );
};

/**
 * GET TASKS (Logged-in user)
 */
exports.getTasks = (req, res) => {
  db.query(
    "SELECT id, title FROM tasks WHERE user_id = ?",
    [req.user.id],
    (err, result) => {
      if (err) {
        console.error("GET TASK ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json(result);
    }
  );
};

/**
 * DELETE TASK
 */
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) {
        console.error("DELETE TASK ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task deleted successfully" });
    }
  );
};
