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
const VAPID_PUBLIC_KEY = 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY';
