import { cookies } from "next/headers";

export const MEMBER_SESSION_COOKIE = "rover_member_session";
export const MEMBER_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type MemberSession = { memberId: string; email: string; name: string; exp: number };

function toBase64Url(value: Uint8Array) {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

export async function createMemberSession(session: Omit<MemberSession, "exp">, secret: string) {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + MEMBER_SESSION_DURATION_SECONDS })));
  return `${body}.${await sign(body, secret)}`;
}

export async function verifyMemberSession(token?: string | null, secret = process.env.MEMBER_SESSION_SECRET): Promise<MemberSession | null> {
  if (!token || !secret) return null;
  const [body, received] = token.split(".");
  if (!body || !received) return null;
  const expected = await sign(body, secret);
  if (received.length !== expected.length) return null;
  let difference = 0;
  for (let index = 0; index < received.length; index++) difference |= received.charCodeAt(index) ^ expected.charCodeAt(index);
  if (difference) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as MemberSession;
    return session.memberId && session.email && session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch {
    return null;
  }
}

export async function getMemberSession() {
  return verifyMemberSession((await cookies()).get(MEMBER_SESSION_COOKIE)?.value);
}
