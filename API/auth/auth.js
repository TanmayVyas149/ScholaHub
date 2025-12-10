const jwt = require("jsonwebtoken");

// roles = ["SCHOOL"], ["TEACHER"], ["STUDENT"]
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No token provided, Authorization denied",
        });
      }

      // Extract token
      const token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      // Role check
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
