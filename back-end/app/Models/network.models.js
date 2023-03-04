const config = require("../config/config");

const createNetworkTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS network (
        id integer PRIMARY KEY AUTOINCREMENT,
        name varchar UNIQUE,
        ticker varchar UNIQUE)`;

    return config.database.run(sqlQuery);
}

createNetworkTable();