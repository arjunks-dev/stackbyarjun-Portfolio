import { NextResponse } from "next/server";

export const runtime = "edge";

interface ContactBody {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
}

async function verifyTurnstile(token: string, request: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: request.headers.get("cf-connecting-ip") || undefined,
    }),
  });

  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, email, message, turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json({ error: "Security verification required" }, { status: 403 });
      }
      const valid = await verifyTurnstile(turnstileToken, request);
      if (!valid) {
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 });
      }
    }

    const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "Contact delivery is not configured. Set CONTACT_FORM_WEBHOOK_URL in Cloudflare Pages environment variables.",
        },
        { status: 503 },
      );
    }

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        _replyto: email.trim(),
        _subject: `Portfolio contact from ${name.trim()}`,
        timestamp: new Date().toISOString(),
        source: "stackbyarjun-portfolio",
      }),
    });

    if (!webhookRes.ok) {
      return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
