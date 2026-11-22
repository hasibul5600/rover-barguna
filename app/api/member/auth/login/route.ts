import { NextRequest, NextResponse } from "next/server";

const OAUTH_STATE_COOKIE = "rover_member_oauth_state";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) return NextResponse.redirect(new URL("/member/login?error=config", request.url));
  const returnTo = request.nextUrl.searchParams.get("next");
  const safeNext = returnTo?.startsWith("/member") ? returnTo : "/member";
  const state = crypto.randomUUID();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_STATE_COOKIE, JSON.stringify({ state, next: safeNext }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 10 * 60, path: "/" });
  return response;
}
