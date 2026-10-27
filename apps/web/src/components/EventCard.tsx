import type { RaceEvent } from "@/lib/api";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/Denver",
});

export function EventCard({ event }: { event: RaceEvent }) {
  return (
    <article className="rounded-xl border border-line bg-panel p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-racing">{event.game}</p>
      <h3 className="font-display mt-1 text-xl font-extrabold">{event.title}</h3>
      <p className="mt-1 text-muted">
        {event.track}
        {event.carClass ? ` · ${event.carClass}` : ""}
      </p>
      <p className="mt-3 text-sm font-semibold">
        <time dateTime={event.startsAt}>{dateFormat.format(new Date(event.startsAt))}</time>
      </p>
      {event.description && <p className="mt-3 text-sm text-muted">{event.description}</p>}
    </article>
  );
}
