const createUserTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS user (
        id integer PRIMARY KEY AUTOINCREMENT,
        email varchar UNIQUE,
        password varchar,
        role integer)`;

    return database.run(sqlQuery);
}

createUserTable();

const create = (data, cb) => {
    return database.run('INSERT INTO user (email, password, role) VALUES (?,?,?)', data, (err) => {
        cb(err)
    });
}

const getUserCount = (cb) => {
    return database.get('SELECT COUNT(*) AS userCount FROM user', (err, row) => {
        cb(err, row)
    });
}

const getUserIdByEmail = (data, cb) => {
    return database.get('SELECT id FROM user WHERE email = ?', data, (err, row) => {
        cb(err, row)
    });
}

const getUserEmailById = (data, cb) => {
    return database.get('SELECT email FROM user WHERE id = ?', data, (err, row) => {
        cb(err, row)
    });
}

const getUserDataByEmail = (data, cb) => {
    return database.get('SELECT id, password, role FROM user WHERE email = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    create,
    getUserDataByEmail,
    getUserCount,
    getUserIdByEmail,
    getUserEmailById
};
