import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function trySendContactEmail(payload: ContactPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !to) {
    return { sent: false, reason: "SMTP not configured" as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Portfolio Contact <${user}>`,
    to,
    subject: `New message from ${payload.name}`,
    replyTo: payload.email,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
  });

  return { sent: true as const };
}
