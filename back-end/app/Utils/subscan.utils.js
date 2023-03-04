const config = require('../Config/config');
const dataUtil = require('./data.utils');

function getPolkadotEra() {
    dataUtil.getDataByKey('https://polkadot.api.subscan.io/api/scan/metadata', config.getSubscanApiKey())
        .then(data => {
            data = data['data'];
            const eraProcess = data.eraProcess;
            const eraLength = data.eraLength;

            return { "eraProcess": eraProcess, "eraLength": eraLength };
        });
}

function getKusamaEra() {
    dataUtil.getDataByKey('https://kusama.api.subscan.io/api/scan/metadata', config.getSubscanApiKey())
        .then(data => {
            data = data['data'];
            const eraProcess = data.eraProcess;
            const eraLength = data.eraLength;

            return { "eraProcess": eraProcess, "eraLength": eraLength };
        });
}

module.exports = {
    getPolkadotEra,
    getKusamaEra
};