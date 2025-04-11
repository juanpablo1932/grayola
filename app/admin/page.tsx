import {getProjects} from "@/utils/api/project";
import { createClient } from "@/utils/supabase/server"
import {Project, columns} from "@/app/admin/columns"
import { DataTable } from "@/app/admin/dataTable"
import { getSignedFileUrls } from "@/utils/supabase/signedFiles";

async function getData() {
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User is not authenticated");
  }
  const { projects } = await getProjects();

  if (!projects) return [];

  // Agregar signed URLs a cada archivo de cada proyecto
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => ({
      ...project,
      project_files: await getSignedFileUrls(project.project_files || []),
    }))
  );

  console.log("Enriched Projects:", enrichedProjects);

  return enrichedProjects;
}

async function adminPage() {
  const data = await getData();
  return ( 
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Hola Colaborador!</h1>
      <p className="text-balance text-sm text-muted-foreground">
        Aquí puedes ver los proyectos que se han creado y sus archivos adjuntos.
        <br />
        Puedes editar o eliminar los proyectos desde aquí.
        <br />
      </p>
      <DataTable columns={columns} data={data as Project[]} />
    </div>
   );
}

export default adminPage;