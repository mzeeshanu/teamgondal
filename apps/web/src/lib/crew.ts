import { site } from "./site";

/**
 * The crew, their channels and the community content shown on the home page. Hand edited:
 * video and playlist ids come straight from YouTube URLs.
 */

export type Platform = "youtube" | "instagram" | "tiktok" | "discord" | "web";

export type CrewMember = {
  name: string;
  handle: string;
  role: string;
  bio: string;
  /** Square image in public/crew. Without one the card shows initials. */
  avatar?: string;
  initials: string;
  links: { platform: Platform; href: string; label: string }[];
};

export const crew: CrewMember[] = [
  {
    name: "techyGondal",
    handle: "@TechyGondal",
    role: "Founder",
    bio: "Software engineer by day, sim racer by night. Runs the channel, the rig and the team.",
    avatar: "/crew/techygondal.jpg",
    initials: "TG",
    links: [
      { platform: "youtube", href: "https://www.youtube.com/@TechyGondal", label: "YouTube" },
      { platform: "instagram", href: "https://www.instagram.com/techygondal", label: "Instagram" },
      { platform: "tiktok", href: "https://www.tiktok.com/@techygondal", label: "TikTok" },
      { platform: "web", href: site.links.creator, label: "techygondal.com" },
    ],
  },
  {
    name: "Elite Automotive Club",
    handle: "@PsykoPak",
    role: "Crew",
    bio: "Cinematic Assetto Corsa runs, real world car meets and the Techy Gondal Convoy series.",
    avatar: "/crew/elite-automotive-club.jpg",
    initials: "EA",
    links: [
      { platform: "youtube", href: "https://www.youtube.com/@PsykoPak", label: "YouTube" },
      { platform: "instagram", href: "https://www.instagram.com/elite.auto.club", label: "Instagram" },
      { platform: "discord", href: "https://discord.gg/s3TEeVZyv", label: "Discord" },
    ],
  },
  {
    name: "Saifullah Zubair",
    handle: "@saifullah_dev",
    role: "Crew",
    bio: "Sim racer and drifter from Pakistan. Real world is the dream; follow the journey.",
    initials: "SZ",
    links: [{ platform: "instagram", href: "https://www.instagram.com/saifullah_dev", label: "Instagram" }],
  },
];

/** Discord servers to showcase. Name and icon are looked up live from the invite. */
export const servers = [
  {
    invite: site.discordInvite,
    fallbackName: "Team Gondal",
    blurb: "Race night calls, server details, setups and results. Our home base.",
    primary: true,
  },
  {
    // Temporary invite; swap for a permanent one from the Elite server when it expires.
    invite: process.env.NEXT_PUBLIC_ELITE_DISCORD_INVITE || "https://discord.gg/s3TEeVZyv",
    fallbackName: "Elite Automotive Club",
    blurb: "Car culture, meets and cruises from our friends at Elite Automotive Club.",
    primary: false,
  },
];

/** Plays in the hero: the crew driving together, filmed by Elite Automotive Club. */
export const featuredPlaylist = { id: "PLcu7sRGnLO-AUVMDjdO-8PMfaepAtn1NB", title: "Techy Gondal Convoy" };

export type CrewVideo = { id: string; title: string; by: string; views?: string };

export const crewVideos: CrewVideo[] = [
  { id: "3GHDCo5bqnk", title: "INSANE high speed run in Dodge Chargers! Father vs Son", by: "techyGondal", views: "7.4K" },
  { id: "lDl1gABi2Bk", title: "Skeler - Code Red | Assetto Corsa", by: "Elite Automotive Club", views: "4.4K" },
  { id: "alp4DWTnvw8", title: "F1 traffic run on SRP! Night chase with Ali, Asim & Hassan", by: "techyGondal" },
  { id: "ibGM4G9xGK4", title: "Honda NSX - French Alps | Assetto Corsa", by: "Elite Automotive Club", views: "2.4K" },
  { id: "e-rWNEzdRwY", title: "The crew drives the most scenic mountain road in Assetto Corsa", by: "techyGondal" },
  { id: "3RzVa54Orwk", title: "Top 5 maps with traffic: Assetto Corsa 2025", by: "Elite Automotive Club" },
];

export const games = [
  { name: "Assetto Corsa", detail: "No Hesi, SRP and Shutoku traffic, Nordschleife, LA Canyons" },
  { name: "Assetto Corsa EVO", detail: "Free roam and the new physics" },
  { name: "BeamNG", detail: "Utah off-roading on BeamMP" },
  { name: "Dirt Rally 2.0", detail: "Gravel, snow and too many trees" },
];

export const tickerItems = [
  "No Hesi",
  "SRP traffic",
  "Shutoku",
  "Nordschleife",
  "LA Canyons",
  "Union Island",
  "Spa",
  "FDR New York",
  "Convoys",
  "Race nights",
  "Clean racing",
];
