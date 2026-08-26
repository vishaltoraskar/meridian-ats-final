import { AppHeader } from "@/components/app-header";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const metrics = [
  {
    label: "Open Positions",
    value: "40",
    detail: "Roles currently hiring",
  },
  {
    label: "Candidates in Pipeline",
    value: "200",
    detail: "Active applicants across stages",
  },
  {
    label: "Avg Time-to-Fill",
    value: "32 days",
    detail: "Offer accepted from requisition open",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f5f1] text-zinc-900">
      <AppHeader current="dashboard" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Hiring snapshot for Pune, Bangalore, and Goa. Figures below are
            placeholders until live requisition data is connected.
          </p>
        </div>

        <section
          aria-label="Hiring summary"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Active job requisitions
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Open roles will appear in this list.
              </p>
            </div>
          </div>
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-zinc-700">
              No requisitions loaded yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Manage open roles on the job requisitions page.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Open job requisitions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
