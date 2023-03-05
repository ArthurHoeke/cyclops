const config = require("../Models/config.models");

const setSMTP = async (req, res) => {
    const smtpHost = req.body.smtpHost;
    const smtpPort = req.body.smtpPort;
    const smtpUsername = req.body.smtpUsername;
    const smtpPassword = req.body.smtpPassword;

    if(smtpHost == null || smtpPort == null || smtpUsername == null || smtpPassword == null) {
        config.setSMTP([smtpHost, smtpPort, smtpUsername, smtpPassword], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                SMTP_HOST = smtpHost;
                SMTP_PORT = smtpPort;
                SMTP_USERNAME = smtpUsername;
                SMTP_PASSWORD = smtpPassword;

                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

const setSubscanApiKey = async (req, res) => {
    const subscanApiKeyVar = req.body.subscanApiKey;
    if(subscanApiKeyVar != null) {
        config.setSubscanApiKey([subscanApiKeyVar], (err, data) => {
            if (err) {
                res.sendStatus(500);
            } else {
                SUBSCAN_APIKEY = subscanApiKeyVar;
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(400);
    }
};

module.exports = {
    setSMTP,
    setSubscanApiKey
};