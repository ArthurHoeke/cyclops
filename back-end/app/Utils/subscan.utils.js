const dataUtil = require('./data.utils');

function getEra(networkName) {
    dataUtil.getDataByKey('https://' + networkName + '.api.subscan.io/api/scan/metadata', subscanApiKey)
        .then(data => {
            data = data['data'];
            const eraProcess = data.eraProcess;
            const eraLength = data.eraLength;

            return { "eraProcess": eraProcess, "eraLength": eraLength };
        });
}

function getActiveValidators(networkName) {
    dataUtil.postData('https://' + networkName + '.api.subscan.io/api/scan/staking/validators', {
        "key": 20
    }, subscanApiKey)
        .then(data => {
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
            return data;
        });
}

function getValidatorDetails(networkName, validatorAddress) {
    dataUtil.postData('https://' + networkName + '.api.subscan.io/api/v2/scan/search', {
        "key": validatorAddress
    }, subscanApiKey)
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
            return data;
        });
}

//This API is only available in Polkadot, Kusama, Westend network
function getValidatorEvents(networkName, validatorAddress, page) {
    dataUtil.postData('https://' + networkName + '.api.subscan.io/api/v2/scan/account/reward_slash', {
        "row": 100,
        "page": page,
        "address": validatorAddress
    }, subscanApiKey)
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
            return data;
        });
}

module.exports = {
    getPolkadotEra,
    getKusamaEra
};