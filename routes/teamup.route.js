import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createTeamUp,
  getTeamUps,
  getTeamUp,
  toggleBookmark,
  addComment,
  getComments,
  deleteComment,
  addReply
} from '../controllers/teamup.controller.js';

const router = express.Router();

// Public routes
router.get('/', getTeamUps);
router.get('/:id', getTeamUp);
router.get('/:id/comments', getComments);

// Protected routes
router.use(verifyToken); // Apply auth middleware to all routes below
router.post('/', createTeamUp);
router.post('/:id/bookmark', toggleBookmark);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.post('/:id/comments/:commentId/reply', addReply);

export default router; 