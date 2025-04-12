"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { Project, ProjectFile } from "@/app/admin/columns"
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getDisenadores } from "@/utils/api/profile"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { deleteProject } from "@/utils/api/project"

const editSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio." }),
  description: z.string().min(1, { message: "La descripción es obligatoria." }),
  designer_id: z.string().optional(),
})

type FormValues = z.infer<typeof editSchema>

interface Designer {
  id: string
  email: string
}

export default function EditProjectForm({
  project,
  className
}: {
  project: Project
  className?: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [designers, setDesigners] = useState<Designer[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
    },
  })

    useEffect(() => {
      getDisenadores()
        .then((response) => {
          if (response.disenadores) {
            setDesigners(response.disenadores)
          }
        })
        .catch(console.error)
    }, [])

  const onSubmit = async (values: FormValues) => {
    startTransition(async () => {
      try {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            title: values.title,
            description: values.description,
            designer_id: values.designer_id || null,
          })
          .eq("id", project.id)

        if (updateError) {
          toast.error("Error al actualizar el proyecto.")
          return
        }

        toast.success("Proyecto actualizado correctamente ✅")
        router.push("/admin")
        router.refresh()
      } catch (err) {
        console.error(err)
        toast.error("Ocurrió un error inesperado.")
      }
    })
  }

  const handleDeleteProject = async (projectId: string) => {
    startTransition(async () => {
      try {
        const { error } = await deleteProject(projectId)

        if (error) {
          toast.error("Error al eliminar el proyecto.")
          return
        }

        toast.success("Proyecto eliminado correctamente ✅")
        router.push("/admin")
        router.refresh()
      } catch (err) {
        console.error(err)
        toast.error("Ocurrió un error inesperado.")
      }
    })}
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título del proyecto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del proyecto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diseñador Asignado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={project.designer_id ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un diseñador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {designers.map((designer) => (
                    <SelectItem key={designer.id} value={designer.id}>
                      {designer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Puedes asignar o cambiar el diseñador del proyecto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <div>
          <FormLabel>Archivos existentes</FormLabel>
          <ul className="text-sm text-muted-foreground list-disc ml-5">
            {project.project_files?.length > 0
              ? project.project_files.map((f: ProjectFile) => (
                  <li key={f.id}>{f.file_name}</li>
                ))
              : <li>No hay archivos aún.</li>}
          </ul>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>

        <div className="flex flex-col items-center gap-4">
          <FormLabel>Eliminar proyecto</FormLabel>
          <Button type="button" variant="destructive" onClick={() => handleDeleteProject(project.id)}>Esta acción es permanente</Button>
        </div>
      </form>
    </Form>
  )
}
