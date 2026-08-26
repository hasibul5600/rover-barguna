import { publicListRoute } from "@/lib/publicApi";
import { NOTICE_COLLECTION } from "@/models/Notice";

export const GET = publicListRoute(NOTICE_COLLECTION, "নোটিশ লোড করা যায়নি।");
