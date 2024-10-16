const express = require('express');
const dotenv = require('dotenv'); // Ensure dotenv is imported
const { register, login } = require('../controllers/authController');

dotenv.config();

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router; // Ensure the file ends correctly
