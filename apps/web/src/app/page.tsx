import Link from "next/link";
import { ApexG } from "@/components/ApexG";
import { EventCard } from "@/components/EventCard";
import { api } from "@/lib/api";
import { site } from "@/lib/site";

export default async function Home() {
  const events = (await api.upcomingEvents())?.slice(0, 3) ?? [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted">{site.tagline}</p>
            <h1 className="font-display mt-3 text-5xl font-black italic leading-none tracking-tight md:text-7xl">
              TEAM <span className="text-racing">GONDAL</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Race nights, leagues and a crew to chase lap times with. Started by techyGondal, built for every driver
              who wants a team to race for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/join" className="rounded-md bg-racing px-6 py-3 font-bold text-ink hover:bg-yellow-300">
                Join the team
              </Link>
              <Link
                href="/events"
                className="rounded-md border border-line px-6 py-3 font-bold hover:border-white"
              >
                See events
              </Link>
            </div>
          </div>
          <ApexG size={260} badge className="mx-auto hidden md:block" />
        </div>
        <div className="kerb h-1.5" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold">Upcoming events</h2>
          <Link href="/events" className="text-sm font-semibold text-racing hover:underline">
            All events
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-line p-8 text-muted">
            No events scheduled yet. Join the Discord to hear about the first race night.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Race nights", body: "Regular lobbies on our own Assetto Corsa server. Show up, race clean, have fun." },
            { title: "Leagues", body: "Championships with standings, so every round counts." },
            { title: "Community", body: "Setups, tips and banter on Discord with drivers of every level." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-line bg-panel p-6">
              <h3 className="font-display text-xl font-extrabold text-racing">{f.title}</h3>
              <p className="mt-2 text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
