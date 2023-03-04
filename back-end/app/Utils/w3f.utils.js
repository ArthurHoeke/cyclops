const data = require('./data.utils');

function getPolkadot1kvData() {
    data.getData('https://polkadot.w3f.community/candidates')
        .then(data => {
            return data;
    });
}

function getKusama1kvData() {
    data.getData('https://kusama.w3f.community/candidates')
        .then(data => {
            return data;
    });
}

module.exports = {
    getPolkadot1kvData,
    getKusama1kvData
};