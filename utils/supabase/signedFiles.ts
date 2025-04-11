import { createClient } from "./server";
import { ProjectFile } from "@/app/admin/columns";

export async function getSignedFileUrls(files: ProjectFile[]) {
  const supabase = await createClient();
  const signedFiles = await Promise.all(
    files.map(async (file) => {
      const { data } = await supabase.storage
        .from("files")
        .createSignedUrl(file.file_path, 60 * 10);

      return {
        ...file,
        signed_url: data?.signedUrl || null,
      };
    })
  );

  return signedFiles;
}
