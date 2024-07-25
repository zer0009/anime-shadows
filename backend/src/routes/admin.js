const express = require('express');
const { createAdmin, fetchUsers, updateUserRole } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/create-admin', createAdmin);  // Only use this in a controlled environment
router.get('/users',authMiddleware, authorize('admin'), fetchUsers);
router.put('/users/:userId/role',authMiddleware, authorize('admin'), updateUserRole);

module.exports = router;