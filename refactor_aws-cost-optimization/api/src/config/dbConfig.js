// api/src/config/dbConfig.js
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const dbConfig = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  // RDS SSL 접속
  ssl: {
    rejectUnauthorized: false, // 개발용: RDS 인증서 검증은 생략
  },
};

module.exports = dbConfig;
