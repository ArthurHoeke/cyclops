const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const reward = require("../Controllers/reward.controllers");
const network = require("../Controllers/network.controllers");

//network object keeping track of all active validators per network
//loop through all validators in list, if address matches a tracked validator mark the reward points in temp. array.
// write function which takes all reward points and returns an average. If monitored validator is heavily under average shoot performance alert

module.exports = {
    
};