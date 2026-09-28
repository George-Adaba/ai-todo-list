import { getDueDateLabel, isTodoOverdue } from "@/lib/todo";
import type { Priority, Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const priorityDetails: Record<Priority, { label: string; className: string; dotClassName: string }> = {
  low: {
    label: "Low",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClassName: "bg-sky-500",
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500",
  },
  high: {
    label: "High",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    dotClassName: "bg-rose-500",
  },
};

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const priority = priorityDetails[todo.priority];
  const overdue = isTodoOverdue(todo);
  const dueDateLabel = todo.dueDate ? getDueDateLabel(todo.dueDate) : null;

  return (
    <li className="px-4 py-4 sm:px-5 sm:py-5">
      <article className="flex items-start gap-3 sm:gap-4">
        <div className="pt-0.5">
          <input
            id={`todo-${todo.id}-complete`}
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            className="h-5 w-5 rounded border-slate-300 accent-indigo-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          />
          <label htmlFor={`todo-${todo.id}-complete`} className="sr-only">
            Mark {todo.title} as {todo.completed ? "active" : "complete"}
          </label>
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-sm font-semibold leading-6 sm:text-base ${
              todo.completed ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {todo.title}
          </h3>
          {todo.description ? (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
              {todo.description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priority.className}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${priority.dotClassName}`} />
              {priority.label}
            </span>
            {dueDateLabel ? (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  overdue
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : todo.completed
                      ? "border-slate-200 bg-slate-50 text-slate-500"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {overdue ? `Overdue · ${dueDateLabel}` : dueDateLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            aria-label={`Edit ${todo.title}`}
            className="min-h-9 rounded-md px-2.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo)}
            aria-label={`Delete ${todo.title}`}
            className="min-h-9 rounded-md px-2.5 text-xs font-semibold text-slate-500 outline-none hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Delete
          </button>
        </div>
      </article>
    </li>
  );
}