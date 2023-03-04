//create user

//get user by ID / e-mail

//get user by accesstoken

//get accessToken

//set accesstoken

//get role

const User = require("../Models/user.models");

const ping = async (req, res) => {
    res.status(200).json({
        message: "pong"
    });
};

module.exports = {
  ping
};
