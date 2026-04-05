const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactusController');
const { verifyToken, hasPermission } = require("../middleware/auth");

// 1. PUBLIC: Anyone can see the list
router.get('/contactus', contactController.getContactus);

// 2. PUBLIC: Anyone can submit the form
router.post('/addcontactus', contactController.addContactus);

router.put('/contactusstatus/:id', verifyToken, hasPermission, contactController.updatestatus);

// 3. PROTECTED: Only Admins can delete
router.delete('/contactus/:id', verifyToken, hasPermission, contactController.deleteContactus);

module.exports = router;