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

/** Returns null when the API cannot be reached, so pages can show a friendly state. */
async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
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
