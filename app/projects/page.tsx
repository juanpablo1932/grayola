import {getProjectsByUserId} from "@/utils/api/project";
import { createClient } from "@/utils/supabase/server"
import {Project, columns} from "@/app/projects/columns"
import { DataTable } from "@/app/admin/dataTable"
import { getSignedFileUrls } from "@/utils/supabase/signedFiles";
import { getUserById } from "@/utils/api/profile";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/supabase/logout";

async function getData() {
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User is not authenticated");
  }
  const { projects } = await getProjectsByUserId(user.id);

  if (!projects) return [];

  // Agregar signed URLs a cada archivo de cada proyecto
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => ({
      ...project,
      project_files: await getSignedFileUrls(project.project_files || []),
    }))
  );

  return enrichedProjects;
}

async function projectPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { profile } = await getUserById(user?.id || "")
  
  if (!profile) {
    throw new Error("User is not authenticated")
  }

  const data = await getData();
  return ( 
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Hola {profile.name}!</h1>
        <div className="absolute right-0 m-5">
          <Button variant="destructive" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
      <p className="text-balance text-sm text-muted-foreground">
        Aquí puedes ver los proyectos que se te han asignado.
        <br />
      </p>
      <DataTable columns={columns} data={data as Project[]} />
    </div>
   );
}

export default projectPage;