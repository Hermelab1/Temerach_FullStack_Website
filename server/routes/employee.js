const express = require('express');
const db = require('./db');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const { verifyToken, hasPermission } = require('../middleware/auth'); 

const upload = multer({ dest: 'uploads/' });

// Helper function to create a new item
const createEmployees = async (req, res) => {
    try {
        const connection = await db();
        Id, FullName, Positions, Memo, IsActicve, EmpImage
        await connection.execute(
            'INSERT INTO employees (FullName, Positions, Memo, IsActicve, EmpImage) VALUES (?, ?, ?, ?, ?)', 
            [
                req.body.FullName, 
                req.body.Positions, 
                req.body.Memo, 
                req.body.IsActicve === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null
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
const updateEmployees = async (req, res, id) => {
    try {
        const connection = await db();
        const [result] = await connection.execute(
            'UPDATE employees SET FullName = ?, Positions = ?, Memo = ?, IsActicve = ?, EmpImage = ? WHERE id = ?', 
            [
                req.body.FullName, 
                req.body.Positions, 
                req.body.Memo, 
                req.body.IsActicve === 'true' ? 1 : 0, 
                req.file ? `/uploads/${req.file.filename}` : null, 
                id
            ]
        );
        await connection.end();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found!' });
        }
        
        res.json({ message: 'Employee updated successfully!' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee', error: error.message });
    }
};

// Fetch all items
router.get('/employee', async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute('SELECT * FROM employees');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Failed to retrieve employees' });
    }
});

// Create a new item (Admin Only)
router.post('/addemployees', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    await createEmployees(req, res);
});

// Update an item (Admin Only)
router.put('/updateemployees/:id', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    const id = req.params.id;
    await updateEmployees(req, res, id);
});

module.exports = router;