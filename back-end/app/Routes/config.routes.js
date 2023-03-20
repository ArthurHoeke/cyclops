const express = require('express');

const isAdmin = require("../Middleware/isAdmin.middleware")

const configController = require('../Controllers/config.controllers');
const router = express.Router();

router.post('/setSMTP', isAdmin, configController.setSMTP);
router.post('/setSubscanApiKey', isAdmin, configController.setSubscanApiKey);
router.post('/list', isAdmin, configController.getVariableList);

module.exports = router