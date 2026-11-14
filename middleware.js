// mcp.growthapp.me sin «/mcp»: quien pega solo el dominio en Claude o ChatGPT
// también llega al servidor MCP. La raíz de growthapp.me sigue siendo la landing.
// Corre antes que los archivos estáticos (que si no responderían index.html).
export const config = { matcher: "/" };

const MCP = "https://tlwboeoreerunwakkkan.supabase.co/functions/v1/growth-mcp/mcp";

export default async function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname !== "mcp.growthapp.me") return;
  const headers = new Headers(request.headers);
  headers.delete("host");
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
  return fetch(MCP + url.search, { method: request.method, headers, body, redirect: "manual" });
}
