import { publicListRoute } from "@/lib/publicApi";
import { EVENT_COLLECTION } from "@/models/Event";

export const GET = publicListRoute(EVENT_COLLECTION, "ইভেন্ট লোড করা যায়নি।");
