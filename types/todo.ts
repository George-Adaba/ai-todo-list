export const priorities = ["low", "medium", "high"] as const;

export type Priority = (typeof priorities)[number];
export type TodoFilter = "all" | "active" | "completed";

export interface TodoDraft {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

export interface Todo extends TodoDraft {
  id: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStatistics {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}