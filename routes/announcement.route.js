import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
} from '../controllers/announcement.controller.js';

const router = express.Router();

// Public route - anyone can view announcements
router.get('/', getAnnouncements);

// Protected routes - only admin/staff can create/delete
router.post('/', verifyToken, checkRole(['admin', 'staff']), createAnnouncement);
router.delete('/:id', verifyToken, checkRole(['admin', 'staff']), deleteAnnouncement);

export default router; 