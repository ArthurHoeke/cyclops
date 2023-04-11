const express = require('express');

const isLoggedIn = require("../Middleware/isLoggedIn.middleware")

const rewardControllers = require('../Controllers/reward.controllers');
const router = express.Router();

router.post('/sync', isLoggedIn, rewardControllers.requestSync);
router.post('/getWeeklyRewardsFromValidator', isLoggedIn, rewardControllers.getWeeklyRewardsFromValidator);
router.post('/getAllRewardsFromValidator', isLoggedIn, rewardControllers.getAllRewardsFromValidator);
router.post('/getMonthlyRewardReportFromValidator', isLoggedIn, rewardControllers.getMonthlyRewardReportFromValidator);
router.get('/getRewardsFromValidatorInPeriod', isLoggedIn, rewardControllers.getRewardsFromValidatorInPeriod);
router.get('/getMonthlyRewardsFromValidator', isLoggedIn, rewardControllers.getMonthlyRewardsFromValidator);
router.get('/getYearlyRewardsFromValidator', isLoggedIn, rewardControllers.getYearlyRewardsFromValidator);
router.get('/getCombinedWeeklyRewards', isLoggedIn, rewardControllers.getCombinedWeeklyRewards);
router.post('/getValidatorRewardOverview', isLoggedIn, rewardControllers.getValidatorRewardOverview);
router.get('/getIncomeDistribution', isLoggedIn, rewardControllers.getIncomeDistribution);
router.post('/deleteAllFromValidator', isLoggedIn, rewardControllers.deleteAllRewards);
module.exports = router