const express = require('express');
const router = express.Router();
const orderController = require('../controller/ordersController');
const { body } = require('express-validator');
const { verifyToken, hasPermission } = require('../middleware/auth');

// Validation Rules
const orderValidation = [
    body('customerName').not().isEmpty().withMessage('Customer name is required!'),
    body('customerEmail').isEmail().withMessage('Email must be valid!'),
    body('deliveryAddress').not().isEmpty().withMessage('Delivery address is required!')
];

// GET all orders - Restricted to Admin
router.get('/allorders', orderController.getAllOrders);

// POST add order - verifyToken will now check the whitelist and allow this through
router.post('/addorders',  orderValidation, orderController.createOrder);

// PUT update - Fully protected
router.put('/updateorders/:id', 
    verifyToken, 
    hasPermission, 
    orderController.updateOrderStatus
);

// Note: CyberSource sends this as a POST request
router.post("/cybersource/callback", orderController.handleCyberSourceCallback);

// GET all payments - Restricted to Admin
router.get('/allpayments', verifyToken, hasPermission, orderController.getAllPayments);

module.exports = router;