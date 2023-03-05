const createValidatorTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS validator (
        id integer PRIMARY KEY AUTOINCREMENT,
        address varchar UNIQUE,
        networkId integer,
        userId integer,
        FOREIGN KEY(userId) REFERENCES user(id),
        FOREIGN KEY(networkId) REFERENCES network(id))`;

    return database.run(sqlQuery);
}

createValidatorTable();

const add = (data, cb) => {
    return database.run('INSERT INTO validator (address, networkId, userId) VALUES (?,?,?)', data, (err) => {
        cb(err)
    });
}

const remove = (data, cb) => {
    return database.run('DELETE FROM validator WHERE id = ? AND userId = ?', data, (err) => {
        cb(err)
    });
}

const getList = (data, cb) => {
    return database.all('SELECT * FROM validator WHERE userId = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    remove,
    getList
};