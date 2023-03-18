const reward = require("../Models/reward.models");

const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const network = require("../Controllers/network.controllers");

async function add(validatorId, amount, timestamp, hash) {
    return new Promise((resolve) => {
        reward.add([validatorId, amount, timestamp, hash], async (err, data) => {
            resolve(data);
        });
    });
};

const getAllRewardsFromValidator = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getAllRewardsFromValidator([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getWeeklyRewardsFromValidator = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getWeeklyRewardsFromValidator([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getMonthlyRewardsFromValidator = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getMonthlyRewardsFromValidator([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getYearlyRewardsFromValidator = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getYearlyRewardsFromValidator([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getRewardsFromValidatorInPeriod = async (req, res) => {
    const validatorId = req.body.validatorId;
    const start = req.body.start;
    const end = req.body.end;
    reward.getRewardsFromValidatorInPeriod([validatorId, start, end], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getCombinedWeeklyRewards = async (req, res) => {
    const userId = req.user.id;

    if(userId != null) {
        reward.getCombinedWeeklyRewards([userId], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.status(200).json({
                    data: data
                });
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const getValidatorRewardOverview = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getValidatorRewardOverview(validatorId, (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const requestSync = async (req, res) => {
    const validatorId = req.body.validatorId;

    if (validatorId != undefined) {
        const status = await validatorService.performRewardSync(validatorId);
        if (status == true) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
};

async function getAllRewardsFromValidatorAsync(validatorId) {
    return new Promise((resolve) => {
        reward.getAllRewardsFromValidator([validatorId], (err, data) => {
            if (err) {
                return null;
            } else {
                resolve(data);
            }
        });
    });
}


module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod,
    getAllRewardsFromValidatorAsync,
    requestSync,
    getWeeklyRewardsFromValidator,
    getMonthlyRewardsFromValidator,
    getYearlyRewardsFromValidator,
    getCombinedWeeklyRewards,
    getValidatorRewardOverview
};