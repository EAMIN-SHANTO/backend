import Course from "../models/course.model.js";
import CourseReview from "../models/courseReview.model.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, credits, department, prerequisite, courseDetails } = req.body;

    // Validate required fields
    if (!courseCode || !courseName || !credits || !department) {
      return res.status(400).json({ 
        message: "Course code, name, credits, and department are required" 
      });
    }

    // Ensure prerequisite is an array
    const prerequisiteArray = Array.isArray(prerequisite) ? prerequisite : [];

    const newCourse = new Course({
      courseCode,
      courseName,
      credits: Number(credits),
      department,
      prerequisite: prerequisiteArray,
      courseDetails
    });

    await newCourse.save();
    res.status(201).json({ 
      message: "Course created successfully", 
      course: newCourse 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "A course with this code already exists" 
      });
    }
    res.status(500).json({ 
      message: "Error creating course", 
      error: error.message 
    });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID with reviews
export const getCourseWithReviews = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await CourseReview.find({ courseId: req.params.id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json({ course, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course reviews
export const getCourseReviews = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Get the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get reviews for the course
    const reviews = await CourseReview.find({ courseId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json({
      course,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Add a review
export const addReview = async (req, res) => {
  try {
    const { rating, difficulty, comment, semester, year } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id; // From auth middleware

    // Check if user already reviewed this course
    const existingReview = await CourseReview.findOne({ courseId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    const review = new CourseReview({
      courseId,
      userId,
      rating,
      difficulty,
      comment,
      semester,
      year
    });

    await review.save();

    // Update course average rating
    const courseReviews = await CourseReview.find({ courseId });
    const avgRating = courseReviews.reduce((acc, rev) => acc + rev.rating, 0) / courseReviews.length;

    await Course.findByIdAndUpdate(courseId, {
      averageRating: avgRating,
      totalReviews: courseReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await CourseReview.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update course average rating
    const courseReviews = await CourseReview.find({ courseId: review.courseId });
    const avgRating = courseReviews.length 
      ? courseReviews.reduce((acc, rev) => acc + rev.rating, 0) / courseReviews.length
      : 0;

    await Course.findByIdAndUpdate(review.courseId, {
      averageRating: avgRating,
      totalReviews: courseReviews.length
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseCode, courseName, prerequisite, courseDetails, department } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseCode, courseName, prerequisite, courseDetails, department }, // Include department
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};
