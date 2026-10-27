/* eslint-disable @next/next/no-img-element */
import { PlatformIcon, platformHover } from "./PlatformIcon";
import type { CrewMember, CrewVideo } from "@/lib/crew";
import type { DiscordServer } from "@/lib/discord";

export function CrewCard({ member }: { member: CrewMember }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-racing">
      <div className="flex items-center gap-4">
        {member.avatar ? (
          <img src={member.avatar} alt="" loading="lazy" className="h-16 w-16 rounded-full border-2 border-racing bg-white object-cover" />
        ) : (
          <span className="font-display grid h-16 w-16 place-items-center rounded-full border-2 border-racing bg-gradient-to-br from-electric to-[#8b3dff] text-xl font-black italic">
            {member.initials}
          </span>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-racing">{member.role}</p>
          <h3 className="font-display text-xl font-extrabold leading-tight">{member.name}</h3>
          <p className="text-sm text-muted">{member.handle}</p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-muted">{member.bio}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {member.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition ${platformHover[l.platform]}`}
            >
              <PlatformIcon name={l.platform} className="h-4 w-4" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

type ServerProps = { invite: string; server: DiscordServer | null; fallbackName: string; blurb: string; primary: boolean };

export function ServerCard({ invite, server, fallbackName, blurb, primary }: ServerProps) {
  const name = server?.name ?? fallbackName;
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 ${
        primary ? "border-[#5865f2] bg-gradient-to-br from-[#5865f2] to-[#2b2f7a]" : "border-line bg-panel"
      }`}
    >
      <PlatformIcon name="discord" className="absolute -right-6 -bottom-8 h-40 w-40 text-white/10" />
      <div className="relative flex items-center gap-4">
        {server?.icon ? (
          <img src={server.icon} alt="" loading="lazy" className="h-14 w-14 rounded-2xl bg-ink object-cover" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#5865f2] text-white">
            <PlatformIcon name="discord" className="h-7 w-7" />
          </span>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">{primary ? "Our server" : "Friends of the team"}</p>
          <h3 className="font-display text-2xl font-extrabold leading-tight">{name}</h3>
        </div>
      </div>
      <p className={`relative mt-4 flex-1 ${primary ? "text-white/85" : "text-muted"}`}>{blurb}</p>
      <a
        href={invite}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative mt-6 inline-flex w-fit items-center gap-2 rounded-md px-5 py-2.5 font-bold ${
          primary ? "bg-white text-[#5865f2] hover:bg-white/90" : "bg-[#5865f2] text-white hover:bg-[#4752c4]"
        }`}
      >
        <PlatformIcon name="discord" className="h-5 w-5" /> Join {name}
      </a>
    </article>
  );
}

export function CrewVideoGrid({ videos }: { videos: CrewVideo[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id}>
          <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="relative overflow-hidden rounded-xl border border-line group-hover:border-racing">
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="aspect-video w-full object-cover transition group-hover:scale-105"
              />
              {v.views && (
                <span className="absolute right-2 bottom-2 rounded bg-black/75 px-2 py-0.5 text-xs font-bold">▶ {v.views}</span>
              )}
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-racing">{v.by}</p>
            <h3 className="mt-1 font-bold leading-snug group-hover:text-racing">{v.title}</h3>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Embedded player for a whole playlist, on the privacy enhanced domain. */
export function PlaylistPlayer({ id, title }: { id: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-racing/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${id}`}
        title={`${title} playlist`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

/** Scrolling band of words. Decorative; stops for people who prefer reduced motion. */
export function Ticker({ items }: { items: string[] }) {
  const row = items.map((t) => (
    <span key={t} className="flex items-center gap-6">
      <span>{t}</span>
      <span className="text-racing">◆</span>
    </span>
  ));
  return (
    <div className="overflow-hidden border-y border-line bg-panel py-3" aria-hidden="true">
      <div className="ticker font-display flex w-max gap-6 text-lg font-extrabold uppercase italic tracking-wide">
        <div className="flex gap-6">{row}</div>
        <div className="flex gap-6">{row}</div>
      </div>
    </div>
  );
}

export function SectionHeading({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-racing">{kicker}</p>
        <h2 className="font-display text-3xl font-extrabold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
