// employee.js
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Ensure this path is correct
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { verifyToken, hasPermission } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');


const uploadsDir = path.join(__dirname, '../uploads'); // Navigate one level up

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Ensure directory is created with the recursive option
}

// Configure multer for file uploads to accept only .webp format
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set a file size limit (e.g., 5 MB)
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .webp format allowed!'), false);
        }
    },
});

router.get('/categoriesI', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM categories where IsAvalible= true');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to retrieve blog posts' });
    }
});

router.get('/avalibleproduct', async (req, res) => {
    try{
        const connection = await pool.getConnection();
        const isAvalible = true;
        const [rows] = await connection.query('Select * from items where IsAvalible = ?', [isAvalible]);
        connection.release();
        res.json(rows)
    }catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to retrieve blog posts' });
    }
});
// Route to fetch all blog posts
router.get('/item', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM items');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to retrieve blog posts' });
    }
});

router.post('/additems', 
    verifyToken, 
    hasPermission, 
    upload.single('ItemImage'), 
    [
        body('Itemcode').not().isEmpty().withMessage('Item code is required!'), // Updated message
        body('Itemname').not().isEmpty().withMessage('Item name is required!'), // Updated message
        body('Itemdescription').optional().isString(),
        body('IsAvalible').not().isEmpty().isInt().withMessage('Availability must be 0 or 1'), // Validate number
        body('CatName').not().isEmpty().withMessage('Category name is required!').isString(), // Validate string
        body('GradeName').optional().isString(), // Validate string
        body('Price').optional().isDecimal().withMessage('Price must be a number'), // Validate number if exists
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //Itemcode, Itemname, Itemdescription, IsAvalible, ItemImage, CatName, GradeName, Price
        const { Itemcode, Itemname, Itemdescription, IsAvalible, CatName, GradeName, Price  } = req.body;
        const ItemImage = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            const connection = await pool.getConnection();
            const [result] = await connection.query(
                'INSERT INTO items (Itemcode, Itemname, Itemdescription, IsAvalible, ItemImage, CatName, GradeName, Price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [Itemcode, Itemname, Itemdescription, IsAvalible, ItemImage, CatName, GradeName, Price] 
            );
            connection.release();
            res.status(201).json({ message: 'Post created successfully!', id: result.insertId });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Failed to create blog post' });
        }
    }
);

// Route to update a blog post (Admin Only)
router.put('/updateitem/:id', 
    verifyToken, 
    hasPermission, 
    upload.single('ItemImage'), 
    async (req, res) => {
        const { id } = req.params;
        const { Itemcode, Itemname, Itemdescription, IsAvalible, CatName, GradeName, Price} = req.body;
        const ItemImage = req.file ? `/uploads/${req.file.filename}` : null;
//id, Itemcode, Itemname, Itemdescription, IsAvalible, ItemImage, CatName, GradeName, Price
        try {
            const connection = await pool.getConnection();
            const [result] = await connection.query(
                'UPDATE items SET Itemcode = ?, Itemname = ?, Itemdescription = ?, IsAvalible = ?, ItemImage = ?, CatName = ?, GradeName = ?, Price = ? WHERE id = ?', 
                [Itemcode, Itemname, Itemdescription, IsAvalible, ItemImage, CatName, GradeName, Price, id] 
            );
            connection.release();

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Post not found!' });
            }

            res.json({ message: 'Post updated successfully!' });
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Failed to update blog post' });
        }
    }
);

module.exports = router;