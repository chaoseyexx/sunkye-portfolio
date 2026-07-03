"use server";

import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

// Type definition to ensure safety
export type ProjectInput = {
  title: string;
  desc: string;
  category: "environments" | "structures" | "interiors" | "models";
  image: string; // Base64 or URL
};

export async function getProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProject(data: ProjectInput) {
  try {
    await connectToDatabase();
    const newProject = await Project.create(data);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
