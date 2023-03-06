const subscan = require("../Utils/subscan.utils");
const validator = require("../Controllers/validator.controllers");
const reward = require("../Controllers/reward.controllers");
const network = require("../Controllers/network.controllers");

//network object keeping track of all active validators per network
//loop through all validators in list, if address matches a tracked validator mark the reward points in temp. array.
// write function which takes all reward points and returns an average. If monitored validator is heavily under average shoot performance alert

async function performRewardSync(validatorId) {
    const validatorData = await validator.getValidatorById(validatorId);

    if(validatorData == undefined) {
        return false;
    }

    const rewardData = await reward.getAllRewardsFromValidatorAsync(validatorId);
    var rewardHashCache = {};
    rewardData.forEach(function(reward){
        rewardHashCache[reward.hash] = reward.id
    });

    const networkData = await network.getNetworkFromId(validatorData.networkId);

    let  eventData = await subscan.getValidatorEvents(networkData.name, validatorData.address, 0);

    if(eventData.code != 0) {
        return false;
    } else {
        eventData = eventData.data;
    }

    let rewardList = eventData.list;

    let realtimeRewardCount = eventData.count;
    let locallyStoredRewardCount = rewardData.length;

    if(realtimeRewardCount == locallyStoredRewardCount) {
        return true;
    }

    for(let i = 0; i < Math.ceil(realtimeRewardCount / 100); i++) {
        if(i > 0) {
            eventData = await subscan.getValidatorEvents(networkData.name, validatorData.address, i);
            rewardList = eventData['data'].list;
        }
        const newLocalStoreCount = await processRewardListSync(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount)
        if(realtimeRewardCount == newLocalStoreCount) {
            break;
        }
    }
}

async function processRewardListSync(validatorId, rewardList, rewardHashCache, locallyStoredRewardCount) {
    return new Promise(async (resolve) => {
        for(let i = 0; i < rewardList.length; i++) {
            const rewardAmt = rewardList[i].amount;
            const timestamp = rewardList[i].block_timestamp;
            const hash = rewardList[i].extrinsic_index;
    
            const exists = rewardHashCache[hash];
    
            if(!exists) {
                await reward.add(validatorId, rewardAmt, timestamp, hash);
                locallyStoredRewardCount++;
            }
        }
    
        resolve(locallyStoredRewardCount);
    });
}

module.exports = {
    performRewardSync
};