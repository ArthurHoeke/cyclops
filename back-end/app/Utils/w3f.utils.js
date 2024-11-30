const data = require('./data.utils');

async function getPolkadot1kvData() {
    try {
        const val = await data.getData('https://nodes.web3.foundation/api/cohort/1/polkadot');
        return val;
    } catch {
        return false;
    }
}

async function getKusama1kvData() {
    try {
        const val = await data.getData('https://nodes.web3.foundation/api/cohort/1/kusama');
        return val;
    } catch {
        return false;
    }
}

module.exports = {
    getPolkadot1kvData,
    getKusama1kvData
};
