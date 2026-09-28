"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoStats } from "@/components/TodoStats";
import {
  createTodo,
  deleteTodo,
  filterTodos,
  getTodoStatistics,
  loadTodos,
  saveTodos,
  toggleTodo,
  updateTodo,
} from "@/lib/todo";
import type { Todo, TodoDraft, TodoFilter } from "@/types/todo";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return loadTodos(window.localStorage);
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isStorageReady = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    if (isStorageReady) {
      saveTodos(todos, window.localStorage);
    }
  }, [todos, isStorageReady]);

  const hydratedTodos = isStorageReady ? todos : [];
  const visibleTodos = filterTodos(hydratedTodos, filter, searchQuery);
  const statistics = getTodoStatistics(hydratedTodos);

  function handleCreate(draft: TodoDraft) {
    setTodos((currentTodos) => [createTodo(draft), ...currentTodos]);
    setFilter("all");
    setSearchQuery("");
  }

  function handleUpdate(draft: TodoDraft) {
    if (!editingTodo) {
      return;
    }

    const todoId = editingTodo.id;
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? updateTodo(todo, draft) : todo)),
    );
    setEditingTodo(null);
  }

  function handleToggle(todo: Todo) {
    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.id === todo.id ? toggleTodo(currentTodo) : currentTodo,
      ),
    );
  }

  function handleStartEditing(todo: Todo) {
    setEditingTodo(todo);
    window.requestAnimationFrame(() => {
      const titleInput = document.getElementById("todo-title");
      titleInput?.focus({ preventScroll: true });
      document.getElementById("todo-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function handleDelete(todo: Todo) {
    const confirmed = window.confirm(`Delete “${todo.title}”? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setTodos((currentTodos) => deleteTodo(currentTodos, todo.id));

    if (editingTodo?.id === todo.id) {
      setEditingTodo(null);
    }
  }

  function clearControls() {
    setFilter("all");
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-50 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-indigo-600 text-white" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">Tasklist</p>
              <p className="hidden text-xs text-slate-500 sm:block">Personal task manager</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500">Private to this browser</span>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-7 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Todo dashboard</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Keep your work clear and manageable.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Create tasks, set priorities and due dates, and focus on what needs attention next.
          </p>
        </section>

        <TodoStats statistics={statistics} />

        <div className="mt-6 grid items-start gap-6 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="order-2 overflow-hidden border border-slate-200 bg-white shadow-sm lg:order-1" aria-label="Todo list and filters">
            <TodoFilters
              filter={filter}
              searchQuery={searchQuery}
              onFilterChange={setFilter}
              onSearchChange={setSearchQuery}
              onClear={clearControls}
            />
            <TodoList
              todos={visibleTodos}
              totalCount={hydratedTodos.length}
              filter={filter}
              searchQuery={searchQuery}
              isLoading={!isStorageReady}
              onToggle={handleToggle}
              onEdit={handleStartEditing}
              onDelete={handleDelete}
              onClearControls={clearControls}
            />
          </section>

          <div className="order-1 lg:order-2">
            <TodoForm
              key={editingTodo?.id ?? "new-task"}
              todo={editingTodo ?? undefined}
              onSubmit={editingTodo ? handleUpdate : handleCreate}
              onCancel={() => setEditingTodo(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}