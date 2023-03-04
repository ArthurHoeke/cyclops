const config = require("../config/config");

const createRewardTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS reward (
        id integer PRIMARY KEY AUTOINCREMENT,
        validatorId integer,
        amount integer,
        timestamp datetime,
        hash varchar)`;

    return config.database.run(sqlQuery);
}

createRewardTable();