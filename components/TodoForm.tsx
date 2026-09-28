"use client";

import { useState, type FormEvent } from "react";
import { priorities, type Priority, type Todo, type TodoDraft } from "@/types/todo";

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (draft: TodoDraft) => void;
  onCancel: () => void;
}

const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? "");
  const [titleError, setTitleError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setTitleError("Enter a task title.");
      return;
    }

    onSubmit({
      title: cleanTitle,
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    });

    if (!todo) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }

    setTitleError("");
  }

  return (
    <section
      id="todo-editor"
      aria-labelledby="todo-editor-heading"
      className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          {todo ? "Update task" : "New task"}
        </p>
        <h2 id="todo-editor-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
          {todo ? "Edit task" : "Add a task"}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          {todo ? "Update the details and save your changes." : "Capture the details now, then work through them one by one."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="todo-title" className="text-sm font-medium text-slate-700">
              Title <span className="text-rose-600">*</span>
            </label>
            <span className="text-xs text-slate-400">{title.length}/120</span>
          </div>
          <input
            id="todo-title"
            name="title"
            type="text"
            value={title}
            maxLength={120}
            required
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? "todo-title-error" : undefined}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) {
                setTitleError("");
              }
            }}
            placeholder="What needs to be done?"
            className="h-11 w-full border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {titleError ? (
            <p id="todo-title-error" role="alert" className="mt-1.5 text-sm text-rose-600">
              {titleError}
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="todo-description" className="text-sm font-medium text-slate-700">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <span className="text-xs text-slate-400">{description.length}/500</span>
          </div>
          <textarea
            id="todo-description"
            name="description"
            value={description}
            maxLength={500}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add context, notes, or a next step"
            className="w-full resize-y border border-slate-300 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-slate-700">Priority</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {priorities.map((priorityOption) => (
              <label key={priorityOption} className="cursor-pointer">
                <input
                  type="radio"
                  name={`priority-${todo?.id ?? "new"}`}
                  value={priorityOption}
                  checked={priority === priorityOption}
                  onChange={() => setPriority(priorityOption)}
                  className="peer sr-only"
                />
                <span className="flex h-10 items-center justify-center border border-slate-300 bg-white text-sm font-medium text-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
                  {priorityLabels[priorityOption]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="todo-due-date" className="text-sm font-medium text-slate-700">
            Due date <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="todo-due-date"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-2 h-11 w-full border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="h-11 flex-1 bg-indigo-600 px-4 text-sm font-semibold text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {todo ? "Save changes" : "Add task"}
          </button>
          {todo ? (
            <button
              type="button"
              onClick={onCancel}
              className="h-11 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}