import { publicListRoute } from "@/lib/publicApi";
import { MEMBER_COLLECTION } from "@/models/Member";

export const GET = publicListRoute(MEMBER_COLLECTION, "সদস্য তালিকা লোড করা যায়নি।");
