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
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

module.exports = {
    create,
    remove
};  