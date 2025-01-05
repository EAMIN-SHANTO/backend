import User from "../models/user.model.js";
import "../models/resource.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";
import Resource from "../models/resource.model.js";
import Visit from "../models/visit.model.js";

const jwtSecret = "fsadfasfnxcv234";
const saltRounds = 12;

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      return res.status(422).json({
        error:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, saltRounds);
    
    // Create new user with role (will default to 'user' if role is not provided)
    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user', // This will use the provided role or default to 'user'
      img: "",
      contributedResources: [],
      savedResources: [],
      posts: [],
      reviews: [],
      bookmarks: [],
    });

    const userResponse = userDoc.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (e) {
    console.error("Registration error:", e);
    res.status(422).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    const passOk = bcryptjs.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(422).json({ error: "Invalid password" });
    }

// In your login controller
    jwt.sign(
      {
        email: userDoc.email,
        id: userDoc._id,
        username: userDoc.username,
        role: userDoc.role,
      },
      jwtSecret,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        const userResponse = userDoc.toObject();
        delete userResponse.password;
        res.json(userResponse);
      }
    );
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    };

// The logout function remains the same
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add these to your existing user.controller.js

// user.controller.js
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log('User profile:', user); // Debug log
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  const { username, img } = req.body;
  try {
    // Check if new username already exists
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(422).json({ error: "Username already taken" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(username && { username }),
          ...(img && { img })
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add this function to get site statistics
export const getSiteStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total posts count
    const totalPosts = await Post.countDocuments();
    
    // Get total resources count
    const totalResources = await Resource.countDocuments();
    
    // Get or create website visits
    let websiteVisits = await Visit.findOne();
    if (!websiteVisits) {
      websiteVisits = await Visit.create({ count: 1 });
    }

    res.json({
      users: totalUsers || 0,
      visits: websiteVisits.count || 0,
      posts: totalPosts || 0,
      resources: totalResources || 0
    });
  } catch (error) {
    console.error('Error getting site statistics:', error);
    res.status(500).json({ 
      users: 0,
      visits: 0,
      posts: 0,
      resources: 0
    });
  }
};