const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Ensure this path is correct
const { verifyToken, hasPermission } = require('../middleware/auth'); // Include authentication and role permission middleware

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from the uploads directory
router.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route to fetch all blog posts
router.get('/blog', async (req, res) => {
    try {
        const connection = await db(); // Get DB connection
        const [rows] = await connection.execute('SELECT * FROM blog'); // Query the DB
        await connection.end(); // Close the connection
        res.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to retrieve blog posts' });
    }
});

// Route to create a new blog post (Admin Only)
router.post('/addblog', verifyToken, hasPermission, upload.single('mediaSrc'), async (req, res) => {
    const { mediaType, title, detail, posteddate } = req.body; // Extract values from the request body
    const mediaSrc = req.file ? `/uploads/${req.file.filename}` : null; // Get the file path

    // Basic validation
    if (!title || !detail) {
        return res.status(400).json({ message: 'Title and detail are required!' });
    }

    try {
        const connection = await db(); // Get DB connection
        const result = await connection.execute(
            'INSERT INTO blog (mediaType, title, detail, posteddate, mediaSrc) VALUES (?, ?, ?, ?, ?)', 
            [mediaType, title, detail, posteddate, mediaSrc]
        );
        await connection.end(); // Close the connection
        
        res.status(201).json({ message: 'Post created successfully!', id: result.insertId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
});

// Route to fetch a single blog post by ID
router.get('/blogbyid/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const connection = await db(); // Get DB connection
        const [row] = await connection.execute('SELECT * FROM blog WHERE id = ?', [id]);
        await connection.end(); // Close the connection

        if (!row || row.length === 0) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        res.json(row[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to retrieve blog post' });
    }
});

// Route to update a blog post (Admin Only)
router.put('/updateblog/:id', verifyToken, hasPermission, upload.single('mediaSrc'), async (req, res) => {
    const id = req.params.id;
    const { mediaType, title, detail, posteddate } = req.body; 
    const mediaSrc = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (!title || !detail) {
        return res.status(400).json({ message: 'Title and detail are required!' });
    }

    try {
        const connection = await db(); // Get DB connection
        const result = await connection.execute(
            'UPDATE blog SET mediaType = ?, title = ?, detail = ?, posteddate = ?, mediaSrc = ? WHERE id = ?', 
            [mediaType, title, detail, posteddate, mediaSrc, id]
        );
        await connection.end(); // Close the connection

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        res.json({ message: 'Post updated successfully!' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update blog post' });
    }
});

module.exports = router;