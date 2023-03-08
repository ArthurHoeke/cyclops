const network = require("../Models/network.models");

const create = async (req, res) => {
    const name = req.body.name;
    const ticker = req.body.ticker;
    const icon = req.body.icon;

    if (name != null && ticker != null && icon != null) {
        network.create([name.toLowerCase(), ticker.toLowerCase(), icon], (err) => {
            if (err) {
                res.sendStatus(500);
            } else {
                validatorService.updateNetworkList();
                res.sendStatus(201);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const remove = async (req, res) => {
    const id = req.body.id;

    if (id != null) {
        network.remove([id], (err) => {
            if (err) {
                res.sendStatus(500);
            } else {
                validatorService.updateNetworkList();
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const list = async (req, res) => {
    network.getList((err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

async function getTokenNames() {
    return new Promise((resolve) => {
        network.getTokenNames(async (err, data) => {
            resolve(data);
        });
    });
}

async function getNetworkFromId(networkId) {
    return new Promise((resolve) => {
        network.getNetworkFromId([networkId], async (err, data) => {
            resolve(data);
        });
    });
}

module.exports = {
    create,
    remove,
    list,
    getNetworkFromId,
    getTokenNames
};  