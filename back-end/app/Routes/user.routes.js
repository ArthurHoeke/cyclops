const express = require('express');
// const checkAuth = require('../Middleware/checkAuth.middleware');
const userControllers = require('../Controllers/user.controllers');
const router = express.Router();

router.post('/register', userControllers.register);
router.post('/login', userControllers.login);

module.exports = router