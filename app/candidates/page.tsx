import { CandidateForm } from "@/app/candidates/candidate-form";
import { CandidatesDirectory } from "@/app/candidates/candidates-directory";
import { listCandidates } from "@/app/candidates/queries";
import { AppHeader } from "@/components/app-header";

export default async function CandidatesPage() {
  const { candidates, error } = await listCandidates();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f5f1] text-zinc-900">
      <AppHeader current="candidates" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Talent pool
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Candidates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Add a candidate record. Phone numbers must be unique so recruiters
            do not create duplicate profiles.
          </p>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Add candidate
          </h2>
          <p className="mt-1 mb-6 text-sm text-zinc-500">
            Fields map to the candidates table in Supabase.
          </p>
          <CandidateForm />
        </section>

        <CandidatesDirectory
          initialCandidates={candidates}
          loadError={error}
        />
      </main>
    </div>
  );
}
