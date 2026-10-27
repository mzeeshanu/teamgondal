import { PlatformIcon, platformHover } from "./PlatformIcon";
import type { Platform } from "@/lib/crew";
import { site } from "@/lib/site";

const follow: { platform: Platform; href: string; label: string }[] = [
  { platform: "discord", href: site.discordInvite, label: "Discord" },
  { platform: "youtube", href: site.links.youtube, label: "YouTube" },
  { platform: "instagram", href: site.links.instagram, label: "Instagram" },
  { platform: "tiktok", href: site.links.tiktok, label: "TikTok" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="kerb h-1.5" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} Team Gondal. A{" "}
          <a href={site.links.creator} className="text-white hover:text-racing">
            techyGondal
          </a>{" "}
          community.
        </p>
        <ul className="flex flex-wrap gap-2">
          {follow.map((f) => (
            <li key={f.platform}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={f.label}
                title={f.label}
                className={`grid h-9 w-9 place-items-center rounded-full border border-line transition ${platformHover[f.platform]}`}
              >
                <PlatformIcon name={f.platform} className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
