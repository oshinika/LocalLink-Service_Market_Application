import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "oshi2000";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    req.user = {
      email: decoded.email,
      roles: Array.isArray(decoded.roles)
        ? decoded.roles.map((r) => r.toLowerCase())
        : [decoded.roles.toLowerCase()],
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Add this named export
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user?.roles) {
      return res.status(403).json({ message: "No roles assigned" });
    }

    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    const hasPermission = req.user.roles.some(role =>
      normalizedAllowed.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: `Required roles: ${allowedRoles.join(", ")}`
      });
    }

    next();
  };
};


