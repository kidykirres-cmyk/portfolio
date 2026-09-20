import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  url.hostname = "gokulk.freedev.app";
  url.protocol = "https:";
  
  // Forward request with browser-like headers
  const response = await fetch(url.toString(), {
    method: request.method,
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Cookie": request.headers.get("Cookie") || "",
    },
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
  });
  
  // Return response with CORS headers
  return new Response(response.body, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
};

export const config: Config = { path: "/api/*" };
