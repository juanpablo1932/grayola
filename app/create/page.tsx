import ProjectForm from '@/components/ProjectForm';


async function createPage() {

  return ( 
    <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
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
    </div>
  </div>
   );
}

export default createPage;