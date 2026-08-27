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

type NestedRelation<T> = T | T[] | null | undefined;

function unwrapRelation<T>(value: NestedRelation<T>): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapApplicationRow(row: {
  id?: string;
  stage?: string | null;
  source?: string | null;
  candidates?: NestedRelation<{ name?: string | null; email?: string | null }>;
  jobs?: NestedRelation<{ title?: string | null }>;
}): ApplicationRow {
  const candidate = unwrapRelation(row.candidates);
  const job = unwrapRelation(row.jobs);

  return {
    id: row.id,
    stage: row.stage ?? null,
    source: row.source ?? null,
    candidates: candidate
      ? {
          name: candidate.name ?? null,
          email: candidate.email ?? null,
        }
      : null,
    jobs: job ? { title: job.title ?? null } : null,
  };
}
