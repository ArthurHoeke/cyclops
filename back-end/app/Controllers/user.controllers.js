const dataUtil = require("../Utils/data.utils");
const User = require("../Models/user.models");
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const email = (req.body.email).toLowerCase();
  let password = req.body.password;

  if (email != null && password != null) {
    password = await bcrypt.hash(password, 10);
    const accessToken = dataUtil.generateAccessToken(email, password);

    User.create([email, password, 0], (err) => {
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
            const accessToken = dataUtil.generateAccessToken(email, pwHash);

            res.status(200).json({
              accessToken: accessToken
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
