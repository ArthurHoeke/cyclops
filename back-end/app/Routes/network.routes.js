const express = require('express');
const isAdmin = require('../Middleware/isAdmin.middleware');
const networkControllers = require('../Controllers/network.controllers');
const isLoggedIn = require('../Middleware/isLoggedIn.middleware');
const router = express.Router();

router.post('/create', isAdmin, networkControllers.create);
router.post('/remove', isAdmin, networkControllers.remove);
router.get('/list', isLoggedIn, networkControllers.list);

module.exports = router