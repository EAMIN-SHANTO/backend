import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';
import {
  createEvent,
  getEvents,
  addAchievement,
  registerForEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';
import Event from '../models/event.model.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

router.get('/', getEvents);
router.post('/', verifyToken, checkRole(['admin', 'staff']), upload.single('image'), createEvent);
router.post('/:id/achievements', verifyToken, checkRole(['admin', 'staff']), addAchievement);
router.post('/:id/register', verifyToken, registerForEvent);

// Update delete route to use async/await properly
router.delete('/:id', verifyToken, checkRole(['admin', 'staff']), deleteEvent);

router.put('/:id', verifyToken, checkRole(['admin', 'staff']), upload.single('image'), updateEvent);

export default router; 