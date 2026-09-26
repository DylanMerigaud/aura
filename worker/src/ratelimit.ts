// Fixed window rate limit, 30 requests per minute per client IP, counted in the RATE KV namespace.
// A fixed window is enough here: the limit only exists to keep one client from burning the partner
// API quotas, and KV cannot do atomic increments anyway.
export const LIMIT = 30;
export const WINDOW_SECONDS = 60;

export interface RateStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export function rateKey(ip: string, now: number): string {
  return `rl:${ip}:${Math.floor(now / (WINDOW_SECONDS * 1000))}`;
}

// Returns true when the request is over the limit and must be rejected.
export async function overLimit(store: RateStore, ip: string, now: number = Date.now()): Promise<boolean> {
  const key = rateKey(ip, now);
  const current = Number((await store.get(key)) ?? 0);
  if (current >= LIMIT) return true;
  // Double the window as the TTL floor: KV requires at least 60 seconds and the count only has to
  // outlive its own window.
  await store.put(key, String(current + 1), { expirationTtl: WINDOW_SECONDS * 2 });
  return false;
}

export function clientIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
