import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { PlatformIcon } from "@/components/PlatformIcon";
import {
  CrewCard,
  CrewVideoGrid,
  PlaylistPlayer,
  SectionHeading,
  ServerCard,
  Ticker,
} from "@/components/CommunityBlocks";
import { api } from "@/lib/api";
import { crew, crewVideos, featuredPlaylist, games, servers, tickerItems } from "@/lib/crew";
import { getInviteServer } from "@/lib/discord";
import { site } from "@/lib/site";

// Prerendered without data at build time; refreshed from the API at runtime.
export const revalidate = 60;

export default async function Home() {
  const [events, serverInfo] = await Promise.all([
    api.upcomingEvents().then((e) => e?.slice(0, 3) ?? []),
    Promise.all(servers.map((s) => getInviteServer(s.invite))),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-electric/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted">{site.tagline}</p>
            <h1 className="font-display mt-3 text-5xl font-black italic leading-none tracking-tight md:text-7xl">
              TEAM <span className="text-racing">GONDAL</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Race nights, convoys and a crew to chase lap times with. Started by techyGondal, built for every driver
              who wants a team to race for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-racing px-6 py-3 font-bold text-ink hover:bg-yellow-300"
              >
                <PlatformIcon name="discord" /> Join the Discord
              </a>
              <Link href="#crew" className="rounded-md border border-line px-6 py-3 font-bold hover:border-white">
                Meet the crew
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { value: crew.length, label: "drivers" },
                { value: servers.length, label: "Discord servers" },
                { value: games.length, label: "games we race" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-racing pl-3">
                  <dd className="font-display text-3xl font-black italic">{s.value}</dd>
                  <dt className="text-xs uppercase tracking-widest text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <PlaylistPlayer id={featuredPlaylist.id} title={featuredPlaylist.title} />
            <p className="mt-3 text-sm text-muted">
              Now playing: <span className="font-semibold text-white">{featuredPlaylist.title}</span>, the crew on the
              road together, filmed by Elite Automotive Club.
            </p>
          </div>
        </div>
        <div className="kerb h-1.5" aria-hidden="true" />
      </section>

      <Ticker items={tickerItems} />

      <section id="crew" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <SectionHeading kicker="The drivers" title="Meet the crew">
          <Link href="/drivers" className="text-sm font-semibold text-racing hover:underline">
            Full roster →
          </Link>
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {crew.map((m) => (
            <CrewCard key={m.name} member={m} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading kicker="Pull up a seat" title="Join a server" />
          <div className="grid gap-4 md:grid-cols-2">
            {servers.map((s, i) => (
              <ServerCard
                key={s.invite}
                invite={s.invite}
                server={serverInfo[i]}
                fallbackName={s.fallbackName}
                blurb={s.blurb}
                primary={s.primary}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker="From the crew's channels" title="Watch us race">
          <a
            href={site.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-racing hover:underline"
          >
            More on YouTube →
          </a>
        </SectionHeading>
        <CrewVideoGrid videos={crewVideos} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading kicker="On the calendar" title="Upcoming events">
          <Link href="/events" className="text-sm font-semibold text-racing hover:underline">
            All events →
          </Link>
        </SectionHeading>
        {events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-line p-8">
            <p className="text-muted">No events scheduled yet. Race nights are called on Discord first.</p>
            <a
              href={site.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-bold hover:border-[#5865f2]"
            >
              <PlatformIcon name="discord" className="h-4 w-4" /> Get notified
            </a>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeading kicker="Where you'll find us" title="What we race" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((g, i) => (
            <li key={g.name} className="relative overflow-hidden rounded-xl border border-line bg-panel p-5">
              <span className="font-display absolute -top-3 right-2 text-7xl font-black italic text-white/5" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display relative text-xl font-extrabold text-racing">{g.name}</h3>
              <p className="relative mt-2 text-sm text-muted">{g.detail}</p>
            </li>
          ))}
        </ul>
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
