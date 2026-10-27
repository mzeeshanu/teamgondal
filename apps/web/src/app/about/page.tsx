import type { Metadata } from "next";
import { ApexG } from "@/components/ApexG";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ApexG size={96} badge />
      <h1 className="font-display mt-6 text-4xl font-black italic">About Team Gondal</h1>
      <p className="mt-4 text-lg text-muted">
        Team Gondal grew out of the{" "}
        <a href={site.links.youtube} className="text-white underline hover:text-racing">
          techyGondal
        </a>{" "}
        channel. What started as racing videos is becoming a team: a place for drivers to race together, improve and
        represent the yellow and blue.
      </p>
      <h2 className="font-display mt-12 text-2xl font-extrabold">The Apex G</h2>
      <p className="mt-4 text-muted">
        Our logo is a G drawn as a corner, with a kerb on the apex. It is the line every driver is chasing.
      </p>
    </div>
  );
}
