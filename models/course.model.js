import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [0, 'Credits cannot be negative'],
    max: [20, 'Credits cannot exceed 20']
  },
  prerequisite: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  courseDetails: {
    type: String,
    trim: true
  },
  // Aliases for backward compatibility
  code: String,
  name: String,
  description: String,
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to sync aliases and format data
courseSchema.pre('save', function(next) {
  // Sync aliases
  this.code = this.courseCode;
  this.name = this.courseName;
  this.description = this.courseDetails;
  
  // Convert courseCode to uppercase
  if (this.courseCode) {
    this.courseCode = this.courseCode.toUpperCase();
  }
  
  // Format prerequisites to uppercase
  if (this.prerequisite && Array.isArray(this.prerequisite)) {
    this.prerequisite = this.prerequisite.map(p => p.toUpperCase());
  }
  
  next();
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course; 