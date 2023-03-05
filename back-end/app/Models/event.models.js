

const createEventTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS event (
        id integer PRIMARY KEY AUTOINCREMENT,
        validatorId integer,
        eventType varchar,
        description varchar,
        timestamp integer,
        FOREIGN KEY(validatorId) REFERENCES validator(id))`;

    return database.run(sqlQuery);
}

createEventTable();

const add = (data, cb) => {
    return database.run('INSERT INTO event (validatorId, eventType, description, timestamp) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const getEvents = (data, cb) => {
    return database.all('SELECT * FROM event WHERE validatorId = ?', data, (err, row) => {
        cb(err, row)
    });
}

const remove = (data, cb) => {
    return database.run('DELETE FROM event WHERE id = ? AND validatorId = ?', data, (err) => {
        cb(err)
    });
}

module.exports = {
    add,
    getEvents,
    remove
};