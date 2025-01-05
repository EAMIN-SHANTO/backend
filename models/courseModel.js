import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  prerequisite: { type: String },
  courseDetails: { type: String, required: true },
  department: { type: String, required: true }, // Add department field
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
