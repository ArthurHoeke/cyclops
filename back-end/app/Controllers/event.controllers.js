const mailService = require("../Services/mail.services");

const event = require("../Models/event.models");

async function register(val, eventType, description) {
    return new Promise((resolve) => {
        event.add([val.id, eventType, description, Date.now()], async (err, data) => {
            mailService.sendEmail(val.userId, "Low reward point warning", "Validator " + val.address + " is currently amongst the 5% worst performing validators based on the average reward points on the network. Is everything OK?");
            resolve(data);
        });
    });
}

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
    register,
    get,
    remove
};