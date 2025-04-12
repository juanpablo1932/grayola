"use server";

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

export async function getDisenadores() {
  const supabase = await createClient();

  const { data: disenadores, error: disenadoresError } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "disenador");

  return { disenadores, disenadoresError };
}

export async function getUserById(id: string) {
  const supabase = await createClient();

  const { data: profile, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return { profile, userError };
}
