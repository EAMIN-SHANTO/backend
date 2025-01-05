import express from "express";
import multer from "multer";
import path from "path";
import { getPosts, getPost, createPost, deletePost, uploadAuth, updatePost } from "../controllers/post.controller.js";
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
const { fileURLToPath } = await import('url');

// Set up __dirname to point to the upper directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the photos folder in the upper directory
    cb(null, path.join(__dirname, "photos"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define routes
router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", getPost);
router.post("/", verifyToken, upload.single("img"), createPost);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id", verifyToken, upload.single("img"), updatePost);

export default router;