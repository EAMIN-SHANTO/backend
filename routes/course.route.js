import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllCourses,
  getCourseWithReviews,
  addReview,
  deleteReview,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseReviews
} from "../controllers/course.controller.js";
import Course from "../models/course.model.js";

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ code: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', getCourseWithReviews);

// Course review routes
router.get('/:id/reviews', getCourseReviews);
router.post('/:id/reviews', verifyToken, addReview);
router.delete('/:id/reviews/:reviewId', verifyToken, deleteReview);

// Protected routes
router.post('/', verifyToken, createCourse);
router.put('/:id', verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);

export default router;
