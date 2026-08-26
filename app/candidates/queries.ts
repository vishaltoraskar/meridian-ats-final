"use server";

import { auth } from "@clerk/nextjs/server";
import {
  CANDIDATE_COLUMNS,
  type Candidate,
} from "@/lib/candidates";
import { createSupabaseClient } from "@/lib/supabase";

export type CandidateListResult = {
  candidates: Candidate[];
  error?: string;
};

function sanitizeSearch(query: string) {
  return query
    .replace(/[%_*,()\\"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sortByCreatedAt(candidates: Candidate[]) {
  return [...candidates].sort((left, right) => {
    const leftTime = left.created_at ? Date.parse(left.created_at) : 0;
    const rightTime = right.created_at ? Date.parse(right.created_at) : 0;
    return rightTime - leftTime;
  });
}

export async function listCandidates(
  query = "",
): Promise<CandidateListResult> {
  const supabase = createSupabaseClient();
  const term = sanitizeSearch(query);

  if (term) {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "search_candidates",
      { search: term },
    );

    if (!rpcError) {
      return { candidates: sortByCreatedAt((rpcData ?? []) as Candidate[]) };
    }

    const skillValue = term.includes(" ") ? `"${term}"` : term;
    const { data, error } = await supabase
      .from("candidates")
      .select(CANDIDATE_COLUMNS)
      .or(
        `name.ilike.%${term}%,skills.cs.{${skillValue}},skills.cs.{${skillValue.toUpperCase()}}`,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return { candidates: [], error: error.message };
    }

    return { candidates: (data ?? []) as Candidate[] };
  }

  const { data, error } = await supabase
    .from("candidates")
    .select(CANDIDATE_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return { candidates: [], error: error.message };
  }

  return { candidates: (data ?? []) as Candidate[] };
}

export async function searchCandidates(
  query: string,
): Promise<CandidateListResult> {
  const { userId } = await auth();
  if (!userId) {
    return { candidates: [], error: "You must be signed in." };
  }

  return listCandidates(query);
}
