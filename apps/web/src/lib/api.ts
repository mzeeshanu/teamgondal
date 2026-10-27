// Server side client for the Team Gondal API. On Railway, point API_URL at the
// API service's private address, e.g. http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
const API_URL = process.env.API_URL ?? "http://localhost:5231";

export type RaceEvent = {
  id: string;
  title: string;
  description: string | null;
  game: string;
  track: string;
  carClass: string | null;
  startsAt: string;
  serverInfo: string | null;
};

export type Driver = {
  id: string;
  displayName: string;
  raceNumber: number | null;
  country: string | null;
  joinedAt: string;
};

/**
 * Returns null when the API cannot be reached, so pages can show a friendly state.
 * The timeout matters at build time: Railway's private network is not reachable
 * during builds, so prerendering would otherwise hang until Next.js gives up.
 */
async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  upcomingEvents: () => get<RaceEvent[]>("/api/events?upcoming=true"),
  events: () => get<RaceEvent[]>("/api/events"),
  drivers: () => get<Driver[]>("/api/drivers"),
};
