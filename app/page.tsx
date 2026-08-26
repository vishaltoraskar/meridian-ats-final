import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f5f1] text-zinc-900">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <p className="text-sm font-semibold tracking-wide">
          Meridian Technologies
        </p>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 pb-24">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Applicant tracking system
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome to Meridian ATS
        </h1>
        <p className="mt-5 text-base leading-7 text-zinc-600">
          Sign in to manage open roles and candidates across Pune, Bangalore,
          and Goa.
        </p>

        <div className="mt-10">
          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/dashboard">
              <button
                type="button"
                className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Open recruiter workspace
            </Link>
          </Show>
        </div>
      </main>
    </div>
  );
}
