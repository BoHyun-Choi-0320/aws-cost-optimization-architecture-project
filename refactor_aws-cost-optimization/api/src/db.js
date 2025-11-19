// api/src/db.js
const { Pool } = require("pg");
const dbConfig = require("./config/dbConfig"); // 경로 주의

const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
