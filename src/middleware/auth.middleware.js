import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token; // read token from httpOnly cookie

  if (!token) {
    // No token provided
    const err = new Error("Authentication required");
    err.status = 401; // 401 Unauthorized
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify JWT
    req.user = decoded; // attach decoded user to req.user
    next(); // continue to next middleware/route
  } catch (err) {
    console.error("JWT verification failed:", err);
    // Token expired or invalid
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
};