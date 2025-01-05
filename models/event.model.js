import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['university', 'club', 'contest', 'recruitment', 'achievement'],
    required: true
  },
  organizer: {
    type: String,
    required: true  // Club name or department name
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid date format'
    }
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v === null || (v instanceof Date && !isNaN(v));
      },
      message: 'Invalid deadline format'
    }
  },
  location: String,
  image: String,
  registrationLink: String,
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  achievements: [{
    studentName: String,
    achievement: String,
    projectTitle: String,
    description: String,
    image: String
  }]
}, { timestamps: true });

export default mongoose.model("Event", eventSchema); 