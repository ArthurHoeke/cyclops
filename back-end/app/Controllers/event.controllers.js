const event = require("../Models/event.models");

function add(validatorId, eventType, description, timestamp) {
    event.add([validatorId, eventType, description, timestamp], (err, data) => {
        if (err) {
            return false;
        } else {
            return data;
        }
    });
};

const get = async (req, res) => {
    const validatorId = req.body.validatorId;
    event.get([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const remove = async (req, res) => {
    const eventId = req.body.id;
    const valId = req.body.validatorId;
    event.remove([eventId, valId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
};

module.exports = {
    add,
    get,
    remove
};