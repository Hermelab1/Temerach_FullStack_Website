const express = require('express');
const db = require('./db');
const multer = require('multer');
const router = express.Router();
const { verifyToken, hasPermission } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

// Helper function to create a new item
const createOurtochs = async (req, res) => {
    let connection;
    try {
        connection = await db();

        // Validate required fields
        if (!req.body.Title || !req.body.Detail) {
            return res.status(400).json({ message: 'Title and Detail are required!' });
        }

        await connection.execute(
            'INSERT INTO ourtochs (Icon, Title, Detail, IsActive) VALUES (?, ?, ?, ?)', 
            [
                req.file ? `/uploads/${req.file.filename}` : null, 
                req.body.Title, 
                req.body.Detail, 
                req.body.IsActive === 'true' ? 1 : 0
            ]
        );
        
        res.json({ message: 'Ourtochs created successfully!' });
    } catch (error) {
        console.error('Error creating Ourtochs:', error);
        res.status(500).json({ message: 'Failed to create Ourtochs', error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Helper function to update an item
const updateOurtochs = async (req, res, id) => {
    let connection;
    try {
        connection = await db();

        // Validate required fields
        if (!req.body.Title || !req.body.Detail) {
            return res.status(400).json({ message: 'Title and Detail are required!' });
        }

        const [result] = await connection.execute(
            'UPDATE ourtochs SET Icon = ?, Title = ?, Detail = ?, IsActive = ? WHERE id = ?', 
            [
                req.file ? `/uploads/${req.file.filename}` : null, 
                req.body.Title, 
                req.body.Detail, 
                req.body.IsActive === 'true' ? 1 : 0, 
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ourtochs not found!' });
        }
        
        res.json({ message: 'Ourtochs updated successfully!' });
    } catch (error) {
        console.error('Error updating Ourtochs:', error);
        res.status(500).json({ message: 'Failed to update Ourtochs', error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Fetch all items
router.get('/ourtochs', async (req, res) => {
    let connection;
    try {
        connection = await db();
        const [rows] = await connection.execute('SELECT * FROM ourtochs');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching ourtochs:', error);
        res.status(500).json({ message: 'Failed to retrieve ourtochs' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Create a new item (Admin Only)
router.post('/addourtochs', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    await createOurtochs(req, res);
});

// Update an item (Admin Only)
router.put('/updateourtochs/:id', [verifyToken, hasPermission], upload.single('Images'), async (req, res) => {
    const id = req.params.id;
    await updateOurtochs(req, res, id);
});

module.exports = router;