import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./lib/connectDB.js";
import postRouter from "./routes/post.route.js";
import coommentRouter from "./routes/comment.js";
// import webhookRouter from "./routes/webhook.route.js";
import userRouter from "./routes/user.route.js";
import clubRoutes from "./routes/club.route.js";
import courseRoutes from "./routes/course.route.js";
import trendRoutes from "./routes/trend.route.js";
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/auth.js';
import resourceRoutes from './routes/resource.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import teamupRoutes from './routes/teamup.route.js';
import eventRoutes from './routes/event.route.js';
import adminRoutes from './routes/admin.route.js';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import announcementRoutes from './routes/announcement.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
connectDB();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Add this before your routes

const app = express();
app.use(express.json());
// CORS options for frontend
const corsOptions = {
  origin: "http://localhost:5173", // Set this to your frontend's URL
  credentials: true, // Allow cookies and credentials
};
app.use(corsMiddleware);

// Use CORS middleware with the defined options
app.use(cors(corsOptions));

app.use('/photos', express.static('photos'));

app.use(cookieParser());
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('=====================');
  next();
});
// app.use("/webhooks", webhookRouter);
app.use("/usersp", userRouter);
app.use("/posts", postRouter);
app.use("/comments", coommentRouter);
app.use("/", clubRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/courses", courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use("/api/teamup", teamupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);

// Global error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// Error handling middleware should be last
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'resources');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const eventsUploadsDir = path.join(__dirname, 'uploads', 'events');
if (!fs.existsSync(eventsUploadsDir)){
    fs.mkdirSync(eventsUploadsDir, { recursive: true });
}

const trendsUploadsDir = path.join(__dirname, 'uploads', 'trends');
if (!fs.existsSync(trendsUploadsDir)){
    fs.mkdirSync(trendsUploadsDir, { recursive: true });
}

const clubsUploadsDir = path.join(__dirname, 'uploads', 'clubs');
if (!fs.existsSync(clubsUploadsDir)){
    fs.mkdirSync(clubsUploadsDir, { recursive: true });
}