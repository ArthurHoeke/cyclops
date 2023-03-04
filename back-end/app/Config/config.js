const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database("./database.db");

function getSubscanApiKey() {
    return null;
}

module.exports = {
    database,
    getSubscanApiKey
};