import express from "express";
import { login, register, logout, getProfile, updateProfile, getSiteStats } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { incrementVisitCount } from '../middleware/visitCounter.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get('/site-stats', incrementVisitCount, getSiteStats);


console.log('Setting up user routes...');

router.get("/profile", verifyToken, (req, res, next) => {
  console.log('Profile route hit');
  next();
}, getProfile);

console.log('User routes setup complete');

export default router;