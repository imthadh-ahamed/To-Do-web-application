import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/getTasks", getTasks);
router.get("/getTaskById/:taskId", getTaskById);
router.post("/createTask", createTask);
router.put("/updateTask/:taskId", updateTask);
router.delete("/deleteTask/:taskId", deleteTask);

export default router;
