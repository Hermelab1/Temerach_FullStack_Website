const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const SYSTEM_ADMIN_ROLE_ID = 1;

const publicRoutes = [
  "/api/addcontactus"
];

const verifyToken = (req, res, next) => {
  if (req.method === "GET" || publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided." });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return res.status(403).json({ message: "Token missing." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized: Invalid token." });

    req.user = {
      id: decoded.id,
      roleId: decoded.roleId,
      username: decoded.username,
    };
    next();
  });
};

/* ================= PERMISSION CHECK ================= */
const hasPermission = async (req, res, next) => {
  // Skip permission check for GET requests and public routes
  if (req.method === "GET" || publicRoutes.includes(req.path)) {
    return next();
  }

  try {
    const { path, method } = req;
    const { roleId, username } = req.user || {};

    if (!username) return res.status(403).json({ message: "User not authenticated." });

    // System admin bypass
    if (roleId === SYSTEM_ADMIN_ROLE_ID) return next();

    const connection = await db.getConnection();

    try {
      const [permissions] = await connection.execute(
        "SELECT Endpoint, HttpMethod FROM roles_permissions WHERE RoleId = ? AND HttpMethod = ?",
        [roleId, method]
      );

      const allowed = permissions.some((perm) => {
        const endpointRegex = perm.Endpoint.replace(/:[^\s/]+/g, "[^/]+").replace(/\/$/, '');
        const regex = new RegExp(`^${endpointRegex}$`);
        return regex.test(path.replace(/\/$/, ''));
      });

      if (!allowed) {
        return res.status(403).json({
          message: `Forbidden: User "${username}" lacks permission for ${method} ${path}.`
        });
      }

      next();
    } finally {
      connection.release();
    }

  } catch (err) {
    console.error("Permission check error:", err);
    res.status(500).json({ message: "Internal server error during permission check." });
  }
};

module.exports = { verifyToken, hasPermission };