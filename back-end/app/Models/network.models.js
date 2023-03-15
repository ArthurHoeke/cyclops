const createNetworkTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS network (
        id integer PRIMARY KEY AUTOINCREMENT,
        name varchar UNIQUE,
        ticker varchar UNIQUE,
        icon varchar);`;

    database.run(sqlQuery);
    addDefaultNetwork();
}

const addDefaultNetwork = () => {
    const sqlQuery = `
        INSERT OR IGNORE INTO network (name, ticker, icon) VALUES ('polkadot', 'dot', 'data:image/png;base64,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');
        `;

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