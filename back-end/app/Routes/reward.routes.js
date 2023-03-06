const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const rewardControllers = require('../Controllers/reward.controllers');
const router = express.Router();

router.get('/getAllRewardsFromValidator', isLoggedIn, rewardControllers.getAllRewardsFromValidator);
router.get('/getRewardsFromValidatorInPeriod', isLoggedIn, rewardControllers.getRewardsFromValidatorInPeriod);
router.get('/sync', isLoggedIn, rewardControllers.requestSync);

module.exports = router