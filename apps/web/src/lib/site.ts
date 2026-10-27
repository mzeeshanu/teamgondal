export const site = {
  name: "Team Gondal",
  tagline: "Sim racing community",
  description: "Team Gondal is a sim racing community from techyGondal. Race nights, leagues and a home for drivers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamgondal.com",
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/VJtXHF38TP",
  links: {
    youtube: "https://www.youtube.com/@TechyGondal",
    instagram: "https://www.instagram.com/techygondal",
    tiktok: "https://www.tiktok.com/@techygondal",
    creator: "https://techygondal.com",
  },
  nav: [
    { href: "/events", label: "Events" },
    { href: "/drivers", label: "Drivers" },
    { href: "/about", label: "About" },
  ],
} as const;
