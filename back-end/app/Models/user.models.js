const config = require("../config/config");

const createUserTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS user (
        id integer PRIMARY KEY AUTOINCREMENT,
        email varchar UNIQUE,
        password varchar,
        role integer,
        accessToken varchar)`;

    return config.database.run(sqlQuery);
}

createUserTable();