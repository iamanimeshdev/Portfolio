/** Discord embed field value max length */
const DISCORD_FIELD_MAX = 1024;

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function isDiscordWebhookUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (host !== "discord.com" && host !== "discordapp.com") return false;
    return u.pathname.startsWith("/api/webhooks/");
  } catch {
    return false;
  }
}

async function sendDiscordContact(
  webhookUrl: string,
  name: string,
  email: string,
  message: string,
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const body = JSON.stringify({
    embeds: [
      {
        title: "Portfolio inquiry",
        color: 0x34_d399,
        fields: [
          { name: "Name", value: truncate(name, DISCORD_FIELD_MAX), inline: true },
          { name: "Email", value: truncate(email, DISCORD_FIELD_MAX), inline: true },
          { name: "Message", value: truncate(message, DISCORD_FIELD_MAX) },
        ],
      },
    ],
  });

  let res: Response;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    return { ok: false, status: 502, detail: "Could not reach Discord. Try again later." };
  }

  if (!res.ok) {
    let detail = "Could not deliver to Discord. Check the webhook URL.";
    try {
      const errText = await res.text();
      if (errText.trim()) detail = errText.trim().slice(0, 200);
    } catch {
      /* keep default */
    }
    return { ok: false, status: res.status >= 400 && res.status < 600 ? res.status : 502, detail };
  }

  return { ok: true };
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

  const discordWebhook = process.env.DISCORD_CONTACT_WEBHOOK_URL?.trim();
  if (!discordWebhook) {
    return Response.json({ ok: false, code: "CONTACT_NOT_CONFIGURED" as const }, { status: 503 });
  }

  if (!isDiscordWebhookUrl(discordWebhook)) {
    return Response.json(
      {
        ok: false,
        error:
          "Invalid DISCORD_CONTACT_WEBHOOK_URL. It must be an https URL under discord.com/api/webhooks/…",
      },
      { status: 400 },
    );
  }

  const d = await sendDiscordContact(discordWebhook, name, email, message);
  if (!d.ok) {
    return Response.json({ ok: false, error: d.detail }, { status: d.status });
  }

  return Response.json({ ok: true });
}
