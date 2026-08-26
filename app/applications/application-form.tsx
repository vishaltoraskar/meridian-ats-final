"use client";

import { useActionState } from "react";
import { createApplication, type CreateApplicationState } from "./actions";
import {
  APPLICATION_SOURCES,
  PIPELINE_STAGES,
} from "@/lib/applications";

const initialState: CreateApplicationState = {};

const fieldClass =
  "mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2";

type Option = {
  id: string;
  label: string;
};

export function ApplicationForm({
  jobs,
  candidates,
}: {
  jobs: Option[];
  candidates: Option[];
}) {
  const [state, formAction, pending] = useActionState(
    createApplication,
    initialState,
  );

  const noJobs = jobs.length === 0;
  const noCandidates = candidates.length === 0;

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-zinc-700">
        Candidate
        <select
          required
          name="candidate_id"
          defaultValue=""
          disabled={noCandidates}
          className={fieldClass}
        >
          <option value="" disabled>
            {noCandidates ? "No candidates yet" : "Select a candidate"}
          </option>
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Job
        <select required name="job_id" defaultValue="" disabled={noJobs} className={fieldClass}>
          <option value="" disabled>
            {noJobs ? "No jobs yet" : "Select a job"}
          </option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Pipeline stage
        <select required name="stage" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select stage
          </option>
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Source
        <select required name="source" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select source
          </option>
          {APPLICATION_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </label>

      {state.error ? (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="sm:col-span-2 text-sm text-emerald-700">
          Application saved.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending || noJobs || noCandidates}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save application"}
        </button>
      </div>
    </form>
  );
}
