const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = "bWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRjb1ZNRGpoVWFNSEFwdWmlh";
const database = new sqlite3.Database("./database.db");

function getSubscanApiKey() {
    return null;
}

module.exports = {
    database,
    getSubscanApiKey,
    JWT_SECRET
};