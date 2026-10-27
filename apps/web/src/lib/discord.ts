export type DiscordServer = { name: string; icon: string | null };

/**
 * Server name and icon for a public invite link, from Discord's unauthenticated invite endpoint.
 * Returns null when the invite is invalid, expired or Discord is unreachable.
 */
export async function getInviteServer(invite: string): Promise<DiscordServer | null> {
  const code = invite.split("/").pop();
  if (!code) return null;
  try {
    const res = await fetch(`https://discord.com/api/v10/invites/${code}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { guild?: { id: string; name: string; icon: string | null } };
    if (!data.guild) return null;
    const { id, name, icon } = data.guild;
    return { name, icon: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=128` : null };
  } catch {
    return null;
  }
}
