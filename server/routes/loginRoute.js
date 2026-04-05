// routes/auth.js
const express = require('express');
const router = express.Router(); // <-- create router

// Import controllers correctly
const { getAllUser, registerUser, postlogin,  deleteUser, updateUser  } = require("../controller/userscontroller");

// Register User Endpoint
router.post('/register', registerUser);

// Login User Endpoint
router.post('/login', postlogin);

//update user endpoint
router.put('/updateuser/:id', updateUser);

// Delete User Endpoint
router.delete('/deleteuser/:id', deleteUser);   

// Get All Users Endpoint
router.get('/getalluser', getAllUser);

module.exports = router;
