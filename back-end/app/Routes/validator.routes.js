const express = require('express');

const isLoggedIn = require('../Middleware/isLoggedIn.middleware');

const validatorController = require('../Controllers/validator.controllers');
const router = express.Router();

router.post('/add', isLoggedIn, validatorController.add);
router.post('/delete', isLoggedIn, validatorController.remove);
router.post('/updateName', isLoggedIn, validatorController.updateName);
router.get('/list', isLoggedIn, validatorController.getList);
router.post('/findValidatorNameByAddress', isLoggedIn, validatorController.findValidatorNameByAddress);
module.exports = router