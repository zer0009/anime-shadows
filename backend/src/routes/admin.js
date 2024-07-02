const express = require('express');
const { createAdmin } = require('../controllers/adminController');
const router = express.Router();

router.post('/create-admin', createAdmin);  // Only use this in a controlled environment

module.exports = router;