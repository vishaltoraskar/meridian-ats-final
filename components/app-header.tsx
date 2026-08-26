import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Job requisitions" },
  { href: "/candidates", label: "Candidates" },
  { href: "/applications", label: "Applications" },
];

export function AppHeader({
  current,
}: {
  current: "dashboard" | "jobs" | "candidates" | "applications";
}) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div>
            <Link href="/" className="text-sm font-semibold tracking-wide">
              Meridian Technologies
            </Link>
            <p className="text-xs text-zinc-500">Applicant tracking system</p>
          </div>
          <nav className="hidden gap-4 text-sm sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  current === link.href.slice(1)
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-zinc-500 sm:block">Head of TA</p>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
