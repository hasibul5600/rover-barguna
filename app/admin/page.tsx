import LiveDashboard from "@/components/admin/LiveDashboard";
import { EMPTY_STATS, loadAdminStats } from "@/lib/stats";

// Counts change constantly, so never serve this page from the build cache.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Server-render the first set of real numbers; LiveDashboard keeps them fresh.
  // If the database is unreachable we still render, and the client's poll retries.
  let stats = EMPTY_STATS;
  try {
    stats = await loadAdminStats();
  } catch (error) {
    console.error("Dashboard stats failed:", error);
  }

  return <LiveDashboard initial={stats} />;
}
