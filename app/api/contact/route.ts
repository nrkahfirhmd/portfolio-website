import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanHeader(value: string) {
  return value.replace(/[\r\n"]+/g, " ").trim();
}

export async function POST(req: Request) {
  const user = process.env.ICLOUD_USER;
  const pass = process.env.ICLOUD_APP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    const fromAddress = process.env.ICLOUD_FROM || user;

    await transporter.sendMail({
      from: `"${cleanHeader(name)}" <${fromAddress}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: cleanHeader(email),
      subject: `[Portfolio] ${cleanHeader(subject)}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json(
      { error: "Could not send message. Please try again later." },
      { status: 502 },
    );
  }
}
