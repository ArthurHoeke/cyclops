const pool = require("../Models/pool.models");

const add = async (req, res) => {
    const id = req.body.id;
    const networkId = req.body.networkId;
    const name = req.body.name;
    const userId = req.user.id;

    if (id != null || networkId != null && userId != null && name != null) {
        pool.create([id, networkId, userId, name], (err, data) => {
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

const findPoolNameByID = async (req, res) => {
    const network = req.body.network;
    const id = req.body.id;

    const valName = await validatorService.findPoolNameByID(network, id);
    if (valName != null) {
        res.status(200).json({ data: valName });
    } else {
        res.sendStatus(404);
    }
};

const remove = async (req, res) => {
    const id = req.body.id;
    const userId = req.user.id;

    if (id != null) {
        pool.deletePool([id, userId], (err, data) => {
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

const getUserPools = async (req, res) => {
    const userId = req.user.id;

    pool.getUserPools([userId], async (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // res.status(200).json({ data: data });

            for(let i = 0; i < data.length; i++) {
                data[i].meta = await validatorService.getPoolMeta(data[i].id, data[i].networkId);
            }
            res.status(200).json({
                data: data
            });
        }
    });
};

async function getAllPools() {
    return new Promise((resolve) => {
        pool.getAllPools(async (err, data) => {
            resolve(data);
        });
    });
}

module.exports = {
    add,
    remove,
    getUserPools,
    findPoolNameByID,
    getAllPools
};  