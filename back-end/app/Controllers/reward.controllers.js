//create reward

//get all rewards from validator

//get all rewards from validator between two timestamps

const reward = require("../Models/reward.models");

function add(validatorId, amount, timestamp, hash) {
    reward.add([validatorId, amount, timestamp, hash], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
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

module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod
};
  