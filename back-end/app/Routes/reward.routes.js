const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const rewardControllers = require('../Controllers/reward.controllers');
const router = express.Router();

router.post('/getAllRewardsFromValidator', rewardControllers.getAllRewardsFromValidator);
router.post('/getRewardsFromValidatorInPeriod', rewardControllers.getRewardsFromValidatorInPeriod);

module.exports = router