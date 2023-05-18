const dataUtil = require('./data.utils');

async function getEra(networkName) {
    return new Promise((resolve) => {
        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/scan/metadata', {
            "row": 1
        }, SUBSCAN_APIKEY)
        .then(data => {
            resolve(data);
        });
    });
}

async function getPool(networkName) {
    return new Promise((resolve) => {
        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/scan/nomination_pool/pools', {
            "row": 1
        }, SUBSCAN_APIKEY)
        .then(data => {
            resolve(data);
        });
    });
}

async function getActiveValidators(networkName) {
    return new Promise((resolve) => {
        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/scan/staking/validators', {
        "key": 20
    }, SUBSCAN_APIKEY)
        .then(data => {
            resolve(data);
        });
    });
}

async function getWaitingValidators(networkName) {
    return new Promise((resolve) => {
        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/scan/staking/waiting', {
        "row": 1
    }, SUBSCAN_APIKEY)
        .then(data => {
            resolve(data);
        });
    });
}

async function getValidatorDetails(networkName, validatorAddress) {
    return new Promise((resolve) => {

        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/v2/scan/search', {
            "key": validatorAddress
        }, SUBSCAN_APIKEY)
            .then(data => {
                resolve(data);
            });
    });
}

//This API is only available in Polkadot, Kusama, Westend network
async function getValidatorEvents(networkName, validatorAddress, page) {
    return new Promise((resolve) => {
        dataUtil.postData('https://' + networkName + '.api.subscan.io/api/v2/scan/account/reward_slash', {
        "row": 100,
        "page": page,
        "address": validatorAddress
    }, SUBSCAN_APIKEY)
        .then(data => {
            resolve(data);
        });
    });
}

module.exports = {
    getEra,
    getPool,
    getActiveValidators,
    getValidatorDetails,
    getValidatorEvents,
    getWaitingValidators
};