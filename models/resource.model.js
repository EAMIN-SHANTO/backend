import { Schema } from "mongoose";
import mongoose from "mongoose";

const resourceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ['note', 'slide', 'book', 'video', 'tutorial', 'other'],
    },
    course: {
      type: String,
      required: true,
    },
    resourceUrl: {
      type: String,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    semester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);