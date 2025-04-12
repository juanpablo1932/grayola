import ProjectForm from '@/components/ProjectForm';
import { createClient } from "@/utils/supabase/server"
import {getUserById} from "@/utils/api/profile"
import { logout } from '@/utils/supabase/logout';
import { Button } from "@/components/ui/button"


async function createPage() {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { profile } = await getUserById(user?.id || "")

  if (!profile) {
    throw new Error("User is not authenticated")
  }

  return ( 
    <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <h1 className="text-2xl font-bold">Hola {profile.name}!</h1>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <ProjectForm
          />
        </div>
      </div>
    </div>
    <div className="relative hidden lg:block">
      <img
        src="https://grayola.io/wp-content/uploads/2023/10/cuervi.svg"
        alt="Image"
        className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
      />
      <div className="absolute right-0 m-5">
        <Button variant="destructive" onClick={logout}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  </div>
   );
}

export default createPage;