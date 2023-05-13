const createNominationTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS nominator (
        validatorId integer,
        nominationCount integer,
        timestamp integer)`;

    return database.run(sqlQuery);
}

createNominationTable();

const add = (data, cb) => {
    const [validatorId, nominationCount, timestamp] = data;
    const query = `
      INSERT INTO nominator (validatorId, nominationCount, timestamp)
      SELECT ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM nominator
        WHERE validatorId = ?
        AND nominationCount = ?
        AND DATE(timestamp, 'unixepoch', 'localtime') = DATE((SELECT timestamp FROM nominator WHERE validatorId = ? ORDER BY timestamp DESC LIMIT 1), 'unixepoch', 'localtime')
      )
    `;
    const params = [validatorId, nominationCount, timestamp, validatorId, nominationCount, validatorId];

    return database.run(query, params, (err) => {
        cb(err);
    });
};

const getNominationHistoryFromValidator = (data, cb) => {
    return database.all('SELECT nominationCount, timestamp FROM nominator WHERE validatorId = ? ORDER BY timestamp DESC', data, (err, row) => {
        cb(err, row)
    });
}

const deleteAllNominations = (data, cb) => {
    return database.all('DELETE FROM nominator WHERE validatorId = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    getNominationHistoryFromValidator,
    deleteAllNominations
};