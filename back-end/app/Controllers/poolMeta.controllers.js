const poolMeta = require("../Models/poolMeta.models");

async function add(poolId, networkId, totalBond, memberCount, pendingRewards) {
    return new Promise((resolve) => {
        const today = Math.floor(Date.now() / 1000);

        poolMeta.add([poolId, networkId, totalBond, memberCount, pendingRewards, today], async (err, data) => {
            resolve(data);
        });
    });
};

async function getPoolMeta(poolId, networkId) {
    return new Promise((resolve) => {
        poolMeta.getPoolMetaFromPoolId([poolId, networkId], async (err, data) => {
            if (err) {
                return null;
            } else {
                resolve(data);
            }
        });
    });
}

const deleteAllPoolMeta = async (req, res) => {
    const poolId = req.body.id;
    poolMeta.deleteAllMeta([poolId], (err, data) => {
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
    getPoolMeta,
    deleteAllPoolMeta
};