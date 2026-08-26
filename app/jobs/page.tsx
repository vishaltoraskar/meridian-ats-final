import { JobRequisitionForm } from "@/app/jobs/job-requisition-form";
import { AppHeader } from "@/components/app-header";
import { skillsToList, type JobRequisition } from "@/lib/jobs";
import { createSupabaseClient } from "@/lib/supabase";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function JobsPage() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, client, project, skills_required, experience_band, ctc_range, location, target_closure_date, status, created_at",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const jobs = (data ?? []) as JobRequisition[];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f5f1] text-zinc-900">
      <AppHeader current="jobs" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Hiring
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Job requisitions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Raise a new role for Meridian Technologies and review open
            requisitions across Pune, Bangalore, and Goa.
          </p>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Add job requisition
          </h2>
          <p className="mt-1 mb-6 text-sm text-zinc-500">
            Fields map to the jobs table in Supabase.
          </p>
          <JobRequisitionForm />
        </section>

        <section className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight">
              Open jobs
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {error
                ? "Could not load requisitions from Supabase."
                : `${jobs.length} open requisition${jobs.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {error ? (
            <p className="px-6 py-10 text-sm text-red-700">{error.message}</p>
          ) : jobs.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-zinc-500">
              No open jobs yet. Save a requisition above to see it here.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {jobs.map((job, index) => {
                const skills = skillsToList(job.skills_required);
                return (
                  <li
                    key={job.id ?? `${job.title}-${index}`}
                    className="px-6 py-5"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {job.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {job.client}
                          {job.project ? ` · ${job.project}` : ""}
                        </p>
                      </div>
                      <p className="text-sm text-zinc-500">
                        Close by {formatDate(job.target_closure_date)}
                      </p>
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-zinc-400">
                          Location
                        </dt>
                        <dd>{job.location ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-zinc-400">
                          Experience
                        </dt>
                        <dd>{job.experience_band ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-zinc-400">
                          CTC
                        </dt>
                        <dd>{job.ctc_range ?? "—"}</dd>
                      </div>
                    </dl>
                    {skills.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
