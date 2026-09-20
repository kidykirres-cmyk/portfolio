import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  url.hostname = "gokulk.freedev.app";
  url.protocol = "https:";

  const response = await fetch(url.toString(), {
    method: request.method,
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Content-Type": request.headers.get("Content-Type") || "application/json",
      "Cookie": request.headers.get("Cookie") || "",
      "Authorization": request.headers.get("Authorization") || "",
      "X-Requested-With": request.headers.get("X-Requested-With") || "XMLHttpRequest",
    },
    body: ["GET", "HEAD", "OPTIONS"].includes(request.method) ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  responseHeaders.set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,X-XSRF-TOKEN");
  responseHeaders.set("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: responseHeaders });
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

export const config: Config = { path: "/api/*" };
