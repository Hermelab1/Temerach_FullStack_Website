const jwt = require("jsonwebtoken");
require("dotenv").config();

const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const SYSTEM_ADMIN_ROLE_ID = 1;

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
  const { method } = req;
  // Get the path and remove trailing slashes for consistency
  const currentPath = req.path.replace(/\/$/, "");

  // ✅ PUBLIC ROUTES (NO TOKEN REQUIRED)
  const publicRoutes = ["/addorders", "/hasher", "/signature", "/callback", "/blogs/:id/view", "/blogs/:id/like", "/blogs/:id/share"];

  // ✅ Allow all GET requests automatically
  if (method === "GET") return next();

  // ✅ Check if the current route is in the public whitelist
  if (publicRoutes.includes(currentPath)) {
    return next();
  }

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied: No token provided.",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({
        message: "Unauthorized: Invalid or expired token.",
      });
    }

    console.log("DECODED TOKEN:", decoded);

    req.user = {
      id: decoded.id,
      roleId: decoded.roleId || decoded.RoleId || 1,
      username: decoded.username || decoded.userName || "Unknown",
    };

    next();
  });
};

// ================= PERMISSION =================
const hasPermission = async (req, res, next) => {
  try {
    const { method } = req;
    const currentPath = req.path.replace(/\/$/, "");

    const publicRoutes = ["/addorders", "/hasher", "/callback"];

    // ✅ Skip permission check for public routes/GETs
    if (method === "GET") return next();
    if (publicRoutes.includes(currentPath)) {
      return next();
    }

    let { roleId, username } = req.user;

    if (!roleId) {
      console.warn("roleId missing → defaulting to admin");
      roleId = 1; 
    }

    if (roleId === SYSTEM_ADMIN_ROLE_ID) return next();

    const permissions = await sequelize.query(
      "SELECT Endpoint, HttpMethod FROM roles_permissions WHERE RoleId = :roleId",
      {
        replacements: { roleId },
        type: QueryTypes.SELECT,
      }
    );

    const isAllowed = permissions.some((perm) => {
      if (perm.HttpMethod !== method) return false;

      const endpointRegex = perm.Endpoint
        .replace(/:[^/]+/g, "[^/]+")
        .replace(/\/$/, "");

      const regex = new RegExp(`^${endpointRegex}$`);
      return regex.test(currentPath);
    });

    if (!isAllowed) {
      return res.status(403).json({
        message: `Forbidden: No permission for ${username}`,
      });
    }

    next();
  } catch (err) {
    console.error("PERMISSION ERROR:", err);
    res.status(500).json({
      message: "Internal server error during permission check.",
      error: err.message,
    });
  }
};

module.exports = { verifyToken, hasPermission };