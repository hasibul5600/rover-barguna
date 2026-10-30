const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function frame(title: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #dbe7df;border-radius:14px;overflow:hidden"><header style="background:#073b2c;color:#f5bf43;padding:22px;font-weight:bold">রোভার স্কাউট বরগুনা</header><main style="padding:24px;color:#24332d"><h2>${escape(title)}</h2>${body}</main><footer style="padding:16px 24px;background:#f7faf8;color:#66756d;font-size:12px">Barguna Polytechnic Institute Rover Scout Group</footer></div>`;
}
export const applicationReceived = (name: string) => frame("আবেদন গ্রহণ করা হয়েছে", `<p>প্রিয় ${escape(name)}, আপনার সদস্যপদের আবেদন সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।</p>`);
export const applicationStatus = (name: string, status: "approved" | "rejected") => frame("আবেদনের হালনাগাদ", `<p>প্রিয় ${escape(name)}, আপনার আবেদন ${status === "approved" ? "অনুমোদিত হয়েছে" : "অনুমোদিত হয়নি"}।</p>`);
export const adminAlert = (title: string, detail: string) => frame(title, `<p>${escape(detail)}</p>`);
