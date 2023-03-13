const validator = require("../Models/validator.models");

const add = async (req, res) => {
    const address = req.body.address;
    const networkId = req.body.networkId;
    const userId = req.user.id;

    if (address != null && networkId != null) {
        validator.add([address, networkId, userId], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    }
};

const remove = async (req, res) => {
    const id = req.body.validatorId;
    const userId = req.user.id;

    if (id != null) {
        validator.remove([id, userId], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    }
};

const getList = async (req, res) => {
    const userId = req.user.id;

    validator.getList([userId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // validatorService.get
            res.status(200).json({ data: data });
        }
    });
};

async function getValidatorById(validatorId) {
    return new Promise((resolve) => {
        validator.getValidatorById([validatorId], async (err, data) => {
            resolve(data);
        });
    });
}

async function getAllValidatorIds() {
    return new Promise((resolve) => {
        validator.getAllValidatorIds(async (err, data) => {
            resolve(data);
        });
    });
}

module.exports = {
    add,
    remove,
    getList,
    getValidatorById,
    getAllValidatorIds
};  