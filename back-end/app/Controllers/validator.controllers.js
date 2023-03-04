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

const getList = async (req, res) => {
    const userId = req.user.id;
    
    validator.getList([userId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({data: data});
        }
    });
};

module.exports = {
    add,
    getList
};  