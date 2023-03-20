const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("No JWT token provided.");

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;

    if(verified.role == 1) {
        next();
    } else {
        res.sendStatus(401);
    }
  } catch (err) {
    res.status(400).send({ error: "Authentication failed, something went wrong." });
  }
};