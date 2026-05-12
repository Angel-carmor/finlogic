const express = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.put('/profile', authMiddleware, UserController.updateProfile);

module.exports = router;
