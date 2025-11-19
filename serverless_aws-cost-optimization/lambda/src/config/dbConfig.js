// lambda/src/config/dbConfig.js
const path = require("path");
const dotenv = require("dotenv");

// 로컬 테스트용: .env 읽기
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const dbConfig = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  // RDS / Aurora Serverless SSL 환경 고려
  ssl:
    process.env.PGSSL === "true"
      ? { rejectUnauthorized: false }
      : false,
};

module.exports = dbConfig;
