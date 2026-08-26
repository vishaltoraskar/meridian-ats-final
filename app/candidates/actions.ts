"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";

export type CreateCandidateState = {
  error?: string;
  duplicatePhone?: boolean;
  success?: boolean;
};

function isDuplicatePhone(error: {
  code?: string;
  message?: string;
  details?: string;
}) {
  if (error.code !== "23505") return false;
  const text = `${error.message} ${error.details ?? ""}`.toLowerCase();
  return text.includes("phone");
}

export async function createCandidate(
  _prevState: CreateCandidateState,
  formData: FormData,
): Promise<CreateCandidateState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to add a candidate." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\s+/g, "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const currentCompany = String(formData.get("current_company") ?? "").trim();
  const currentCtc = Number(formData.get("current_ctc"));
  const expectedCtc = Number(formData.get("expected_ctc"));
  const noticePeriod = Number(formData.get("notice_period"));
  const totalExperience = Number(formData.get("total_experience"));
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (
    !name ||
    !phone ||
    !email ||
    !currentCompany ||
    Number.isNaN(currentCtc) ||
    Number.isNaN(expectedCtc) ||
    Number.isNaN(noticePeriod) ||
    Number.isNaN(totalExperience) ||
    skills.length === 0
  ) {
    return { error: "Please complete every field before saving." };
  }

  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return { error: "Please attach a PDF resume." };
  }

  const isPdf =
    resume.type === "application/pdf" ||
    resume.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return { error: "Resume must be a PDF file." };
  }

  const supabase = createSupabaseClient();
  const objectPath = `${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(objectPath, await resume.arrayBuffer(), {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Resume upload failed: ${uploadError.message}` };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("resumes").getPublicUrl(objectPath);

  const { error } = await supabase.from("candidates").insert({
    name,
    phone,
    email,
    current_company: currentCompany,
    current_ctc: currentCtc,
    expected_ctc: expectedCtc,
    notice_period: noticePeriod,
    total_experience: totalExperience,
    skills,
    resume_url: publicUrl,
  });

  if (error) {
    await supabase.storage.from("resumes").remove([objectPath]);
    if (isDuplicatePhone(error)) {
      return {
        duplicatePhone: true,
        error:
          "A candidate with this phone number already exists. Check the records below instead of creating a duplicate.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/candidates");
  return { success: true };
}
