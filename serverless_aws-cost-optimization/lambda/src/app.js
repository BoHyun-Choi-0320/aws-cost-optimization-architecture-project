// lambda/src/app.js
const express = require("express");
const cors = require("cors");
const todoRouter = require("./routes/todos");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Todo REST API
app.use("/api/todos", todoRouter);

module.exports = app;
