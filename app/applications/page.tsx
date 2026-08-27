import { ApplicationForm } from "@/app/applications/application-form";
import { SendInterviewInviteButton } from "@/app/applications/send-interview-invite-button";
import { AppHeader } from "@/components/app-header";
import { type ApplicationRow, mapApplicationRow } from "@/lib/applications";
import { createSupabaseClient } from "@/lib/supabase";

export default async function ApplicationsPage() {
  const supabase = createSupabaseClient();

  const [jobsResult, candidatesResult, applicationsResult] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title, client, location")
      .order("created_at", { ascending: false }),
    supabase
      .from("candidates")
      .select("id, name, phone")
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id, stage, source, created_at, candidates(name, email), jobs(title)")
      .order("created_at", { ascending: false }),
  ]);

  const jobs = (jobsResult.data ?? []).map((job) => ({
    id: String(job.id),
    label: [job.title, job.client, job.location].filter(Boolean).join(" · "),
  }));

  const candidates = (candidatesResult.data ?? []).map((candidate) => ({
    id: String(candidate.id),
    label: [candidate.name, candidate.phone].filter(Boolean).join(" · "),
  }));

  const applications: ApplicationRow[] = (applicationsResult.data ?? []).map(
    mapApplicationRow,
  );
  const loadError =
    jobsResult.error?.message ||
    candidatesResult.error?.message ||
    applicationsResult.error?.message;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f5f1] text-zinc-900">
      <AppHeader current="applications" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Pipeline
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Link a candidate to a job requisition and record how they entered
            the pipeline.
          </p>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Add application
          </h2>
          <p className="mt-1 mb-6 text-sm text-zinc-500">
            Candidate and job lists are loaded from Supabase.
          </p>
          <ApplicationForm jobs={jobs} candidates={candidates} />
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight">
              All applications
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {loadError
                ? "Could not load applications from Supabase."
                : `${applications.length} record${applications.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {loadError ? (
            <p className="px-6 py-10 text-sm text-red-700">{loadError}</p>
          ) : applications.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-zinc-500">
              No applications yet. Link a candidate to a job above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Candidate name</th>
                    <th className="px-4 py-3">Job title</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Invite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {applications.map((application, index) => (
                    <tr key={application.id ?? index}>
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        {application.candidates?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {application.jobs?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {application.stage ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {application.source ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {application.id ? (
                          <SendInterviewInviteButton
                            applicationId={application.id}
                            disabled={!application.candidates?.email}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
