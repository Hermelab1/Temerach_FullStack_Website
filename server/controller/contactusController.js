const db = require('../models');

// Fetch all entries
async function getContactus(req, res) {
    try {
        const contactusEntries = await db.Contactus.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(contactusEntries);
    } catch (error) {
        console.error("FETCH ERROR:", error);
        res.status(500).json({ message: "Failed to fetch entries", error: error.message });
    }
}

// Add new entry
async function addContactus(req, res) {
    try {
        // Destructure exactly what the frontend sends
        const { FullName, CompanyName, Phone, Websites, Email, Memo } = req.body;
        
        const newContactusEntry = await db.Contactus.create({
            FullName,
            CompanyName,
            Phone,
            Websites,
            Email,
            Memo
        });
        
        res.status(201).json(newContactusEntry);
    } catch (error) {
        console.error("DATABASE SAVE ERROR:", error);
        res.status(500).json({ message: "Failed to save to database", error: error.message });
    }
}

// ... existing getContactus and addContactus code ...

// Delete an entry
async function deleteContactus(req, res) {
    try {
        const { id } = req.params;
        const deleted = await db.Contactus.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ message: "Entry deleted successfully" });
        } else {
            res.status(404).json({ message: "Entry not found" });
        }
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ message: "Failed to delete entry", error: error.message });
    }
}

module.exports = { getContactus, addContactus, deleteContactus };