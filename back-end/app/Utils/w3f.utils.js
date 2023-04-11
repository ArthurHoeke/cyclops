const data = require('./data.utils');

async function getPolkadot1kvData() {
    await data.getData('https://polkadot.w3f.community/candidates')
        .then(data => {
            return data;
    });
}

async function getKusama1kvData() {
    await data.getData('https://kusama.w3f.community/candidates')
        .then(data => {
            return data;
    });
}

module.exports = {
    getPolkadot1kvData,
    getKusama1kvData
};