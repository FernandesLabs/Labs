import { NextResponse } from 'next/server'

/**
 * POST /api/newsletter
 *
 * Accepts a JSON body `{ email: string }`, validates the email, and "stores"
 * the subscription. In production this would forward to a provider (Mailchimp,
 * Buttondown, ConvertKit, …) — for now it validates and returns a success
 * response so the UI can show confirmation feedback.
 *
 * The endpoint is intentionally provider-agnostic: swap the `subscribeEmail`
 * implementation for a real API call when a provider is chosen.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SubscribeBody {
  email?: unknown
}

/**
 * Persist a subscription. Placeholder implementation — returns true to signal
 * success. Replace with a real provider call (e.g. Mailchimp Lists API) when
 * configured.
 */
async function subscribeEmail(email: string): Promise<boolean> {
  // No-op store. In production:
  //   await fetch('https://usX.api.mailchimp.com/3.0/lists/<list>/members', {
  //     method: 'POST',
  //     headers: { Authorization: `Basic ${btoa('any:' + apiKey)}` },
  //     body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  //   })
  void email
  return true
}

export async function POST(request: Request) {
  let body: SubscribeBody
  try {
    body = (await request.json()) as SubscribeBody
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email) {
    return NextResponse.json(
      { ok: false, error: 'Email is required.' },
      { status: 400 }
    )
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  try {
    await subscribeEmail(email)
    return NextResponse.json(
      {
        ok: true,
        message: "You're subscribed! We'll notify you when new tools launch.",
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

// Optional GET for health-check / debugging.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/newsletter',
    method: 'POST',
  })
}
