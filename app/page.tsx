import { db } from "@/lib/db";
import { addTask } from "@/app/actions";
import { deleteTask } from "@/app/actions";
import { toggleTask } from "@/app/actions";
import EditableTask from "@/app/component/EditableTask";
import { Trash2 } from "lucide-react";
import type { Task } from "@/app/generated/prisma/client"


export default async function Home() {
  // Fetch tasks directly from the DB
  const tasks = await db.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* Form to add tasks */}
      <form action={addTask} className="flex gap-2 mb-8">
        <input
          name="title"
          type="text"
          placeholder="What needs to be done?"
          className="border p-2 rounded w-full text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* List of tasks */}
      <ul className="space-y-3">
        {tasks.map((task: Task) => (
          <li 
            key={task.id} 
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center text-black"
          >
            <div className="flex items-center gap-3">
              {/* Toggle Checkbox */}
              <form action={async () => {
                "use server"
                await toggleTask(task.id, task.isCompleted)
              }}>
                <button 
                  type="submit"
                  className={`w-6 h-6 border rounded-full flex items-center justify-center transition-colors ${
                    task.isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {task.isCompleted && <span className="text-white text-xs">✓</span>}
                </button>
              </form>

              {/* Task Title with conditional styling */}
              <EditableTask task={task} />
            </div>
            
            {/* Delete Button (Keep your existing trash icon code here) */}
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button type="submit" className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}