const createNetworkTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS network (
        id integer PRIMARY KEY AUTOINCREMENT,
        name varchar UNIQUE,
        ticker varchar UNIQUE,
        icon varchar)`;

    return database.run(sqlQuery);
}

createNetworkTable();

const create = (data, cb) => {
    return database.run('INSERT INTO network (name, ticker, icon) VALUES (?,?,?)', data, (err) => {
        cb(err)
    });
}

const remove = (data, cb) => {
    return database.run('DELETE FROM network WHERE id = ?', data, (err) => {
        cb(err)
    });
}

const getList = (cb) => {
    return database.all('SELECT * FROM network', (err, data) => {
        cb(err, data)
    });
}

const getNetworkFromId = (data, cb) => {
    return database.get('SELECT * FROM network WHERE id = ?', data, (err, row) => {
        cb(err, row)
    });
}

const getTokenNames = (cb) => {
    return database.all('SELECT name FROM network ORDER BY id', (err, data) => {
        cb(err, data)
    });
}

module.exports = {
    create,
    remove,
    getList,
    getNetworkFromId,
    getTokenNames
};