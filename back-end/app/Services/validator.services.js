const subscan = require("../Utils/subscan.utils");
const w3f = require("../Utils/w3f.utils");
const data = require("../Utils/data.utils");

const validator = require("../Controllers/validator.controllers");
const reward = require("../Controllers/reward.controllers");
const network = require("../Controllers/network.controllers");
const event = require("../Controllers/event.controllers");

networkList = [];
networkEraProgress = {};

activeNetworkValidators = [];
waitingNetworkValidators = [];

rewardPointTracker = {};
avgRewardPoints = [];

var polkadot1kvData = null;
var kusama1kvData = null;

isSyncing = false;

let interval;

async function updateNetworkList() {
    networkList = await network.getTokenNames();
    if(SUBSCAN_APIKEY != null) {
        await updateEraData();
    }
}

async function updateEraData() {
    for (let i = 0; i < networkList.length; i++) {
        const eraData = await subscan.getEra(networkList[i].name);

        if(eraData['data']['eraLength'] != undefined) {
            const eraObj = {
                eraLength: eraData['data']['eraLength'],
                eraProcess: eraData['data']['eraProcess']
            };
            networkEraProgress[networkList[i].name] = eraObj;
        }
    }
}

// This async function periodically fetches all the validators of each network, sets the activeNetworkValidators and waitingNetworkValidators variables and starts the syncAllValidatorRewards function.
async function periodicNetworkCheck() {
    await updateNetworkList()

    //fetch all networks
    getNetworkValidators();
    this.interval = setInterval(async function () {
        if(isSyncing == false) {
            console.clear();
            await getNetworkValidators();
            await updateEraData();
        }
    }, 5 * 60000);
}

function thousandValidatorCheck() {
    update1kvData();

    //update 1kv data every hour
    setInterval(async function () {
        update1kvData();
    }, 60 * 60000);
}

async function update1kvData() {
    const kusamaw3f = await w3f.getKusama1kvData();
    if(kusamaw3f == false) {
        console.log(data.redConsoleLog("Failed") + " to update Kusama 1kv data (W3F API service is down)");
    } else {
        let kvList = [];
        for(let i = 0; i < kusamaw3f.length; i++) {
            kvList[i] = {};
            kvList[i].stash = kusamaw3f[i]['stash'];
            kvList[i].score = kusamaw3f[i]['score'];
            kvList[i].validity = kusamaw3f[i]['validity'];
        }

        kusama1kvData = kvList;

        console.log(data.greenConsoleLog("Updated") + " Kusama 1kv data");
    }

    const polkadotw3f = await w3f.getPolkadot1kvData();

    if(polkadotw3f == false) {
        console.log(data.redConsoleLog("Failed") + " to update Polkadot 1kv data (W3F API service is down)");
    } else {
        let kvList = [];
        for(let i = 0; i < polkadotw3f.length; i++) {
            kvList[i] = {};
            kvList[i].stash = polkadotw3f[i]['stash'];
            kvList[i].score = polkadotw3f[i]['score'];
            kvList[i].validity = polkadotw3f[i]['validity'];
        }

        polkadot1kvData = kvList;

        console.log(data.greenConsoleLog("Updated") + " Polkadot 1kv data");
    }
}

// This function returns the status of a validator given the networkId and address.
function getValidatorStatus(networkId, address) {
    let selValidator = null;
    let status = "offline";

    //cyclops has not yet fetched API data, return null
    if (activeNetworkValidators[networkId - 1] == undefined || waitingNetworkValidators[networkId - 1] == undefined) {
        return null;
    }

    //check if validator is listed in the active list
    for (let i = 0; i < activeNetworkValidators[networkId - 1].length; i++) {
        if (activeNetworkValidators[networkId - 1][i]['stash_account_display']['address'] == address) {
            selValidator = activeNetworkValidators[networkId - 1][i];
            selValidator.rewardTracking = rewardPointTracker[address];
            status = "active";
            break;
        }
    }

    //if the validator has not been found yet, try again in the waiting list
    if (selValidator == null) {
        for (let i = 0; i < waitingNetworkValidators[networkId - 1].length; i++) {
            if (waitingNetworkValidators[networkId - 1][i]['stash_account_display']['address'] == address) {
                selValidator = waitingNetworkValidators[networkId - 1][i];
                status = "waiting";
                break;
            }
        }
    }

    //if the validator has still not been found it is offline, if it has been found return validator details + status
    if (selValidator != null) {
        selValidator.status = status;
        return selValidator;
    } else {
        return {
            status: status
        };
    }
}

//loops over all active validators, combined reward points and calculated the average.
//used to check performance
function getAverageRewardPoints() {
    avgRewardPoints = [];

    for (let i = 0; i < activeNetworkValidators.length; i++) {
        let totalRewardPoints = 0;
        let avg = 0;
        for (let i2 = 0; i2 < activeNetworkValidators[i].length; i2++) {
            totalRewardPoints += activeNetworkValidators[i][i2]['reward_point'];
        }
        avg = totalRewardPoints / activeNetworkValidators[i].length;
        avgRewardPoints.push(avg)
    }
}

async function trackValidatorRewardPoints(validatorId) {
    const val = await validator.getValidatorById(validatorId);

    const networkId = val.networkId;
    const address = val.address;

    if (address in rewardPointTracker) {
        //being tracked
        let selValidator = null;

        if(activeNetworkValidators[networkId - 1] != undefined) {
            for (let i = 0; i < activeNetworkValidators[networkId - 1].length; i++) {
                if (activeNetworkValidators[networkId - 1][i]['stash_account_display']['address'] == address) {
                    selValidator = activeNetworkValidators[networkId - 1][i];
                    break;
                }
            }   
        }

        if (selValidator != null) {
            const pointArr = rewardPointTracker[address];

            if(pointArr[pointArr.length - 1] != undefined) {
                if (pointArr[pointArr.length - 1] > selValidator['reward_point']) {
                    //new ERA, reset tracking
                    rewardPointTracker[address] = [selValidator['reward_point']];
                } else {
                    //add points to tracking
                    rewardPointTracker[address].push(selValidator['reward_point']);
    
                    //if validator reward points differ more than 90% of the average, send warning e-mail
                    if (data.compareAndCalculatePercentageDifference(avgRewardPoints[networkId - 1], selValidator['reward_point']) >= 95 && selValidator['reward_point'] > 1000) {
                        //to prevent event spamming, check if this is the first warning in the past 24hrs
                        const eventList = await event.getEventsFromToday(validatorId, "low reward points");
                        if (eventList.length == 0) {
                            event.register(val, "low reward points", val.name + " is currently amongst the 5% worst performing validators based on the average reward points on the network.");
                        }
                    }
                }
            }
        } else {
            delete rewardPointTracker[address];
        }
    } else {
        //not tracked yet
        let selValidator = null;

        if(activeNetworkValidators[networkId - 1] != undefined) {
            for (let i = 0; i < activeNetworkValidators[networkId - 1].length; i++) {
                if (activeNetworkValidators[networkId - 1][i]['stash_account_display']['address'] == address) {
                    selValidator = activeNetworkValidators[networkId - 1][i];
                    break;
                }
            }

            if (selValidator != null) {
                rewardPointTracker[address] = [selValidator['reward_point']];
            }
        }
    }
}

async function syncAllValidatorRewards() {
    const validatorList = await validator.getAllValidatorIds();
    if (validatorList.length == 0) {
        console.log("🟠" + "No validators have been added yet");
    } else {
        for (let i = 0; i < validatorList.length; i++) {
            const success = await performRewardSync(validatorList[i].id);

            if (!success) {
                console.log("🔴" + "Syncing error.");
            } else {
                trackValidatorRewardPoints(validatorList[i].id);
            }
        }
    }
}

// This is an asynchronous function that fetches data from subscan API for multiple networks
// and stores the results in two arrays - newActiveNetworkValidators and newWaitingNetworkValidators.
// The function also handles rate limiting by adding a delay between each API call.
async function getNetworkValidators() {
    console.log(data.getDividerLogString());
    console.log("Preparing to fetch network data..");

    let newActiveNetworkValidators = [];
    let newWaitingNetworkValidators = [];

    let error = false;

    // Loops through the network list array and fetches data for each network
    for (let i = 0; i < networkList.length; i++) {

        // Wait for a certain amount of time to make sure the rate limit is not hit before making the API call
        await setTimeout(async function () {
            let res = null;
            let res2 = null;

            if (error == false) {
                // Logs a message indicating which network is being fetched
                console.log(data.getDividerLogString());
                console.log(data.yellowConsoleLog("Fetching") + " active " + networkList[i].name + " validators..");

                // Fetches the active validators for the current network
                res = await subscan.getActiveValidators(networkList[i].name);

                console.log(data.greenConsoleLog("Received") + " active validators");
                console.log(data.yellowConsoleLog("Fetching") + " waiting " + networkList[i].name + " validators..");

                // Fetches the waiting validators for the current network
                res2 = await subscan.getWaitingValidators(networkList[i].name);
                console.log(data.greenConsoleLog("Received") + " waiting validators");
            }

            // If any of the API responses contain an error code or are undefined/null, set the error flag to true
            if (res == null || res.code == undefined || res2.code == undefined || res.code == null || res2.code == null || res.code != 0 || res2.code != 0) {
                error = true;
            } else {
                newActiveNetworkValidators.push(res['data'].list);
                newWaitingNetworkValidators.push(res2['data'].list);
                console.log(data.grayConsoleLog("Pushing") + " " + networkList[i].name + " live validator data to cache..");
            }

            if (i == (networkList.length - 1) && error == false) {
                console.log(data.getDividerLogString());

                activeNetworkValidators = newActiveNetworkValidators;
                waitingNetworkValidators = newWaitingNetworkValidators;

                console.log("🟢" + "Succussfully updated all network data @ " + data.getCurrentTimeString());

                getAverageRewardPoints();

                console.log("Preparing to sync validator rewards..");

                syncAllValidatorRewards();
            } else if (error == true) {
                console.log(data.getDividerLogString());

                if (res == null || res.code == 20008) {
                    console.log("🟠" + " No subscan API key has been configured yet");
                } else {
                    console.log("🔴" + "Error occurred fetching network, preserving previous data @ " + data.getCurrentTimeString());
                }
            }
        }, 5000 * i);
    }
}

// This function performs a sync between local rewards data and Subscan's API data for a given validator ID
async function performRewardSync(validatorId) {
    isSyncing = true;

    // First, retrieve validator data using its ID
    const validatorData = await validator.getValidatorById(validatorId);

    // If the validator data is undefined, exit the function and return false
    if (validatorData == undefined) {
        isSyncing = false;
        return false;
    }

    console.log(data.getDividerLogString());
    console.log(data.yellowConsoleLog("Started sync") + " for validator " + validatorData.address);

    // Retrieve all rewards for this validator and store them in a cache for later use
    const rewardData = await reward.getAllRewardsFromValidatorAsync(validatorId);
    var rewardHashCache = {};
    rewardData.forEach(function (reward) {
        rewardHashCache[reward.hash] = reward.id;
    });

    // Get the network data for this validator
    const networkData = await network.getNetworkFromId(validatorData.networkId);

    // Get all events for this validator's address
    let eventData = await subscan.getValidatorEvents(networkData.name, validatorData.address, 0);

    // If there was an error retrieving events, return false
    if (eventData.code != 0) {
        isSyncing = false;
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
        console.log("🟢" + "Already synced");
        isSyncing = false;
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

    isSyncing = false;

    // Return true to indicate the sync was successfu
    return true;
}

// This function processes a list of rewards and returns a new count of locally stored rewards
async function processRewardList(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount) {
    return new Promise(async (resolve) => {
        for (let i = 0; i < rewardList.length; i++) {
            // Retrieve reward data for each reward in the list
            const rewardAmt = rewardList[i].amount;
            const timestamp = rewardList[i].block_timestamp;
            const hash = rewardList[i].event_index;

            // Check if the reward already exists in the cache, if not add it to the local store and update the count
            const exists = rewardHashCache[hash];

            if (!exists) {
                await reward.add(validatorId, rewardAmt, timestamp, hash);
                locallyStoredRewardCount++;
                console.log(data.greenConsoleLog("Added") + " | " + hash);
            }
        }

        // Resolve the promise with the new count of locally stored rewards
        resolve(locallyStoredRewardCount);
    });
}

async function findValidatorNameByAddress(network, address) {
    let networkId = null;
    let name = null;

    for(let i = 0; i < networkList.length; i++) {
        if(networkList[i].name == network) {
            networkId = i;
            break;
        }
    }

    if(networkId != null && activeNetworkValidators.length != 0 && waitingNetworkValidators.length != 0) {
        for(let i = 0; i < activeNetworkValidators[networkId].length; i++) {
            if(activeNetworkValidators[networkId][i]['stash_account_display']['address'] == address) {
                if(activeNetworkValidators[networkId][i]['stash_account_display']['parent'] != null) {
                    name = activeNetworkValidators[networkId][i]['stash_account_display']['parent']['display'] + " " + activeNetworkValidators[networkId][i]['stash_account_display']['parent']['sub_symbol'];
                } else if(activeNetworkValidators[networkId][i]['stash_account_display']['display'] != null) {
                    name = activeNetworkValidators[networkId][i]['stash_account_display']['display'];
                }
                break;
            }
        }
        if(name == null) {
            for(let i = 0; i < waitingNetworkValidators[networkId].length; i++) {
                if(waitingNetworkValidators[networkId][i]['stash_account_display']['address'] == address) {
                    if(waitingNetworkValidators[networkId][i]['stash_account_display']['parent'] != null) {
                        name = waitingNetworkValidators[networkId][i]['stash_account_display']['parent']['display'] + " " + waitingNetworkValidators[networkId][i]['stash_account_display']['parent']['sub_symbol'];
                    } else if(waitingNetworkValidators[networkId][i]['stash_account_display']['display'] != null) {
                        name = waitingNetworkValidators[networkId][i]['stash_account_display']['display'];
                    }
                    break;
                }
            }
        }

        return name;
    } else {
        return null;
    }
}

function getNetworkEraData(name) {
    return networkEraProgress[name];
}

function getPolkadot1kvData() {
    return polkadot1kvData;
}

function getKusama1kvData() {
    return kusama1kvData;
}

module.exports = {
    periodicNetworkCheck,
    updateNetworkList,
    getValidatorStatus,
    performRewardSync,
    getNetworkEraData,
    thousandValidatorCheck,
    getPolkadot1kvData,
    getKusama1kvData,
    findValidatorNameByAddress
};