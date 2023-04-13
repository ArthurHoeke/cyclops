const data = require('./data.utils');

async function getPolkadot1kvData() {
    try {
        const val = await data.getData('https://polkadot.w3f.community/candidates');
        return val;
    } catch {
        return false;
    }
}

async function getKusama1kvData() {
    try {
        const val = await data.getData('https://kusama.w3f.community/candidates');
        return val;
    } catch {
        return false;
    }
}

module.exports = {
    getPolkadot1kvData,
    getKusama1kvData
};