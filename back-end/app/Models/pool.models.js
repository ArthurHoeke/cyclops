const createPoolTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS pool (
        id integer PRIMARY KEY,
        networkId integer,
        userId integer,
        name varchar,
        FOREIGN KEY(userId) REFERENCES user(id),
        FOREIGN KEY(networkId) REFERENCES network(id))`;

    return database.run(sqlQuery);
}

createPoolTable();

const create = (data, cb) => {
    return database.run('INSERT INTO pool (id, networkId, userId, name) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const getAllPools = (cb) => {
    return database.all('SELECT * FROM pool', (err, data) => {
        cb(err, data)
    });
}

const getUserPools = (data, cb) => {
    return database.all('SELECT id, networkId, name FROM pool WHERE userId = ?', data, (err, row) => {
        cb(err, row)
    });
}

const deletePool = (data, cb) => {
    return database.all('DELETE FROM pool WHERE id = ? AND userId = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    create,
    getUserPools,
    deletePool,
    getAllPools
};