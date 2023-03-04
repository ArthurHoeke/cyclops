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

const create = (data, cb) => {
    return config.database.run('INSERT INTO user (email, password, role, accessToken) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const getPasswordByEmail = (data, cb) => {
    return config.database.get('SELECT password FROM user WHERE email = ?', data, (err, row) => {
        cb(err, row)
    });
}

const updateAccessToken = (data, cb) => {
    return config.database.run('UPDATE user SET accessToken = ? WHERE email = ?', data, (err) => {
        cb(err)
    });
}

module.exports = {
    create,
    getPasswordByEmail,
    updateAccessToken
};
