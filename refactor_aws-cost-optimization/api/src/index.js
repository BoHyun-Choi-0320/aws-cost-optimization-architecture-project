// api/src/index.js
const express = require("express");
const cors = require("cors");
const todoRouter = require("./routes/todos");

const app = express();

// CORS: 웹이 S3, EC2 등 다른 도메인에 있어도 호출 가능하게
app.use(
  cors({
    origin: "*", // 나중에 S3 도메인으로 제한 가능
  })
);

// JSON body 파싱
app.use(express.json());

// 헬스 체크
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Todo CRUD 라우터
app.use("/api/todos", todoRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});
