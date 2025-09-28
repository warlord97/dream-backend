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

// ✅ Multer config with 5MB size limit
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ✅ Wrap multer manually without next(err)
const handleUpload = (req, res, cb) => {
  upload.single("image")(req, res, (err) => {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Image size should not exceed 5 MB" });
    }
    if (err) {
      return res.status(400).json({ error: "File upload error" });
    }
    cb();
  });
};

// Routes
router.post("/", protect, (req, res) => handleUpload(req, res, () => createProject(req, res)));
router.get("/", getProjects);
router.put("/:id", protect, (req, res) => handleUpload(req, res, () => updateProject(req, res)));
router.delete("/:id", protect, deleteProject);

export default router;
