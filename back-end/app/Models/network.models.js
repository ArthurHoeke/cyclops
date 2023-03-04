const config = require("../config/config");

const createNetworkTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS network (
        id integer PRIMARY KEY AUTOINCREMENT,
        name varchar UNIQUE,
        ticker varchar UNIQUE,
        icon varchar)`;

    return config.database.run(sqlQuery);
}

createNetworkTable();

const create = (data, cb) => {
    return config.database.run('INSERT INTO network (name, ticker, icon) VALUES (?,?,?)', data, (err) => {
        cb(err)
    });
}

const remove = (data, cb) => {
    return config.database.run('DELETE FROM network WHERE id = ?', data, (err) => {
        cb(err)
    });
}

module.exports = {
    create,
    remove
};