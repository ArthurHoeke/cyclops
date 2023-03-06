const reward = require("../Models/reward.models");

const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const network = require("../Controllers/network.controllers");

async function add(validatorId, amount, timestamp, hash) {
    return new Promise((resolve) => {
        reward.add([validatorId, amount, timestamp, hash], async (err, data) => {
            resolve(data);
        });
    });
};

const getAllRewardsFromValidator = async (req, res) => {
    const validatorId = req.body.validatorId;
    reward.getAllRewardsFromValidator([validatorId], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const getRewardsFromValidatorInPeriod = async (req, res) => {
    const validatorId = req.body.validatorId;
    const start = req.body.start;
    const end = req.body.end;
    reward.getRewardsFromValidatorInPeriod([validatorId, start, end], (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).json({
                data: data
            });
        }
    });
};

const requestSync = async (req, res) => {
    const validatorId = req.body.validatorId;

    if (validatorId != undefined) {
        const status = await performRewardSync(validatorId);
        if (status == true) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
};

async function getAllRewardsFromValidatorAsync(validatorId) {
    return new Promise((resolve) => {
        reward.getAllRewardsFromValidator([validatorId], (err, data) => {
            if (err) {

            } else {
                resolve(data);
            }
        });
    });
}

// This function performs a sync between local rewards data and Subscan's API data for a given validator ID
async function performRewardSync(validatorId) {
    // First, retrieve validator data using its ID
    const validatorData = await validator.getValidatorById(validatorId);

    // If the validator data is undefined, exit the function and return false
    if (validatorData == undefined) {
        return false;
    }

    // Retrieve all rewards for this validator and store them in a cache for later use
    const rewardData = await getAllRewardsFromValidatorAsync(validatorId);
    var rewardHashCache = {};
    rewardData.forEach(function (reward) {
        rewardHashCache[reward.hash] = reward.id
    });

    // Get the network data for this validator
    const networkData = await network.getNetworkFromId(validatorData.networkId);

    // Get all events for this validator's address
    let eventData = await subscan.getValidatorEvents(networkData.name, validatorData.address, 0);

    // If there was an error retrieving events, return false
    if (eventData.code != 0) {
        return false;
    } else {
        // Otherwise, store the event data
        eventData = eventData.data;
    }

    // Store the reward list from the event data
    let rewardList = eventData.list;

    // Store the count of rewards in real-time and in the local cache
    let realtimeRewardCount = eventData.count;
    let locallyStoredRewardCount = rewardData.length;

    // If the counts are the same, there is no need to sync, return true
    if (realtimeRewardCount == locallyStoredRewardCount) {
        return true;
    }

    // Loop through all pages of rewards data (up to 100 entries per page) and process them
    for (let i = 0; i < Math.ceil(realtimeRewardCount / 100); i++) {
        if (i > 0) {
            // If there is more than one page, retrieve the next page of events
            eventData = await subscan.getValidatorEvents(networkData.name, validatorData.address, i);
            rewardList = eventData['data'].list;
        }
        // Process the reward list and retrieve the new local stored reward count
        const newLocalStoreCount = await processRewardListSync(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount)
        if (realtimeRewardCount == newLocalStoreCount) {
            // If the real-time and local counts match, there is no need to continue processing, break out of the loop
            break;
        }
    }

    // Return true to indicate the sync was successful
    return true;
}

// This function processes a list of rewards and returns a new count of locally stored rewards
async function processRewardListSync(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount) {
    return new Promise(async (resolve) => {
        for (let i = 0; i < rewardList.length; i++) {
            // Retrieve reward data for each reward in the list
            const rewardAmt = rewardList[i].amount;
            const timestamp = rewardList[i].block_timestamp;
            const hash = rewardList[i].extrinsic_index;

            // Check if the reward already exists in the cache, if not add it to the local store and update the count
            const exists = rewardHashCache[hash];

            if (!exists) {
                await add(validatorId, rewardAmt, timestamp, hash);
                locallyStoredRewardCount++;
            }
        }

        // Resolve the promise with the new count of locally stored rewards
        resolve(locallyStoredRewardCount);
    });
}


module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod,
    getAllRewardsFromValidatorAsync,
    requestSync
};