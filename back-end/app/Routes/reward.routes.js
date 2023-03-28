const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const rewardControllers = require('../Controllers/reward.controllers');
const router = express.Router();

router.post('/sync', isLoggedIn, rewardControllers.requestSync);
router.post('/getWeeklyRewardsFromValidator', isLoggedIn, rewardControllers.getWeeklyRewardsFromValidator);
router.get('/getAllRewardsFromValidator', isLoggedIn, rewardControllers.getAllRewardsFromValidator);
router.get('/getRewardsFromValidatorInPeriod', isLoggedIn, rewardControllers.getRewardsFromValidatorInPeriod);
router.get('/getMonthlyRewardsFromValidator', isLoggedIn, rewardControllers.getMonthlyRewardsFromValidator);
router.get('/getYearlyRewardsFromValidator', isLoggedIn, rewardControllers.getYearlyRewardsFromValidator);
router.get('/getCombinedWeeklyRewards', isLoggedIn, rewardControllers.getCombinedWeeklyRewards);
router.get('/getValidatorRewardOverview', isLoggedIn, rewardControllers.getValidatorRewardOverview);
router.get('/getIncomeDistribution', isLoggedIn, rewardControllers.getIncomeDistribution);
module.exports = router