import { Resend } from "resend";

type Mail = { to: string; subject: string; html: string };
const from = process.env.MAIL_FROM || "Rover Scout Barguna <onboarding@resend.dev>";

/** Sends through Resend when configured; otherwise logs safely so forms remain usable locally. */
export async function sendMail(mail: Mail) {
  if (!process.env.RESEND_API_KEY) {
    console.info("Email not configured:", { to: mail.to, subject: mail.subject });
    return { delivered: false };
  }
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ from, ...mail });
  if (result.error) throw new Error(result.error.message);
  return { delivered: true, id: result.data?.id };
}

export function adminEmail() { return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL; }
