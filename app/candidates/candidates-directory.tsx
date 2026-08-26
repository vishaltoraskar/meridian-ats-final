"use client";

import { searchCandidates } from "@/app/candidates/queries";
import {
  formatCandidateNumber,
  skillsToList,
  type Candidate,
} from "@/lib/candidates";
import { useEffect, useRef, useState, useTransition } from "react";

export function CandidatesDirectory({
  initialCandidates,
  loadError,
}: {
  initialCandidates: Candidate[];
  loadError?: string;
}) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState(initialCandidates);
  const [error, setError] = useState(loadError);
  const [pending, startTransition] = useTransition();
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    setCandidates(initialCandidates);
    setError(loadError);
  }, [initialCandidates, loadError]);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(async () => {
        const result = await searchCandidates(query);
        setCandidates(result.candidates);
        setError(result.error);
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const summary = error
    ? "Could not load candidates from Supabase."
    : query.trim()
      ? `${candidates.length} match${candidates.length === 1 ? "" : "es"}`
      : `${candidates.length} record${candidates.length === 1 ? "" : "s"}`;

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              All candidates
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{summary}</p>
          </div>
          {pending ? (
            <p className="text-xs text-zinc-400">Searching…</p>
          ) : null}
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Search candidates by name or skills</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or skills"
            autoComplete="off"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 placeholder:text-zinc-400 focus:ring-2"
          />
        </label>
      </div>

      {error ? (
        <p className="px-6 py-10 text-sm text-red-700">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-zinc-500">
          {query.trim()
            ? "No candidates match that name or skill."
            : "No candidates yet. Save a record above to see it in this table."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Current company</th>
                <th className="px-4 py-3">Current CTC</th>
                <th className="px-4 py-3">Expected CTC</th>
                <th className="px-4 py-3">Notice</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {candidates.map((candidate, index) => {
                const skills = skillsToList(candidate.skills);
                return (
                  <tr
                    key={candidate.id ?? `${candidate.phone}-${index}`}
                    className="align-top"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {candidate.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                      {candidate.phone}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {candidate.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {candidate.current_company}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                      {formatCandidateNumber(candidate.current_ctc)} LPA
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                      {formatCandidateNumber(candidate.expected_ctc)} LPA
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                      {formatCandidateNumber(candidate.notice_period)} days
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                      {formatCandidateNumber(candidate.total_experience)} yrs
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {skills.length > 0 ? skills.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {candidate.resume_url ? (
                        <a
                          href={candidate.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
