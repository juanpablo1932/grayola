import { projectFormSchema } from "@/components/ProjectForm";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function createProject({
  data,
  id,
}: {
  data: z.infer<typeof projectFormSchema>;
  id: string;
}) {
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
