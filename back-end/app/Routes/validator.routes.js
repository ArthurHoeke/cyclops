const express = require('express');

const isLoggedIn = require('../Middleware/isLoggedIn.middleware');

const validatorController = require('../Controllers/validator.controllers');
const router = express.Router();

router.post('/add', isLoggedIn, validatorController.add);
router.post('/remove', isLoggedIn, validatorController.remove);
router.get('/list', isLoggedIn, validatorController.getList);

module.exports = router