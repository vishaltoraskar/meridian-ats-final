"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";

export type CreateJobState = {
  error?: string;
  success?: boolean;
};

export async function createJobRequisition(
  _prevState: CreateJobState,
  formData: FormData,
): Promise<CreateJobState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to create a job requisition." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim();
  const project = String(formData.get("project") ?? "").trim();
  const experienceBand = String(formData.get("experience_band") ?? "").trim();
  const ctcRange = String(formData.get("ctc_range") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const targetClosureDate = String(
    formData.get("target_closure_date") ?? "",
  ).trim();
  const skillsRequired = String(formData.get("skills_required") ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (
    !title ||
    !client ||
    !project ||
    skillsRequired.length === 0 ||
    !experienceBand ||
    !ctcRange ||
    !location ||
    !targetClosureDate
  ) {
    return { error: "Please complete every field before saving." };
  }

  const supabase = createSupabaseClient();
  const { error } = await supabase.from("jobs").insert({
    title,
    client,
    project,
    skills_required: skillsRequired,
    experience_band: experienceBand,
    ctc_range: ctcRange,
    location,
    target_closure_date: targetClosureDate,
    status: "open",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { success: true };
}
