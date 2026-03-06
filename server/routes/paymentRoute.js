const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();

const CYBERSOURCE_API_URL = 'https://api.cybersource.com/pt/v2/transactions'; // CyberSource API endpoint
const CYBERSOURCE_MERCHANT_ID = 'YOUR_MERCHANT_ID';  // Your CyberSource Merchant ID
const CYBERSOURCE_API_KEY = 'YOUR_API_KEY'; // Your CyberSource API Key
const CYBERSOURCE_SECRET_KEY = 'YOUR_SECRET_KEY'; // Your CyberSource Secret Key

// Middleware to parse the body of incoming requests
router.use(bodyParser.json());

// Endpoint to initiate the payment process
router.post('/create-payment', async (req, res) => {
  const paymentData = req.body;  // Data like amount, currency, etc. from frontend

  // Construct the request payload to CyberSource
  const payload = {
    "merchantReferenceCode": paymentData.orderId, // A unique reference for the order
    "amount": paymentData.amount,                 // Amount to charge
    "currency": paymentData.currency,             // Currency code (USD, EUR, etc.)
    "paymentMethod": "creditCard",                // Payment method (can be creditCard, paypal, etc.)
    "billToAddress": paymentData.billingAddress,  // Billing address info
    // You can add other customer information here as well
  };

  // Set up authentication headers for CyberSource API
  const headers = {
    'Authorization': `Bearer ${CYBERSOURCE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    // Send request to CyberSource for creating payment
    const response = await axios.post(CYBERSOURCE_API_URL, payload, { headers });

    if (response.data && response.data.redirectUrl) {
      // Redirect to CyberSource hosted checkout page
      return res.json({ redirectUrl: response.data.redirectUrl });
    }

    // Handle unexpected response
    res.status(500).json({ error: 'Failed to create payment request.' });

  } catch (error) {
    console.error('Error creating payment request: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle the response after payment is processed
router.post('/payment-response', (req, res) => {
  const paymentStatus = req.body;  // Data sent back from CyberSource after payment

  // Check if payment was successful
  if (paymentStatus.transactionStatus === 'ACCEPT') {
    res.json({ message: 'Payment Successful', transactionDetails: paymentStatus });
  } else {
    res.status(400).json({ message: 'Payment Failed', transactionDetails: paymentStatus });
  }
});

module.exports = router;
