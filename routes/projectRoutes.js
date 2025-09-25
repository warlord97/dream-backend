import express from "express";
import multer from "multer";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer (temporary storage)
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("image"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
