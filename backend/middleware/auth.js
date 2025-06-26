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
