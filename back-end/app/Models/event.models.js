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

const get = (data, cb) => {
    return database.all('SELECT * FROM event WHERE validatorId = ?', data, (err, row) => {
        cb(err, row)
    });
}

const all = (data, cb) => {
    return database.all('SELECT event.id AS eventId, validatorId, name, eventType, description, timestamp FROM event JOIN validator ON event.validatorId = validator.id WHERE validator.userId = ?', data, (err, row) => {
        cb(err, row)
    });
}

const remove = (data, cb) => {
    return database.run('DELETE FROM event WHERE id = ?', data, (err) => {
        cb(err)
    });
}

const getEventsFromToday = (data, cb) => {
    return database.all('SELECT * FROM event WHERE validatorId = ? AND datetime(timestamp, "unixepoch", "localtime") >= datetime("now", "-24 hours") AND eventType = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    get,
    all,
    remove,
    getEventsFromToday
};