const config = require("../config/config");

const createEventTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS event (
        id integer PRIMARY KEY AUTOINCREMENT,
        validatorId integer,
        eventType varchar,
        description varchar,
        timestamp datetime,
        FOREIGN KEY(validatorId) REFERENCES validator(id))`;

    return config.database.run(sqlQuery);
}

createEventTable();