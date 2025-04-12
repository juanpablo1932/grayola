"use client"

import { ColumnDef } from "@tanstack/react-table"


export interface ProjectFile {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  project_id: string;
  signed_url?: string
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;
  designer_id: string | null;
  created_at: string;
  updated_at: string;
  project_files: ProjectFile[];
  designer?: {
    email: string;
  } | null;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "project_files",
    header: "Archivos",
    cell: ({ row }) => {
      const files = row.original.project_files || [];
      return (
        <div className="flex flex-col gap-1">
          {files.length > 0
            ? files.map((file) =>
                file.signed_url ? (
                  <a
                    key={file.id}
                    href={file.signed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {file.file_name}
                  </a>
                ) : (
                  <span key={file.id} className="text-muted-foreground">
                    No disponible
                  </span>
              ))
            : <span className="text-muted-foreground">Sin archivos</span>}
        </div>
      );
    }
  },
]
