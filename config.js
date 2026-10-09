/* ============================================================
   BUDGET COCKPIT — YOUR CONFIGURATION
   ============================================================
   This is the ONLY file that should ever hold your real Supabase
   project details. It is deliberately separate from app.js: every
   time an updated app.js is shipped to you, THIS file is untouched —
   you never have to re-paste your credentials again after today.

   Both values below are safe to have in a public file: the project
   URL is public by design, and the anon key is a publishable key
   that can't do anything on its own — Row Level Security enforces
   that every person can only ever see their own rows, and every
   request also goes through the Edge Function, which checks the
   login on top of that.
   ============================================================ */
const SUPABASE_URL      = 'https://zxfvtiovpjnuqpabkkvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZnZ0aW92cGpudXFwYWJra3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MDQ5MDMsImV4cCI6MjEwNTE4MDkwM30.YDuD_GuKX745jEL6qoKnXcAuY8Dlyv9n77xSrlPie_o';

/* Daily expense reminder (push notifications) — the public half of a VAPID
   keypair. Public by design, same as the anon key above: it identifies this
   server to push services, it doesn't grant access to anything.
   Generate a real pair with: npx web-push generate-vapid-keys
   Then set this to the printed Public Key, and set the Private Key +
   a contact email (mailto:you@example.com) as VAPID_PRIVATE_KEY and
   VAPID_SUBJECT secrets on the Edge Function. Until a real key is set here,
   "Enable push notifications" in Settings will show an error instead of
   silently doing nothing.
   ============================================================ */
const VAPID_PUBLIC_KEY = 'BNzUnBcFKCAubkXD8S_ueR-80FQLTieHxPteqijk3IY6IQE4pJjluVVcPJ7c-jD4utWcISIMYOzuAnC1c56SrJA';

/* Bot protection on login, signup and password reset — Cloudflare Turnstile.
   This is the public Site Key, safe to expose (same as the anon key above).
   1. Create a Turnstile widget at https://dash.cloudflare.com (Turnstile),
      add your real domain as the hostname, choose "Managed".
   2. Paste the Site Key below.
   3. Paste the Secret Key into Supabase Dashboard → Authentication →
      Bot and Abuse Protection → Enable CAPTCHA protection → Turnstile.
   Steps 2 and 3 must both be done together — once Supabase has CAPTCHA
   enabled, every signup/login/reset needs a valid token or Supabase
   rejects it outright. Leave this as the placeholder and nothing changes:
   no widget renders, no token is sent, auth works exactly as before.
   ============================================================ */
const TURNSTILE_SITE_KEY = '0x4AAAAAAFSBHW8Cw2sjMC00';
