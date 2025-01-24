// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');  // Make sure this points to your db.js file

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Create User Endpoint
router.post('/register', async (req, res) => {
    const { username, password, roleId } = req.body;

    // Basic validation
    if (!username || !password || !roleId) {
        return res.status(400).json({ error: 'Username, password, and roleId are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const checkUserSql = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
        const [[{ count }]] = await db.query(checkUserSql, [username]);
        
        if (count > 0) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const sql = `INSERT INTO users (username, password, RoleId) VALUES (?, ?, ?)`;
        await db.query(sql, [username, hashedPassword, roleId]);
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

// Login User Endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const [users] = await db.query(sql, [username]);
        const user = users[0]; // Get the first user from query results

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user.id, roleId: user.RoleId }, JWT_SECRET, {
                expiresIn: '1h', // Token expiration
            });

            return res.json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

module.exports = router;