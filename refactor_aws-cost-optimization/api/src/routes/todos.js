// api/src/routes/todos.js
const express = require("express");
const db = require("../db");

const router = express.Router();

/**
 * JSON 응답용으로 row를 변환
 * - DB: due_date (DATE)
 * - JSON: dueDate (YYYY-MM-DD 또는 null)
 */
function mapTodoRow(row) {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    dueDate: row.due_date ? row.due_date.toISOString().slice(0, 10) : null,
  };
}

/**
 * R: 전체 Todo 조회
 * GET /api/todos
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, title, completed, due_date
      FROM todos
      ORDER BY id DESC
      `
    );
    const todos = result.rows.map(mapTodoRow);
    res.json(todos);
  } catch (err) {
    console.error("GET /api/todos 에러:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * C: Todo 생성
 * POST /api/todos
 * body: { title, dueDate? }
 */
router.post("/", async (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  // 파라미터 구성
  const values = [title.trim()];
  let query;

  if (dueDate) {
    // dueDate 문자열(YYYY-MM-DD)을 DATE로 캐스팅
    query = `
      INSERT INTO todos (title, completed, due_date)
      VALUES ($1, FALSE, $2::date)
      RETURNING id, title, completed, due_date
    `;
    values.push(dueDate);
  } else {
    query = `
      INSERT INTO todos (title, completed)
      VALUES ($1, FALSE)
      RETURNING id, title, completed, due_date
    `;
  }

  try {
    const result = await db.query(query, values);
    const todo = mapTodoRow(result.rows[0]);
    res.status(201).json(todo);
  } catch (err) {
    console.error("POST /api/todos 에러:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * U: Todo 부분 수정
 * PATCH /api/todos/:id
 * body: { title?, completed?, dueDate? }
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed, dueDate } = req.body;

  if (
    title === undefined &&
    completed === undefined &&
    dueDate === undefined
  ) {
    return res
      .status(400)
      .json({ message: "title, completed, dueDate 중 하나는 있어야 합니다." });
  }

  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title.trim());
  }

  if (completed !== undefined) {
    fields.push(`completed = $${idx++}`);
    values.push(completed);
  }

  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === "") {
      // 날짜 제거
      fields.push(`due_date = NULL`);
    } else {
      fields.push(`due_date = $${idx++}::date`);
      values.push(dueDate);
    }
  }

  // updated_at 갱신
  fields.push(`updated_at = NOW()`);

  values.push(id);

  const query = `
    UPDATE todos
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING id, title, completed, due_date
  `;

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todo = mapTodoRow(result.rows[0]);
    res.json(todo);
  } catch (err) {
    console.error("PATCH /api/todos/:id 에러:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * D: Todo 삭제
 * DELETE /api/todos/:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM todos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/todos/:id 에러:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
