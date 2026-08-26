export const PIPELINE_STAGES = [
  "Applied",
  "Screened",
  "Internal Interview",
  "Client Round",
  "Offered",
  "BGV",
  "Joined",
  "Rejected",
  "Dropped Out",
] as const;

export const APPLICATION_SOURCES = [
  "Naukri",
  "LinkedIn",
  "Referral",
  "Consultancy",
  "Direct",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export type ApplicationRow = {
  id?: string;
  stage: string | null;
  source: string | null;
  candidates: { name: string | null; email: string | null } | null;
  jobs: { title: string | null } | null;
};
