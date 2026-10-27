import type { Metadata } from "next";
import { CrewCard } from "@/components/CommunityBlocks";
import { api } from "@/lib/api";
import { crew } from "@/lib/crew";

export const metadata: Metadata = { title: "Drivers" };

// Prerendered without data at build time; refreshed from the API at runtime.
export const revalidate = 60;

export default async function DriversPage() {
  const drivers = await api.drivers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl font-black italic">Drivers</h1>
      <p className="mt-2 text-muted">The people who race under the Team Gondal colors.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {crew.map((m) => (
          <CrewCard key={m.name} member={m} />
        ))}
      </div>

      <h2 className="font-display mt-14 text-2xl font-extrabold">Roster</h2>
      {drivers && drivers.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {drivers.map((d) => (
            <li key={d.id} className="flex items-center gap-4 rounded-xl border border-line bg-panel p-4">
              <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-racing text-lg font-black italic text-ink">
                {d.raceNumber ?? d.displayName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-bold">{d.displayName}</p>
                {d.country && <p className="text-sm text-muted">{d.country}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-line p-8 text-muted">
          The driver roster opens with Discord sign in. Join the Discord to be one of the first.
        </p>
      )}
    </div>
  );
}
