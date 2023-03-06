const reward = require("../Models/reward.models");

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

async function getAllRewardsFromValidatorAsync(validatorId) {
    return new Promise((resolve) => {
        reward.getAllRewardsFromValidator([validatorId], async (err, data) => {
            resolve(data);
        });
    });
}

module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod,
    getAllRewardsFromValidatorAsync
};