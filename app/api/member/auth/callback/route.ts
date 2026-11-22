import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";
import { createMemberSession, MEMBER_SESSION_COOKIE, MEMBER_SESSION_DURATION_SECONDS } from "@/lib/memberAuth";

type GoogleProfile = { email?: string; email_verified?: boolean; name?: string };
const OAUTH_STATE_COOKIE = "rover_member_oauth_state";

export async function GET(request: NextRequest) {
  const errorUrl = new URL("/member/login", request.url);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const sessionSecret = process.env.MEMBER_SESSION_SECRET;
  let oauthState: { state?: string; next?: string } = {};
  try { oauthState = JSON.parse(request.cookies.get(OAUTH_STATE_COOKIE)?.value || "{}"); } catch { /* invalid state is handled below */ }
  if (!code || !state || state !== oauthState.state || !clientId || !clientSecret || !redirectUri || !sessionSecret) {
    errorUrl.searchParams.set("error", "config");
    return NextResponse.redirect(errorUrl);
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
    const token = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !token.access_token) throw new Error("Google token exchange failed");
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store" });
    const profile = await profileResponse.json() as GoogleProfile;
    const email = profile.email?.trim().toLowerCase();
    if (!profileResponse.ok || !email || !profile.email_verified) throw new Error("Google account email is not verified");
    await connectDb();
    const member = await ContentItem.findOne({ collection: "members", status: { $ne: "draft" }, "meta.email": email }).lean() as { _id: { toString(): string }; title: string } | null;
    if (!member) {
      errorUrl.searchParams.set("error", "not-member");
      return NextResponse.redirect(errorUrl);
    }
    const response = NextResponse.redirect(new URL(oauthState.next?.startsWith("/member") ? oauthState.next : "/member", request.url));
    response.cookies.set(OAUTH_STATE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: new Date(0), path: "/" });
    response.cookies.set(MEMBER_SESSION_COOKIE, await createMemberSession({ memberId: member._id.toString(), email, name: member.title || profile.name || "সদস্য" }, sessionSecret), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: MEMBER_SESSION_DURATION_SECONDS, path: "/" });
    return response;
  } catch (error) {
    console.error("Member Google sign-in failed:", error);
    errorUrl.searchParams.set("error", "signin");
    return NextResponse.redirect(errorUrl);
  }
}
