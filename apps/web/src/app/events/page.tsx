import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await api.events();
  const now = Date.now();
  const upcoming = events?.filter((e) => new Date(e.startsAt).getTime() >= now) ?? [];
  const past = events?.filter((e) => new Date(e.startsAt).getTime() < now).reverse() ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl font-black italic">Events</h1>
      <p className="mt-2 text-muted">Race nights and league rounds. Times shown in Mountain Time.</p>

      {events === null && (
        <p className="mt-8 rounded-xl border border-dashed border-line p-8 text-muted">
          The schedule is offline right now. Check back soon.
        </p>
      )}

      {events !== null && (
        <>
          <h2 className="font-display mt-10 text-2xl font-extrabold">Upcoming</h2>
          {upcoming.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <p className="mt-4 text-muted">Nothing on the calendar yet.</p>
          )}

          {past.length > 0 && (
            <>
              <h2 className="font-display mt-12 text-2xl font-extrabold">Past</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {past.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
