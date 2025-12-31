const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  deleteTask
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.delete("/:id", auth, deleteTask);

module.exports = router;
