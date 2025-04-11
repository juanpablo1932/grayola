import EditProjectForm from "@/components/EditProjectForm";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string }
}

async function editPage(
  { params }: Props,
) {

  console.log("Params", params)
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, project_files(*)")
    .eq("id", params.id)
    .single()

    console.log("Project", project)
    console.log("Error", error)

  if (error || !project) {
    return notFound()
  }
  return (     
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Proyecto</h1>
      <EditProjectForm project={project} />
    </div> );
}

export default editPage;