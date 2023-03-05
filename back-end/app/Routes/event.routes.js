const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const eventControllers = require('../Controllers/event.controllers');
const router = express.Router();

router.get('/get', isLoggedIn, eventControllers.get);
router.post('/remove', isLoggedIn, eventControllers.remove);

module.exports = router