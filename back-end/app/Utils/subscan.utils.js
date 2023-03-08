const dataUtil = require('./data.utils');

async function getEra(networkName) {
    return new Promise((resolve) => {
        dataUtil.getDataByKey('https://' + networkName + '.api.subscan.io/api/scan/metadata', SUBSCAN_APIKEY)
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
                // "account": {
                //     "account_display": {
                //         "address": "15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5",
                //             "display": "🌐 decentraDOT.com 🌐",
                //                 "identity": true,
                //                     "judgements": [
                //                         {
                //                             "index": 0,
                //                             "judgement": "Reasonable"
                //                         }
                //                     ]
                //     },
                //     "address": "15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5",
                //         "assets_tag": null,
                //             "balance": "7505.3404027903",
                //                 "balance_lock": "7337.0734471036",
                //                     "bonded": "73370734471036",
                //                         "count_extrinsic": 117,
                //                             "democracy_lock": "50579921000000",
                //                                 "derive_token": { },
                //     "display": "🌐 decentraDOT.com 🌐",
                //         "election_lock": "60000000000000",
                //             "email": "admin@decentradot.com",
                //                 "evm_account": "",
                //                     "is_council_member": false,
                //                         "is_erc20": false,
                //                             "is_erc721": false,
                //                                 "is_evm_contract": false,
                //                                     "is_fellowship_member": false,
                //                                         "is_module_account": false,
                //                                             "is_registrar": false,
                //                                                 "is_techcomm_member": false,
                //                                                     "judgements": [
                //                                                         {
                //                                                             "index": 0,
                //                                                             "judgement": "Reasonable"
                //                                                         }
                //                                                     ],
                //                                                         "legal": "",
                //                                                             "lock": "7337.0734471036",
                //                                                                 "multisig": { },
                //     "nonce": 117,
                //         "proxy": { },
                //     "registrar_info": null,
                //         "reserved": "1614390000000",
                //             "riot": "",
                //                 "role": "",
                //                     "staking_info": {
                //         "controller": "1e51LfMpHfvfa1cm6YAj7GThvV7bLjaRSiqEooTSgKVTcer",
                //             "controller_display": {
                //             "address": "1e51LfMpHfvfa1cm6YAj7GThvV7bLjaRSiqEooTSgKVTcer"
                //         },
                //         "reward_account": "stash"
                //     },
                //     "stash": "",
                //         "substrate_account": null,
                //             "twitter": "",
                //                 "unbonding": "0",
                //                     "vesting": null,
                //                         "web": "https://decentradot.com"
                // }
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
            // "list": [
            //     {
            //         "era": 1005,
            //         "stash": "15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5",
            //         "account": "15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5",
            //         "validator_stash": "15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5",
            //         "amount": "573355476100",
            //         "block_timestamp": 1677947712,
            //         "event_index": "14505537-1142",
            //         "module_id": "Staking",
            //         "event_id": "Rewarded",
            //         "slash_kton": "0",
            //         "extrinsic_index": "14505537-2",
            //         "invalid_era": false
            //     },
            // ]
            resolve(data);
        });
    });
}

module.exports = {
    getEra,
    getActiveValidators,
    getValidatorDetails,
    getValidatorEvents,
    getWaitingValidators
};