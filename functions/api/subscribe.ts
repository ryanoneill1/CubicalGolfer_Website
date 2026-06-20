/**
 * Cloudflare Pages Function — /api/subscribe
 * 
 * Proxies email subscriptions to ConvertKit form 9359554.
 * The API key is read from the CONVERTKIT_API_KEY environment secret
 * (set in Cloudflare Pages dashboard → Settings → Environment Variables).
 * 
 * This keeps the key server-side — it never ships to the browser.
 */

interface Env {
  CONVERTKIT_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // ── CORS for same-origin (belt-and-suspenders) ──
  const origin = ctx.request.headers.get('Origin') || '';
  if (origin && !origin.includes('cubicalgolfer.com') && !origin.includes('localhost')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Parse and validate input ──
  let body: { email?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Read API key from environment secret ──
  const apiKey = ctx.env.CONVERTKIT_API_KEY;
  if (!apiKey) {
    console.error('CONVERTKIT_API_KEY not set in environment');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Forward to ConvertKit ──
  try {
    const ckResponse = await fetch('https://api.convertkit.com/v3/forms/9359554/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        api_key: apiKey,
        email: email,
      }),
    });

    const ckData = await ckResponse.json();

    return new Response(JSON.stringify(ckData), {
      status: ckResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ConvertKit API error:', err);
    return new Response(JSON.stringify({ error: 'Subscription service unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
