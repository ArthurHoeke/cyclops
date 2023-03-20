const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const rewardControllers = require('../Controllers/reward.controllers');
const router = express.Router();

router.get('/getAllRewardsFromValidator', isLoggedIn, rewardControllers.getAllRewardsFromValidator);
router.get('/getRewardsFromValidatorInPeriod', isLoggedIn, rewardControllers.getRewardsFromValidatorInPeriod);
router.get('/sync', isLoggedIn, rewardControllers.requestSync);
router.get('/getWeeklyRewardsFromValidator', isLoggedIn, rewardControllers.getWeeklyRewardsFromValidator);
router.get('/getMonthlyRewardsFromValidator', isLoggedIn, rewardControllers.getMonthlyRewardsFromValidator);
router.get('/getYearlyRewardsFromValidator', isLoggedIn, rewardControllers.getYearlyRewardsFromValidator);
router.get('/getCombinedWeeklyRewards', isLoggedIn, rewardControllers.getCombinedWeeklyRewards);
router.get('/getValidatorRewardOverview', isLoggedIn, rewardControllers.getValidatorRewardOverview);
module.exports = router