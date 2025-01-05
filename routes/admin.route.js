import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser
} from '../controllers/admin.controller.js';

const router = express.Router();

// Protect all admin routes
router.use(verifyToken, checkRole(['admin']));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router; 