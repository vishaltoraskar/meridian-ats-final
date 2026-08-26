export type Candidate = {
  id?: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  current_company: string | null;
  current_ctc: number | string | null;
  expected_ctc: number | string | null;
  notice_period: number | string | null;
  total_experience: number | string | null;
  skills: string[] | string | null;
  resume_url: string | null;
  created_at?: string | null;
};

export function skillsToList(skills: Candidate["skills"]) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function formatCandidateNumber(value: Candidate["current_ctc"]) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toString();
}

export const CANDIDATE_COLUMNS =
  "id, name, phone, email, current_company, current_ctc, expected_ctc, notice_period, total_experience, skills, resume_url, created_at";
