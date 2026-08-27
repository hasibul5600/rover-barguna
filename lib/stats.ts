import connectDb from "@/lib/db";
import ContentItem from "@/models/ContentItem";

export type StatRecent = {
  id: string;
  collection: string;
  title: string;
  status: string;
  createdAt: string;
  meta: Record<string, unknown>;
};

export type AdminStats = {
  members: number;
  membersThisMonth: number;
  exmembers: number;
  requests: number;
  requestsNew: number;
  events: number;
  eventsUpcoming: number;
  messages: number;
  messagesUnread: number;
  activities: number;
  notices: number;
  gallery: number;
  recent: StatRecent[];
  /** Server timestamp, so the dashboard can show when the numbers were taken. */
  at: string;
};

/** All zeroes — used as the client's starting state and when a fetch fails. */
export const EMPTY_STATS: AdminStats = {
  members: 0,
  membersThisMonth: 0,
  exmembers: 0,
  requests: 0,
  requestsNew: 0,
  events: 0,
  eventsUpcoming: 0,
  messages: 0,
  messagesUnread: 0,
  activities: 0,
  notices: 0,
  gallery: 0,
  recent: [],
  at: "",
};

/**
 * Live counts for the admin dashboard. Called both by /api/admin/stats (for the
 * client's polling) and by the dashboard page itself (so the first paint already
 * has real numbers instead of a skeleton).
 */
export async function loadAdminStats(): Promise<AdminStats> {
  await connectDb();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Event dates are stored as YYYY-MM-DD strings, so a lexical compare orders them.
  const todayIso = new Date().toISOString().slice(0, 10);

  const [
    members,
    membersThisMonth,
    exmembers,
    requests,
    requestsNew,
    events,
    eventsUpcoming,
    messages,
    messagesUnread,
    activities,
    notices,
    gallery,
    recentDocs,
  ] = await Promise.all([
    ContentItem.countDocuments({ collection: "members" }),
    ContentItem.countDocuments({ collection: "members", createdAt: { $gte: monthStart } }),
    ContentItem.countDocuments({ collection: "exmembers" }),
    ContentItem.countDocuments({ collection: "requests" }),
    ContentItem.countDocuments({ collection: "requests", status: "new" }),
    ContentItem.countDocuments({ collection: "events" }),
    ContentItem.countDocuments({ collection: "events", "meta.date": { $gte: todayIso } }),
    ContentItem.countDocuments({ collection: "messages" }),
    ContentItem.countDocuments({ collection: "messages", status: "unread" }),
    ContentItem.countDocuments({ collection: "activities" }),
    ContentItem.countDocuments({ collection: "notices" }),
    ContentItem.countDocuments({ collection: "gallery" }),
    ContentItem.find({}, { collection: 1, title: 1, status: 1, createdAt: 1, meta: 1 })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  return {
    members,
    membersThisMonth,
    exmembers,
    requests,
    requestsNew,
    events,
    eventsUpcoming,
    messages,
    messagesUnread,
    activities,
    notices,
    gallery,
    recent: recentDocs.map((doc) => ({
      id: String(doc._id),
      collection: String(doc.collection ?? ""),
      title: String(doc.title ?? ""),
      status: String(doc.status ?? ""),
      createdAt: doc.createdAt ? new Date(doc.createdAt as Date).toISOString() : "",
      meta: (doc.meta as Record<string, unknown>) || {},
    })),
    at: new Date().toISOString(),
  };
}
