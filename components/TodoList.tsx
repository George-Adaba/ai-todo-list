import { TodoItem } from "@/components/TodoItem";
import type { Todo, TodoFilter } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  totalCount: number;
  filter: TodoFilter;
  searchQuery: string;
  isLoading: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onClearControls: () => void;
}

function getEmptyState(filter: TodoFilter, hasActiveControls: boolean) {
  if (hasActiveControls) {
    return {
      title: "No matching tasks",
      description: "Try a different search or clear the current filters.",
    };
  }

  if (filter === "active") {
    return {
      title: "No active tasks",
      description: "Everything is complete. Add another task when you are ready.",
    };
  }

  if (filter === "completed") {
    return {
      title: "No completed tasks yet",
      description: "Finished tasks will be collected here.",
    };
  }

  return {
    title: "Your list is clear",
    description: "Add your first task using the form to get started.",
  };
}

export function TodoList({
  todos,
  totalCount,
  filter,
  searchQuery,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  onClearControls,
}: TodoListProps) {
  const hasActiveControls = searchQuery.length > 0 || filter !== "all";
  const emptyState = getEmptyState(filter, hasActiveControls);

  return (
    <section id="todo-list" aria-labelledby="todo-list-heading" className="bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 id="todo-list-heading" className="text-lg font-semibold tracking-tight text-slate-900">
            Tasks
          </h2>
          <p className="mt-0.5 text-sm text-slate-500" aria-live="polite">
            {isLoading ? "Loading saved tasks…" : `${todos.length} of ${totalCount} shown`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div role="status" className="px-6 py-14 text-center text-sm text-slate-500">
          <span className="sr-only">Loading saved tasks</span>
          <span aria-hidden="true">Loading…</span>
        </div>
      ) : todos.length > 0 ? (
        <ul className="divide-y divide-slate-200">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <div className="px-6 py-12 text-center sm:py-16">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto h-9 w-9 text-slate-300"
          >
            <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="m8 10 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="mt-4 text-base font-semibold text-slate-800">{emptyState.title}</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{emptyState.description}</p>
          {hasActiveControls ? (
            <button
              type="button"
              onClick={onClearControls}
              className="mt-4 text-sm font-semibold text-indigo-600 outline-none hover:text-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Clear search and filters
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}