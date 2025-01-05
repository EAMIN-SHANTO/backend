import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkRole } from "../middleware/role.js";
import {
  createClub,
  getClubs,
  getClub,
  updateClub,
  deleteClub
} from "../controllers/club.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/clubs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get("/clubs", getClubs);
router.get("/clubs/:id", getClub);

// Protected routes
router.post("/clubs", verifyToken, checkRole(["admin"]), upload.single("image"), createClub);
router.put("/clubs/:id", verifyToken, checkRole(["admin"]), upload.single("image"), updateClub);
router.delete("/clubs/:id", verifyToken, checkRole(["admin"]), deleteClub);

export default router;
