const SESSION_COOKIE = "rover_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = { email: string; role: "admin"; exp: number };

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signed));
}

export async function createAdminSession(email: string, secret: string) {
  const payload: SessionPayload = { email, role: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS };
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await signature(body, secret)}`;
}

export async function verifyAdminSession(token?: string | null, secret?: string): Promise<SessionPayload | null> {
  if (!token || !secret) return null;
  const [body, received] = token.split(".");
  if (!body || !received) return null;
  const expected = await signature(body, secret);
  if (received.length !== expected.length) return null;
  let difference = 0;
  for (let i = 0; i < received.length; i++) difference |= received.charCodeAt(i) ^ expected.charCodeAt(i);
  if (difference) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;
    return payload.role === "admin" && payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_DURATION_SECONDS };
