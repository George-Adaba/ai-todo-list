import { priorities, type Todo, type TodoDraft, type TodoFilter, type TodoStatistics } from "@/types/todo";

export const TODO_STORAGE_KEY = "todo-dashboard.todos";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isPriority(value: unknown): value is Todo["priority"] {
  return typeof value === "string" && priorities.some((priority) => priority === value);
}

export function isTodo(value: unknown): value is Todo {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.description === "string" &&
    typeof value.completed === "boolean" &&
    isPriority(value.priority) &&
    (value.dueDate === null || (typeof value.dueDate === "string" && isDateInput(value.dueDate))) &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === "string" &&
    !Number.isNaN(Date.parse(value.updatedAt))
  );
}

export function createTodo(
  draft: TodoDraft,
  id: string = globalThis.crypto.randomUUID(),
  now = new Date(),
): Todo {
  const timestamp = now.toISOString();

  return {
    id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    completed: false,
    priority: draft.priority,
    dueDate: draft.dueDate,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateTodo(todo: Todo, draft: TodoDraft, now = new Date()): Todo {
  return {
    ...todo,
    title: draft.title.trim(),
    description: draft.description.trim(),
    priority: draft.priority,
    dueDate: draft.dueDate,
    updatedAt: now.toISOString(),
  };
}

export function toggleTodo(todo: Todo, now = new Date()): Todo {
  return {
    ...todo,
    completed: !todo.completed,
    updatedAt: now.toISOString(),
  };
}

export function deleteTodo(todos: readonly Todo[], todoId: string): Todo[] {
  return todos.filter((todo) => todo.id !== todoId);
}

function dueDateAtStartOfDay(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isTodoOverdue(todo: Todo, now = new Date()): boolean {
  if (todo.completed || todo.dueDate === null) {
    return false;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dueDateAtStartOfDay(todo.dueDate) < today;
}

export function filterTodos(
  todos: readonly Todo[],
  filter: TodoFilter,
  searchQuery: string,
): Todo[] {
  const query = searchQuery.trim().toLocaleLowerCase();

  return todos.filter((todo) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);
    const matchesSearch =
      query.length === 0 ||
      todo.title.toLocaleLowerCase().includes(query) ||
      todo.description.toLocaleLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });
}

export function getTodoStatistics(
  todos: readonly Todo[],
  now = new Date(),
): TodoStatistics {
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - active;
  const overdue = todos.filter((todo) => isTodoOverdue(todo, now)).length;

  return {
    total: todos.length,
    active,
    completed,
    overdue,
  };
}

export function getDueDateLabel(dueDate: string, now = new Date()): string {
  const due = dueDateAtStartOfDay(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const differenceInDays = Math.round(
    (Date.UTC(due.getFullYear(), due.getMonth(), due.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      86_400_000,
  );

  if (differenceInDays === 0) {
    return "Due today";
  }

  if (differenceInDays === 1) {
    return "Due tomorrow";
  }

  if (differenceInDays === -1) {
    return "Due yesterday";
  }

  return `Due ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: due.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(due)}`;
}

export function loadTodos(storage: Pick<Storage, "getItem">): Todo[] {
  try {
    const storedValue = storage.getItem(TODO_STORAGE_KEY);

    if (storedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Stored todo data is not an array.");
    }

    if (!parsedValue.every(isTodo)) {
      throw new Error("Stored todo data contains an invalid item.");
    }

    return parsedValue;
  } catch (error) {
    console.error("Unable to load saved todos.", error);
    return [];
  }
}

export function saveTodos(
  todos: readonly Todo[],
  storage: Pick<Storage, "setItem">,
): void {
  try {
    storage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Unable to save todos.", error);
  }
}