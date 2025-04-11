import { createClient } from "@/utils/supabase/server";

export async function getRole(id: string) {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  return { profile, profileError };
}
