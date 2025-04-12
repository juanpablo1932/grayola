import EditProjectForm from "@/components/EditProjectForm";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string }
}

export default async function editPage(
  { params }: Props,
) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, project_files(*)")
    .eq("id", params.id)
    .single()

  if (error || !project) {
    return notFound()
  }
  return (     
    <div className="flex gap-20 max-w-2xl mx-auto min-h-svh flex-col justify-center p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Editar Proyecto</h1>
      <EditProjectForm project={project} />
    </div> 
  );
}