// middleware/auth.js
import jwt from "jsonwebtoken";

// ✅ Middleware to verify JWT Token
export const verifyToken = (req, res, next) => {
  console.log("=== verifyToken Middleware ===");
  console.log("Cookies received:", req.cookies);

  const token = req.cookies?.token; // ✅ Safe access to token

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "fsadfasfnxcv234");
    console.log("✅ Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ CORS Middleware to Allow Requests from Frontend
export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://buui-sage.vercel.app"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

  // ✅ Handle Preflight (OPTIONS) Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};
