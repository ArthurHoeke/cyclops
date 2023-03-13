const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const reward = require("../Controllers/reward.controllers");
const network = require("../Controllers/network.controllers");
const data = require("../Utils/data.utils");

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
    await updateNetworkList()

    //fetch all networks
    getActiveNetworkValidators();
    interval = setInterval(async function () {
        console.clear();
        getActiveNetworkValidators();
    }, 5 * 60000);
}

function getValidatorStatus(networkId, address) {
    let selValidator = null;
    let status = "offline";

    for(let i  = 0; i < activeNetworkValidators[networkId-1].length; i++) {
        if(activeNetworkValidators[networkId-1][i]['stash_account_display']['address'] == address) {
            selValidator = activeNetworkValidators[networkId-1][i];
            status = "active";
            break;
        }
    }

    if(selValidator == null) {
        for(let i  = 0; i < waitingNetworkValidators[networkId-1].length; i++) {
            if(waitingNetworkValidators[networkId-1][i]['stash_account_display']['address'] == address) {
                selValidator = waitingNetworkValidators[networkId-1][i];
                status = "waiting";
                break;
            }
        }
    }

    if(selValidator != null) {
        selValidator.status = status;
        return selValidator;
    } else {
        return {
            status: status
        };
    }
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

async function syncAllValidatorRewards() {
    const validatorList = await validator.getAllValidatorIds();
    if(validatorList.length == 0) {
        console.log("No validators have been added yet.");
    } else {
        for(let i = 0; i < validatorList.length; i++) {
            await performRewardSync(validatorList[i].id);
        }
    }
}

async function getActiveNetworkValidators() {
    console.log(data.getDividerLogString());
    console.log("Preparing to fetch network data..");

    let newActiveNetworkValidators = [];
    let newWaitingNetworkValidators = [];

    let error = false;

    for (let i = 0; i < networkList.length; i++) {

        //wait to make sure request ratelimit is not hit
        await setTimeout(async function () {
            let res = null;
            let res2 = null;

            if(error == false) {
                console.log(data.getDividerLogString());
                console.log(data.yellowConsoleLog("Fetching") + " active " + networkList[i].name + " validators..");
                res = await subscan.getActiveValidators(networkList[i].name);
                console.log(data.greenConsoleLog("Received") + " active validators");
                console.log(data.yellowConsoleLog("Fetching") + " waiting " + networkList[i].name + " validators..");
                res2 = await subscan.getWaitingValidators(networkList[i].name);
                console.log(data.greenConsoleLog("Received") + " waiting validators");
            }

            if (res.code == undefined || res2.code == undefined || res.code == null || res2.code == null || res.code != 0 || res2.code != 0) {
                error = true;
            } else {
                newActiveNetworkValidators.push(res['data'].list);
                newWaitingNetworkValidators.push(res2['data'].list);
                console.log(data.grayConsoleLog("Pushing") + " " + networkList[i].name + " live validator data to cache..");
            }

            if(i == (networkList.length - 1) && error == false) {
                console.log(data.getDividerLogString());
                activeNetworkValidators = newActiveNetworkValidators;
                waitingNetworkValidators = newWaitingNetworkValidators;
                console.log("🟢" + "Succussfully updated all network data @ " + data.getCurrentTimeString());
                getAverageRewardPoints();
                console.log("Preparing to sync validator rewards..");
                syncAllValidatorRewards();
            } else if(error == true) {
                console.log(data.getDividerLogString());
                console.log("🔴" + "Error occurred fetching network, preserving previous data @ " + data.getCurrentTimeString());
            }
        }, 5000 * i);
    }
}

// This function performs a sync between local rewards data and Subscan's API data for a given validator ID
async function performRewardSync(validatorId) {
    // First, retrieve validator data using its ID
    const validatorData = await validator.getValidatorById(validatorId);

    // If the validator data is undefined, exit the function and return false
    if (validatorData == undefined) {
        return false;
    }

    console.log(data.getDividerLogString());
    console.log(data.yellowConsoleLog("Started sync") + " for validator " + validatorData.address);

    // Retrieve all rewards for this validator and store them in a cache for later use
    const rewardData = await reward.getAllRewardsFromValidatorAsync(validatorId);
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
        console.log("💤" + "Already synced");
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
        const newLocalStoreCount = await processRewardList(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount)
        if (realtimeRewardCount == newLocalStoreCount) {
            // If the real-time and local counts match, there is no need to continue processing, break out of the loop
            console.log("🟢" + "Finished syncing");
            break;
        }
    }

    // Return true to indicate the sync was successful
    return true;
}

// This function processes a list of rewards and returns a new count of locally stored rewards
async function processRewardList(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount) {
    return new Promise(async (resolve) => {
        for (let i = 0; i < rewardList.length; i++) {
            // Retrieve reward data for each reward in the list
            const rewardAmt = rewardList[i].amount;
            const timestamp = rewardList[i].block_timestamp;
            const hash = rewardList[i].extrinsic_index;

            // Check if the reward already exists in the cache, if not add it to the local store and update the count
            const exists = rewardHashCache[hash];

            if (!exists) {
                await reward.add(validatorId, rewardAmt, timestamp, hash);
                locallyStoredRewardCount++;
                console.log(data.greenConsoleLog("🧊 Added") + " | " + hash);
            }
        }

        // Resolve the promise with the new count of locally stored rewards
        resolve(locallyStoredRewardCount);
    });
}

module.exports = {
    periodicNetworkCheck,
    updateNetworkList,
    getValidatorStatus,
    performRewardSync
};