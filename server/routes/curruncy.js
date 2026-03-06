const express = require('express');
const router = express.Router();
const db = require('./db');

const {body, validationResult} = require('express-validator');


router.get('/allcurrency', async (req, res) => {
    const row = db.query('select * from currency')
})
