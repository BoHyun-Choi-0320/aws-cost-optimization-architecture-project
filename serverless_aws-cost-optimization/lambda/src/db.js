// lambda/src/db.js
const { Pool } = require("pg");
const dbConfig = require("./config/dbConfig");

// Lambda 컨테이너 재사용을 위해 모듈 레벨에서 Pool 한 번만 생성
const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
