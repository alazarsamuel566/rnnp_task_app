"use server" // This tells Next.js: "Run this ONLY on the server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addTask(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) return;

  // Save to PostgreSQL
  await db.task.create({
    data: { title },
  });

  // Refresh the page to show new data
  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;

  await db.task.delete({
    where: { id: parseInt(id) },
  });

  revalidatePath("/");
}
export async function toggleTask(id: number, completed: boolean) {
  "use server"
  
  await db.task.update({
    where: { id },
    data: { isCompleted: !completed }, // Flips true to false, or false to true
  });

  revalidatePath("/");
}
export async function updateTaskTitle(id: number, newTitle: string) {
  "use server"
  
  await db.task.update({
    where: { id },
    data: { title: newTitle },
  });

  revalidatePath("/");
}