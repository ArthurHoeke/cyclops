const createConfigTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS config (
        subscanApiKey varchar,
        smtpHost varchar,
        smtpPort integer,
        smtpUsername varchar,
        smtpPassword varchar,
        jwtSecret varchar NOT NULL)`;

    return database.run(sqlQuery);
}

const setupConfigRow = (data) => {
    database.run('INSERT INTO config (jwtSecret) VALUES (?)', data);
}

createConfigTable();

const setSMTP = (data, cb) => {
    return database.run('UPDATE config SET smtpHost = ?, smtpPort = ?, smtpUsername = ?, smtpPassword = ?', data, (err, row) => {
        cb(err, row)
    });
}

const setSubscanApiKey = (data, cb) => {
    return database.run('UPDATE config SET subscanApiKey = ?', data, (err) => {
        cb(err)
    });
}

const getConfig = (cb) => {
    return database.get('SELECT * FROM config', (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    setSMTP,
    setSubscanApiKey,
    getConfig,
    setupConfigRow
};