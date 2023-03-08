const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const reward = require("../Controllers/reward.controllers");
const network = require("../Controllers/network.controllers");

//network object keeping track of all active validators per network
//loop through all validators in list, if address matches a tracked validator mark the reward points in temp. array.
// write function which takes all reward points and returns an average. If monitored validator is heavily under average shoot performance alert

networkList = [];

activeNetworkValidators = [];
waitingNetworkValidators = [];
avgRewardPoints = [];

let interval;

async function updateNetworkList() {
    networkList = await network.getTokenNames();
}

async function periodicNetworkCheck() {
    networkList = await network.getTokenNames();

    //fetch all networks
    getActiveNetworkValidators();
    interval = setInterval(async function () {
        getActiveNetworkValidators();
    }, 5 * 60000);
}

function getValidatorStatus(networkId, address) {
    
}

function getAverageRewardPoints() {
    avgRewardPoints = [];

    for(let i = 0; i < activeNetworkValidators.length; i++) {
        let totalRewardPoints = 0;
        let avg = 0;
        for(let i2 = 0; i2 < activeNetworkValidators[i].length; i2++) {
            totalRewardPoints += activeNetworkValidators[i][i2]['reward_point'];
        }
        avg = totalRewardPoints / activeNetworkValidators[i].length;
        avgRewardPoints.push(avg)
    }
}

async function getActiveNetworkValidators() {
    let newActiveNetworkValidators = [];
    let newWaitingNetworkValidators = [];

    let error = false;

    for (let i = 0; i < networkList.length; i++) {

        // "rank_validator": 0,
        //     "bonded_nominators": "19893288950583338",
        //         "bonded_owner": "0",
        //             "count_nominators": 70,
        //                 "validator_prefs_value": 1000000000,
        //                     "latest_mining": 14520122,
        //                         "reward_point": 6720,
        //                             "session_key": null,
        //                                 "stash_account_display": {
        //     "address": "111B8CxcmnWbuDLyGvgUmRezDCK1brRZmvUuQ6SrFdMyc3S"
        // },
        // "controller_account_display": {
        //     "address": "111B8CxcmnWbuDLyGvgUmRezDCK1brRZmvUuQ6SrFdMyc3S"
        // },
        // "node_name": "",
        //     "reward_account": "",
        //         "reward_pot_balance": "0",
        //             "grandpa_vote": 652,
        //                 "bonded_total": "19893288950583338",
        //                     "status": ""

        // "bonded_owner": "0",
        //         "bonded_nominators": "0",
        //         "count_nominators": 293,
        //         "validator_prefs_value": 50000000,
        //         "stash_account_display": {
        //             "address": "12pJGRmrWoZohZVFnGK2hhoMwzCVkjmEjwv3C5wxdnbCAiEk",
        //             "display": "Watermelon",
        //             "judgements": [
        //                 {
        //                     "index": 0,
        //                     "judgement": "Reasonable"
        //                 }
        //             ],
        //             "identity": true
        //         },
        //         "node_name": "",
        //         "reward_account": "",
        //         "reward_pot_balance": "0"

        //wait to make sure request ratelimit is not hit

        await setTimeout(async function () {
            let res = null;
            let res2 = null;

            if(error == false) {
                res = await subscan.getActiveValidators(networkList[i].name);
                res2 = await subscan.getWaitingValidators(networkList[i].name);
            }

            if (res.code == null || res2.code == null || res.code != 0 || res2.code != 0) {
                error = true;
            } else {
                newActiveNetworkValidators.push(res['data'].list);
                newWaitingNetworkValidators.push(res['data'].list);
            }

            if(i == (networkList.length - 1) && error == false) {
                activeNetworkValidators = newActiveNetworkValidators;
                waitingNetworkValidators = newWaitingNetworkValidators;
                getAverageRewardPoints();
            }
        }, 5000 * i);
    }
}

module.exports = {
    periodicNetworkCheck,
    updateNetworkList
};