const config = require("../config/config");

const createRewardTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS reward (
        id integer PRIMARY KEY AUTOINCREMENT,
        validatorId integer,
        amount integer,
        timestamp varchar,
        hash varchar,
        FOREIGN KEY(validatorId) REFERENCES validator(id))`;

    return config.database.run(sqlQuery);
}

createRewardTable();

const add = (data, cb) => {
    return config.database.run('INSERT INTO reward (validatorId, amount, timestamp, hash) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const getAllRewardsFromValidator = (data, cb) => {
    return config.database.all('SELECT * FROM reward WHERE validatorId = ?', data, (err, row) => {
        cb(err, row)
    });
}

//timestamp = unixtime
const getRewardsFromValidatorInPeriod = (data, cb) => {
    return config.database.all('SELECT * FROM reward WHERE validatorId = ? AND timestamp BETWEEN ? AND ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod
};