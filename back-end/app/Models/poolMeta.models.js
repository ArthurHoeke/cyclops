const createPoolMetaTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS poolMeta (
        poolId integer,
        networkId integer,
        totalBond integer,
        memberCount integer,
        pendingRewards integer,
        timestamp integer,
        FOREIGN KEY(poolId) REFERENCES pool(id))`;

    return database.run(sqlQuery);
}

createPoolMetaTable();

const add = (data, cb) => {
    const [poolId, networkId, totalBond, memberCount, pendingRewards, timestamp] = data;
    const query = `
      INSERT INTO poolMeta (poolId, networkId, totalBond, memberCount, pendingRewards, timestamp)
      SELECT ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM poolMeta
        WHERE poolId = ?
        AND networkId = ?
        AND totalBond = ?
        AND memberCount = ?
        AND pendingRewards = ?
        AND DATE(timestamp, 'unixepoch', 'localtime') = DATE((SELECT timestamp FROM poolMeta WHERE poolId = ? ORDER BY timestamp DESC LIMIT 1), 'unixepoch', 'localtime')
      )
    `;
    const params = [poolId, networkId, totalBond, memberCount, pendingRewards, timestamp, poolId, networkId, totalBond, memberCount, pendingRewards, poolId];

    return database.run(query, params, (err) => {
        cb(err);
    });
};

const getPoolMetaFromPoolId = (data, cb) => {
    return database.all('SELECT totalBond, memberCount, pendingRewards, timestamp FROM poolMeta WHERE poolId = ? AND networkId = ? ORDER BY timestamp DESC LIMIT 100', data, (err, row) => {
        cb(err, row)
    });
}

const deleteAllMeta = (data, cb) => {
    return database.all('DELETE FROM poolMeta WHERE poolId = ? AND networkId = ?', data, (err, row) => {
        cb(err, row)
    });
}

module.exports = {
    add,
    getPoolMetaFromPoolId,
    deleteAllMeta
};