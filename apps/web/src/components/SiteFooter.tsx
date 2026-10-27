import { site } from "@/lib/site";

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
        <ul className="flex flex-wrap gap-4">
          <li><a className="hover:text-white" href={site.links.youtube}>YouTube</a></li>
          <li><a className="hover:text-white" href={site.links.instagram}>Instagram</a></li>
          <li><a className="hover:text-white" href={site.links.tiktok}>TikTok</a></li>
        </ul>
      </div>
    </footer>
  );
}
