"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { useRef } from "react"

export const projectFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre del proyecto es obligatorio.",
  }),
  description: z.string().min(1, {
    message: "La descripción del proyecto es obligatoria.",
  }),
  files: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Debes adjuntar al menos un archivo.",
    }),
})


function ProjectForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })



  const onSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    console.log(data)

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log(user)
  
      if (!user) {
        toast.error("Usuario no autenticado")
        return
      }
  
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          title: data.name,
          description: data.description,
          client_id: user.id
        })
        .select()
        .single()

        console.log(project)
  
      if (projectError || !project) {
        toast.error("Error al crear el proyecto")
        return
      }
  
      //Subir los archivos
      const files = Array.from(data.files as FileList)
  
      const archivosParaInsertar = await Promise.all(
        files.map(async (file) => {
          const filePath = `${project.id}/${file.name}`
  
          const { data: storageData, error: uploadError } = await supabase.storage
            .from("files") // Nombre del bucket
            .upload(filePath, file)

            console.log(storageData)
  
          if (uploadError) {
            toast.error(`Error al subir: ${file.name}`)
            return null
          }
  
          return {
            project_id: project.id,
            file_name: file.name,
            file_path: storageData.path
          }
        })
      )
  
      // Insertar registros en `project_files`
      const filesToInsert = archivosParaInsertar.filter(Boolean)
  
      if (filesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("project_files")
          .insert(filesToInsert)
  
        if (insertError) {
          toast.warning("Proyecto creado, pero no se guardaron los archivos.")
        } else {
          toast.success("Proyecto creado con éxito ✅")
        }
      } else {
        toast.success("Proyecto creado sin archivos adjuntos")
      }
  
      form.reset()
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error(err)
      toast.error("Ocurrió un error inesperado")
    }
  }
  


  return ( 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre De Proyecto</FormLabel>
                <FormControl>
                  <Input placeholder="Project Name" {...field} />
                </FormControl>
                <FormDescription>
                  Introduce el nombre de tu proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción De Proyecto</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here." {...field} />
                </FormControl>
                <FormDescription>
                Ingresa la descripción de tu proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="files"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Archivos</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => onChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Puedes subir uno o más archivos relacionados con el proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Crear Proyecto
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProjectForm;