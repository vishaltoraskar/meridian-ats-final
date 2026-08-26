export type JobRequisition = {
  id?: string | number;
  title: string | null;
  client: string | null;
  project: string | null;
  skills_required: string[] | string | null;
  experience_band: string | null;
  ctc_range: string | null;
  location: string | null;
  target_closure_date: string | null;
  status: string | null;
  created_at?: string | null;
};

export function skillsToList(skills: JobRequisition["skills_required"]) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}
