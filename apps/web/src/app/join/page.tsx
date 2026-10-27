import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Join" };

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-black italic">
        Join <span className="text-racing">Team Gondal</span>
      </h1>
      <p className="mt-4 text-lg text-muted">
        Everything happens on Discord: race night announcements, server details, setups and results. All skill levels
        welcome. Race clean and respect your fellow drivers.
      </p>
      {site.discordInvite ? (
        <a
          href={site.discordInvite}
          className="mt-8 inline-block rounded-md bg-electric px-6 py-3 font-bold text-white hover:bg-blue-500"
        >
          Join the Discord
        </a>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-line p-6 text-muted">
          The Discord invite link is coming soon.
        </p>
      )}
      <h2 className="font-display mt-12 text-2xl font-extrabold">What you need</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
        <li>Assetto Corsa with Content Manager and Custom Shaders Patch</li>
        <li>A wheel is recommended, a controller works for open lobbies</li>
        <li>A Discord account for announcements and voice chat</li>
      </ul>
    </div>
  );
}
