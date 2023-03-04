const express = require('express');
const isAdmin = require('../Middleware/isAdmin.middleware');
const networkControllers = require('../Controllers/network.controllers');
const router = express.Router();

router.post('/create', isAdmin, networkControllers.create);
router.post('/remove', isAdmin, networkControllers.remove);

module.exports = router