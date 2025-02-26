import mongoose from 'mongoose';

const courseReviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['Spring', 'Summer', 'Fall'],
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('CourseReview', courseReviewSchema); 