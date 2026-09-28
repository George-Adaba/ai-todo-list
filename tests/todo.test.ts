import assert from "node:assert/strict";
import test from "node:test";
import {
  createTodo,
  deleteTodo,
  filterTodos,
  getDueDateLabel,
  getTodoStatistics,
  isTodoOverdue,
  loadTodos,
  saveTodos,
  toggleTodo,
  updateTodo,
} from "@/lib/todo";
import type { Todo } from "@/types/todo";

const referenceNow = new Date(2026, 8, 28, 12, 0, 0);
const laterNow = new Date(2026, 8, 28, 13, 30, 0);

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  const baseTodo = createTodo(
    {
      title: "Prepare project notes",
      description: "Summarize decisions and next steps",
      priority: "medium",
      dueDate: null,
    },
    overrides.id ?? "todo-1",
    referenceNow,
  );

  return { ...baseTodo, ...overrides };
}

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

test("creates a clean, active todo with all required fields", () => {
  const todo = createTodo(
    {
      title: "  Plan launch checklist  ",
      description: "  Confirm owners and dates  ",
      priority: "high",
      dueDate: "2026-09-30",
    },
    "new-todo",
    referenceNow,
  );

  assert.equal(todo.id, "new-todo");
  assert.equal(todo.title, "Plan launch checklist");
  assert.equal(todo.description, "Confirm owners and dates");
  assert.equal(todo.completed, false);
  assert.equal(todo.priority, "high");
  assert.equal(todo.dueDate, "2026-09-30");
  assert.equal(todo.createdAt, referenceNow.toISOString());
  assert.equal(todo.updatedAt, referenceNow.toISOString());
});

test("edits task details and updates the modified timestamp", () => {
  const todo = makeTodo();
  const updatedTodo = updateTodo(
    todo,
    {
      title: "  Publish launch checklist  ",
      description: "  Share the final version  ",
      priority: "low",
      dueDate: "2026-10-02",
    },
    laterNow,
  );

  assert.equal(updatedTodo.id, todo.id);
  assert.equal(updatedTodo.title, "Publish launch checklist");
  assert.equal(updatedTodo.description, "Share the final version");
  assert.equal(updatedTodo.priority, "low");
  assert.equal(updatedTodo.dueDate, "2026-10-02");
  assert.equal(updatedTodo.createdAt, todo.createdAt);
  assert.equal(updatedTodo.updatedAt, laterNow.toISOString());
});

test("marks a todo complete and active again", () => {
  const todo = makeTodo();
  const completedTodo = toggleTodo(todo, laterNow);
  const activeTodo = toggleTodo(completedTodo, laterNow);

  assert.equal(completedTodo.completed, true);
  assert.equal(completedTodo.updatedAt, laterNow.toISOString());
  assert.equal(activeTodo.completed, false);
});

test("deletes only the selected todo", () => {
  const firstTodo = makeTodo({ id: "first" });
  const secondTodo = makeTodo({ id: "second" });

  assert.deepEqual(deleteTodo([firstTodo, secondTodo], "first"), [secondTodo]);
});

test("searches titles and descriptions while applying filters", () => {
  const activeTodo = makeTodo({ id: "active", title: "Write launch brief" });
  const completedTodo = makeTodo({
    id: "completed",
    title: "Review old notes",
    description: "Final draft is ready",
    completed: true,
  });
  const todos = [activeTodo, completedTodo];

  assert.deepEqual(filterTodos(todos, "all", "LAUNCH brief"), [activeTodo]);
  assert.deepEqual(filterTodos(todos, "active", ""), [activeTodo]);
  assert.deepEqual(filterTodos(todos, "completed", "draft"), [completedTodo]);
});

test("calculates priorities, due dates, overdue state, and statistics", () => {
  const overdueTodo = makeTodo({ id: "overdue", priority: "high", dueDate: "2026-09-27" });
  const dueTodayTodo = makeTodo({ id: "today", priority: "low", dueDate: "2026-09-28" });
  const futureTodo = makeTodo({ id: "future", priority: "medium", dueDate: "2026-09-29" });
  const completedOverdueTodo = makeTodo({
    id: "completed",
    priority: "medium",
    dueDate: "2026-09-20",
    completed: true,
  });
  const todos = [overdueTodo, dueTodayTodo, futureTodo, completedOverdueTodo];

  assert.equal(isTodoOverdue(overdueTodo, referenceNow), true);
  assert.equal(isTodoOverdue(dueTodayTodo, referenceNow), false);
  assert.equal(isTodoOverdue(futureTodo, referenceNow), false);
  assert.equal(isTodoOverdue(completedOverdueTodo, referenceNow), false);
  assert.deepEqual(getTodoStatistics(todos, referenceNow), {
    total: 4,
    active: 3,
    completed: 1,
    overdue: 1,
  });
  assert.equal(getDueDateLabel("2026-09-27", referenceNow), "Due yesterday");
  assert.equal(getDueDateLabel("2026-09-28", referenceNow), "Due today");
  assert.equal(getDueDateLabel("2026-09-29", referenceNow), "Due tomorrow");
});

test("saves and restores todos from local storage", () => {
  const storage = new MemoryStorage();
  const todo = makeTodo({ priority: "high", dueDate: "2026-10-05" });

  saveTodos([todo], storage);
  assert.deepEqual(loadTodos(storage), [todo]);

  const editedTodo = updateTodo(
    todo,
    { ...todo, title: "Updated project notes" },
    laterNow,
  );
  saveTodos([editedTodo], storage);
  assert.deepEqual(loadTodos(storage), [editedTodo]);
});