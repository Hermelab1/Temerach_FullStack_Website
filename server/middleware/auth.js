const jwt = require('jsonwebtoken');
const db = require('../routes/db'); // Import your database connection

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token
    
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have a JWT secret in your environment variables
        req.userId = decoded.id; // Store user ID for future use
        req.roleId = decoded.roleId; // Store role ID (if included in token)
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

// Middleware to check permissions
const hasPermission = async (req, res, next) => {
    const { originalUrl, method } = req;
    const roleId = req.roleId;
    
    try {
        const connection = await db();
        const [rows] = await connection.execute(
            'SELECT * FROM roles_permissions WHERE RoleId = ? AND Endpoint = ? AND HttpMethod = ?',
            [roleId, originalUrl, method]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(403).send({ message: 'Forbidden: You lack necessary permissions.' });
        }

        next(); // User is authorized; continue to the next middleware or route handler
    } catch (error) {
        console.error('Error checking permissions:', error);
        res.status(500).send({ message: 'Internal server error while checking permissions.' });
    }
};

module.exports = {
    verifyToken,
    hasPermission
};