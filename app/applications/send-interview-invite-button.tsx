"use client";

import { useActionState } from "react";
import {
  sendInterviewInvite,
  type SendInterviewInviteState,
} from "./actions";

const initialState: SendInterviewInviteState = {};

export function SendInterviewInviteButton({
  applicationId,
  disabled,
}: {
  applicationId: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    sendInterviewInvite,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="application_id" value={applicationId} />
      <button
        type="submit"
        disabled={pending || disabled}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Interview Invite"}
      </button>
      {state.error ? (
        <p className="max-w-48 text-xs text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-xs text-emerald-700">Invite sent.</p>
      ) : null}
    </form>
  );
}
