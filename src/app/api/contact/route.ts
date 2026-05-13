import { siteConfig } from "@/lib/site-config";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Body = { name?: unknown; email?: unknown; message?: unknown };

export async function POST(request: Request) {
  let json: Body;
  try {
    json = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(json.name ?? "").trim();
  const email = String(json.email ?? "").trim();
  const message = String(json.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL ?? siteConfig.email;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    return Response.json({ ok: false, code: "MAIL_NOT_CONFIGURED" as const }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio inquiry from ${name}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    }),
  });

  if (!res.ok) {
    return Response.json({ ok: false, error: "Could not send email. Try again later." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
