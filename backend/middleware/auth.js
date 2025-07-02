// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// const SECRET = process.env.JWT_SECRET || "oshi2000";

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: "Missing Authorization header" });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Missing token" });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET);

//     req.user = {
//       email: decoded.email,
//       roles: Array.isArray(decoded.roles)
//         ? decoded.roles.map((r) => r.toLowerCase())
//         : [decoded.roles.toLowerCase()],
//     };

//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };


// export const authorize = (allowedRoles = []) => {
//   return (req, res, next) => {
//     if (!req.user?.roles) {
//       return res.status(403).json({ message: "No roles assigned" });
//     }

//     const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
//     const hasPermission = req.user.roles.some(role =>
//       normalizedAllowed.includes(role)
//     );

//     if (!hasPermission) {
//       return res.status(403).json({
//         message: `Required roles: ${allowedRoles.join(", ")}`
//       });
//     }

//     next();
//   };
// };



// middleware/auth.js

import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

const ASGARDEO_ORG = process.env.ASGARDEO_ORG;
const AUDIENCE = process.env.ASGARDEO_CLIENT_ID;

if (!ASGARDEO_ORG || !AUDIENCE) {
  console.warn("⚠️ ASGARDEO_ORG or ASGARDEO_CLIENT_ID environment variables are not set.");
}

const ISSUER = `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/token`;

/**
 * ✅ JWT Authentication Middleware
 * Verifies the access token issued by Asgardeo
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://api.asgardeo.io/t/${ASGARDEO_ORG}/oauth2/jwks`,
  }),
  audience: AUDIENCE,
  issuer: ISSUER,
  algorithms: ["RS256"],
});

/**
 * ✅ Role-based Authorization Middleware
 * Ensures that the user has one of the allowed roles
 * @param  {...string} allowedRoles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRolesRaw = req.auth?.roles || req.auth?.role || "";
    let userRoles = [];

    if (Array.isArray(userRolesRaw)) {
      userRoles = userRolesRaw;
    } else if (typeof userRolesRaw === "string") {
      userRoles = userRolesRaw.split(",").map((r) => r.trim());
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};
