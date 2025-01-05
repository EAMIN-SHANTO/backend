// models/Trend.js
import { Schema } from "mongoose";
import mongoose from "mongoose";

const trendSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trend = mongoose.model("Trend", trendSchema);

;

export default Trend;
