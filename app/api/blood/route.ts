import { NextResponse } from "next/server";
import { listPublic } from "@/lib/publicApi";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const bloodGroup = query.get("bloodGroup") || ""; const search = (query.get("search") || "").toLowerCase();
  const people = [...await listPublic("members", 500), ...await listPublic("exmembers", 500)].filter((item) => {
    const m = item.meta as Record<string, unknown>; const haystack = `${item.title} ${m.department || ""}`.toLowerCase();
    return (m.isBloodDonor === true || m.isBloodDonor === "হ্যাঁ") && (!bloodGroup || m.bloodGroup === bloodGroup) && (!search || haystack.includes(search));
  });
  return NextResponse.json(people);
}
