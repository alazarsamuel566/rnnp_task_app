"use client" // This makes the component interactive

import { useState } from "react";
import type { Task } from "@/app/generated/prisma/client"
import { updateTaskTitle } from "../actions";

export default function EditableTask({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleUpdate = async () => {
    await updateTaskTitle(task.id, title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input 
          className="border p-1 rounded text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <button onClick={handleUpdate} className="text-green-600 text-sm font-bold">Save</button>
        <button onClick={() => setIsEditing(false)} className="text-gray-400 text-sm">Cancel</button>
      </div>
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer transition-all ${task.isCompleted ? "line-through text-gray-400" : "font-medium"}`}
    >
      {task.title}
    </span>
  );
}