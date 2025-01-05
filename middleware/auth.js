// middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log('=== verifyToken Middleware ===');
    console.log('Cookies received:', req.cookies);
    
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, "fsadfasfnxcv234");
      console.log('Token decoded successfully:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.log('Token verification failed:', err);
      res.status(401).json({ error: "Invalid token" });
    }
  };


// Add this CORS middleware to your Express app
export const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
};