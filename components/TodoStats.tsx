import type { TodoStatistics } from "@/types/todo";

interface TodoStatsProps {
  statistics: TodoStatistics;
}

export function TodoStats({ statistics }: TodoStatsProps) {
  const items = [
    { label: "Total", value: statistics.total, valueClassName: "text-slate-900" },
    { label: "Active", value: statistics.active, valueClassName: "text-indigo-700" },
    { label: "Completed", value: statistics.completed, valueClassName: "text-emerald-700" },
    {
      label: "Overdue",
      value: statistics.overdue,
      valueClassName: statistics.overdue > 0 ? "text-rose-700" : "text-slate-900",
    },
  ];

  return (
    <section aria-label="Todo statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => (
        <div key={item.label} className="border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <p className={`text-2xl font-semibold tracking-tight ${item.valueClassName}`}>{item.value}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
        </div>
      ))}
    </section>
  );
}