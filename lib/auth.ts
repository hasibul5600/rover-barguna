import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

/**
 * Server-side access to the signed admin session.
 *
 * The project uses its own HMAC cookie (see lib/adminAuth.ts) rather than
 * next-auth, so this is the single place server components and route handlers
 * should read the current admin from.
 */
export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifyAdminSession(token, process.env.ADMIN_SESSION_SECRET);
}

export async function isAdmin() {
  return Boolean(await getAdminSession());
}

/** True when the server has everything it needs to sign people in. */
export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export { SESSION_COOKIE };
