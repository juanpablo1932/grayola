"use client"

import { useEffect, useState, useTransition } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { assignDesignerToProject } from "@/utils/api/project"
import { getDisenadores } from "@/utils/api/profile"


interface Designer {
  id: string
  email: string
}

export function AssignDesignerDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [designerId, setDesignerId] = useState("")
  const [designers, setDesigners] = useState<Designer[]>([])
  console.log("designers", designers)
  const [pending, startTransition] = useTransition()


  useEffect(() => {
    getDisenadores()
      .then((response) => {
        if (response.disenadores) {
          setDesigners(response.disenadores)
        }
      })
      .catch(console.error)
  }, [])

  const handleClick = () => {

    if (!designerId) return

    startTransition(async () => {
      try {
        await assignDesignerToProject(projectId, designerId)
        setOpen(false)


      } catch (err) {
        console.error(err)
      }
    })
  }

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full text-left">Asignar Diseñador</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Diseñador</DialogTitle>
        </DialogHeader>


        <Select onValueChange={setDesignerId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un diseñador" />
          </SelectTrigger>
          <SelectContent>
            {designers.map((designer) => (
              <SelectItem key={designer.id} value={designer.id}>
                {designer.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        <DialogFooter>
        <Button onClick={handleClick} disabled={pending}>
          {pending ? "Asignando..." : "Asignar"}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
