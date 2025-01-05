// import { Schema } from "mongoose";
// import mongoose from "mongoose";

// const userSchema = new Schema(
//   {
//     clerkUserId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     img: {
//       type: String,
//     },
//     savedPosts: {
//       type: [String],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);

// models/user.model.js



// const userSchema = new Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     img: { type: String },
//     contributedResources: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
//     ],
//     savedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
//     posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//     bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
//   },
//   { timestamps: true }
// );


// export default mongoose.model("User", userSchema);

// user.model.js
import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['user', 'staff', 'admin'],
      default: 'user'  // This sets the default role
    },
    img: { type: String },
    contributedResources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
    savedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);