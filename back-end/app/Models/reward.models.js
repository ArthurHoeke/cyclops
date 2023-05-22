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
    return database.all('SELECT amount, timestamp, hash, id FROM reward WHERE validatorId = ? ORDER BY timestamp DESC', data, (err, row) => {
        cb(err, row)
    });
}

const deleteAllRewards = (data, cb) => {
    return database.all('DELETE FROM reward WHERE reward.id IN (SELECT reward.id FROM reward JOIN validator ON validatorId = validator.id WHERE validatorId = ? AND validator.userId = ?)', data, (err, row) => {
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
    return database.all(`SELECT 
    strftime('%w', datetime(timestamp, 'unixepoch', 'localtime')) AS weekday,
    SUM(amount) AS total_amount
FROM reward
WHERE validatorId = ? 
  AND strftime('%Y-%W', datetime(timestamp, 'unixepoch', 'localtime')) = strftime('%Y-%W', 'now', 'localtime')
GROUP BY weekday;`, data, (err, row) => {
        cb(err, row)
    });
}

const getMonthlyRewardsFromValidator = (data, cb) => {
    return database.all(`SELECT 
    strftime('%m', datetime(timestamp, 'unixepoch')) AS month,
    SUM(amount) AS total_reward
FROM 
    reward
WHERE 
    validatorId = ? 
    AND strftime('%Y', datetime(timestamp, 'unixepoch')) = strftime('%Y', 'now')
GROUP BY 
    month;
`, data, (err, row) => {
        cb(err, row)
    });
}

const getYearlyRewardsFromValidator = (data, cb) => {
    return database.all(`SELECT amount, timestamp, hash FROM reward WHERE strftime('%Y', timestamp, 'unixepoch') = strftime('%Y', 'now') AND validatorId = ?`, data, (err, row) => {
        cb(err, row)
    });
}

const getMonthlyRewardReportFromValidator = (data, cb) => {
    return database.all(`SELECT amount, timestamp, hash FROM reward WHERE validatorId = ? AND strftime('%Y-%m', datetime(timestamp, 'unixepoch', 'localtime')) = ? ORDER BY timestamp ASC`, data, (err, row) => {
        cb(err, row)
    });
}

//get daily, weekly, monthly and all-time validator income via function
const getValidatorRewardOverview = (validatorId, cb) => {
    return database.all(`SELECT 
    SUM(amount) AS allTime,
    SUM(CASE WHEN strftime('%Y-%m', timestamp, 'unixepoch', 'localtime') = strftime('%Y-%m', 'now') THEN amount ELSE 0 END) AS monthly,
    SUM(CASE WHEN strftime('%W', timestamp, 'unixepoch', 'localtime') = strftime('%W', 'now') THEN amount ELSE 0 END) AS weekly,
    SUM(CASE WHEN strftime('%Y-%m-%d', timestamp, 'unixepoch', 'localtime') = strftime('%Y-%m-%d', 'now') THEN amount ELSE 0 END) AS daily
FROM
    reward
WHERE
    validatorId = ${validatorId};`, (err, row) => {
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
    getIncomeDistribution,
    getMonthlyRewardReportFromValidator,
    deleteAllRewards
};