import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

/**
 * Guard for admin **pages** (server components).
 *
 * middleware.ts already redirects unauthenticated visitors away from /admin/*,
 * so this is defence in depth for pages that render sensitive data — and it
 * hands back the session so the page can greet the admin by email.
 */
export async function requireAdminPage(returnTo?: string) {
  const session = await getAdminSession();
  if (!session) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/admin/login${next}`);
  }
  return session;
}

/** Send an already-signed-in admin away from the login screen. */
export async function redirectIfSignedIn(to = "/admin") {
  if (await getAdminSession()) redirect(to);
}
