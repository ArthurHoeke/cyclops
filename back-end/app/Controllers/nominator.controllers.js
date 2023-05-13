const nomination = require("../Models/nominator.models");

async function add(validatorId, nominationCount) {
    return new Promise((resolve) => {
        const today = Math.floor(Date.now() / 1000);
        nomination.add([validatorId, nominationCount, today], async (err, data) => {
            resolve(data);
        });
    });
};

async function getNominationHistoryFromValidator(validatorId) {
    return new Promise((resolve) => {
        nomination.getNominationHistoryFromValidator([validatorId], async (err, data) => {
            if (err) {
                return null;
            } else {
                resolve(data);
            }
        });
    });
}

const deleteAllNominations = async (req, res) => {
    const validatorId = req.body.id;
    nomination.deleteAllNominations([validatorId], (err, data) => {
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
    getNominationHistoryFromValidator,
    deleteAllNominations
};