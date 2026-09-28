import type { TodoFilter } from "@/types/todo";

interface TodoFiltersProps {
  filter: TodoFilter;
  searchQuery: string;
  onFilterChange: (filter: TodoFilter) => void;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

const filterOptions: Array<{ label: string; value: TodoFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export function TodoFilters({
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClear,
}: TodoFiltersProps) {
  const hasActiveControls = searchQuery.length > 0 || filter !== "all";

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="todo-search" className="sr-only">
            Search todos
          </label>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.5" />
            <path d="m13 13 3.25 3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="todo-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks"
            className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Filter todos" className="flex rounded-lg bg-slate-100 p-1">
            {filterOptions.map((option) => {
              const isSelected = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onFilterChange(option.value)}
                  className={`min-h-8 rounded-md px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                    isSelected
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {hasActiveControls ? (
            <button
              type="button"
              onClick={onClear}
              className="min-h-10 px-2 text-sm font-medium text-indigo-600 outline-none hover:text-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}