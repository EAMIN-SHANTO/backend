// routes/trendRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkRole } from "../middleware/role.js";
import {
  getTrends,
  createTrend,
  deleteTrend,
  updateTrend
} from "../controllers/trend.controller.js";

const router = express.Router();

// Public route
router.get('/', getTrends);

// Protected routes
router.post('/', verifyToken, checkRole(['admin', 'staff']), createTrend);
router.delete('/:id', verifyToken, checkRole(['admin', 'staff']), deleteTrend);
router.put('/:id', verifyToken, checkRole(['admin', 'staff']), updateTrend);

export default router;
