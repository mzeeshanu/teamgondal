import Link from "next/link";
import { ApexG } from "./ApexG";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <ApexG size={36} />
          <span className="font-display text-xl font-black italic tracking-tight">
            TEAM <span className="text-racing">GONDAL</span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-muted hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="ml-2 rounded-md bg-racing px-4 py-2 font-bold text-ink hover:bg-yellow-300"
          >
            Join the team
          </Link>
        </nav>
      </div>
    </header>
  );
}
