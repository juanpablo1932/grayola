"use server";

import { projectFormSchema } from "@/components/ProjectForm";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function createProject(
  data: z.infer<typeof projectFormSchema>,
  id: string
) {
  const supabase = await createClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      title: data.name,
      description: data.description,
      client_id: id,
    })
    .select()
    .single();

  return { project, projectError };
}

export async function getProjects() {
  const supabase = await createClient();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*, project_files(*), designer:designer_id(email)");

  return { projects, projectsError };
}

export async function getProjectsByUserId(userId: string) {
  const supabase = await createClient();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*, project_files(*)")
    .eq("designer_id", userId);

  return { projects, projectsError };
}

export async function assignDesignerToProject(
  projectId: string,
  designerId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ designer_id: designerId })
    .eq("id", projectId)
    .select()
    .single();

  return { error };
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select()
    .single();

  return { error };
}
