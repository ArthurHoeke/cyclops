const dataUtil = require("../Utils/data.utils");
const User = require("../Models/user.models");
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email != null && password != null) {
    email = email.toLowerCase();
    password = await bcrypt.hash(password, 10);
    let role = 0;

    //First account to be registered is admin / role 1
    User.getUserCount((err, row) => {
      if (row.userCount == 0) {
        role = 1;
      }

      User.create([email, password, role], (err) => {
        if (err) {
          res.sendStatus(409);
        } else {
          User.getUserIdByEmail([email],(err, row) => {
            const accessToken = dataUtil.generateAccessToken(row.id, email, password, role);
  
            res.status(201).json({
              accessToken: accessToken
            });
          });
        }
      });
    });
  } else {
    res.sendStatus(400);
  }
};

const login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email != null && password != null) {
    email = email.toLowerCase();

    User.getUserDataByEmail([email], (err, row) => {
      if (err || row == undefined) {
        res.sendStatus(404);
      } else {
        const id = row.id;
        const pwHash = row.password;
        const role = row.role;

        bcrypt.compare(password, pwHash, function (err, match) {
          if (match && !err) {
            const accessToken = dataUtil.generateAccessToken(id, email, pwHash, role);

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

async function getUserEmailById() {
  return new Promise((resolve) => {
      User.getUserEmailById(async (err, data) => {
          resolve(data);
      });
  });
}

module.exports = {
  register,
  login,
  getUserEmailById
};
