const express = require('express');
const db = require('./db');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const { verifyToken, hasPermission } = require('../middleware/auth'); 

const upload = multer({ dest: 'uploads/' });

// Helper function to create a new item
const createItem = async (req, res) => {
    try {
        const connection = await db();
        await connection.execute(
            'INSERT INTO items (Itemcode, Itemname, Itemdescription, IsAvailable, Image, CategoryId, GradeId) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [
                req.body.ItemCode, 
                req.body.Itemname, 
                req.body.Itemdescription, 
                req.body.IsAvailable === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null, 
                parseInt(req.body.CategoryId), 
                parseInt(req.body.GradeId)
            ]
        );
        await connection.end();
        
        res.json({ message: 'Item created successfully!' });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Failed to create item', error: error.message });
    }
};

// Helper function to update an item
const updateItem = async (req, res, id) => {
    try {
        const connection = await db();
        const [result] = await connection.execute(
            'UPDATE items SET Itemcode = ?, Itemname = ?, Itemdescription = ?, IsAvailable = ?, Image = ?, CategoryId = ?, GradeId = ? WHERE id = ?', 
            [
                req.body.ItemCode, 
                req.body.Itemname, 
                req.body.Itemdescription, 
                req.body.IsAvailable === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null, 
                parseInt(req.body.CategoryId), 
                parseInt(req.body.GradeId), 
                id
            ]
        );
        await connection.end();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found!' });
        }
        
        res.json({ message: 'Item updated successfully!' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Failed to update item', error: error.message });
    }
};

// Fetch all items
router.get('/items', async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute('SELECT * FROM items');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Failed to retrieve items' });
    }
});

// Create a new item (Admin Only)
router.post('/additems', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    await createItem(req, res);
});

// Update an item (Admin Only)
router.put('/updateitems/:id', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    const id = req.params.id;
    await updateItem(req, res, id);
});

module.exports = router;