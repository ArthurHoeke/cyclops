const jwt = require("jsonwebtoken");
const config = require("../Config/config");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("Access Denied!, no token entered");

  try {
    const verified = jwt.verify(token, config.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ error: "auth failed, check auth-token" });
  }
};