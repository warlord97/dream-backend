import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

// ✅ Create Project
export const createProject = async (req, res) => {
  try {
    const { title, location, price, type, propertyType } = req.body;

    if (!title || !location || !price || !type || !propertyType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects/images",
    });

    // Remove temp file
    await fs.unlink(req.file.path);

    const project = await Project.create({
      title,
      location,
      price,
      type,
      propertyType,
      imageUrl: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id, // ✅ store public_id
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (project.imagePublicId) {
        await cloudinary.uploader.destroy(project.imagePublicId);
      }

      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "projects/images",
      });

      await fs.unlink(req.file.path);

      updateData.imageUrl = imageUpload.secure_url;
      updateData.imagePublicId = imageUpload.public_id;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, project: updatedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    // ✅ Delete image from Cloudinary
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
