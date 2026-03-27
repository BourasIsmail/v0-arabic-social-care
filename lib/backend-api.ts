// Backend API configuration
export const BACKEND_URL = process.env.BACKEND_URL || "https://enfance.entraide.ma/api";

export async function backendFetch(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  const headers = new Headers(options.headers);
  
  if (!headers.has("Content-Type") && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${BACKEND_URL}${path}`;
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// Helper to extract token from request headers
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
