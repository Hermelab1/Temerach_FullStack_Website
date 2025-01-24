const express = require('express');
const db = require('./db');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const { verifyToken, hasPermission } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Helper function to create a new item
const createTestiminial = async (req, res) => {
    try {
        const connection = await db();

        // Basic validation
        if (!req.body.CompanyName || !req.body.EmpName || !req.body.Memo) {
            return res.status(400).json({ message: 'Company name, Employee name, and Memo are required!' });
        }
        
        await connection.execute(
            'INSERT INTO testimonials (CompanyName, EmpName, Memo, IsActicve, CompanyLogo, Flag) VALUES (?, ?, ?, ?, ?, ?)', 
            [
                req.body.CompanyName, 
                req.body.EmpName, 
                req.body.Memo, 
                req.body.IsActicve === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null, 
                req.file ?`/uploads/${req.file.filename}` : null
            ]
        );
        await connection.end();
        
        res.json({ message: 'Testimonial created successfully!' });
    } catch (error) {
        console.error('Error creating Testimonial:', error);
        res.status(500).json({ message: 'Failed to create Testimonial', error: error.message });
    }
};

// Helper function to update an item
const updateTestimonial = async (req, res, id) => {
    try {
        const connection = await db();

        // Basic validation
        if (!req.body.CompanyName || !req.body.EmpName || !req.body.Memo) {
            return res.status(400).json({ message: 'Company name, Employee name, and Memo are required!' });
        }
        
        const [result] = await connection.execute(
            'UPDATE testimonials SET CompanyName = ?, EmpName = ?, Memo = ?, IsActicve = ?, CompanyLogo = ?, Flag = ? WHERE id = ?', 
            [
                req.body.CompanyName, 
                req.body.EmpName, 
                req.body.Memo, 
                req.body.IsActicve === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null, 
                req.file ? `/uploads/${req.file.filename}` : null,                 
                id
            ]
        );
        await connection.end();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Testimonial not found!' });
        }
        
        res.json({ message: 'Testimonial updated successfully!' });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
    }
};

// Fetch all items
router.get('/testimonial', verifyToken, async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute('SELECT * FROM testimonials');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ message: 'Failed to retrieve testimonial' });
    }
});

// Create a new item (Admin Only)
router.post('/addTestimonial', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    await createTestiminial(req, res);
});

// Update an item (Admin Only)
router.put('/updatetestimonial/:id', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    const id = req.params.id;
    await updateTestimonial(req, res, id);
});

module.exports = router;