"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import {
  APPLICATION_SOURCES,
  PIPELINE_STAGES,
  mapApplicationRow,
  type ApplicationSource,
  type PipelineStage,
} from "@/lib/applications";
import { createSupabaseClient } from "@/lib/supabase";

export type CreateApplicationState = {
  error?: string;
  success?: boolean;
};

function isStage(value: string): value is PipelineStage {
  return (PIPELINE_STAGES as readonly string[]).includes(value);
}

function isSource(value: string): value is ApplicationSource {
  return (APPLICATION_SOURCES as readonly string[]).includes(value);
}

export async function createApplication(
  _prevState: CreateApplicationState,
  formData: FormData,
): Promise<CreateApplicationState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to create an application." };
  }

  const jobId = String(formData.get("job_id") ?? "").trim();
  const candidateId = String(formData.get("candidate_id") ?? "").trim();
  const stage = String(formData.get("stage") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();

  if (!jobId || !candidateId || !stage || !source) {
    return { error: "Please select a candidate, job, stage, and source." };
  }

  if (!isStage(stage) || !isSource(source)) {
    return { error: "Choose a valid pipeline stage and source." };
  }

  const supabase = createSupabaseClient();
  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    candidate_id: candidateId,
    stage,
    source,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/applications");
  return { success: true };
}

export type SendInterviewInviteState = {
  error?: string;
  success?: boolean;
};

export async function sendInterviewInvite(
  _prevState: SendInterviewInviteState,
  formData: FormData,
): Promise<SendInterviewInviteState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to send an interview invite." };
  }

  const applicationId = String(formData.get("application_id") ?? "").trim();
  if (!applicationId) {
    return { error: "Missing application." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { error: "RESEND_API_KEY is not configured." };
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("applications")
    .select("id, candidates(name, email), jobs(title)")
    .eq("id", applicationId)
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Application not found." };
  }

  const application = mapApplicationRow(data);
  const email = application.candidates?.email?.trim();
  const name = application.candidates?.name?.trim() || "there";
  const jobTitle = application.jobs?.title?.trim() || "the open role";

  if (!email) {
    return { error: "This candidate does not have an email address on file." };
  }

  const resend = new Resend(apiKey);
  const { error: sendError } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Interview Invitation from Meridian Technologies",
    text: `Dear ${name},

Thank you for your interest in the ${jobTitle} role with Meridian Technologies.

We would like to invite you to the client round of interviews. A member of our talent team will follow up with the schedule and joining details.

Kind regards,
Talent Acquisition
Meridian Technologies`,
  });

  if (sendError) {
    return { error: sendError.message };
  }

  return { success: true };
}
