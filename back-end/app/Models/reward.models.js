const createRewardTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS reward (
        id integer PRIMARY KEY AUTOINCREMENT,
        validatorId integer,
        amount integer,
        timestamp integer,
        hash varchar,
        FOREIGN KEY(validatorId) REFERENCES validator(id))`;

    return database.run(sqlQuery);
}

createRewardTable();

const add = (data, cb) => {
    return database.run('INSERT INTO reward (validatorId, amount, timestamp, hash) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const getAllRewardsFromValidator = (data, cb) => {
    return database.all('SELECT * FROM reward WHERE validatorId = ?', data, (err, row) => {
        cb(err, row)
    });
}

//timestamp = unixtime
const getRewardsFromValidatorInPeriod = (data, cb) => {
    return database.all('SELECT * FROM reward WHERE validatorId = ? AND timestamp BETWEEN ? AND ?', data, (err, row) => {
        cb(err, row)
    });
}

const getWeeklyRewardsFromValidator = (data, cb) => {
    return database.all(`SELECT amount, timestamp, hash FROM reward WHERE timestamp >= strftime('%s', 'now', 'weekday 0', '-7 days') AND timestamp < strftime('%s', 'now', 'weekday 0')  AND validatorId = ?`, data, (err, row) => {
        cb(err, row)
    });
}

const getMonthlyRewardsFromValidator = (data, cb) => {
    return database.all(`SELECT amount, timestamp, hash FROM reward WHERE strftime('%Y-%m', timestamp, 'unixepoch') = strftime('%Y-%m', 'now') AND validatorId = ?`, data, (err, row) => {
        cb(err, row)
    });
}

const getYearlyRewardsFromValidator = (data, cb) => {
    return database.all(`SELECT amount, timestamp, hash FROM reward WHERE strftime('%Y', timestamp, 'unixepoch') = strftime('%Y', 'now') AND validatorId = ?`, data, (err, row) => {
        cb(err, row)
    });
}

//get daily, weekly, monthly and all-time validator income via function
const getValidatorRewardOverview = (validatorId, cb) => {
    return database.all(`SELECT v.id AS validatorId, 'daily' AS period, strftime('%Y-%m-%d', r.timestamp, 'unixepoch') AS date, SUM(r.amount) AS rewards FROM validator v JOIN reward r ON r.validatorId = v.id WHERE v.id = ${validatorId} AND r.timestamp >= strftime('%s', 'now', 'start of day') GROUP BY v.id, date UNION 
    SELECT v.id AS validatorId, 'weekly' AS period, strftime('%Y-%W', r.timestamp, 'unixepoch') AS week, SUM(r.amount) AS rewards FROM validator v JOIN reward r ON r.validatorId = v.id WHERE v.id = ${validatorId} AND r.timestamp >= strftime('%s', 'now', 'weekday 0', '-7 days') AND r.timestamp < strftime('%s', 'now', 'weekday 0') GROUP BY v.id, week  UNION 
    SELECT v.id AS validatorId, 'monthly' AS period, strftime('%Y-%m', r.timestamp, 'unixepoch') AS month, SUM(r.amount) AS rewards FROM validator v JOIN reward r ON r.validatorId = v.id WHERE v.id = ${validatorId} AND r.timestamp >= strftime('%s', 'now', 'start of month') AND r.timestamp < strftime('%s', 'now', 'start of month', '+1 month') GROUP BY v.id, month UNION 
    SELECT v.id AS validatorId, 'all-time' AS period, '' AS time, SUM(r.amount) AS rewards FROM validator v JOIN reward r ON r.validatorId = v.id WHERE v.id = ${validatorId} GROUP BY v.id, time;`, (err, row) => {
        cb(err, row)
    });
}

//get combined per day weekly income
const getCombinedWeeklyRewards = (data, cb) => {
    return database.all(`SELECT v.id AS validatorId, strftime('%Y-%m-%d', r.timestamp, 'unixepoch') AS date, SUM(r.amount) AS daily_rewards FROM validator v JOIN reward r ON r.validatorId = v.id WHERE v.userId = ? AND r.timestamp >= strftime('%s', 'now', 'weekday 0', '-7 days') GROUP BY v.id, date ORDER BY date, v.id;`, data, (err, row) => {
        cb(err, row)
    });
}

const getIncomeDistribution = (data, cb) => {
    return database.all(`SELECT validatorId, validator.networkId, SUM(amount) AS totalEarned FROM reward JOIN validator ON validatorId = validator.id WHERE userId = ? GROUP BY validatorId`, data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    getAllRewardsFromValidator,
    getRewardsFromValidatorInPeriod,
    getWeeklyRewardsFromValidator,
    getMonthlyRewardsFromValidator,
    getYearlyRewardsFromValidator,
    getCombinedWeeklyRewards,
    getValidatorRewardOverview,
    getIncomeDistribution
};