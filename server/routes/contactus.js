const express = require('express');
const db = require('./db');
const router = express.Router();
const { verifyToken, hasPermission } = require('../middleware/auth'); 

// Helper function to create a new item
const createContact = async (req, res) => {
    try {
        const connection = await db();

        // Basic validation
        if (!req.body.FullName || !req.body.CompanyName || !req.body.Phone || !req.body.Websites || !req.body.Email || !req.body.Memo) {
            return res.status(400).json({ message: 'Full name, Company name, Phone, Website, Email, and Memo are required!' });
        }
        
        await connection.execute(
            'INSERT INTO contactus (FullName, CompanyName, Phone, Websites, Email, Memo) VALUES (?, ?, ?, ?, ?, ?)', 
            [
                req.body.FullName, 
                req.body.CompanyName, 
                req.body.Phone, 
                req.body.Websites,
                req.body.Email,
                req.body.Memo,
            ]
        );
        await connection.end();
        
        res.json({ message: 'Contact created successfully!' });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Failed to create contact', error: error.message });
    }
};

// Fetch all items (requires authentication)
router.get('/contactus', verifyToken, async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute('SELECT * FROM contactus');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        res.status(500).json({ message: 'Failed to retrieve contact info' });
    }
});

// Create a new item (no authentication required)
router.post('/addcontactus', async (req, res) => {
    await createContact(req, res);
});

module.exports = router;