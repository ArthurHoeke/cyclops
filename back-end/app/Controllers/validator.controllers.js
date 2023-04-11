const validator = require("../Models/validator.models");

const add = async (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const networkId = req.body.networkId;
    const userId = req.user.id;

    if (name != null || address != null && networkId != null) {
        validator.add([name, address, networkId, userId], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const remove = async (req, res) => {
    const id = req.body.id;
    const userId = req.user.id;

    if (id != null) {
        validator.remove([id, userId], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const getList = async (req, res) => {
    const userId = req.user.id;

    validator.getList([userId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({ data: data });
        }
    });
};

const updateName = async (req, res) => {
    const userId = req.user.id;
    const validatorId = req.body.id;
    const newName = req.body.name;

    validator.updateName([newName, validatorId, userId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
};

const findValidatorNameByAddress = async (req, res) => {
    const network = req.body.network;
    const address = req.body.address;

    const valName = await validatorService.findValidatorNameByAddress(network, address);
    if (valName != null) {
        res.status(200).json({ data: valName });
    } else {
        res.sendStatus(404);
    }
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
    getAllValidatorIds,
    updateName,
    findValidatorNameByAddress
};  