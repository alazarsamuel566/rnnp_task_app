import { db } from "@/lib/db";
import { addTask } from "@/app/actions";
import { deleteTask } from "@/app/actions";
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
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 bg-gray-100 rounded flex justify-between items-center text-black">
            <span>{task.title}</span>
            
            {/* Small form just for the delete button */}
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button className="text-gray-400 hover:text-red-600 rounded-md transition-all">
                <Trash2 size={18} />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}