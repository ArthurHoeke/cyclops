const express = require('express');
const poolControllers = require('../Controllers/pool.controllers');
const isLoggedIn = require('../Middleware/isLoggedIn.middleware');
const router = express.Router();

router.post('/create', isLoggedIn, poolControllers.add);
router.post('/remove', isLoggedIn, poolControllers.remove);
router.post('/findPoolNameByID', isLoggedIn, poolControllers.findPoolNameByID);
router.get('/list', isLoggedIn, poolControllers.getUserPools);

module.exports = router