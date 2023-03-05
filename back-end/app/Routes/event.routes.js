const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const eventControllers = require('../Controllers/event.controllers');
const router = express.Router();

router.get('/getEvents', isLoggedIn, eventControllers.getEvents);
router.post('/remove', isLoggedIn, eventControllers.remove);

module.exports = router