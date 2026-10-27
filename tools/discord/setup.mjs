// Sets up the Team Gondal Discord server: roles, channels, permissions, Community mode,
// starter messages and a permanent invite. Safe to re-run: anything that already exists
// (matched by name) is left alone. See docs/DISCORD.md.
//
//   node --env-file=tools/discord/.env tools/discord/setup.mjs
//
// tools/discord/.env (git ignored):
//   DISCORD_BOT_TOKEN=...
//   DISCORD_GUILD_ID=...   (leave out on the first run to get the bot invite link)

const API = "https://discord.com/api/v10";
const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

const P = {
  KICK_MEMBERS: 1n << 1n,
  ADMINISTRATOR: 1n << 3n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  MOVE_MEMBERS: 1n << 24n,
  MANAGE_EVENTS: 1n << 33n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  MODERATE_MEMBERS: 1n << 40n,
};
const bits = (...names) => names.reduce((acc, n) => acc | P[n], 0n).toString();
const READ_ONLY = ["SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "SEND_MESSAGES_IN_THREADS"];

const TEXT = 0;
const VOICE = 2;
const CATEGORY = 4;
const ANNOUNCEMENT = 5;

const ROLES = [
  { name: "admin", color: 0xffd100, hoist: true, permissions: bits("ADMINISTRATOR") },
  {
    name: "steward",
    color: 0x1e6bff,
    hoist: true,
    mentionable: true,
    permissions: bits("MANAGE_MESSAGES", "MUTE_MEMBERS", "MOVE_MEMBERS", "MANAGE_EVENTS", "MODERATE_MEMBERS", "KICK_MEMBERS"),
  },
  { name: "driver", color: 0xffffff, hoist: true, mentionable: true, permissions: "0" },
];

// access: "read-only" (only admins post), "stewards-post", "drivers-only", "stewards-speak", "staff-only"
const LAYOUT = [
  {
    category: "INFO",
    channels: [
      { name: "welcome", access: "read-only", topic: "Start here. Team Gondal is a sim racing community from techyGondal." },
      { name: "rules", access: "read-only", topic: "Race clean, respect everyone." },
      { name: "announcements", access: "read-only", announcement: true, topic: "Race nights, leagues and news." },
    ],
  },
  {
    category: "RACING",
    channels: [
      { name: "race-nights", topic: "Event posts, server name and password, start times." },
      { name: "results", access: "stewards-post", topic: "Official results, posted by stewards." },
      { name: "incidents", access: "drivers-only", topic: "Lap number, drivers involved, a short clip. Stewards review." },
      { name: "setups", topic: "Share and ask about car setups." },
    ],
  },
  {
    category: "COMMUNITY",
    channels: [{ name: "general" }, { name: "clips-and-screenshots" }, { name: "rigs-and-hardware" }],
  },
  {
    category: "VOICE",
    channels: [
      { name: "Race Control", type: VOICE, access: "stewards-speak" },
      { name: "Grid 1", type: VOICE },
      { name: "Grid 2", type: VOICE },
      { name: "Lounge", type: VOICE },
    ],
  },
  {
    category: "STAFF",
    channels: [{ name: "staff", access: "staff-only", topic: "Admins and stewards. Discord sends community updates here." }],
  },
];

const WELCOME = `# Welcome to Team Gondal 🏁
The sim racing community from **techyGondal**. Race nights, leagues and a home for drivers of every skill level.

**Start here**
• Read <#RULES>
• Race nights are posted in <#RACE_NIGHTS> and as Discord events
• Say hi in <#GENERAL>

**Links**
• Website: https://teamgondal.com
• YouTube: https://www.youtube.com/@TechyGondal
• techyGondal: https://techygondal.com`;

const RULES = `# Rules
**1. Race clean.** Give room, leave space, own your mistakes.
**2. Respect everyone,** every skill level. No harassment or hate.
**3. Steward decisions are final on race night.** Discuss in <#INCIDENTS> afterward.
**4. No spam or self promotion** outside <#CLIPS>.
**5. Follow Discord's Terms of Service.** https://discord.com/terms`;

async function discord(method, path, body) {
  for (;;) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      const { retry_after } = await res.json();
      await new Promise((r) => setTimeout(r, Math.ceil(retry_after * 1000) + 100));
      continue;
    }
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  }
}

function overwrites(access, roles) {
  const everyone = guildId;
  const allow = (id, ...p) => ({ id, type: 0, allow: bits(...p), deny: "0" });
  const deny = (id, ...p) => ({ id, type: 0, allow: "0", deny: bits(...p) });
  switch (access) {
    case "read-only":
      return [deny(everyone, ...READ_ONLY)];
    case "stewards-post":
      return [deny(everyone, ...READ_ONLY), allow(roles.steward, ...READ_ONLY)];
    case "drivers-only":
      return [deny(everyone, "VIEW_CHANNEL"), allow(roles.driver, "VIEW_CHANNEL"), allow(roles.steward, "VIEW_CHANNEL")];
    case "stewards-speak":
      return [deny(everyone, "SPEAK"), allow(roles.steward, "SPEAK")];
    case "staff-only":
      return [deny(everyone, "VIEW_CHANNEL"), allow(roles.steward, "VIEW_CHANNEL")];
    default:
      return [];
  }
}

async function main() {
  if (!token) throw new Error("Set DISCORD_BOT_TOKEN in tools/discord/.env (see docs/DISCORD.md).");

  if (!guildId) {
    const app = await discord("GET", "/oauth2/applications/@me");
    console.log("Add the bot to your server with this link, then set DISCORD_GUILD_ID and run again:");
    console.log(`https://discord.com/oauth2/authorize?client_id=${app.id}&scope=bot&permissions=8`);
    return;
  }

  const guild = await discord("GET", `/guilds/${guildId}`);
  console.log(`Setting up "${guild.name}"`);

  // Roles: create in reverse so the list reads admin, steward, driver from the top.
  const existingRoles = await discord("GET", `/guilds/${guildId}/roles`);
  const roles = {};
  for (const role of [...ROLES].reverse()) {
    const found = existingRoles.find((r) => r.name === role.name);
    roles[role.name] = found ? found.id : (await discord("POST", `/guilds/${guildId}/roles`, role)).id;
    console.log(`${found ? "  kept" : "  created"} role ${role.name}`);
  }

  let channels = await discord("GET", `/guilds/${guildId}/channels`);
  const byName = {};

  // Reuse the default channels Discord creates instead of deleting them.
  const rename = async (fromName, type, toName) => {
    const ch = channels.find((c) => c.name === fromName && c.type === type);
    if (ch && !channels.some((c) => c.name === toName && c.type === type)) {
      await discord("PATCH", `/channels/${ch.id}`, { name: toName });
      ch.name = toName;
    }
  };
  await rename("General", VOICE, "Lounge");

  for (const [i, group] of LAYOUT.entries()) {
    let category = channels.find((c) => c.type === CATEGORY && c.name.toUpperCase() === group.category);
    if (!category) {
      category = await discord("POST", `/guilds/${guildId}/channels`, { name: group.category, type: CATEGORY, position: i });
      channels.push(category);
      console.log(`  created category ${group.category}`);
    }

    for (const spec of group.channels) {
      const type = spec.type ?? TEXT;
      const sameKind = (c) => (type === VOICE ? c.type === VOICE : c.type === TEXT || c.type === ANNOUNCEMENT);
      let ch = channels.find((c) => c.name === spec.name && sameKind(c));
      const label = type === VOICE ? `voice ${spec.name}` : `#${spec.name}`;
      const settings = {
        parent_id: category.id,
        permission_overwrites: overwrites(spec.access, roles),
        ...(spec.topic ? { topic: spec.topic } : {}),
      };
      if (ch) {
        if (ch.parent_id !== category.id) {
          await discord("PATCH", `/channels/${ch.id}`, settings);
          console.log(`  moved ${label} to ${group.category}`);
        }
      } else {
        ch = await discord("POST", `/guilds/${guildId}/channels`, { name: spec.name, type, ...settings });
        channels.push(ch);
        console.log(`  created ${label}`);
      }
      byName[spec.name] = ch;
    }
  }

  // Remove Discord's default categories once they are empty.
  channels = await discord("GET", `/guilds/${guildId}/channels`);
  for (const name of ["Text Channels", "Voice Channels"]) {
    const cat = channels.find((c) => c.type === CATEGORY && c.name === name);
    if (cat && !channels.some((c) => c.parent_id === cat.id)) {
      await discord("DELETE", `/channels/${cat.id}`);
      channels = channels.filter((c) => c.id !== cat.id);
      console.log(`  removed empty default category ${name}`);
    }
  }

  // Report leftovers from Discord's starter template; deleting them is left to you.
  const managed = new Set(Object.values(byName).map((c) => c.id));
  const managedCategories = new Set(LAYOUT.map((g) => g.category));
  const extras = channels.filter((c) =>
    c.type === CATEGORY ? !managedCategories.has(c.name.toUpperCase()) : !managed.has(c.id),
  );
  if (extras.length) console.log(`  not part of the layout (delete if unwanted): ${extras.map((c) => c.name).join(", ")}`);

  // Community mode needs a rules channel, an updates channel, verification and the media filter.
  // The updates channel must stay a plain text channel, so it is #staff rather than #announcements.
  if (!guild.features.includes("COMMUNITY")) {
    await discord("PATCH", `/guilds/${guildId}`, {
      features: [...guild.features, "COMMUNITY"],
      verification_level: 2,
      explicit_content_filter: 2,
      rules_channel_id: byName.rules.id,
      public_updates_channel_id: byName.staff.id,
      description: "Sim racing community from techyGondal. Race nights, leagues and a home for drivers.",
    });
    console.log("  enabled Community mode");
  } else if (guild.public_updates_channel_id !== byName.staff.id) {
    // Discord silently ignores this unless the Community fields are sent together.
    await discord("PATCH", `/guilds/${guildId}`, {
      features: guild.features,
      rules_channel_id: byName.rules.id,
      public_updates_channel_id: byName.staff.id,
    });
    console.log("  set #staff as the community updates channel");
  }
  if (byName.announcements.type !== ANNOUNCEMENT) {
    await discord("PATCH", `/channels/${byName.announcements.id}`, { type: ANNOUNCEMENT });
    console.log("  made #announcements an Announcement channel");
  }

  // Starter messages, posted once.
  const me = await discord("GET", "/users/@me");
  const postOnce = async (ch, content) => {
    const recent = await discord("GET", `/channels/${ch.id}/messages?limit=20`);
    if (recent.some((m) => m.author.id === me.id)) return;
    await discord("POST", `/channels/${ch.id}/messages`, { content });
    console.log(`  posted in #${ch.name}`);
  };
  const link = (text) =>
    text
      .replace("<#RULES>", `<#${byName.rules.id}>`)
      .replace("<#RACE_NIGHTS>", `<#${byName["race-nights"].id}>`)
      .replace("<#GENERAL>", `<#${byName.general.id}>`)
      .replace("<#INCIDENTS>", `<#${byName.incidents.id}>`)
      .replace("<#CLIPS>", `<#${byName["clips-and-screenshots"].id}>`);
  await postOnce(byName.welcome, link(WELCOME));
  await postOnce(byName.rules, link(RULES));

  // A permanent invite into #welcome. Discord returns the existing one when settings match.
  const invite = await discord("POST", `/channels/${byName.welcome.id}/invites`, { max_age: 0, max_uses: 0, unique: false });
  console.log(`\nDone. Invite: https://discord.gg/${invite.code}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
