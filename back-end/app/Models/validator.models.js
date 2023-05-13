const createValidatorTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS validator (
        id integer PRIMARY KEY AUTOINCREMENT,
        name varchar,
        address varchar UNIQUE,
        networkId integer,
        userId integer,
        FOREIGN KEY(userId) REFERENCES user(id),
        FOREIGN KEY(networkId) REFERENCES network(id))`;

    return database.run(sqlQuery);
}

createValidatorTable();

const add = (data, cb) => {
    return database.run('INSERT INTO validator (name, address, networkId, userId) VALUES (?,?,?,?)', data, (err) => {
        cb(err)
    });
}

const remove = (data, cb) => {
    return database.run('DELETE FROM validator WHERE id = ? AND userId = ?', data, (err) => {
        cb(err)
    });
}

const updateName = (data, cb) => {
    return database.run('UPDATE validator SET name = ? WHERE id = ? AND userId = ?', data, (err) => {
        cb(err)
    });
}

const getList = async (data, cb) => {
    return database.all('SELECT * FROM validator WHERE userId = ?', data, async (err, row) => {
        for(let i = 0; i < row.length; i++) {
            const nominatorHistory = await validatorService.getNominationHistory(row[i].id);
            const valData = validatorService.getValidatorStatus(row[i].networkId, row[i].address);

            row[i].details = (valData);
            row[i].nominatorHistory = nominatorHistory;
        }
        cb(err, row)
    });
}

const getAllValidatorIds = (cb) => {
    return database.all('SELECT id FROM validator', (err, row) => {
        cb(err, row)
    });
}

const getValidatorById = (data, cb) => {
    return database.get('SELECT * FROM validator WHERE id = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    remove,
    getList,
    getValidatorById,
    getAllValidatorIds,
    updateName
};