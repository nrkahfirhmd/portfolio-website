import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 254, subject: 150, message: 5000 } as const;
const MAX_BODY = 12_000;

// shortcut: in-memory limit, per server process; move to Redis/KV if the site ever runs on several instances.
const LIMIT = 3;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [key, times] of hits) if (now - times[times.length - 1] > WINDOW_MS) hits.delete(key);
  return false;
}

let transporter: Transporter | undefined;
function mailer(user: string, pass: string) {
  transporter ??= nodemailer.createTransport({
    host: "smtp.mail.me.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
  return transporter;
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n"<>]+/g, " ").trim();
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const user = process.env.ICLOUD_USER;
  const pass = process.env.ICLOUD_APP_PASSWORD;

  if (!user || !pass) return fail("Email service is not configured.", 500);

  // Browsers always send Origin on a cross-site POST; refuse any that is not this site.
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return fail("Forbidden.", 403);

  // nginx sets X-Forwarded-For (DEPLOY.md); the first entry is the client.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return fail("Too many messages. Please try again in a few minutes.", 429);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail("Message is too long.", 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Invalid request body.", 400);
  }

  // A bot filled the hidden field: pretend it worked and send nothing.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const field = (key: keyof typeof MAX) => (typeof body[key] === "string" ? body[key].trim() : "");
  const name = field("name");
  const email = field("email");
  const subject = field("subject");
  const message = field("message");

  if (!name || !email || !subject || !message) return fail("All fields are required.", 400);
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.", 400);
  for (const key of Object.keys(MAX) as (keyof typeof MAX)[]) {
    if (field(key).length > MAX[key]) return fail(`${key[0].toUpperCase()}${key.slice(1)} is too long.`, 400);
  }

  try {
    await mailer(user, pass).sendMail({
      from: `"${cleanHeader(name)}" <${process.env.ICLOUD_FROM || user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: cleanHeader(email),
      subject: `[Portfolio] ${cleanHeader(subject)}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return fail("Could not send message. Please try again later.", 502);
  }
}
