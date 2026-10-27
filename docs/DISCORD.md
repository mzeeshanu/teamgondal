# Team Gondal Discord

The community lives on Discord: announcements, race nights, voice chat, setups and results. The website's Join page links here through `NEXT_PUBLIC_DISCORD_INVITE`.

Discord stopped letting apps create servers in July 2025, so creating the empty server is a manual click. Everything after that is scripted in [`tools/discord/setup.mjs`](../tools/discord/setup.mjs), which is safe to re-run.

## 1. Create the empty server (1 minute)

1. In Discord, click **+** at the bottom of the server list → **Create My Own** → **For a club or community** (or **For me and my friends**; either works).
2. Name: **Team Gondal**. Icon: the Apex G mark (`apps/web/src/app/icon.svg`, exported as a 512×512 PNG).

## 2. Create the bot (1 minute)

1. Go to <https://discord.com/developers/applications> → **New Application** → name it **Team Gondal Bot**.
2. **Bot** tab → **Reset Token** → copy it.
3. Copy `tools/discord/.env.example` to `tools/discord/.env` (git ignored) and paste the token after `DISCORD_BOT_TOKEN=`.

The same bot later handles race reminders, results posts and role sync (see the roadmap).

## 3. Run the script

```bash
node --env-file=tools/discord/.env tools/discord/setup.mjs
```

The first run prints a link to add the bot to your server with Administrator. Open it, choose **Team Gondal**, then put the server id in `.env` as `DISCORD_GUILD_ID` (Discord → User Settings → Advanced → Developer Mode on, then right click the server → **Copy Server ID**) and run it again.

The second run sets up everything below and prints a permanent invite link.

## What the script sets up

**Roles**, top to bottom. They match the roles the website will read once Discord sign in lands.

| Role | Color | Who | Permissions |
| --- | --- | --- | --- |
| `admin` | Racing yellow `#ffd100` | You | Administrator |
| `steward` | Electric blue `#1e6bff` | Race directors, incident review | Manage Messages, Mute/Move Members, Manage Events, Timeout, Kick |
| `driver` | White | Anyone who has raced with the team | Default |

**Channels**

| Category | Channels |
| --- | --- |
| INFO | `#welcome` and `#rules` (read only, with starter posts), `#announcements` (read only, Announcement channel) |
| RACING | `#race-nights`, `#results` (stewards post), `#incidents` (drivers and stewards only), `#setups` |
| COMMUNITY | `#general`, `#clips-and-screenshots`, `#rigs-and-hardware` |
| VOICE | `Race Control` (stewards speak, everyone listens), `Grid 1`, `Grid 2`, `Lounge` |
| STAFF | `#staff` (admins and stewards only; Discord sends community updates here) |

**Settings**: Community mode on (rules and announcements channels set), verification level Medium, explicit media filter for all members.

**Rules** posted in `#rules`:

1. Race clean. Give room, leave space, own your mistakes.
2. Respect everyone, every skill level. No harassment or hate.
3. Steward decisions are final on race night; discuss in `#incidents` afterward.
4. No spam or self promotion outside `#clips-and-screenshots`.
5. Follow Discord's Terms of Service.

## Left to do by hand

* Server icon.
* Give yourself the `admin` role (right click your name → Roles).
* Onboarding (Server Settings → Onboarding): one question, "Which sim do you race?", with optional roles for pings.
* Race nights as Discord Scheduled Events, so members get reminders.

## 4. Put the invite on the website

```bash
railway variable set NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/XXXXXX --service web
```

The web service rebuilds with the link. A custom link such as `discord.gg/teamgondal` needs Server Boost level 3; until then use the generated code.
