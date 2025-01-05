import mongoose from "mongoose";

const teamupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Project', 'Competition', 'Thesis', 'Programming', 'Other']
  },
  skills: [{
    type: String
  }],
  teamSize: {
    type: Number
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { 
  timestamps: true 
});

const TeamUp = mongoose.model("TeamUp", teamupSchema);
export default TeamUp; 