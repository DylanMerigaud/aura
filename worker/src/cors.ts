// Origin allow list for the static game builds: GitHub Pages, the two itch.io iframe hosts and the local dev server.
export const ALLOWED_ORIGINS = [
  "https://dylanmerigaud.github.io",
  "https://html.itch.zone",
  "https://v6p9d9t4.ssl.hwcdn.net",
  "http://localhost:8080",
];

export function isAllowedOrigin(origin: string | null): boolean {
  return origin !== null && ALLOWED_ORIGINS.includes(origin);
}

// Headers echo the request origin only when it is allowed, so a browser on any other origin
// gets no CORS grant. Vary keeps caches from sharing one origin's grant with another.
export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    vary: "Origin",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
  if (isAllowedOrigin(origin)) headers["access-control-allow-origin"] = origin as string;
  return headers;
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "content-type": "application/json" },
  });
}
