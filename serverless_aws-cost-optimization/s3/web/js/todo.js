// ==============================
// API 설정
// ==============================

// 나중에 실제 API URL로 바꾸면 됨
// 예: const API_BASE = "https://your-api.com/api/todos";
const API_BASE = "http://localhost:3000/api/todos";

// DOM 요소
const $input = document.getElementById("new-todo-input");
const $dateInput = document.getElementById("todo-date-input");
const $addBtn = document.getElementById("add-todo-btn");
const $list = document.getElementById("todo-list");

// ==============================
// 렌더링
// ==============================
function renderTodos(todos) {
  // 기존 리스트 초기화
  $list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    // 완료 여부 체크박스
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed; // API에서 completed(boolean) 내려준다고 가정
    checkbox.addEventListener("change", () =>
      toggleTodo(todo.id, checkbox.checked)
    );

    // 제목
    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;

    if (todo.completed) {
      titleSpan.style.textDecoration = "line-through";
      titleSpan.style.color = "#aaa";
    }

    // 날짜
    const dateSpan = document.createElement("span");
    dateSpan.className = "todo-date";

    // API에서 dueDate(YYYY-MM-DD)로 내려온다고 가정
    if (todo.dueDate) {
      dateSpan.textContent = todo.dueDate;
    } else {
      dateSpan.textContent = ""; // 날짜 없으면 비워두기
    }

    // 제목 + 날짜 묶는 영역
    const textWrapper = document.createElement("div");
    textWrapper.className = "todo-text";
    textWrapper.appendChild(titleSpan);
    textWrapper.appendChild(dateSpan);

    // 수정 버튼 (제목 수정)
    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => {
      const newTitle = prompt("새 제목을 입력하세요", todo.title);
      if (newTitle !== null) {
        const trimmed = newTitle.trim();
        if (trimmed && trimmed !== todo.title) {
          updateTodoTitle(todo.id, trimmed);
        }
      }
    });

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", () => {
      if (confirm("정말 삭제하시겠습니까?")) {
        deleteTodo(todo.id);
      }
    });

    // li에 요소들 추가
    li.appendChild(checkbox);
    li.appendChild(textWrapper);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    $list.appendChild(li);
  });
}

// ==============================
// API 호출 (CRUD)
// ==============================

// R: 전체 Todo 조회
async function loadTodos() {
  try {
    const res = await fetch(API_BASE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("GET /api/todos 실패:", res.status);
      return;
    }

    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error("loadTodos 에러:", err);
  }
}

// C: Todo 추가 (제목 + 날짜)
async function addTodo() {
  const title = $input.value.trim();
  const dueDate = $dateInput.value; // "YYYY-MM-DD" 형식

  if (!title) return;

  // 보낼 payload 구성
  const payload = { title };
  if (dueDate) {
    payload.dueDate = dueDate;
  }

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("POST /api/todos 실패:", res.status);
      return;
    }

    // 목록 다시 조회
    await loadTodos();
    $input.value = "";
    $dateInput.value = "";
  } catch (err) {
    console.error("addTodo 에러:", err);
  }
}

// U: 완료 상태 토글
async function toggleTodo(id, completed) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) {
      console.error("PATCH /api/todos/:id 실패:", res.status);
      return;
    }

    await loadTodos();
  } catch (err) {
    console.error("toggleTodo 에러:", err);
  }
}

// U: 제목 수정 (날짜는 그대로 둠)
async function updateTodoTitle(id, title) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      console.error("PATCH /api/todos/:id (title) 실패:", res.status);
      return;
    }

    await loadTodos();
  } catch (err) {
    console.error("updateTodoTitle 에러:", err);
  }
}

// D: Todo 삭제
async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("DELETE /api/todos/:id 실패:", res.status);
      return;
    }

    await loadTodos();
  } catch (err) {
    console.error("deleteTodo 에러:", err);
  }
}

// ==============================
// 이벤트 바인딩 & 초기 로드
// ==============================

$addBtn.addEventListener("click", addTodo);

$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// 페이지 진입 시 자동 조회
loadTodos();
