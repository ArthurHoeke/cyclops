const dataUtil = require("../Utils/data.utils");
const User = require("../Models/user.models");
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const email = (req.body.email).toLowerCase();
  let password = req.body.password;

  if (email != null && password != null) {
    const accessToken = dataUtil.generateAccessToken();
    password = await bcrypt.hash(password, 10);

    User.create([email, password, 0, accessToken], (err) => {
      if (err) {
        res.sendStatus(409);
      } else {
        res.status(201).json({
          accessToken: accessToken
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
};

const login = async (req, res) => {
  const email = (req.body.email).toLowerCase();
  let password = req.body.password;

  if (email != null && password != null) {
    User.getPasswordByEmail([email], (err, row) => {
      if (err || row == undefined) {
        res.sendStatus(404);
      } else {
        const pwHash = row.password;

        bcrypt.compare(password, pwHash, function (err, match) {
          if (match && !err) {
            const accessToken = dataUtil.generateAccessToken();

            User.updateAccessToken([accessToken, email], (err) => {
              if(!err) {
                res.status(200).json({
                  accessToken: accessToken
                });
              }
            });
          } else {
            res.sendStatus(401);
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
};

module.exports = {
  register,
  login
};
