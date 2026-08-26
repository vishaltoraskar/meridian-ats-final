"use client";

import { useActionState } from "react";
import { createCandidate, type CreateCandidateState } from "./actions";

const initialState: CreateCandidateState = {};

const fieldClass =
  "mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2";

export function CandidateForm() {
  const [state, formAction, pending] = useActionState(
    createCandidate,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-zinc-700">
        Name
        <input
          required
          name="name"
          type="text"
          placeholder="Candidate full name"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Phone
        <input
          required
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="9876543210"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Email
        <input
          required
          name="email"
          type="email"
          placeholder="name@company.com"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Current company
        <input
          required
          name="current_company"
          type="text"
          placeholder="Employer name"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Current CTC (LPA)
        <input
          required
          name="current_ctc"
          type="number"
          min="0"
          step="0.01"
          placeholder="18"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Expected CTC (LPA)
        <input
          required
          name="expected_ctc"
          type="number"
          min="0"
          step="0.01"
          placeholder="24"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Notice period (days)
        <input
          required
          name="notice_period"
          type="number"
          min="0"
          step="1"
          placeholder="30"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Total experience (years)
        <input
          required
          name="total_experience"
          type="number"
          min="0"
          step="0.1"
          placeholder="5.5"
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700 sm:col-span-2">
        Skills
        <input
          required
          name="skills"
          type="text"
          placeholder="Java, Spring Boot, Microservices"
          className={fieldClass}
        />
        <span className="mt-1 block text-xs font-normal text-zinc-500">
          Separate skills with commas.
        </span>
      </label>

      <label className="block text-sm font-medium text-zinc-700 sm:col-span-2">
        Resume (PDF)
        <input
          required
          name="resume"
          type="file"
          accept="application/pdf,.pdf"
          className="mt-1.5 w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </label>

      {state.duplicatePhone ? (
        <div
          className="sm:col-span-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Duplicate phone number</p>
          <p className="mt-1">{state.error}</p>
        </div>
      ) : state.error ? (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="sm:col-span-2 text-sm text-emerald-700">
          Candidate record saved.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save candidate"}
        </button>
      </div>
    </form>
  );
}
