"use client";

import { useActionState } from "react";
import { createJobRequisition, type CreateJobState } from "./actions";

const initialState: CreateJobState = {};

const experienceBands = [
  "0-2 years",
  "2-4 years",
  "4-6 years",
  "6-10 years",
  "10+ years",
];

const locations = ["Pune", "Bangalore", "Goa", "Hybrid", "Remote"];

const fieldClass =
  "mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2";

export function JobRequisitionForm() {
  const [state, formAction, pending] = useActionState(
    createJobRequisition,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-zinc-700">
        Title
        <input
          required
          name="title"
          type="text"
          placeholder="Senior React Engineer"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Client
        <input
          required
          name="client"
          type="text"
          placeholder="Client name"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Project
        <input
          required
          name="project"
          type="text"
          placeholder="Project or engagement"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Experience band
        <select required name="experience_band" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select experience
          </option>
          {experienceBands.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-zinc-700 sm:col-span-2">
        Skills required
        <input
          required
          name="skills_required"
          type="text"
          placeholder="React, TypeScript, Node.js"
          className={fieldClass}
        />
        <span className="mt-1 block text-xs font-normal text-zinc-500">
          Separate skills with commas.
        </span>
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        CTC range
        <input
          required
          name="ctc_range"
          type="text"
          placeholder="18–24 LPA"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Location
        <select required name="location" defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select location
          </option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-zinc-700 sm:col-span-2">
        Target closure date
        <input
          required
          name="target_closure_date"
          type="date"
          className={fieldClass}
        />
      </label>

      {state.error ? (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="sm:col-span-2 text-sm text-emerald-700">
          Job requisition saved.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save requisition"}
        </button>
      </div>
    </form>
  );
}
