// routes/auth.js
const express = require('express');
const router = express.Router(); // <-- create router

// Import controllers correctly
const { getAllUser, registerUser, postlogin } = require("../controller/userscontroller");

// Register User Endpoint
router.post('/register', registerUser);

// Login User Endpoint
router.post('/login', postlogin);

// Get All Users Endpoint
router.get('/getalluser', getAllUser);

module.exports = router;
