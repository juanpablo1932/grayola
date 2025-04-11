"use server";

import { redirect } from "next/navigation";
import { getRole } from "@/utils/api/profile";
import { createClient } from "@/utils/supabase/server";

interface LoginFormData {
  email: string;
  password: string;
}

export async function login(formData: LoginFormData) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    redirect("/error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/error");
  }

  const { profile, profileError } = await getRole(user.id);

  if (profileError || !profile) {
    redirect("/error");
  }

  switch (profile.role) {
    case "cliente":
      redirect("/create");
    case "project_manager":
      redirect("/admin");
    case "disenador":
      redirect("/projects");
    default:
      redirect("/error");
  }
}
