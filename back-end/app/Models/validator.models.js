const config = require("../config/config");

const createValidatorTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS validator (
        id integer PRIMARY KEY AUTOINCREMENT,
        address varchar UNIQUE,
        networkId integer,
        userId integer)`;

    return config.database.run(sqlQuery);
}

createValidatorTable();

const create = (data, cb) => {
    return database.run('INSERT INTO validator (address, networkId, userId) VALUES (?,?,?)', data, (err) => {
        cb(err)
    });
}