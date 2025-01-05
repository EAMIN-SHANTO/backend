import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cultural', 'technical', 'sports', 'social'],
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x200?text=Club+Image'
  },
  tags: [{
    type: String
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  registrationLink: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String
  },
  establishedDate: {
    type: Date,
    default: Date.now
  },
  president: {
    type: String
  },
  vicePresident: {
    type: String
  },
  advisor: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Club', clubSchema);
