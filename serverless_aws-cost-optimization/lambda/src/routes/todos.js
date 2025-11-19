// lambda/src/routes/todos.js
const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/todos
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, completed, due_date AS \"dueDate\" FROM todos ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/todos 에러:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/todos
router.post("/", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }

    const result = await db.query(
      `INSERT INTO todos (title, due_date)
       VALUES ($1, $2)
       RETURNING id, title, completed, due_date AS "dueDate"`,
      [title.trim(), dueDate || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/todos 에러:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH /api/todos/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, completed, dueDate } = req.body;

    if (!id) {
      return res.status(400).json({ message: "invalid id" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (typeof title === "string") {
      fields.push(`title = $${idx++}`);
      values.push(title.trim());
    }
    if (typeof completed === "boolean") {
      fields.push(`completed = $${idx++}`);
      values.push(completed);
    }
    if (typeof dueDate !== "undefined") {
      fields.push(`due_date = $${idx++}`);
      values.push(dueDate || null);
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ message: "no fields to update" });
    }

    values.push(id);

    const result = await db.query(
      `
      UPDATE todos
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING id, title, completed, due_date AS "dueDate"
      `,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PATCH /api/todos/:id 에러:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await db.query("DELETE FROM todos WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/todos/:id 에러:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
