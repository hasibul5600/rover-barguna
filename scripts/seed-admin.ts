import connectDb from "../lib/db";
import User from "../models/User";
import { hashPassword } from "../lib/password";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  await connectDb();
  if (await User.exists({})) return console.info("Users already exist; nothing to seed.");
  await User.create({ name: "Super Admin", email, passwordHash: await hashPassword(password), role: "super_admin", isActive: true });
  console.info(`Seeded ${email}`);
}
main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
