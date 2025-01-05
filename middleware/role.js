// middleware/authMiddleware.js
export const checkRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
  
      next();
    };
  };
  
  // Usage in routes:
  // router.post("/admin-only", checkRole(['admin']), adminController.someFunction);
  // router.post("/staff-and-admin", checkRole(['admin', 'staff']), staffController.someFunction);