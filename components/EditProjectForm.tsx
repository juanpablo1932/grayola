"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { Project, ProjectFile } from "@/app/admin/columns"
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const editSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio." }),
  description: z.string().min(1, { message: "La descripción es obligatoria." }),
})

type FormValues = z.infer<typeof editSchema>

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

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
    },
  })

  const onSubmit = async (values: FormValues) => {
    startTransition(async () => {
      try {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            title: values.title,
            description: values.description,
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
      </form>
    </Form>
  )
}
