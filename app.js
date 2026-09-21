
/* ============================================================
   DEFAULT DATA
   ============================================================ */
const DEFAULT_CATEGORIES = [
  {id:'rent', name:'Rent / Housing', group:'Needs', budget:0, threshold:0.90, icon:'🏠'},
  {id:'util', name:'Utilities', group:'Needs', budget:0, threshold:0.90, icon:'💡'},
  {id:'transport', name:'Transport / Fuel', group:'Needs', budget:0, threshold:0.85, icon:'🚗'},
  {id:'food', name:'Feeding / Groceries', group:'Needs', budget:0, threshold:0.85, icon:'🍽️'},
  {id:'airtime', name:'Airtime & Data', group:'Needs', budget:0, threshold:0.90, icon:'📱'},
  {id:'health', name:'Health / Medical', group:'Needs', budget:0, threshold:0.90, icon:'🏥'},
  {id:'family', name:'Family support', group:'Needs', budget:0, threshold:0.90, icon:'👪'},
  {id:'debt', name:'Debt repayment', group:'Needs', budget:0, threshold:0.95, icon:'💳'},
  {id:'lend', name:'Money Lent Out', group:'Wants', budget:0, threshold:0.90, icon:'🤝'},
  {id:'care', name:'Personal care', group:'Wants', budget:0, threshold:0.85, icon:'🧴'},
  {id:'clothing', name:'Clothing', group:'Wants', budget:0, threshold:0.85, icon:'👕'},
  {id:'ent', name:'Entertainment', group:'Wants', budget:0, threshold:0.80, icon:'🎬'},
  {id:'subs', name:'Subscriptions', group:'Wants', budget:0, threshold:0.80, icon:'📺'},
  {id:'misc', name:'Misc / Buffer', group:'Wants', budget:0, threshold:0.80, icon:'🧾'},
  {id:'emergency', name:'Emergency Fund', group:'Savings', budget:0, threshold:null, goal:0, icon:'🚨'},
  {id:'invest', name:'Savings / Investment', group:'Savings', budget:0, threshold:null, goal:0, icon:'📈'},
];
const DEFAULT_ICON_BY_GROUP = { Needs:'📌', Wants:'✨', Savings:'💰' };

const LOCAL_QUOTES = [
  {text:"A budget is telling your money where to go instead of wondering where it went.", author:"John C. Maxwell"},
  {text:"Do not save what is left after spending; spend what is left after saving.", author:"Warren Buffett"},
  {text:"It's not your salary that makes you rich, it's your spending habits.", author:"Charles A. Jaffe"},
  {text:"The habit of saving is itself an education; it fosters every virtue.", author:"T.T. Munger"},
  {text:"Beware of little expenses; a small leak will sink a great ship.", author:"Benjamin Franklin"},
  {text:"You must gain control over your money or the lack of it will forever control you.", author:"Dave Ramsey"},
  {text:"Never spend your money before you have earned it.", author:"Thomas Jefferson"},
  {text:"An investment in knowledge pays the best interest.", author:"Benjamin Franklin"},
  {text:"Rich people have small TVs and big libraries, poor people have big TVs and small libraries.", author:"Zig Ziglar"},
  {text:"The stock market is a device for transferring money from the impatient to the patient.", author:"Warren Buffett"},
  {text:"Financial peace isn't the acquisition of stuff, it's learning to live on less than you make.", author:"Dave Ramsey"},
  {text:"Every time you borrow money, you're robbing your future self.", author:"Nathan W. Morris"},
  {text:"A part of all you earn is yours to keep.", author:"George S. Clason, The Richest Man in Babylon"},
  {text:"Money looks better in the bank than on your feet.", author:"Sophia Amoruso"},
  {text:"Discipline is choosing between what you want now and what you want most.", author:"Abraham Lincoln"},
  {text:"The rich buy assets. The poor only have expenses.", author:"Robert Kiyosaki, Rich Dad Poor Dad"},
  {text:"Wealth is what you don't see — spent money is gone, not wealth.", author:"Morgan Housel, The Psychology of Money"},
  {text:"Good investing isn't about being right — it's about staying wealthy for a long time.", author:"Morgan Housel, The Psychology of Money"},
  {text:"Whatever your income, always live below your means.", author:"Thomas J. Stanley, The Millionaire Next Door"},
  {text:"Money is a tool. Used wisely, it can make life more enjoyable.", author:"T. Harv Eker"},
  {text:"Frugality includes learning to enjoy what you already have.", author:"Vicki Robin, Your Money or Your Life"},
  {text:"Every dollar you have is a servant working for you.", author:"Idowu Koyenikan"},
  {text:"Not knowing your numbers is the fastest route to broke.", author:"Ramit Sethi"},
  {text:"Small amounts saved consistently outperform big amounts saved rarely.", author:"J.L. Collins, The Simple Path to Wealth"},
  {text:"A goal without a plan is just a wish.", author:"Antoine de Saint-Exupéry"},
  {text:"Formal education will make you a living; self-education will make you a fortune.", author:"Jim Rohn"},
  {text:"He who buys what he does not need steals from himself.", author:"Swedish proverb"},
  {text:"Thinking about tomorrow and ignoring today's small habits is how debt begins.", author:"Suze Orman"},
  {text:"The habit of saving money teaches every virtue — self-control, discipline, self-denial.", author:"T.T. Munger"},
  {text:"It is not the man who has too little, but the man who craves more, that is poor.", author:"Seneca"},
  {text:"Riches begin with a state of mind, with definiteness of purpose.", author:"Napoleon Hill, Think and Grow Rich"},
  {text:"He that is of the opinion money will do everything may well be suspected of doing everything for money.", author:"Benjamin Franklin"},
];

function pad(n){ return String(n).padStart(2,'0'); }
function toDateInput(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }

/* ============================================================
   PAYDAY RULE — fixed day of month, shifted to the preceding
   Friday if it falls on a Saturday or Sunday.
   ============================================================ */
function adjustForWeekend(date){
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const d = new Date(date);
  if(day === 6) d.setDate(d.getDate() - 1);
  else if(day === 0) d.setDate(d.getDate() - 2);
  return d;
}
function paydayForMonth(year, monthIndex, payDay){
  const lastDayOfMonth = new Date(year, monthIndex+1, 0).getDate();
  const day = Math.min(payDay, lastDayOfMonth);
  return adjustForWeekend(new Date(year, monthIndex, day));
}
function mostRecentPayday(payDay, ref){
  const thisMonth = paydayForMonth(ref.getFullYear(), ref.getMonth(), payDay);
  if(thisMonth <= ref) return thisMonth;
  return paydayForMonth(ref.getFullYear(), ref.getMonth()-1, payDay);
}
function refreshCycleDates(){
  const today = new Date(); today.setHours(0,0,0,0);
  const payDay = state.paydayDay || 25;
  const last = mostRecentPayday(payDay, today);
  const next = paydayForMonth(last.getFullYear(), last.getMonth()+1, payDay);
  state.lastPayDate = toDateInput(last);
  state.nextPayDate = toDateInput(next);
}

let state = {
  theme: 'dark',
  income: 0,
  email: '',
  currency: '₦',
  paydayDay: 25,
  lastPayDate: '',
  nextPayDate: '',
  categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
  savingsAccumulated: {},  // {categoryId: lifetime total, excluding current uncommitted cycle}
  extraIncome: [],
  transactions: [],
  history: [],
  debts: [],              // {id, creditor, reason, amount, interestRate}
  debtStrategy: 'avalanche', // 'avalanche' | 'snowball' | 'manual'
  debtFocusId: '',         // used when debtStrategy === 'manual'
  loans: [],               // {id, borrower, reason, amount} — money YOU lent out
  loanPaidAccumulated: {}, // {loanId: lifetime repaid total, excluding current uncommitted cycle}
  aiHistory: [],           // {id, role:'user'|'bot', text, error?}
  personalNotes: '',       // free-text budgeting notes/strategy from the Guide tab
  bills: [],               // {id, name, amount, dueDay} — recurring monthly bills/subscriptions
  shares: []                // {id, token, createdAt} — active shareable report links (local cache of what's on the server)
};

const CURRENCY_OPTIONS = [
  {sym:'₦', code:'NGN', label:'₦ Naira'}, {sym:'$', code:'USD', label:'$ Dollar'}, {sym:'£', code:'GBP', label:'£ Pound'},
  {sym:'€', code:'EUR', label:'€ Euro'}, {sym:'R', code:'ZAR', label:'R Rand'}, {sym:'₵', code:'GHS', label:'₵ Cedi'},
  {sym:'KSh', code:'KES', label:'KSh Kenyan Shilling'}, {sym:'₹', code:'INR', label:'₹ Rupee'}
];
function currencyCodeFor(sym){
  const c = CURRENCY_OPTIONS.find(x=>x.sym===sym);
  return c ? c.code : 'NGN';
}

/* ============================================================
   BACKEND CONFIG
   ============================================================ */
/* ------------------------------------------------------------------
   SUPABASE — fill these two in once (Supabase dashboard → Project
   Settings → API). Both are safe to have in this public file: the URL
   is public by design, and the anon key is a publishable key that can
   do nothing on its own. Row Level Security enforces that every
   person can only ever see their own rows; every request also goes
   through the Edge Function, which checks the login on top of that.
   ------------------------------------------------------------------ */
const SUPABASE_URL      = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

// Everything else in the app talks to this one endpoint, exactly as it
// used to talk to the Apps Script exec URL. Same action names, same
// JSON shapes — only the transport and the auth header changed.
const API_URL   = SUPABASE_URL + '/functions/v1/api';
const AUTH_URL  = SUPABASE_URL + '/auth/v1';
const STORAGE_KEY = 'budget-cockpit-state';
const SESSION_KEY = 'budget-cockpit-session';
const REFRESH_KEY = 'budget-cockpit-refresh';
const EXPIRY_KEY  = 'budget-cockpit-session-expiry';
const LOCAL_MIRROR_KEY = 'budget-cockpit-local-mirror';
const DEVICE_ID_KEY = 'budget-cockpit-device-id';

// A random id generated once per device/browser and persisted. Under the old
// Apps Script backend this was sent with every login so the failed-attempt
// lockout could be scoped per device (a global counter was a trivial denial
// of service). Supabase Auth now rate-limits sign-in attempts on its own
// side, so this is no longer sent with the login — it's kept only as a
// stable per-device id for local preferences.
let deviceId = '';
try{
  deviceId = localStorage.getItem(DEVICE_ID_KEY) || '';
  if(!deviceId){
    deviceId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
}catch(e){ /* private browsing may block storage — login still works, just without the per-device throttle */ }

// Session lives in localStorage (not sessionStorage) on purpose: it survives
// closing and reopening the app, so you can log expenses offline without
// needing a network round-trip just to log back in every time. Trade-off:
// it persists until you explicitly "Lock app now" or it expires server-side
// (12h) — use Lock now before handing the device to someone else.
let sessionToken = '';       // Supabase access token (a short-lived JWT, ~1h)
let refreshToken = '';       // Supabase refresh token (long-lived)
let sessionExpiresAt = 0;    // epoch ms the access token stops being valid
try{
  sessionToken     = localStorage.getItem(SESSION_KEY) || '';
  refreshToken     = localStorage.getItem(REFRESH_KEY) || '';
  sessionExpiresAt = Number(localStorage.getItem(EXPIRY_KEY) || 0);
}catch(e){ /* private browsing may block storage */ }

function storeSession(data){
  sessionToken = (data && data.access_token) || '';
  refreshToken = (data && data.refresh_token) || refreshToken;
  // expires_in is seconds. Subtract a minute so we refresh slightly early
  // rather than discovering expiry mid-request.
  const ttl = Number(data && data.expires_in) || 3600;
  sessionExpiresAt = Date.now() + (ttl * 1000);
  try{
    localStorage.setItem(SESSION_KEY, sessionToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(EXPIRY_KEY, String(sessionExpiresAt));
  }catch(e){}
}
function clearSession(){
  sessionToken = ''; refreshToken = ''; sessionExpiresAt = 0;
  try{
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  }catch(e){}
}

/* Supabase access tokens last about an hour, far less than the 12-hour
   sessions the Apps Script backend issued. Without this, the app would drop
   you back to the lock screen every hour — exactly the symptom this project
   has fought before, just from a new cause. So: refresh proactively when the
   token is nearly expired, and reactively if a request ever comes back
   Unauthorized. The in-flight promise is shared, so ten queued requests
   noticing an expired token at once trigger ONE refresh, not ten racing
   ones (a duplicate-refresh storm can invalidate the token it just got). */
let refreshInFlight = null;
async function refreshSession(){
  if(!refreshToken) return false;
  if(refreshInFlight) return refreshInFlight;
  refreshInFlight = (async ()=>{
    try{
      const res = await fetchWithTimeout(AUTH_URL + '/token?grant_type=refresh_token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY},
        body: JSON.stringify({ refresh_token: refreshToken })
      }, 15000);
      const data = await res.json();
      if(res.ok && data && data.access_token){ storeSession(data); return true; }
      // A refresh token that the server rejects is dead — there is nothing to
      // retry, so fall through and let the caller send us to the lock screen.
      return false;
    }catch(e){
      // Network failure, not a rejected token. Keep the refresh token: the
      // app is offline-first and will retry on the next request.
      return null;
    }finally{
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}
function sessionNearlyExpired(){
  return !!sessionToken && sessionExpiresAt > 0 && Date.now() > (sessionExpiresAt - 60000);
}

// isDirty = true means there are local changes not yet confirmed saved to
// the backend (either never attempted, or the attempt failed/was offline).
let isDirty = false;
// While true, the debounced saveState() and the periodic trySyncNow() both
// no-op instead of pushing to the backend. Used during restoreCycleFromHistory:
// without this, a background sync landing in the gap between "POST restore"
// and "GET fresh state" would push this browser's stale, pre-restore
// transaction list and silently overwrite the just-restored data.
let syncSuspended = false;
function saveLocalMirror(){
  try{ localStorage.setItem(LOCAL_MIRROR_KEY, JSON.stringify({ state, dirty: isDirty, savedAt: Date.now() })); }catch(e){}
}
function loadLocalMirror(){
  try{
    const raw = localStorage.getItem(LOCAL_MIRROR_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

// Wraps fetch() with a hard timeout via AbortController. Without this, a
// stalled request (weak mobile signal, an Apps Script cold start that never
// quite finishes, a proxy that swallows the response) hangs forever — the
// fetch promise neither resolves nor rejects, so callers relying on
// try/catch (including the login screen) get stuck on "Checking…"
// indefinitely with no way to know something went wrong. Aborting after a
// bounded time turns that silent hang into a normal, catchable failure that
// existing retry logic (trySyncNow, the 30s safety-net interval, the
// 'online' listener) already knows how to handle.
async function fetchWithTimeout(url, options, timeoutMs){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), timeoutMs);
  try{
    return await fetch(url, Object.assign({}, options, {signal: controller.signal}));
  }finally{
    clearTimeout(timer);
  }
}

// Centralized request helpers — every backend call goes through these,
// so auth (session/token) is attached consistently and a session that's
// expired or invalid triggers the lock screen instead of silently failing.
function authHeaders(){
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + (sessionToken || SUPABASE_ANON_KEY)
  };
}

// One shared implementation for GET and POST, so the refresh-and-retry rule
// can't drift between them. Order of events on an expired token:
//   1. refresh proactively if we already know it's about to expire
//   2. send the request
//   3. if the backend still says Unauthorized, refresh ONCE and resend
//   4. only if that also fails do we surrender the session and show the lock
// Step 3 matters because the client's clock can be wrong — a device whose
// time is off by hours would otherwise never refresh proactively and would
// look like it was being logged out at random.
async function apiRequest(action, opts){
  opts = opts || {};
  const send = async ()=>{
    if(opts.method === 'POST'){
      return await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(Object.assign({action}, opts.payload || {}))
      }, 20000);
    }
    let qs = '?action=' + encodeURIComponent(action);
    if(opts.params) Object.keys(opts.params).forEach(k => qs += '&'+k+'='+encodeURIComponent(opts.params[k]));
    return await fetchWithTimeout(API_URL + qs, {headers: authHeaders()}, 20000);
  };

  if(sessionNearlyExpired()) await refreshSession();

  let res = await send();
  let data = await res.json().catch(()=>null);

  if(res.status === 401 || (data && data.error === 'Unauthorized')){
    const refreshed = await refreshSession();
    if(refreshed === true){
      res = await send();
      data = await res.json().catch(()=>null);
    }
    if(res.status === 401 || (data && data.error === 'Unauthorized')){
      // refreshed === null means the refresh call itself couldn't reach the
      // network. Treating that as "your session is invalid" would log you out
      // for a flaky connection, which is precisely the failure mode this app
      // has been bitten by before. Surface it as a normal sync failure and
      // let the existing retry paths deal with it.
      if(refreshed === null) return {error: 'Could not reach backend'};
      onSessionInvalid();
    }
  }
  return data;
}

async function apiGet(action, extraParams){
  return await apiRequest(action, {method: 'GET', params: extraParams});
}
async function apiPost(action, payload){
  return await apiRequest(action, {method: 'POST', payload: payload});
}
function onSessionInvalid(){
  clearSession();
  try{ localStorage.removeItem(LOCAL_MIRROR_KEY); }catch(e){}
  // Same reasoning as lockNow() — an expired/invalidated session shouldn't
  // leave the previous session's full financial data sitting in the DOM or
  // in the local mirror, inspectable by whoever's at the device next.
  try{ sessionStorage.setItem('pendingLockMessage', 'Your session expired — please log in again.'); }catch(e){}
  location.reload();
}

async function loadState(){
  // 1. Load the local mirror first — instant, works fully offline.
  const mirror = loadLocalMirror();
  if(mirror && mirror.state){
    state = Object.assign(state, mirror.state);
    isDirty = !!mirror.dirty;
  }

  // 2. If we're online, try to refresh from the backend. If there are
  //    unsynced local changes (isDirty), don't let a server fetch overwrite
  //    them — push them to the server instead once reachable.
  if(API_URL && navigator.onLine){
    try{
      const data = await apiGet('getState');
      if(data && !data.error){
        if(!isDirty){ state = Object.assign(state, data); }
      } else if(data.error !== 'Unauthorized' && !mirror){
        showToast('Backend error: ' + (data.error||'unknown'));
      }
    }catch(e){
      if(!mirror) showToast('Could not reach backend — showing local data');
    }
  } else if(!API_URL){
    try{
      const res = await window.storage.get(STORAGE_KEY, false);
      if(res && res.value) state = Object.assign(state, JSON.parse(res.value));
    }catch(e){}
  }

  if(!state.paydayDay) state.paydayDay = 25;
  if(!state.savingsAccumulated) state.savingsAccumulated = {};
  if(!state.debtPaidAccumulated) state.debtPaidAccumulated = {};
  if(!state.debts) state.debts = [];
  if(!state.debtStrategy) state.debtStrategy = 'avalanche';
  if(state.debtFocusId == null) state.debtFocusId = '';
  if(!state.loans) state.loans = [];
  if(!state.loanPaidAccumulated) state.loanPaidAccumulated = {};
  // Existing accounts already have a saved categories list from the server,
  // which predates this category — add it once so it shows up for
  // returning users too, not just brand-new accounts.
  if(!state.categories.find(c=>c.id==='lend')){
    state.categories.push({id:'lend', name:'Money Lent Out', group:'Wants', budget:0, threshold:0.90, icon:'🤝'});
  }
  // One-time cleanup: fold the old, pre-existing lending category (created
  // before this app had a real one) into the new 'lend' category — moving
  // its transactions over rather than orphaning them, then removing the
  // now-redundant duplicate. Matches by name since the old one predates
  // any special id; 'debt' is excluded from the match on purpose.
  {
    const oldLendCats = state.categories.filter(c=>c.id!=='lend' && c.id!=='debt' && /lend|loan/i.test(c.name));
    if(oldLendCats.length){
      const oldIds = new Set(oldLendCats.map(c=>c.id));
      state.transactions.forEach(t=>{ if(oldIds.has(t.categoryId)) t.categoryId = 'lend'; });
      state.categories = state.categories.filter(c=>!oldIds.has(c.id));
    }
  }
  // Defensive: collapse any exact-id duplicate categories (e.g. two entries
  // both id:'lend') that may have crept in from an earlier session/version —
  // keeps the first occurrence of each id, drops the rest. Doesn't touch
  // transactions, which reference categories by id, so this can't orphan
  // any spending history.
  {
    const seenCatIds = new Set();
    state.categories = state.categories.filter(c=>{
      if(seenCatIds.has(c.id)) return false;
      seenCatIds.add(c.id);
      return true;
    });
  }
  if(!state.aiHistory) state.aiHistory = [];
  if(state.personalNotes == null) state.personalNotes = '';
  if(state.lastArchivedPayday == null) state.lastArchivedPayday = '';
  if(state.stateVersion == null) state.stateVersion = 0;
  if(!state.recurringTemplates) state.recurringTemplates = [];
  if(!state.currency) state.currency = '₦';
  if(!state.bills) state.bills = [];
  if(!state.shares) state.shares = [];
  state.categories.forEach(c=>{ if(c.group==='Savings' && c.goal==null) c.goal = 0; if(c.rollover==null) c.rollover = false; });
  refreshCycleDates();

  applyTheme(state.theme);
  applyPrivacyModeUI();
  document.getElementById('personalNotesInput').value = state.personalNotes || '';
  renderAll();
  updateSyncIndicator();
  loadQuote();
  startClock();
  hideLoadingScreen();

  if(isDirty) trySyncNow(); // push anything queued from an earlier offline session
  flushLoanDebtOps(); // same idea, for any loan/debt add/delete that didn't reach the backend yet
}

// Loans and Debts are persisted via small atomic add/delete calls (see
// Code.gs) rather than as part of the general saveState blob, specifically
// to avoid a stale background save from another open tab/device silently
// overwriting a loan or debt that was just added elsewhere. This queue
// makes that durable even if you're offline when you add/delete one —
// the operation is retried automatically once back online, same idea as
// the isDirty/local-mirror pattern above but for these two record types.
let pendingLoanDebtOps = [];
try{ pendingLoanDebtOps = JSON.parse(localStorage.getItem('pendingLoanDebtOps') || '[]'); }catch(e){}
function saveLoanDebtOpsQueue(){
  try{ localStorage.setItem('pendingLoanDebtOps', JSON.stringify(pendingLoanDebtOps)); }catch(e){}
}
function queueLoanDebtOp(action, payload){
  pendingLoanDebtOps.push({action, payload});
  saveLoanDebtOpsQueue();
  flushLoanDebtOps();
}
// Re-entrancy guard: without this, calling flushLoanDebtOps() again while a
// previous call is still awaiting its network response (e.g. the 30s
// interval firing right as queueLoanDebtOp's own immediate call is still in
// flight) let both invocations read the SAME still-queued operation before
// either had shifted it off — sending it to the backend twice and creating
// a genuine duplicate loan/debt row. Only one flush runs at a time now.
let flushingLoanDebtOps = false;
async function flushLoanDebtOps(){
  if(flushingLoanDebtOps || !API_URL || !navigator.onLine) return;
  flushingLoanDebtOps = true;
  try{
    while(pendingLoanDebtOps.length){
      const op = pendingLoanDebtOps[0];
      try{
        const data = await apiPost(op.action, op.payload);
        if(!data || data.error) break; // backend busy or unreachable — stop, retry later
        if(data.stateVersion != null) state.stateVersion = data.stateVersion;
        pendingLoanDebtOps.shift();
        saveLoanDebtOpsQueue();
      }catch(e){ break; }
    }
  }finally{
    flushingLoanDebtOps = false;
  }
}
window.addEventListener('online', flushLoanDebtOps);
setInterval(flushLoanDebtOps, 30000);

let saveTimer = null;
function saveState(){
  // Mirror to localStorage immediately and unconditionally — this is what
  // makes offline logging possible: the change is safe on this device the
  // instant you make it, whether or not the network call below succeeds.
  isDirty = true;
  saveLocalMirror();
  updateSyncIndicator();

  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if(syncSuspended) return; // a restore is in flight — see restoreCycleFromHistory
    if(!API_URL){
      try{ await window.storage.set(STORAGE_KEY, JSON.stringify(state), false); isDirty = false; }
      catch(e){ /* stays dirty, harmless in the Claude-preview-only case */ }
      saveLocalMirror(); updateSyncIndicator();
      return;
    }
    if(!navigator.onLine){ return; } // stay queued — the 'online' listener retries automatically
    try{
      const data = await apiPost('saveState', {state});
      if(data && !data.error){
        isDirty = false;
        if(data.conflictResolved && data.state){
          // Something else changed on the server since this device's last
          // sync — another tab, another device, or an auto-archive. Rather
          // than blindly overwrite it (the old behavior, which is what was
          // silently reverting logged repayments and category edits),
          // adopt the current authoritative state instead.
          state = Object.assign(state, data.state);
          renderAll();
          showToast('Synced with a change from another tab/device — redo anything that didn\'t stick');
        } else if(data.stateVersion != null){
          // Crucial: without recording the version this save just produced,
          // the very next save would look stale to the backend (comparing
          // against a version number that's already out of date) and get
          // needlessly rejected — which is exactly what was causing the
          // constant "synced with another tab" refresh even on a single tab.
          state.stateVersion = data.stateVersion;
        }
        saveLocalMirror(); updateSyncIndicator();
      }
    }catch(e){
      // still offline/unreachable — stays queued, no error shown (this is expected while offline)
    }
  }, 250);
}

// Retries a queued save the moment connectivity returns, and periodically
// while online in case a save silently failed for another reason.
function trySyncNow(){
  if(!API_URL || !navigator.onLine || !isDirty || syncSuspended) return;
  updateSyncIndicator();
  apiPost('saveState', {state}).then(data=>{
    if(data && !data.error){
      isDirty = false; saveLocalMirror(); updateSyncIndicator();
      if(data.conflictResolved && data.state){
        state = Object.assign(state, data.state);
        renderAll();
        showToast('Synced with a change from another tab/device — redo anything that didn\'t stick');
      } else {
        if(data.stateVersion != null) state.stateVersion = data.stateVersion;
        showToast('Back online — synced ✓');
      }
    }
  }).catch(()=>{});
}
window.addEventListener('online', trySyncNow);
window.addEventListener('offline', updateSyncIndicator);
setInterval(trySyncNow, 30000); // safety net retry every 30s while a change is queued

function updateSyncIndicator(){
  const el = document.getElementById('syncIndicator');
  if(!el) return;
  if(!navigator.onLine){
    el.textContent = isDirty ? '○ Offline — changes queued' : '○ Offline';
    el.style.color = 'var(--amber)';
  } else if(isDirty){
    el.textContent = '⟳ Syncing…';
    el.style.color = 'var(--amber)';
  } else {
    el.textContent = '● Synced';
    el.style.color = 'var(--teal)';
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function fmt(n){
  n = Math.round(n||0);
  const sym = state.currency || '₦';
  if(privacyMode) return sym + '••••'; // fixed-length mask — doesn't leak magnitude via digit count
  return sym + n.toLocaleString('en-NG');
}
function catById(id){ return state.categories.find(c=>c.id===id); }
function isSavingsCat(id){ const c = catById(id); return !!(c && c.group==='Savings'); }

function spendingCategories(){ return state.categories.filter(c=>c.group!=='Savings'); }
function savingsCategories(){ return state.categories.filter(c=>c.group==='Savings'); }

function spentFor(catId){ return state.transactions.filter(t=>t.categoryId===catId).reduce((s,t)=>s+Number(t.amount),0); }
// One pass over all transactions, bucketed by category. Anywhere that needs
// spentFor() for EVERY category in a loop (the dashboard alert count, the
// category list, report generation) should build this once and look up by
// id, rather than calling spentFor() per category — spentFor() itself
// re-scans the full transactions array every time it's called, so doing
// that inside a categories.forEach() turns an O(transactions) job into
// O(categories × transactions) for no benefit, and it silently gets worse
// as a cycle's transaction list grows. statusFor(cat) has the same problem
// one level deeper (it calls spentFor(cat.id) internally) — use
// statusForAmt(cat, spentMap[cat.id]||0) instead when a map is already at
// hand.
function spentByCategoryMap(){
  const m = {};
  state.transactions.forEach(t=>{ m[t.categoryId] = (m[t.categoryId]||0) + Number(t.amount); });
  return m;
}

function totalSpent(){
  return state.transactions.filter(t=>!isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
}
function savingsContribThisCycle(){
  return state.transactions.filter(t=>isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
}
function totalBudget(){ return spendingCategories().reduce((s,c)=>s+effectiveBudget(c),0); }
function totalSavingsBudget(){ return savingsCategories().reduce((s,c)=>s+Number(c.budget),0); }
function extraTotal(){ return state.extraIncome.reduce((s,e)=>s+Number(e.amount),0); }
function combinedIncome(){ return Number(state.income||0) + extraTotal(); }
function lifetimeSaved(catId){ return (state.savingsAccumulated[catId]||0) + spentFor(catId); }

function debtById(id){ return state.debts.find(d=>d.id===id); }
function paidForDebt(debtId){
  const accumulated = (state.debtPaidAccumulated && state.debtPaidAccumulated[debtId]) || 0;
  const liveThisCycle = state.transactions.filter(t=>t.debtId===debtId).reduce((s,t)=>s+Number(t.amount),0);
  return accumulated + liveThisCycle;
}
// Same fix as spentByCategoryMap() above, for the same reason: renderDebtTab
// needs "amount paid" for every debt at once (the summary totals, the focus
// card, and every row in the list all need it), and paidForDebt() rescans
// the full live transactions array every time it's called. Without this,
// a render with N debts calls that full scan 4-5 times per debt (once via
// totalDebtPaid(), again via activeDebts()/suggestedFocusDebt(), again for
// the focus card, again per list row) — this builds the "amount paid" for
// every debt in one pass instead.
function paidByDebtMap(){
  const live = {};
  state.transactions.forEach(t=>{ if(t.debtId) live[t.debtId] = (live[t.debtId]||0) + Number(t.amount); });
  const m = {};
  state.debts.forEach(d=>{
    const accumulated = (state.debtPaidAccumulated && state.debtPaidAccumulated[d.id]) || 0;
    m[d.id] = accumulated + (live[d.id]||0);
  });
  return m;
}
function remainingForDebt(debt){ return Math.max(Number(debt.amount) - paidForDebt(debt.id), 0); }
function totalDebtOwed(){ return state.debts.reduce((s,d)=>s+Number(d.amount),0); }
function totalDebtPaid(){ return state.debts.reduce((s,d)=>s+paidForDebt(d.id),0); }
function totalDebtRemaining(){ return Math.max(totalDebtOwed()-totalDebtPaid(),0); }
function activeDebts(){ return state.debts.filter(d=>remainingForDebt(d)>0); }
function suggestedFocusDebt(){
  const active = activeDebts();
  if(!active.length) return null;
  if(state.debtStrategy==='avalanche') return active.slice().sort((a,b)=>(Number(b.interestRate)||0)-(Number(a.interestRate)||0))[0];
  if(state.debtStrategy==='snowball') return active.slice().sort((a,b)=>remainingForDebt(a)-remainingForDebt(b))[0];
  return debtById(state.debtFocusId) || active[0];
}

// ---- Loans (money lent OUT to others) — mirrors the debt helpers above,
// but repayments live in extraIncome (incoming money) rather than
// transactions (spending), since getting repaid isn't an expense.
function loanById(id){ return state.loans.find(l=>l.id===id); }
// Principal recovered — updated immediately when a repayment is logged
// (see loanRepaySaveBtn below), not deferred to cycle-archive like Debt's
// accumulator is. Only the portion of a repayment that's genuine profit
// (paid back beyond what was originally lent) ever touches extraIncome —
// getting your own principal back isn't income.
function paidForLoan(loanId){
  return (state.loanPaidAccumulated && state.loanPaidAccumulated[loanId]) || 0;
}
function remainingForLoan(loan){ return Math.max(Number(loan.amount) - paidForLoan(loan.id), 0); }
function totalLoaned(){ return state.loans.reduce((s,l)=>s+Number(l.amount),0); }
function totalLoanRepaid(){ return state.loans.reduce((s,l)=>s+paidForLoan(l.id),0); }
function totalLoanRemaining(){ return Math.max(totalLoaned()-totalLoanRepaid(),0); }

function daysBetween(a,b){ return Math.round((b-a)/86400000); }
function cyclePace(){
  const last = new Date(state.lastPayDate+'T00:00:00');
  const next = new Date(state.nextPayDate+'T00:00:00');
  const now = new Date(); now.setHours(0,0,0,0);
  const totalDays = Math.max(daysBetween(last, next), 1);
  let elapsed = daysBetween(last, now);
  elapsed = Math.min(Math.max(elapsed, 0), totalDays);
  const daysLeft = Math.max(totalDays - elapsed, 0);
  return { totalDays, elapsed, daysLeft, pacePct: elapsed/totalDays };
}
// Every logged record (transaction, loan, debt, extra income, bill, etc.)
// gets an id built this way now — timestamp plus a short random suffix,
// instead of a bare Date.now(). A bare timestamp collides if two records
// are created in the same millisecond (a fast double-tap, a recurring
// template firing several entries in a tight loop, or two nearly-simultaneous
// atomic backend calls), and a collision means two different records
// silently share one id — edits/deletes can then hit the wrong one, and on
// the backend an idempotency check (see addLoanRow/addDebtRow) would treat
// the second one as "already exists" and drop it entirely.
function uniqueId(prefix){
  const rand = Math.random().toString(36).slice(2, 8);
  return (prefix ? prefix + '-' : '') + Date.now() + '-' + rand;
}
function escapeHtml(str){
  if(str==null) return '';
  return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
let toastTimer = null;
let toastUndoCallback = null;
function clearToastUndo(){
  if(toastTimer){ clearTimeout(toastTimer); toastTimer = null; }
  toastUndoCallback = null;
}
function showToast(msg){
  clearToastUndo();
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastUndoBtn').style.display = 'none';
  t.classList.add('show');
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}
// Same as showToast, but with a tappable Undo button that runs onUndo and
// stays up for 6s (vs the usual 2.4s) so there's real time to catch a
// mistaken delete.
function showUndoToast(msg, onUndo){
  clearToastUndo();
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  const btn = document.getElementById('toastUndoBtn');
  btn.style.display = '';
  toastUndoCallback = onUndo;
  t.classList.add('show');
  toastTimer = setTimeout(()=>{ t.classList.remove('show'); clearToastUndo(); }, 6000);
}
document.getElementById('toastUndoBtn').addEventListener('click', ()=>{
  if(toastUndoCallback) toastUndoCallback();
  document.getElementById('toast').classList.remove('show');
  clearToastUndo();
});
// Updates an element's text and gives it a brief gold flash — but only
// when the value actually changed, so it never flashes on every render.
function setTextFlash(id, newText){
  const el = document.getElementById(id);
  if(!el) return;
  if(el.textContent === newText) return;
  el.textContent = newText;
  el.classList.remove('value-flash');
  void el.offsetWidth; // restart the animation
  el.classList.add('value-flash');
}
function celebrate(){
  const emojis = ['🎉','✨','💰','🏆','⭐'];
  for(let i=0;i<18;i++){
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.cssText = 'position:fixed;top:-30px;left:'+(Math.random()*100)+'vw;font-size:'+(16+Math.random()*14)+'px;'+
      'z-index:80;pointer-events:none;animation:confettiFall '+(1.8+Math.random()*1.2)+'s ease-in forwards;'+
      'animation-delay:'+(Math.random()*0.4)+'s;';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 3500);
  }
}

// A brief, non-blocking edge-glow after logging an expense — quick visual
// feedback on how that expense landed, without interrupting the flow or
// requiring the person to go check a bar chart. 'ok'/'near'/'over' matches
// the same statusForAmt() classes already used for category bar colors, so
// this reuses a status the app was computing anyway rather than deriving
// a second opinion.
function triggerBudgetReaction(cls){
  const el = document.createElement('div');
  el.className = 'budget-reaction budget-reaction-' + cls;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1100);
}

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  document.getElementById('themeToggleBtn').textContent = theme==='light' ? '☀️' : '🌙';
  document.getElementById('themeOptDark').classList.toggle('active', theme==='dark');
  document.getElementById('themeOptLight').classList.toggle('active', theme==='light');
}
document.getElementById('themeToggleBtn').addEventListener('click', ()=>{
  state.theme = state.theme==='light' ? 'dark' : 'light';
  applyTheme(state.theme); saveState();
});
document.getElementById('themeOptDark').addEventListener('click', ()=>{ state.theme='dark'; applyTheme('dark'); saveState(); });
document.getElementById('themeOptLight').addEventListener('click', ()=>{ state.theme='light'; applyTheme('light'); saveState(); });

/* ============================================================
   LIVE CLOCK + PAYDAY COUNTDOWN
   ============================================================ */
function formatPaydayFull(dateStr){
  const d = new Date(dateStr+'T00:00:00');
  const weekday = d.toLocaleDateString('en-GB', {weekday:'long'});
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', {month:'long'});
  const suffix = (day%10===1 && day!==11) ? 'st' : (day%10===2 && day!==12) ? 'nd' : (day%10===3 && day!==13) ? 'rd' : 'th';
  return weekday + ', ' + day + suffix + ' ' + month;
}
function updatePaydayCard(){
  document.getElementById('lastPaydayVal').textContent = formatPaydayFull(state.lastPayDate);
  document.getElementById('nextPaydayVal').textContent = formatPaydayFull(state.nextPayDate);

  const next = new Date(state.nextPayDate+'T00:00:00');
  const now = new Date();
  const msLeft = next - now;
  const cd = document.getElementById('paydayCountdown');
  if(msLeft <= 0){ cd.textContent = 'Payday is today! 🎉'; return; }
  const totalSec = Math.floor(msLeft/1000);
  const days = Math.floor(totalSec/86400);
  const hours = Math.floor((totalSec%86400)/3600);
  const mins = Math.floor((totalSec%3600)/60);
  const secs = totalSec%60;
  cd.textContent = days + 'd ' + pad(hours) + 'h ' + pad(mins) + 'm ' + pad(secs) + 's to payday';
}
let privacyMode = false;
try{ privacyMode = localStorage.getItem('privacyMode') === '1'; }catch(e){}
let txSearchTerm = '';
function applyPrivacyModeUI(){
  const btn = document.getElementById('privacyToggleBtn');
  if(!btn) return;
  btn.textContent = privacyMode ? '🙈' : '👁️';
  btn.title = privacyMode ? 'Show figures' : 'Hide figures (privacy mode)';
  btn.classList.toggle('privacy-active', privacyMode);
  document.body.classList.toggle('privacy-on', privacyMode);
}
document.getElementById('privacyToggleBtn').addEventListener('click', ()=>{
  privacyMode = !privacyMode;
  try{ localStorage.setItem('privacyMode', privacyMode ? '1' : '0'); }catch(e){}
  applyPrivacyModeUI();
  renderAll(); // fmt() checks privacyMode directly, so every figure app-wide updates in one pass
});

// A separate, narrower hide toggle for just the hero "Available this cycle"
// balance — independent of the app-wide privacy mode above, for when you
// want to keep everything else visible but hide only the headline number
// (e.g. glancing at the app around someone without flashing your balance).
let heroBalanceHidden = false;
try{ heroBalanceHidden = localStorage.getItem('heroBalanceHidden') === '1'; }catch(e){}
function applyHeroHideUI(){
  const btn = document.getElementById('heroHideBtn');
  if(!btn) return;
  btn.textContent = heroBalanceHidden ? '🙈' : '👁️';
  btn.title = heroBalanceHidden ? 'Show this balance' : 'Hide just this balance';
}
document.getElementById('heroHideBtn').addEventListener('click', (e)=>{
  e.stopPropagation();
  heroBalanceHidden = !heroBalanceHidden;
  try{ localStorage.setItem('heroBalanceHidden', heroBalanceHidden ? '1' : '0'); }catch(e){}
  applyHeroHideUI();
  renderDashboard();
});
applyHeroHideUI();

let clockStyle = 'digital';
try{ clockStyle = localStorage.getItem('clockStyle') || 'digital'; }catch(e){}
const CLOCK_THEMES = ['classic','amber','teal','mono'];
let clockTheme = 'classic';
try{ clockTheme = localStorage.getItem('clockTheme') || 'classic'; }catch(e){}

function applyClockThemeUI(){
  const analog = document.getElementById('analogClockFace');
  if(!analog) return;
  CLOCK_THEMES.forEach(t => analog.classList.remove('theme-' + t));
  if(clockTheme !== 'classic') analog.classList.add('theme-' + clockTheme);
}
document.getElementById('clockThemeBtn').addEventListener('click', ()=>{
  const idx = CLOCK_THEMES.indexOf(clockTheme);
  clockTheme = CLOCK_THEMES[(idx + 1) % CLOCK_THEMES.length];
  try{ localStorage.setItem('clockTheme', clockTheme); }catch(e){}
  applyClockThemeUI();
  showToast('Clock theme: ' + clockTheme[0].toUpperCase() + clockTheme.slice(1));
});

function applyClockStyleUI(){
  const analog = document.getElementById('analogClockFace');
  const btn = document.getElementById('clockStyleBtn');
  const themeBtn = document.getElementById('clockThemeBtn');
  if(!analog || !btn) return;
  if(clockStyle === 'analog'){
    analog.style.display = '';
    btn.textContent = '🔢';
    btn.title = 'Switch to digital clock';
    if(themeBtn) themeBtn.style.display = '';
  } else {
    analog.style.display = 'none';
    btn.textContent = '🕐';
    btn.title = 'Switch to analog clock';
    if(themeBtn) themeBtn.style.display = 'none';
  }
  applyClockThemeUI();
}
document.getElementById('clockStyleBtn').addEventListener('click', ()=>{
  clockStyle = clockStyle === 'digital' ? 'analog' : 'digital';
  try{ localStorage.setItem('clockStyle', clockStyle); }catch(e){}
  applyClockStyleUI();
});

function startClock(){
  applyClockStyleUI();
  function tick(){
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
    if(clockStyle === 'analog'){
      document.getElementById('liveClock').textContent = dateStr;
      const hours = now.getHours() % 12;
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const hourDeg = (hours + mins/60) * 30;
      const minDeg = (mins + secs/60) * 6;
      const secDeg = secs * 6;
      document.getElementById('clockHandHour').setAttribute('transform', 'rotate(' + hourDeg + ' 20 20)');
      document.getElementById('clockHandMinute').setAttribute('transform', 'rotate(' + minDeg + ' 20 20)');
      document.getElementById('clockHandSecond').setAttribute('transform', 'rotate(' + secDeg + ' 20 20)');
    } else {
      const timeStr = now.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      document.getElementById('liveClock').textContent = dateStr + ' · ' + timeStr;
    }
    updatePaydayCard();
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   LIVE QUOTE
   ============================================================ */
function dayOfYear(){
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  return Math.floor((now-start)/86400000);
}
function fallbackQuote(){
  const q = LOCAL_QUOTES[dayOfYear() % LOCAL_QUOTES.length];
  renderQuote(q.text, q.author);
}
function renderQuote(text, author){
  document.getElementById('quoteText').textContent = '"' + text + '"';
  document.getElementById('quoteAuthor').textContent = author ? '— ' + author : '';
}
let lastQuoteIndex = -1;
function randomLocalQuote(){
  // Instant — no network wait. Avoids repeating the same quote twice in a row.
  let idx;
  do{ idx = Math.floor(Math.random()*LOCAL_QUOTES.length); }while(idx===lastQuoteIndex && LOCAL_QUOTES.length>1);
  lastQuoteIndex = idx;
  const q = LOCAL_QUOTES[idx];
  renderQuote(q.text, q.author);
}
async function loadQuote(){
  renderQuote('Loading…','');
  try{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 2500);
    const res = await fetch('https://api.quotable.io/random?tags=money|business|success', {signal: controller.signal});
    clearTimeout(timeout);
    if(!res.ok) throw new Error('bad response');
    const data = await res.json();
    if(data && data.content) renderQuote(data.content, data.author);
    else fallbackQuote();
  }catch(e){
    fallbackQuote();
  }
}
document.getElementById('refreshQuoteBtn').addEventListener('click', randomLocalQuote);

/* ============================================================
   STATUS LOGIC
   ============================================================ */
// Rollover: when a category has "carry over unused budget" enabled, any
// amount left unspent last cycle is added on top of this cycle's budget.
// Approximation: uses the category's CURRENT budget as a stand-in for what
// it was last cycle, since History only stores aggregate totals + the raw
// transaction list, not a per-category budget snapshot. Fine in practice
// since budgets rarely change cycle to cycle — but if you just changed
// this category's budget, the rollover amount reflects the new figure,
// not the one that was actually in effect last cycle.
function rolloverAmount(cat){
  if(!cat.rollover || cat.group==='Savings') return 0;
  if(!state.history || !state.history.length) return 0;
  const last = state.history[state.history.length-1];
  const lastSpent = (last.transactions||[]).filter(t=>t.categoryId===cat.id).reduce((s,t)=>s+Number(t.amount),0);
  return Math.max(0, Number(cat.budget) - lastSpent);
}
function effectiveBudget(cat){
  return Number(cat.budget) + rolloverAmount(cat);
}
function statusForAmt(cat, s){
  const budget = effectiveBudget(cat);
  if(cat.threshold==null){
    if(budget<=0) return { label: s>0 ? '✅ Target met' : 'In progress', cls:'st-target' };
    return s>=budget ? {label:'✅ Target met', cls:'st-target'} : {label:'In progress', cls:'st-target'};
  }
  if(budget<=0) return s>0 ? {label:'OVER BUDGET', cls:'st-over'} : {label:'No budget set', cls:'st-target'};
  if(s>budget) return {label:'OVER BUDGET', cls:'st-over'};
  if(s/budget >= cat.threshold) return {label:'NEAR LIMIT', cls:'st-near'};
  return {label:'On track', cls:'st-ok'};
}
function statusFor(cat){ return statusForAmt(cat, spentFor(cat.id)); }
function barColor(status){
  if(status.cls==='st-over') return 'var(--red)';
  if(status.cls==='st-near') return 'var(--amber)';
  if(status.cls==='st-target') return 'var(--muted-2)';
  return 'var(--teal)';
}

// Reusable small instrument dial — used on Savings and Debt cards so
// goal/payoff progress reads the same "instrument readout" way the
// Dashboard gauge cluster does, instead of a plain linear bar.
function miniDialSVG(pct, colorVar, size){
  size = size || 48;
  const r = (size/2) - 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - Math.min(Math.max(pct,0),1) * circ;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg);flex:none;">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="4"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${colorVar}" stroke-width="4"
      stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" stroke-linecap="round"/>
  </svg>`;
}

/* ============================================================
   RENDER: DASHBOARD
   ============================================================ */
function cycleLabelText(){
  const last = new Date(state.lastPayDate+'T00:00:00');
  const next = new Date(state.nextPayDate+'T00:00:00');
  const opts = {day:'numeric', month:'short'};
  return last.toLocaleDateString('en-GB',opts) + ' – ' + next.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

function renderDashboard(){
  const income = combinedIncome();
  const spent = totalSpent();
  const savingsContrib = savingsContribThisCycle();
  const remaining = Math.max(income - spent - savingsContrib, 0);
  const budget = totalBudget();

  document.getElementById('cycleLabel').textContent = cycleLabelText();
  // Income and the headline balance are grouped under the same "hide" toggle
  // — if you're showing someone your budget/spending but not your income —
  // while Budget and Spent stay visible either way, since those were never
  // part of what this toggle was meant to hide.
  setTextFlash('statIncome', heroBalanceHidden ? (state.currency||'₦') + '••••' : fmt(income));
  setTextFlash('statSpent', fmt(spent));

  const compareEl = document.getElementById('spentCompare');
  const lastCycle = state.history[state.history.length-1];
  if(lastCycle && lastCycle.totalSpent > 0){
    const diffPct = Math.round(((spent - lastCycle.totalSpent) / lastCycle.totalSpent) * 100);
    if(diffPct <= 0){
      compareEl.textContent = '↓ ' + Math.abs(diffPct) + '% vs last cycle';
      compareEl.style.color = 'var(--teal)';
    } else {
      compareEl.textContent = '↑ ' + diffPct + '% vs last cycle';
      compareEl.style.color = 'var(--red)';
    }
  } else {
    compareEl.textContent = '';
  }

  const spendPctRaw = income>0 ? spent/income : 0;
  const { daysLeft, pacePct } = cyclePace();

  // Hero card: how much of this cycle's budget has been spent — drives the
  // progress bar, the "X% of budget" readout, and the spent-so-far line.
  // (This replaces the old circular-gauge/dial-cluster rendering, which
  // referenced SVG elements removed during the bank-app redesign — that
  // dead code threw on every render and silently broke everything below
  // it, including the category list, transaction list, and badges.)
  const budgetPctRaw = budget>0 ? spent/budget : 0;
  const barFillEl = document.getElementById('heroBarFill');
  barFillEl.style.width = Math.min(budgetPctRaw,1)*100 + '%';
  barFillEl.style.background = budgetPctRaw > 1 ? 'var(--red)' : 'var(--teal)';

  const gaugePctEl = document.getElementById('gaugePct');
  gaugePctEl.textContent = Math.round(budgetPctRaw*100)+'% of budget';
  gaugePctEl.style.color = budgetPctRaw > 1 ? 'var(--red)' : 'var(--text)';
  document.getElementById('heroSubSpent').textContent = fmt(spent) + ' spent';

  document.getElementById('chipSaved').textContent = fmt(savingsContrib);

  const budgetPct = budget>0 ? spent/budget : 0;
  const paceBadge = document.getElementById('paceBadge');
  const paceDiff = budgetPct - pacePct;
  if(paceDiff <= -0.05){ paceBadge.textContent = '↓ Ahead of pace'; paceBadge.className = 'pace-badge pace-ahead'; }
  else if(paceDiff >= 0.05){ paceBadge.textContent = '↑ Behind pace — spending fast'; paceBadge.className = 'pace-badge pace-behind'; }
  else { paceBadge.textContent = '→ On track'; paceBadge.className = 'pace-badge pace-ontrack'; }

  const remainingBudget = Math.max(budget - spent, 0);
  document.getElementById('daysLeft').textContent = daysLeft;
  document.getElementById('safeToday').textContent = heroBalanceHidden ? (state.currency||'₦') + '••••' : fmt(remaining);
  document.getElementById('statSafePerDay').textContent = fmt(remainingBudget/Math.max(daysLeft,1));

  const grandTotal = budget + totalSavingsBudget();
  const bc = document.getElementById('budgetCheck');
  document.getElementById('budgetCheckVal').textContent = fmt(grandTotal) + (income>0 && !privacyMode ? ' (' + Math.round(grandTotal/income*100) + '% of income)' : '');
  bc.classList.toggle('over', income>0 && grandTotal > income);

  const spentMap = spentByCategoryMap();
  let alerts = 0;
  state.categories.forEach(c=>{ const st = statusForAmt(c, spentMap[c.id]||0); if(st.cls==='st-over' || st.cls==='st-near') alerts++; });
  document.getElementById('alertCount').textContent = alerts;

  renderExtraIncome();
  renderCategoryList(spentMap);
  renderTxPreview();
  renderStreakAndBadges();
  renderWeekdayChart();
  renderTrendChart();
  renderBillReminders();
  renderMoneyWeather(income, spent, budget, alerts);
  renderFxStrip();
}

/* ============================================================
   STREAKS & BADGES
   ============================================================ */
function loggingStreak(){
  const days = new Set(state.transactions.map(t=>t.date));
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  // Today doesn't have to be logged yet for the streak to still count —
  // only break the streak once a full day has passed with nothing logged.
  if(!days.has(toDateInput(d))) d.setDate(d.getDate()-1);
  while(days.has(toDateInput(d))){ streak++; d.setDate(d.getDate()-1); }
  return streak;
}
// Best streak ever is tracked client-side only (localStorage), deliberately
// NOT added to the synced state object — it's a nice-to-have display detail,
// not financial data, and keeping it out of state avoids adding a new field
// to the save/sync/version-conflict model for something this minor.
function bestStreakSeen(currentStreak){
  let best = 0;
  try{ best = Number(localStorage.getItem('budget-cockpit-best-streak')) || 0; }catch(e){}
  if(currentStreak > best){
    try{ localStorage.setItem('budget-cockpit-best-streak', String(currentStreak)); }catch(e){}
    return { best: currentStreak, isNewBest: best>0 }; // don't flag day 1 ever logged as "new best"
  }
  return { best, isNewBest: false };
}
function computeBadges(){
  const badges = [];
  const streak = loggingStreak();
  if(streak >= 3){
    const {isNewBest} = bestStreakSeen(streak);
    const tier = streak>=14 ? 'streak-tier-3' : streak>=7 ? 'streak-tier-2' : 'streak-tier-1';
    badges.push({
      icon: '<span class="streak-flame">🔥</span>', label: streak + '-day logging streak' + (isNewBest?' — new best!':''),
      cls: tier + (isNewBest?' streak-best':'')
    });
  }
  if(activeDebts().length===0 && state.debts.length>0) badges.push({icon:'🏆', label:'Debt-free!'});
  savingsCategories().forEach(c=>{
    if(c.goal>0 && lifetimeSaved(c.id) >= c.goal) badges.push({icon:'🎯', label: c.name+' goal hit'});
  });
  const d = buildReportData();
  if(d.income>0 && d.savingsRate>=20 && d.overBudget.length===0) badges.push({icon:'✨', label:'On track this cycle'});
  if(state.history.length>=3){
    const lastThree = state.history.slice(-3);
    if(lastThree.every(h=>h.totalSpent <= h.totalBudget)) badges.push({icon:'💎', label:'3 cycles under budget'});
  }
  return badges;
}
function renderStreakAndBadges(){
  const wrap = document.getElementById('badgeRow');
  if(!wrap) return;
  const badges = computeBadges();
  if(!badges.length){ wrap.innerHTML = ''; wrap.style.display='none'; return; }
  wrap.style.display = 'flex';
  wrap.innerHTML = badges.map(b=>`<span class="badge-pill${b.cls?' '+b.cls:''}">${b.icon} ${escapeHtml(b.label)}</span>`).join('');
}

/* ============================================================
   WEEKDAY SPEND CHART
   ============================================================ */
function renderWeekdayChart(){
  const canvas = document.getElementById('weekdayCanvas');
  if(!canvas) return;
  const totals = [0,0,0,0,0,0,0]; // Sun..Sat
  state.transactions.filter(t=>!isSavingsCat(t.categoryId)).forEach(t=>{
    const d = new Date(t.date+'T00:00:00');
    totals[d.getDay()] += Number(t.amount);
  });
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const max = Math.max(...totals, 1);
  const labels = ['S','M','T','W','T','F','S'];
  const w = canvas.width, h = canvas.height, pad=18;
  const barW = (w-pad*2)/7 - 6;
  let highestIdx = 0;
  totals.forEach((v,i)=>{ if(v>totals[highestIdx]) highestIdx = i; });
  totals.forEach((v,i)=>{
    const barH = (v/max) * (h-pad*2);
    const x = pad + i*((w-pad*2)/7) + 3;
    ctx.fillStyle = i===highestIdx && v>0 ? '#FFC24D' : '#00E5C7';
    ctx.fillRect(x, h-pad-barH, barW, Math.max(barH,1));
    ctx.fillStyle = '#7B8494'; ctx.font='9px sans-serif'; ctx.textAlign='center';
    ctx.fillText(labels[i], x+barW/2, h-4);
  });
  ctx.textAlign = 'left';
  const label = document.getElementById('weekdayHighest');
  if(label){
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    label.textContent = totals[highestIdx]>0 ? 'You spend most on ' + dayNames[highestIdx] + 's' : 'Log a few expenses to see your pattern';
  }
}

/* ============================================================
   MULTI-CYCLE SPENDING TREND CHART — complements the detailed
   income-vs-spent bar comparison already on the History tab with a
   quick-glance line of spend-only trend, visible right from Dashboard.
   ============================================================ */
function renderTrendChart(){
  const canvas = document.getElementById('trendCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cycles = [...state.history, {label: cycleLabelText(), totalSpent: totalSpent()}].slice(-8);
  const note = document.getElementById('trendNote');
  if(cycles.length < 2){
    if(note) note.textContent = 'Archive a couple more cycles to see a trend';
    return;
  }
  const w = canvas.width, h = canvas.height, pad = 18;
  const max = Math.max(...cycles.map(c=>c.totalSpent), 1);
  const stepX = (w - pad*2) / (cycles.length - 1);
  ctx.strokeStyle = '#00E5C7'; ctx.lineWidth = 2; ctx.beginPath();
  cycles.forEach((c,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - (c.totalSpent/max) * (h - pad*2);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  cycles.forEach((c,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - (c.totalSpent/max) * (h - pad*2);
    const isLast = i === cycles.length - 1;
    ctx.fillStyle = isLast ? '#FFC24D' : '#00E5C7';
    ctx.beginPath(); ctx.arc(x, y, isLast ? 3.5 : 2.5, 0, Math.PI*2); ctx.fill();
  });
  if(note){
    const first = cycles[0].totalSpent, last = cycles[cycles.length-1].totalSpent;
    if(first > 0){
      const pctChange = Math.round(((last-first)/first)*100);
      note.textContent = pctChange===0 ? 'Steady across the last ' + cycles.length + ' cycles'
        : (pctChange>0 ? '↑ ' : '↓ ') + Math.abs(pctChange) + '% vs ' + cycles.length + ' cycles ago';
    } else {
      note.textContent = 'Spending trend over the last ' + cycles.length + ' cycles';
    }
  }
}

/* ============================================================
   BILL / SUBSCRIPTION REMINDERS
   ============================================================ */
function upcomingBills(withinDays){
  const today = new Date(); today.setHours(0,0,0,0);
  return state.bills.map(b=>{
    const lastDay = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    let due = new Date(today.getFullYear(), today.getMonth(), Math.min(b.dueDay, lastDay));
    if(due < today) due = new Date(today.getFullYear(), today.getMonth()+1, Math.min(b.dueDay, new Date(today.getFullYear(),today.getMonth()+2,0).getDate()));
    const daysUntil = Math.round((due-today)/86400000);
    return { ...b, daysUntil };
  }).filter(b => b.daysUntil <= withinDays).sort((a,b)=>a.daysUntil-b.daysUntil);
}
// Pure decision logic, kept separate from the DOM writes below so it can be
// tested directly — same pattern as statusForAmt() elsewhere in this file.
function classifyMoneyWeather(overCount, alerts, spendPct){
  if(overCount >= 2 || spendPct > 1.1){
    return { icon:'⛈️', wxCls:'wx-storm', headline:'Storm warning',
      sub: overCount>0 ? overCount + ' categor' + (overCount===1?'y':'ies') + ' over budget — worth a look.' : 'Spending is running well past budget this cycle.' };
  }
  if(overCount === 1 || alerts >= 2 || spendPct > 0.85){
    return { icon:'⛅', wxCls:'wx-cloudy', headline:'Partly cloudy',
      sub: 'On track overall, but a category or two is close to the edge.' };
  }
  return { icon:'☀️', wxCls:'wx-clear', headline:'Clear skies',
    sub: spendPct>0 ? Math.round((1-spendPct)*100) + '% of budget still unspent — nice and steady.' : 'Nothing logged yet this cycle.' };
}
function renderMoneyWeather(income, spent, budget, alerts){
  const card = document.getElementById('moneyWeatherCard');
  const iconEl = document.getElementById('weatherIcon');
  const headlineEl = document.getElementById('weatherHeadline');
  const subEl = document.getElementById('weatherSub');
  if(!card) return;
  if(income<=0 && spent<=0){ card.style.display = 'none'; return; }
  card.style.display = 'flex';

  const overCount = state.categories.filter(c=>{
    const b = effectiveBudget(c);
    return c.group!=='Savings' && b>0 && spentFor(c.id) > b;
  }).length;
  const spendPct = budget>0 ? spent/budget : 0;
  const wx = classifyMoneyWeather(overCount, alerts, spendPct);
  iconEl.textContent = wx.icon;
  iconEl.className = 'weather-icon ' + wx.wxCls;
  headlineEl.textContent = wx.headline;
  subEl.textContent = wx.sub;
}

// Live FX strip: reuses the exact same api.frankfurter.dev endpoint the
// extra-income currency conversion already calls, just surfaced as a small
// glanceable readout instead of only appearing when logging income. Cached
// per calendar day in localStorage so a render doesn't refetch it —
// exchange rates don't move fast enough to need more than that, and it
// keeps this free API from being hit on every single render.
//
// Quoted as "1 foreign currency = X home currency" (e.g. "1 $ = 1,500 ₦"),
// not the other way around — that's the direction people actually think in
// day to day, and it's what every forex board and bank display uses. The
// API itself is asked for the rate in that same direction (code → home)
// rather than fetching home → code and inverting the fraction client-side,
// which would have compounded floating-point rounding on top of an
// already-inverted number.
async function renderFxStrip(){
  const wrap = document.getElementById('fxStrip');
  if(!wrap) return;
  const home = currencyCodeFor(state.currency || '₦');
  const targets = ['USD','GBP','EUR'].filter(c=>c!==home);
  if(!targets.length){ wrap.style.display='none'; return; }

  const today = toDateInput(new Date());
  let cached = null;
  try{ cached = JSON.parse(localStorage.getItem('budget-cockpit-fx-strip')||'null'); }catch(e){}
  if(cached && cached.date===today && cached.home===home){
    renderFxStripFrom(cached.rates, home, cached.date);
    return;
  }

  try{
    const results = await Promise.all(targets.map(async code=>{
      const res = await fetch(`https://api.frankfurter.dev/v2/rate/${code}/${home}`);
      if(!res.ok) throw new Error('rate fetch failed');
      const data = await res.json();
      return {code, rate: data.rate, date: data.date};
    }));
    const rates = {}; results.forEach(r=>{ rates[r.code]=r.rate; });
    try{ localStorage.setItem('budget-cockpit-fx-strip', JSON.stringify({date: today, home, rates})); }catch(e){}
    renderFxStripFrom(rates, home, results[0]?.date || today);
  }catch(e){
    // Offline or the rate API is briefly down — just hide the strip rather
    // than show stale or broken numbers. Nothing else on the dashboard
    // depends on this succeeding.
    wrap.style.display = 'none';
  }
}
function renderFxStripFrom(rates, home, date){
  const wrap = document.getElementById('fxStrip');
  if(!wrap) return;
  const codes = Object.keys(rates);
  if(!codes.length){ wrap.style.display='none'; return; }
  wrap.style.display = 'flex';
  const symFor = code => (CURRENCY_OPTIONS.find(c=>c.code===code)||{}).sym || code;
  // A large-magnitude quote (e.g. ₦1,500 to the dollar) reads far better
  // with thousands separators and no decimal noise than four decimal
  // places carried over from a sub-1 exchange fraction. toLocaleString
  // with maximumFractionDigits:2 covers both large home currencies (NGN)
  // and smaller ones (EUR-per-GBP-style pairs) sensibly without a special
  // case per currency.
  wrap.innerHTML = codes.map(code=>
    `<span class="fx-pill">1 ${symFor(code)} = <b>${Number(rates[code]).toLocaleString(undefined,{maximumFractionDigits:2})}</b> ${home}</span>`
  ).join('') + `<span class="fx-updated">as of ${escapeHtml(date)}</span>`;
}

function renderBillReminders(){
  const wrap = document.getElementById('billReminders');
  if(!wrap) return;
  const due = upcomingBills(5);
  if(!due.length){ wrap.style.display='none'; wrap.innerHTML=''; return; }
  wrap.style.display = 'block';
  wrap.innerHTML = due.map(b=>`
    <div class="bill-pill">
      <span>${b.daysUntil<=0 ? '⚠ Due today' : b.daysUntil===1 ? '⚠ Due tomorrow' : 'Due in '+b.daysUntil+'d'}</span>
      <b>${escapeHtml(b.name)}</b> — ${fmt(b.amount)}
    </div>`).join('');
}

function renderExtraIncome(){
  const wrap = document.getElementById('extraList');
  document.getElementById('extraTag').textContent = fmt(extraTotal()) + ' added';
  const sorted = [...state.extraIncome].sort((a,b)=> b.date.localeCompare(a.date) || b.id-a.id);
  if(!sorted.length){ wrap.innerHTML = '<div class="empty-hist">No extra income logged this cycle yet.</div>'; return; }
  wrap.innerHTML = '';
  sorted.forEach(e=>{
    const row = document.createElement('div');
    row.className = 'extra-row';
    const fxNote = e.fxOriginalCurrency
      ? `${escapeHtml(e.fxOriginalCurrency)}${e.fxOriginalAmount} converted @ ${Number(e.fxRate).toFixed(2)} (${escapeHtml(e.fxRateDate||'')})`
      : e.date;
    row.innerHTML = `
      <div class="extra-left">
        <div class="src">${escapeHtml(e.source)||'Extra income'}</div>
        <div class="dt">${fxNote}</div>
      </div>
      <div class="extra-right">
        <div class="extra-amt">+${fmt(e.amount)}</div>
        <button class="tx-del" data-id="${e.id}" aria-label="Delete">✕</button>
      </div>`;
    wrap.appendChild(row);
    row.querySelector('.tx-del').addEventListener('click', ()=>{
      state.extraIncome = state.extraIncome.filter(x=>x.id!==e.id);
      saveState(); renderAll();
      showToast('Removed');
    });
  });
}

// A small animated "how's this category feeling" icon, purely derived from
// the same status class barColor() already uses — no new computation, just
// a second, more expressive way of showing the same information.
function moodIconFor(cls){
  const face = cls==='st-over' ? '😬' : cls==='st-near' ? '😅' : '😌';
  const moodCls = cls==='st-over' ? 'mood-over' : cls==='st-near' ? 'mood-near' : 'mood-ok';
  return ` <span class="cat-mood ${moodCls}">${face}</span>`;
}
function renderCategoryList(spentMap){
  spentMap = spentMap || spentByCategoryMap(); // callable standalone too
  const list = document.getElementById('catList');
  list.innerHTML = '';
  const cats = spendingCategories();
  document.getElementById('catTag').textContent = cats.length + ' tracked';
  cats.forEach(cat=>{
    const spent = spentMap[cat.id] || 0;
    const budget = effectiveBudget(cat);
    const rollover = rolloverAmount(cat);
    const pct = budget>0 ? Math.min(spent/budget,1) : (spent>0?1:0);
    const status = statusForAmt(cat, spent);
    const rolloverNote = rollover>0 ? ` <span style="color:var(--teal);">(+${fmt(rollover)} rollover)</span>` : '';
    const div = document.createElement('div');
    div.className = 'cat';
    div.innerHTML = `
      <div class="cat-top">
        <div style="display:flex;align-items:center;">
          <span class="status-light" style="background:${barColor(status)};box-shadow:0 0 6px ${barColor(status)};"></span>
          <div>
            <div class="cat-name">${cat.icon ? escapeHtml(cat.icon)+' ' : ''}${escapeHtml(cat.name)}${moodIconFor(status.cls)}</div>
            <div class="cat-group">${escapeHtml(cat.group)}</div>
          </div>
        </div>
        <div class="cat-amt"><b>${fmt(spent)}</b><br>/ ${fmt(budget)}${rolloverNote}</div>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct*100}%; background:${barColor(status)};"></div>
        ${cat.threshold!=null ? `<div class="bar-thresh" style="left:${cat.threshold*100}%;"></div>` : ''}
      </div>
      <div class="status-row">
        <span class="status-badge ${status.cls}">${status.label}</span>
        <span style="font-size:10px;color:var(--muted);">${budget>0?Math.round(pct*100):0}% used</span>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderTxPreview(){
  const wrap = document.getElementById('txListPreview');
  const sorted = [...state.transactions].sort((a,b)=> b.date.localeCompare(a.date) || b.id-a.id).slice(0,5);
  document.getElementById('txTag').textContent = state.transactions.length + ' this cycle';
  wrap.innerHTML = sorted.length ? '' : '<div class="empty-hist">No expenses logged yet. Tap + to add one.</div>';
  sorted.forEach(t=>renderTxRow(wrap, t, true));
}

function deleteTxWithUndo(t){
  const idx = state.transactions.findIndex(x=>x.id===t.id);
  if(idx===-1) return;
  const removed = state.transactions[idx];
  state.transactions = state.transactions.filter(x=>x.id!==t.id);
  saveState(); renderAll();
  showUndoToast('Expense removed', ()=>{
    state.transactions.splice(Math.min(idx, state.transactions.length), 0, removed);
    saveState(); renderAll();
  });
}

function renderTxRow(container, t, showDelete){
  const cat = catById(t.categoryId);
  const savingsTag = cat && cat.group==='Savings' ? '<span class="tx-tag-savings">SAVINGS</span>' : '';
  const recurTag = t.recurTemplateId ? ' 🔁' : '';
  const methodTag = t.method ? ' · ' + escapeHtml(t.method) : '';

  const wrap = document.createElement('div');
  wrap.className = 'tx-swipe-wrap';
  wrap.innerHTML = `
    <div class="tx-row">
      <div class="tx-left">
        <div class="tx-cat">${cat && cat.icon ? escapeHtml(cat.icon)+' ' : ''}${escapeHtml(cat?cat.name:'Uncategorized')}${savingsTag}${recurTag}</div>
        <div class="tx-desc">${escapeHtml(t.desc)||'—'}${methodTag}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amt-chip"><span class="tx-amt">${fmt(t.amount)}</span></div>
        <div class="tx-date">${t.date}</div>
      </div>
      <div class="tx-actions">
        <button class="tx-action-btn tx-action-edit" aria-label="Edit">✏️</button>
        ${showDelete ? `<button class="tx-action-btn tx-action-del" data-id="${t.id}" aria-label="Delete">🗑</button>` : ''}
      </div>
    </div>
  `;
  container.appendChild(wrap);
  const row = wrap.querySelector('.tx-row');

  row.querySelector('.tx-action-edit').addEventListener('click', (e)=>{ e.stopPropagation(); openEditTx(t); });
  if(showDelete){
    row.querySelector('.tx-action-del').addEventListener('click', (e)=>{
      e.stopPropagation();
      deleteTxWithUndo(t);
    });
  }
}

/* ============================================================
   RENDER: SAVINGS
   ============================================================ */
function renderSavingsTab(){
  const wrap = document.getElementById('savingsList');
  const cats = savingsCategories();
  if(!cats.length){ wrap.innerHTML = '<div class="empty-hist" style="margin:0 20px;">No savings categories set up.</div>'; return; }
  wrap.innerHTML = '';
  cats.forEach(cat=>{
    const total = lifetimeSaved(cat.id);
    const thisCycle = spentFor(cat.id);
    const goal = Number(cat.goal)||0;
    const pct = goal>0 ? Math.min(total/goal,1) : 0;
    const div = document.createElement('div');
    div.className = 'save-card';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        ${goal>0 ? `<div style="position:relative;flex:none;">${miniDialSVG(pct,'var(--teal)',48)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;">${Math.round(pct*100)}%</div></div>` : ''}
        <div style="flex:1;min-width:0;">
          <div class="save-top">
            <div class="save-name">${cat.icon?escapeHtml(cat.icon)+' ':''}${escapeHtml(cat.name)}</div>
            <div style="display:flex;align-items:center;gap:6px;">
              <div class="save-amt">${fmt(total)}</div>
              <button class="save-adjust-btn" data-adjust="${cat.id}" data-name="${escapeHtml(cat.name)}" aria-label="Adjust total saved" title="Adjust total saved">✎</button>
            </div>
          </div>
          <div class="save-sub">+${fmt(thisCycle)} contributed this cycle</div>
        </div>
      </div>
      ${goal>0 ? `<div class="save-foot" style="margin-top:8px;"><span>Goal: ${fmt(goal)}</span></div>` : `<div class="save-foot"><span>No goal set — add one in Settings</span></div>`}
    `;
    wrap.appendChild(div);
  });
  wrap.querySelectorAll('[data-adjust]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const catId = btn.dataset.adjust;
      openAdjustSheet({
        type: 'savings', id: catId,
        title: 'Adjust ' + btn.dataset.name,
        label: 'Total saved (lifetime) ' + (state.currency||'₦'),
        hint: 'Sets the total directly — use this to correct it if money was withdrawn outside the app, or to clear it (enter 0) if this goal no longer applies.',
        prefill: lifetimeSaved(catId)
      });
    });
  });
}

/* ============================================================
   RENDER: DEBT TRACKER
   ============================================================ */
function renderDebtTab(){
  document.getElementById('stratAvalanche').classList.toggle('active', state.debtStrategy==='avalanche');
  document.getElementById('stratSnowball').classList.toggle('active', state.debtStrategy==='snowball');
  document.getElementById('stratManual').classList.toggle('active', state.debtStrategy==='manual');

  const paidMap = paidByDebtMap();
  const remainingFor = d => Math.max(Number(d.amount) - (paidMap[d.id]||0), 0);

  const owed = totalDebtOwed();
  const paid = state.debts.reduce((s,d)=>s+(paidMap[d.id]||0),0);
  const remaining = Math.max(owed-paid,0);
  document.getElementById('debtSummary').innerHTML = `
    <div class="hist-card"><div class="v">${fmt(owed)}</div><div class="l">Total owed</div></div>
    <div class="hist-card"><div class="v">${fmt(paid)}</div><div class="l">Total paid</div></div>
    <div class="hist-card"><div class="v">${fmt(remaining)}</div><div class="l">Remaining</div></div>
  `;

  const active = state.debts.filter(d=>remainingFor(d)>0);
  let focus = null;
  if(active.length){
    if(state.debtStrategy==='avalanche') focus = active.slice().sort((a,b)=>(Number(b.interestRate)||0)-(Number(a.interestRate)||0))[0];
    else if(state.debtStrategy==='snowball') focus = active.slice().sort((a,b)=>remainingFor(a)-remainingFor(b))[0];
    else focus = debtById(state.debtFocusId) || active[0];
  }
  const focusWrap = document.getElementById('debtFocusCard');
  if(!focus){
    focusWrap.innerHTML = '<div class="debt-focus-empty">No active debt to focus on — add a debt below, or you\'re debt-free! 🎉</div>';
  } else {
    const why = state.debtStrategy==='avalanche' ? 'Highest interest rate (' + (focus.interestRate||0) + '%/yr) — clearing this first saves the most money over time.'
      : state.debtStrategy==='snowball' ? 'Smallest remaining balance — clearing this first builds momentum fastest.'
      : 'Manually selected as your current focus.';
    const rem = remainingFor(focus);
    const pct = focus.amount>0 ? Math.min((paidMap[focus.id]||0)/focus.amount,1) : 0;
    focusWrap.innerHTML = `
      <div class="debt-focus-card">
        <div class="focus-badge">CURRENTLY SERVICING</div>
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="position:relative;flex:none;">${miniDialSVG(pct,'var(--gold)',56)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;">${Math.round(pct*100)}%</div></div>
          <div style="flex:1;min-width:0;">
            <div class="debt-top" style="margin-bottom:0;"><div class="debt-name">${escapeHtml(focus.creditor)}</div><div class="debt-amt">${fmt(rem)} left</div></div>
            <div class="debt-reason">${escapeHtml(focus.reason)||'—'}</div>
          </div>
        </div>
        <div class="debt-foot" style="margin-top:10px;"><span>Owed: ${fmt(focus.amount)}</span></div>
        <p style="font-size:11px;color:var(--muted);line-height:1.5;margin:0 0 10px;">${why}</p>
        <button class="btn btn-teal" style="margin:0;" data-debtpay="${focus.id}">Log a payment</button>
      </div>
    `;
    focusWrap.querySelector('[data-debtpay]').addEventListener('click', ()=> openDebtPaySheet(focus.id));
  }

  const listWrap = document.getElementById('debtList');
  document.getElementById('debtTag').textContent = state.debts.length + ' tracked';
  if(!state.debts.length){
    listWrap.innerHTML = '<div class="empty-hist" style="margin:0 20px;">No debts added yet.</div>';
  } else {
    listWrap.innerHTML = '';
    state.debts.forEach(debt=>{
      const rem = remainingFor(debt);
      const pct = debt.amount>0 ? Math.min((paidMap[debt.id]||0)/debt.amount,1) : 0;
      const isFocused = focus && focus.id===debt.id;
      const lightColor = rem<=0 ? 'var(--teal)' : pct>0 ? 'var(--amber)' : 'var(--muted-2)';
      const div = document.createElement('div');
      div.className = 'debt-card' + (isFocused ? ' focused' : '');
      div.innerHTML = `
        <div class="debt-top">
          <div class="debt-name"><span class="status-light" style="background:${lightColor};box-shadow:0 0 6px ${lightColor};"></span>${escapeHtml(debt.creditor)}${isFocused ? ' <span style="color:var(--gold);font-size:10px;">★ FOCUS</span>' : ''}</div>
          <div class="debt-amt">${rem<=0 ? '✅ Cleared' : fmt(rem)+' left'}</div>
        </div>
        <div class="debt-reason">${escapeHtml(debt.reason)||'—'}${debt.interestRate ? ' · '+debt.interestRate+'%/yr' : ''}</div>
        <div class="debt-bar-track"><div class="debt-bar-fill" style="width:${pct*100}%;"></div></div>
        <div class="debt-foot"><span>${Math.round(pct*100)}% paid</span><span>Owed: ${fmt(debt.amount)}</span></div>
        <div class="debt-actions">
          ${rem>0 ? `<button class="debt-btn-pay" data-pay="${debt.id}">Log payment</button>` : ''}
          ${state.debtStrategy==='manual' && rem>0 ? `<button class="debt-btn-focus" data-focus="${debt.id}">${isFocused?'Focused':'Set as focus'}</button>` : ''}
          <button class="debt-btn-adjust" data-adjustdebt="${debt.id}" data-name="${escapeHtml(debt.creditor)}" aria-label="Adjust for a payment made previously" title="Log a payment from a past cycle">✎</button>
          <button class="debt-btn-del" data-del="${debt.id}" data-name="${escapeHtml(debt.creditor)}" aria-label="Delete debt">🗑</button>
        </div>
      `;
      listWrap.appendChild(div);
    });
    listWrap.querySelectorAll('[data-pay]').forEach(b=>b.addEventListener('click', ()=>openDebtPaySheet(b.dataset.pay)));
    listWrap.querySelectorAll('[data-adjustdebt]').forEach(b=>b.addEventListener('click', ()=>{
      openAdjustSheet({
        type: 'debt', id: b.dataset.adjustdebt,
        title: 'Adjust ' + b.dataset.name,
        label: 'Amount already paid, not yet logged (' + (state.currency||'₦') + ')',
        hint: 'For a payment you already made in a previous cycle that never got logged — this reduces the remaining balance without touching this cycle\'s spending. Enter a negative number to correct downward.',
        prefill: ''
      });
    }));
    listWrap.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click', ()=>{
      state.debtFocusId = b.dataset.focus; saveState(); renderAll();
    }));
    listWrap.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', async ()=>{
      const paidAmt = paidMap[b.dataset.del]||0;
      const msg = paidAmt>0
        ? `${b.dataset.name} has ${fmt(paidAmt)} in logged payments. Deleting it keeps those as regular Debt repayment expenses, just no longer tied to this creditor. Continue?`
        : `Delete "${b.dataset.name}"? This can't be undone.`;
      const ok = await askConfirm('Delete debt?', msg);
      if(!ok) return;
      state.debts = state.debts.filter(d=>d.id!==b.dataset.del);
      if(state.debtFocusId===b.dataset.del) state.debtFocusId = '';
      saveState(); renderAll();
      queueLoanDebtOp('deleteDebt', {debtId: b.dataset.del});
      showToast('Debt deleted');
    }));
  }
}

/* ============================================================
   RENDER: LOANS (LENT OUT) TRACKER
   ============================================================ */
function renderLoanTab(){
  const loaned = totalLoaned(), repaid = totalLoanRepaid(), remaining = totalLoanRemaining();
  document.getElementById('loanSummary').innerHTML = `
    <div class="hist-card"><div class="v">${fmt(loaned)}</div><div class="l">Total lent</div></div>
    <div class="hist-card"><div class="v">${fmt(repaid)}</div><div class="l">Repaid</div></div>
    <div class="hist-card"><div class="v">${fmt(remaining)}</div><div class="l">Still owed to you</div></div>
  `;

  const listWrap = document.getElementById('loanList');
  document.getElementById('loanTag').textContent = state.loans.length + ' tracked';
  if(!state.loans.length){
    listWrap.innerHTML = '<div class="empty-hist" style="margin:0 20px;">No loans added yet.</div>';
    return;
  }
  listWrap.innerHTML = '';
  state.loans.forEach(loan=>{
    const rem = remainingForLoan(loan);
    const pct = loan.amount>0 ? Math.min(paidForLoan(loan.id)/loan.amount,1) : 0;
    const lightColor = rem<=0 ? 'var(--teal)' : pct>0 ? 'var(--amber)' : 'var(--muted-2)';
    const div = document.createElement('div');
    div.className = 'debt-card';
    div.innerHTML = `
      <div class="debt-top">
        <div class="debt-name"><span class="status-light" style="background:${lightColor};box-shadow:0 0 6px ${lightColor};"></span>${escapeHtml(loan.borrower)}</div>
        <div class="debt-amt">${rem<=0 ? '✅ Repaid' : fmt(rem)+' left'}</div>
      </div>
      <div class="debt-reason">${escapeHtml(loan.reason)||'—'}</div>
      <div class="debt-bar-track"><div class="debt-bar-fill" style="width:${pct*100}%;"></div></div>
      <div class="debt-foot"><span>${Math.round(pct*100)}% repaid</span><span>Lent: ${fmt(loan.amount)}</span></div>
      <div class="debt-actions">
        ${rem>0 ? `<button class="debt-btn-pay" data-repay="${loan.id}">Log repayment</button>` : ''}
        <button class="debt-btn-adjust" data-adjustloan="${loan.id}" data-name="${escapeHtml(loan.borrower)}" aria-label="Adjust for a repayment made previously" title="Log a repayment from a past cycle">✎</button>
        <button class="debt-btn-del" data-delloan="${loan.id}" data-name="${escapeHtml(loan.borrower)}" aria-label="Delete loan">🗑</button>
      </div>
    `;
    listWrap.appendChild(div);
  });
  listWrap.querySelectorAll('[data-repay]').forEach(b=>b.addEventListener('click', ()=>openLoanRepaySheet(b.dataset.repay)));
  listWrap.querySelectorAll('[data-adjustloan]').forEach(b=>b.addEventListener('click', ()=>{
    openAdjustSheet({
      type: 'loan', id: b.dataset.adjustloan,
      title: 'Adjust ' + b.dataset.name,
      label: 'Amount already repaid, not yet logged (' + (state.currency||'₦') + ')',
      hint: 'For a repayment you already received in a previous cycle that never got logged — this reduces what\'s still owed without touching this cycle\'s figures. Enter a negative number to correct downward.',
      prefill: ''
    });
  }));
  listWrap.querySelectorAll('[data-delloan]').forEach(b=>b.addEventListener('click', async ()=>{
    const repaidAmt = paidForLoan(b.dataset.delloan);
    const msg = repaidAmt>0
      ? `${b.dataset.name} has ${fmt(repaidAmt)} in logged repayments. Deleting it keeps those as regular extra income, just no longer tied to this loan. Continue?`
      : `Delete "${b.dataset.name}"? This can't be undone.`;
    const ok = await askConfirm('Delete loan?', msg);
    if(!ok) return;
    state.loans = state.loans.filter(l=>l.id!==b.dataset.delloan);
    saveState(); renderAll();
    queueLoanDebtOp('deleteLoan', {loanId: b.dataset.delloan});
    showToast('Loan deleted');
  }));
}

document.getElementById('addLoanBtn').addEventListener('click', ()=>{
  const borrower = document.getElementById('newLoanBorrower').value.trim();
  const reason = document.getElementById('newLoanReason').value.trim();
  const amount = Number(document.getElementById('newLoanAmount').value);
  if(!borrower){ showToast('Enter who you lent to'); return; }
  if(!amount || amount<=0){ showToast('Enter a valid amount lent'); return; }
  const newLoan = { id: uniqueId('loan'), borrower, reason, amount };
  state.loans.push(newLoan);
  saveState(); renderAll();
  queueLoanDebtOp('addLoan', {loan: newLoan});
  document.getElementById('newLoanBorrower').value='';
  document.getElementById('newLoanReason').value='';
  document.getElementById('newLoanAmount').value='';
  showToast('Loan added');
});

const loanRepaySheet = document.getElementById('loanRepaySheet');
let repayingLoanId = null;
function openLoanRepaySheet(loanId){
  repayingLoanId = loanId;
  const loan = loanById(loanId);
  document.getElementById('loanRepayTitle').textContent = 'Log repayment — ' + (loan ? loan.borrower : '');
  document.getElementById('loanRepayAmount').value = '';
  document.getElementById('loanRepayMethod').value = '';
  document.getElementById('loanRepayDate').value = toDateInput(new Date());
  activeSheet = loanRepaySheet; openSheetEl(loanRepaySheet);
}
document.getElementById('loanRepayCancelBtn').addEventListener('click', ()=>{ closeSheetEl(loanRepaySheet); activeSheet=null; repayingLoanId=null; });
document.getElementById('loanRepaySaveBtn').addEventListener('click', ()=>{
  const amount = Number(document.getElementById('loanRepayAmount').value);
  const method = document.getElementById('loanRepayMethod').value;
  const date = document.getElementById('loanRepayDate').value || toDateInput(new Date());
  if(!amount || amount<=0){ showToast('Enter a valid amount'); return; }
  const loan = loanById(repayingLoanId);
  // Split the payment: whatever's still owed on the principal is just your
  // own money coming back (not income), so it only reduces the remaining
  // balance directly. Only an amount paid back beyond the original principal
  // — actual profit/interest — counts as extra income.
  const owedBefore = loan ? remainingForLoan(loan) : amount;
  const principalPortion = Math.min(amount, owedBefore);
  const excessPortion = Math.max(amount - owedBefore, 0);
  if(principalPortion > 0){
    state.loanPaidAccumulated[repayingLoanId] = (state.loanPaidAccumulated[repayingLoanId]||0) + principalPortion;
  }
  if(excessPortion > 0){
    state.extraIncome.push({
      id: uniqueId(), amount: excessPortion, date, method,
      source: (loan ? loan.borrower : 'Loan') + ' — repayment (above what was lent)',
      loanId: repayingLoanId
    });
  }
  saveState(); renderAll();
  queueLoanDebtOp('adjustLoanPaid', {loanId: repayingLoanId, delta: principalPortion});
  closeSheetEl(loanRepaySheet); activeSheet=null; repayingLoanId=null;
  showToast(excessPortion>0
    ? `Repayment logged — ${fmt(excessPortion)} of that counted as income`
    : 'Repayment logged');
});

function setFinanceTab(which){
  const tabs = {debt:'financeTabDebt', savings:'financeTabSavings', loans:'financeTabLoans'};
  const panels = {debt:'financePanelDebt', savings:'financePanelSavings', loans:'financePanelLoans'};
  Object.keys(tabs).forEach(k=>{
    document.getElementById(tabs[k]).classList.toggle('active', k===which);
    document.getElementById(panels[k]).style.display = k===which ? '' : 'none';
  });
}
document.getElementById('financeTabDebt').addEventListener('click', ()=>setFinanceTab('debt'));
document.getElementById('financeTabSavings').addEventListener('click', ()=>setFinanceTab('savings'));
document.getElementById('financeTabLoans').addEventListener('click', ()=>setFinanceTab('loans'));
setFinanceTab('debt');

document.getElementById('stratAvalanche').addEventListener('click', ()=>{ state.debtStrategy='avalanche'; saveState(); renderAll(); });
document.getElementById('stratSnowball').addEventListener('click', ()=>{ state.debtStrategy='snowball'; saveState(); renderAll(); });
document.getElementById('stratManual').addEventListener('click', ()=>{ state.debtStrategy='manual'; saveState(); renderAll(); });

document.getElementById('addDebtBtn').addEventListener('click', ()=>{
  const creditor = document.getElementById('newDebtCreditor').value.trim();
  const reason = document.getElementById('newDebtReason').value.trim();
  const amount = Number(document.getElementById('newDebtAmount').value);
  const interestRate = Number(document.getElementById('newDebtInterest').value) || 0;
  if(!creditor){ showToast('Enter who the debt is owed to'); return; }
  if(!amount || amount<=0){ showToast('Enter a valid amount owed'); return; }
  const newDebt = { id: uniqueId('debt'), creditor, reason, amount, interestRate };
  state.debts.push(newDebt);
  saveState(); renderAll();
  queueLoanDebtOp('addDebt', {debt: newDebt});
  document.getElementById('newDebtCreditor').value='';
  document.getElementById('newDebtReason').value='';
  document.getElementById('newDebtAmount').value='';
  document.getElementById('newDebtInterest').value='';
  showToast('Debt added');
});

const debtPaySheet = document.getElementById('debtPaySheet');
let payingDebtId = null;
function openDebtPaySheet(debtId){
  payingDebtId = debtId;
  const debt = debtById(debtId);
  document.getElementById('debtPayTitle').textContent = 'Log payment — ' + (debt ? debt.creditor : '');
  document.getElementById('debtPayAmount').value = '';
  document.getElementById('debtPayMethod').value = '';
  document.getElementById('debtPayDate').value = toDateInput(new Date());
  activeSheet = debtPaySheet; openSheetEl(debtPaySheet);
}
document.getElementById('debtPayCancelBtn').addEventListener('click', ()=>{ closeSheetEl(debtPaySheet); activeSheet=null; payingDebtId=null; });
document.getElementById('debtPaySaveBtn').addEventListener('click', ()=>{
  const amount = Number(document.getElementById('debtPayAmount').value);
  const method = document.getElementById('debtPayMethod').value;
  const date = document.getElementById('debtPayDate').value || toDateInput(new Date());
  if(!amount || amount<=0){ showToast('Enter a valid amount'); return; }
  const debt = debtById(payingDebtId);
  state.transactions.push({
    id: uniqueId(), amount, categoryId: 'debt',
    desc: (debt ? debt.creditor : 'Debt') + ' — debt payment',
    date, method, debtId: payingDebtId
  });
  saveState(); renderAll();
  closeSheetEl(debtPaySheet); activeSheet=null; payingDebtId=null;
  showToast('Payment logged');
});

/* ============================================================
   RENDER: HISTORY
   ============================================================ */
function renderHistory(){
  const summaryWrap = document.getElementById('histSummary');
  const spent = totalSpent();
  const savingsContrib = savingsContribThisCycle();
  const income = combinedIncome();
  summaryWrap.innerHTML = `
    <div class="hist-card"><div class="v">${fmt(income)}</div><div class="l">This cycle income</div></div>
    <div class="hist-card"><div class="v">${fmt(spent)}</div><div class="l">This cycle spent</div></div>
    <div class="hist-card"><div class="v">${income>0?Math.round((savingsContrib/income)*100):0}%</div><div class="l">Savings rate</div></div>
  `;

  const chartWrap = document.getElementById('histChartWrap');
  const budget = totalBudget();
  const cycles = [...state.history, {label: cycleLabelText(), income: income, totalBudget: budget, totalSpent: spent}];
  if(cycles.length===0){
    chartWrap.innerHTML = '<div class="empty-hist">Archive a cycle from Settings to start building your history.</div>';
  } else {
    const maxVal = Math.max(...cycles.map(c=>Math.max(c.income, c.totalSpent, c.totalBudget)), 1);
    let rows = '';
    cycles.slice(-6).forEach(c=>{
      const incW = (c.income/maxVal)*100;
      const spendW = (c.totalSpent/maxVal)*100;
      rows += `
        <div class="chart-row">
          <div class="m">${escapeHtml(c.label)}</div>
          <div class="chart-bars">
            <div class="chart-bar" style="width:${incW}%; background:var(--gold); height:8px;"></div>
            <div class="chart-bar" style="width:${spendW}%; background:var(--teal); height:8px;"></div>
          </div>
        </div>`;
    });
    chartWrap.innerHTML = `
      <div class="chart">
        <div class="chart-rows">${rows}</div>
        <div class="chart-legend">
          <div class="legend-item"><span class="legend-dot" style="background:var(--gold);"></span>Income</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--teal);"></span>Spent</div>
        </div>
      </div>`;
  }

  const txWrap = document.getElementById('txListFull');
  const term = (txSearchTerm || '').trim().toLowerCase();
  let sorted = [...state.transactions].sort((a,b)=> b.date.localeCompare(a.date) || b.id-a.id);
  if(term){
    sorted = sorted.filter(t=>{
      const cat = catById(t.categoryId);
      return (t.desc||'').toLowerCase().includes(term) || (cat && cat.name.toLowerCase().includes(term));
    });
    document.getElementById('txTagFull').textContent = sorted.length + ' match' + (sorted.length===1?'':'es');
  } else {
    document.getElementById('txTagFull').textContent = sorted.length + ' logged';
  }
  txWrap.innerHTML = sorted.length ? '' : '<div class="empty-hist">' + (term ? 'No transactions match "' + escapeHtml(txSearchTerm) + '".' : 'No expenses logged this cycle yet.') + '</div>';
  sorted.forEach(t=>renderTxRow(txWrap, t, true));

  renderPastCycles();
  renderYearSelect();
}

function renderPastCycles(){
  const wrap = document.getElementById('pastCyclesList');
  document.getElementById('pastCyclesTag').textContent = state.history.length + ' archived';
  if(!state.history.length){ wrap.innerHTML = '<div class="empty-hist">No archived cycles yet — use "Archive this cycle" in Settings once a pay cycle ends.</div>'; return; }
  wrap.innerHTML = '';
  [...state.history].reverse().forEach(h=>{
    const row = document.createElement('div');
    row.className = 'tx-row';
    row.innerHTML = `
      <div class="tx-left">
        <div class="tx-cat">${escapeHtml(h.label)}</div>
        <div class="tx-desc">Income ${fmt(h.income)} · Spent ${fmt(h.totalSpent)}</div>
      </div>
      <button class="btn btn-ghost view-btn" style="width:auto;padding:8px 14px;margin:0;font-size:12px;">View</button>
      <button class="btn btn-ghost restore-btn" style="width:auto;padding:8px 14px;margin:0 0 0 6px;font-size:12px;">Restore</button>
    `;
    row.querySelector('.view-btn').addEventListener('click', ()=> openReportForHistory(h));
    row.querySelector('.restore-btn').addEventListener('click', ()=> restoreCycleFromHistory(h));
    wrap.appendChild(row);
  });
}

async function restoreCycleFromHistory(h){
  if(!API_URL){ showToast('Restore needs a live backend connection'); return; }
  if(!navigator.onLine){ showToast('You\'re offline — reconnect to restore a cycle'); return; }
  const ok = await askConfirm('Restore "' + h.label + '"?',
    'This brings its transactions and extra income back into your current cycle and removes it from History. Use this if it archived by mistake.');
  if(!ok) return;

  // Cancel any debounced save already queued from something typed/edited just
  // before this, and block the periodic background sync for the duration of
  // the restore. Without this, a sync landing between the restore call and
  // the state refresh below pushes this browser's stale pre-restore
  // transactions and silently undoes the restore.
  clearTimeout(saveTimer);
  syncSuspended = true;
  try{
    const data = await apiPost('restoreCycle', {label: h.label});
    if(!data || data.error){ showToast('Could not restore: ' + (data && data.error || 'unknown error')); return; }
    const fresh = await apiGet('getState');
    if(fresh && !fresh.error){
      state = Object.assign(state, fresh);
      isDirty = false;
      saveLocalMirror();
      renderAll();
      updateSyncIndicator();
    }
    showToast('Cycle restored — ' + data.restoredTransactions + ' transaction(s) back');
  }catch(e){
    showToast('Could not reach backend to restore');
  }finally{
    syncSuspended = false;
  }
}

function renderYearSelect(){
  const sel = document.getElementById('yearSelect');
  const current = sel.value;
  const years = availableYears();
  sel.innerHTML = years.map(y=>`<option value="${y}">${y}</option>`).join('');
  if(years.includes(current)) sel.value = current;
}
document.getElementById('yearReportBtn').addEventListener('click', ()=>{
  const year = document.getElementById('yearSelect').value;
  if(!year){ showToast('No year selected'); return; }
  openYearReport(year);
});

/* ============================================================
   RENDER: SETTINGS
   ============================================================ */
/* ============================================================
   DRAG-TO-REORDER CATEGORIES (Settings) — Pointer Events cover mouse and
   touch with one code path. Reordering only happens within state.categories'
   array order (which is exactly what the backend persists and reads back),
   so no new schema field is needed — just the array order itself.
   ============================================================ */
let dragCatId = null;
function attachCatDrag(handle, div){
  handle.addEventListener('pointerdown', (e)=>{
    e.preventDefault();
    dragCatId = div.dataset.catId;
    div.classList.add('dragging');
    div.style.opacity = '0.6';
    try{ handle.setPointerCapture(e.pointerId); }catch(err){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(dragCatId !== div.dataset.catId) return;
    const wrap = document.getElementById('settingsCatList');
    const rows = [...wrap.querySelectorAll('.settings-cat')];
    const y = e.clientY;
    for(const row of rows){
      if(row === div) continue;
      const rect = row.getBoundingClientRect();
      if(y > rect.top && y < rect.bottom){
        if(y < rect.top + rect.height/2){ wrap.insertBefore(div, row); }
        else { wrap.insertBefore(div, row.nextSibling); }
        break;
      }
    }
  });
  const finishDrag = ()=>{
    if(dragCatId !== div.dataset.catId) return;
    div.classList.remove('dragging');
    div.style.opacity = '';
    dragCatId = null;
    const wrap = document.getElementById('settingsCatList');
    const newOrderIds = [...wrap.querySelectorAll('.settings-cat')].map(el=>el.dataset.catId);
    state.categories.sort((a,b)=> newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
    saveState(); renderAll();
  };
  handle.addEventListener('pointerup', finishDrag);
  handle.addEventListener('pointercancel', finishDrag);
}

function renderSettings(){
  refreshPinStatusUI();
  const curSel = document.getElementById('currencySelect');
  if(!curSel.options.length){
    curSel.innerHTML = CURRENCY_OPTIONS.map(c=>`<option value="${c.sym}">${escapeHtml(c.label)}</option>`).join('');
  }
  curSel.value = state.currency || '₦';
  document.getElementById('incomeCurrentDisplay').textContent = 'Current: ' + fmt(state.income);
  document.getElementById('emailCurrentDisplay').textContent = 'Current: ' + (state.email || 'not set');
  document.getElementById('paydayInput').value = state.paydayDay || 25;
  document.getElementById('cycleCurrentDisplay').textContent = 'Current cycle: ' + cycleLabelText();

  const budget = totalBudget();
  const income = combinedIncome();
  const totalLine = document.getElementById('budgetTotalLine');
  document.getElementById('budgetTotalVal').textContent = fmt(budget) + (income>0 && !privacyMode ? ' (' + Math.round(budget/income*100) + '% of income)' : '');
  totalLine.classList.toggle('over', income>0 && (budget + totalSavingsBudget()) > income);

  const wrap = document.getElementById('settingsCatList');
  wrap.innerHTML = '';
  state.categories.forEach(cat=>{
    const div = document.createElement('div');
    div.className = 'settings-cat';
    div.dataset.catId = cat.id;
    const isSavings = cat.group === 'Savings';
    div.innerHTML = `
      <div class="settings-cat-name" style="display:flex;justify-content:space-between;align-items:center;">
        <span style="display:flex;align-items:center;">
          <span class="cat-drag-handle" title="Drag to reorder" aria-label="Drag to reorder" style="cursor:grab;color:var(--muted);margin-right:8px;touch-action:none;font-size:14px;">⠿</span>
          ${cat.icon?escapeHtml(cat.icon)+' ':''}${escapeHtml(cat.name)} <span style="color:var(--muted-2); font-weight:400;">(${escapeHtml(cat.group)})</span>
        </span>
        <button class="cat-delete" data-id="${cat.id}" data-name="${escapeHtml(cat.name)}" title="Delete category" aria-label="Delete category"
          style="background:none;border:none;color:var(--red);font-size:15px;cursor:pointer;padding:0 2px;">🗑</button>
      </div>
      <div class="settings-row">
        <div class="field">
          <label>${isSavings ? 'Per-cycle target '+(state.currency||'₦') : 'Budget '+(state.currency||'₦')}</label>
          <input type="number" class="cat-budget" data-id="${cat.id}" value="${cat.budget}" min="0" step="1">
        </div>
        ${!isSavings ? `
        <div class="field">
          <label>Alert %</label>
          <input type="number" class="cat-threshold" data-id="${cat.id}" value="${Math.round(cat.threshold*100)}" min="1" max="100">
        </div>` : `
        <div class="field">
          <label>Lifetime goal ${state.currency||'₦'}</label>
          <input type="number" class="cat-goal" data-id="${cat.id}" value="${cat.goal||0}" min="0" step="1">
        </div>`}
      </div>
      ${!isSavings ? `
      <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin:-6px 0 8px;cursor:pointer;">
        <input type="checkbox" class="cat-rollover" data-id="${cat.id}" style="width:auto;margin:0;" ${cat.rollover?'checked':''}>
        Carry over unused budget to next cycle
      </label>` : ''}
    `;
    wrap.appendChild(div);
  });
  wrap.querySelectorAll('.cat-budget').forEach(inp=>{
    inp.addEventListener('change', e=>{
      catById(e.target.dataset.id).budget = Math.max(Number(e.target.value)||0, 0);
      saveState(); renderAll();
    });
  });
  wrap.querySelectorAll('.cat-threshold').forEach(inp=>{
    inp.addEventListener('change', e=>{
      catById(e.target.dataset.id).threshold = Math.min(Math.max(Number(e.target.value)||1,1),100)/100;
      saveState(); renderAll();
    });
  });
  wrap.querySelectorAll('.cat-goal').forEach(inp=>{
    inp.addEventListener('change', e=>{
      catById(e.target.dataset.id).goal = Math.max(Number(e.target.value)||0, 0);
      saveState(); renderAll();
    });
  });
  wrap.querySelectorAll('.cat-rollover').forEach(inp=>{
    inp.addEventListener('change', e=>{
      catById(e.target.dataset.id).rollover = e.target.checked;
      saveState(); renderAll();
      showToast(e.target.checked ? 'Rollover enabled' : 'Rollover disabled');
    });
  });
  wrap.querySelectorAll('.cat-drag-handle').forEach(handle=>{
    attachCatDrag(handle, handle.closest('.settings-cat'));
  });
  wrap.querySelectorAll('.cat-delete').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = btn.dataset.id;
      const spent = spentFor(id);
      const msg = spent > 0
        ? `"${btn.dataset.name}" has ${fmt(spent)} logged against it this cycle. Deleting it will leave those transactions uncategorized (they won't be removed). Continue?`
        : `Delete "${btn.dataset.name}"? This can't be undone.`;
      const ok = await askConfirm('Delete category?', msg);
      if(!ok) return;
      state.categories = state.categories.filter(c=>c.id!==id);
      saveState(); renderAll();
      showToast('Category deleted');
    });
  });

  renderBillsList();
  renderRecurringList();
}

function renderBillsList(){
  const wrap = document.getElementById('billsList');
  document.getElementById('billsTag').textContent = state.bills.length + ' tracked';
  if(!state.bills.length){ wrap.innerHTML = '<div class="empty-hist">No bills added yet.</div>'; return; }
  wrap.innerHTML = '';
  state.bills.forEach(bill=>{
    const row = document.createElement('div');
    row.className = 'extra-row';
    row.innerHTML = `
      <div class="extra-left">
        <div class="src">${escapeHtml(bill.name)}</div>
        <div class="dt">Due day ${bill.dueDay} · ${fmt(bill.amount)}</div>
      </div>
      <button class="tx-del" data-id="${bill.id}" aria-label="Delete bill">✕</button>
    `;
    row.querySelector('.tx-del').addEventListener('click', ()=>{
      state.bills = state.bills.filter(b=>b.id!==bill.id);
      saveState(); renderAll();
      showToast('Bill removed');
    });
    wrap.appendChild(row);
  });
}
document.getElementById('addBillBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newBillName').value.trim();
  const amount = Number(document.getElementById('newBillAmount').value);
  const dueDay = Math.min(Math.max(Number(document.getElementById('newBillDueDay').value)||1, 1), 28);
  if(!name){ showToast('Enter a bill name'); return; }
  if(!amount || amount<=0){ showToast('Enter a valid amount'); return; }
  state.bills.push({ id: uniqueId('bill'), name, amount, dueDay });
  saveState(); renderAll();
  document.getElementById('newBillName').value = '';
  document.getElementById('newBillAmount').value = '';
  document.getElementById('newBillDueDay').value = '';
  showToast('Bill added');
});

function renderRecurringList(){
  const wrap = document.getElementById('recurringList');
  const tpls = state.recurringTemplates || [];
  document.getElementById('recurTag').textContent = tpls.length + ' active';
  if(!tpls.length){ wrap.innerHTML = '<div class="empty-hist">None yet — check "Repeats every cycle" when logging an expense to add one.</div>'; return; }
  wrap.innerHTML = '';
  tpls.forEach(tpl=>{
    const cat = catById(tpl.categoryId);
    const row = document.createElement('div');
    row.className = 'extra-row';
    row.innerHTML = `
      <div class="extra-left">
        <div class="src">${cat && cat.icon ? escapeHtml(cat.icon)+' ' : ''}${escapeHtml(tpl.desc || (cat?cat.name:'Uncategorized'))}</div>
        <div class="dt">${escapeHtml(cat?cat.name:'Uncategorized')} · ${fmt(tpl.amount)} each cycle</div>
      </div>
      <button class="tx-del" aria-label="Stop recurring">✕</button>
    `;
    row.querySelector('.tx-del').addEventListener('click', async ()=>{
      const ok = await askConfirm('Stop "' + (tpl.desc || cat?.name || 'this') + '" from recurring?',
        'It won\'t be auto-logged next cycle. Any past instances already logged stay untouched.');
      if(!ok) return;
      state.recurringTemplates = state.recurringTemplates.filter(rt=>rt.id!==tpl.id);
      // Unlink any live transaction still pointing at this template so it
      // doesn't silently re-link to a since-deleted recurring rule.
      state.transactions.forEach(t=>{ if(t.recurTemplateId===tpl.id) delete t.recurTemplateId; });
      saveState(); renderAll();
      showToast('Recurring transaction stopped');
    });
    wrap.appendChild(row);
  });
}

/* ============================================================
   RENDER ALL + NAV
   ============================================================ */
function renderAll(){
  refreshCycleDates();
  renderDashboard();
  renderSavingsTab();
  renderDebtTab();
  renderLoanTab();
  renderHistory();
  renderSettings();
  const sel = document.getElementById('txCategory');
  sel.innerHTML = state.categories.map(c=>`<option value="${c.id}">${c.icon?escapeHtml(c.icon)+' ':''}${escapeHtml(c.name)}${c.group==='Savings'?' (savings)':''}</option>`).join('');
}

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+btn.dataset.view).classList.add('active');
    if(btn.dataset.view === 'settings') renderSharesList();
  });
});

/* ============================================================
   SHEETS
   ============================================================ */
const overlay = document.getElementById('overlay');
function openSheetEl(el){ overlay.classList.add('show'); el.classList.add('show'); }
function closeSheetEl(el){ overlay.classList.remove('show'); el.classList.remove('show'); }
let activeSheet = null;
overlay.addEventListener('click', ()=>{ if(activeSheet) closeSheetEl(activeSheet); activeSheet=null; });

/* ============================================================
   VOICE LOGGING (Web Speech API — Chrome/Edge/Android reliable,
   Safari partial, Firefox unsupported: button hides itself if
   the browser has no support at all, rather than showing broken UI)
   ============================================================ */
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceLogBtn = document.getElementById('voiceLogBtn');
if(!SpeechRecognitionAPI){
  voiceLogBtn.style.display = 'none';
} else {
  voiceLogBtn.addEventListener('click', startVoiceCapture);
}
function startVoiceCapture(){
  const statusEl = document.getElementById('voiceStatus');
  const recognition = new SpeechRecognitionAPI();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceLogBtn.classList.add('listening');
  statusEl.style.display = 'block';
  statusEl.textContent = '🎙️ Listening — try "fifteen hundred for transport" or "2000 groceries"…';

  recognition.onresult = (e)=>{
    const transcript = e.results[0][0].transcript;
    parseVoiceTranscript(transcript, statusEl);
  };
  recognition.onerror = ()=>{
    statusEl.textContent = 'Could not hear you — try again, or just type it in.';
  };
  recognition.onend = ()=>{ voiceLogBtn.classList.remove('listening'); };
  try{ recognition.start(); }
  catch(e){ statusEl.textContent = 'Voice input unavailable right now.'; voiceLogBtn.classList.remove('listening'); }
}
function parseVoiceTranscript(text, statusEl){
  const numMatch = text.replace(/,/g,'').match(/(\d+(\.\d+)?)/);
  let matchedAmount = null;
  if(numMatch){
    matchedAmount = numMatch[1];
    document.getElementById('txAmount').value = matchedAmount;
  }
  const lower = text.toLowerCase();
  let matchedCat = null;
  state.categories.forEach(c=>{
    if(matchedCat) return;
    const words = c.name.toLowerCase().split(/[\/\s]+/).filter(w=>w.length>2);
    if(words.some(w=>lower.includes(w))) matchedCat = c;
  });
  if(matchedCat) document.getElementById('txCategory').value = matchedCat.id;
  document.getElementById('txDesc').value = text.charAt(0).toUpperCase() + text.slice(1);
  // Setting .value on a <select> via JS does NOT fire a native 'change'
  // event, so without this, picking up "debt"/"lend" by voice would leave
  // the creditor/borrower linking field hidden — the transaction would
  // save with the right category (so it'd show correctly in the Dashboard's
  // category breakdown) but never create the linked Debt/Loan record. This
  // was the actual bug: voice/quick-add bypassed the one place that reveals
  // that field.
  refreshDebtLinkField();
  refreshLoanLinkField();

  statusEl.textContent = 'Heard: "' + text + '"' +
    (matchedAmount ? ' · amount ' + fmt(Number(matchedAmount)) : ' · no amount detected, check the field') +
    (matchedCat ? ' · category: ' + matchedCat.name : ' · pick a category below');
}

// Auto-links a "Debt repayment" expense logged from the general form to a
// specific creditor, so a single log-expense step is enough (previously
// this only happened when logging via the dedicated Debt tracker, so a
// payment logged here counted toward the budget total but never reduced
// any individual debt's remaining balance).
function refreshDebtLinkField(selectedDebtId){
  const field = document.getElementById('txDebtLinkField');
  const sel = document.getElementById('txDebtLink');
  const isDebtCat = document.getElementById('txCategory').value === 'debt';
  if(!isDebtCat || !state.debts.length){
    field.style.display = 'none';
    sel.innerHTML = '';
    return;
  }
  field.style.display = '';
  sel.innerHTML = '<option value="">Not linked to a specific debt</option>' +
    state.debts.map(d=>`<option value="${d.id}">${escapeHtml(d.creditor)} (${fmt(remainingForDebt(d))} left)</option>`).join('');
  sel.value = selectedDebtId || '';
}
document.getElementById('txCategory').addEventListener('change', ()=>{ refreshDebtLinkField(); refreshLoanLinkField(); });

// Same one-step idea as the debt link, but for money going OUT to a friend:
// picking "Money Lent Out" lets you name who it's for right there, which
// creates the actual Loan record — previously there was no lending
// category at all, so this always ended up as a plain, untracked expense
// with no way to later log a repayment against it.
function refreshLoanLinkField(t){
  const field = document.getElementById('txLoanLinkField');
  const input = document.getElementById('txLoanLinkInput');
  const label = document.getElementById('txLoanLinkLabel');
  const isLendCat = document.getElementById('txCategory').value === 'lend';
  if(!isLendCat){ field.style.display = 'none'; input.value=''; return; }
  field.style.display = '';
  if(t && t.loanId && loanById(t.loanId)){
    // Already linked to a loan — this quick sheet only shows the link,
    // renaming/re-amounting a loan happens on the Lent Out card itself
    // so the two stay in sync from one place.
    label.textContent = 'Linked loan';
    input.value = loanById(t.loanId).borrower;
    input.disabled = true;
  } else {
    label.textContent = 'Who are you lending to?';
    input.value = '';
    input.disabled = false;
  }
}

const addSheet = document.getElementById('addSheet');
let editingTxId = null;
document.getElementById('fabAdd').addEventListener('click', ()=>{
  editingTxId = null;
  document.getElementById('addSheetTitle').textContent = 'Log an expense';
  document.getElementById('txSaveBtn').textContent = 'Add expense';
  document.getElementById('txAmount').value = '';
  document.getElementById('txDesc').value = '';
  document.getElementById('txMethod').value = '';
  document.getElementById('txCategory').value = state.categories[0] ? state.categories[0].id : '';
  document.getElementById('txDate').value = toDateInput(new Date());
  document.getElementById('voiceStatus').style.display = 'none';
  document.getElementById('txRecurring').checked = false;
  refreshDebtLinkField();
  refreshLoanLinkField();
  activeSheet = addSheet; openSheetEl(addSheet);
});
function openEditTx(t){
  editingTxId = t.id;
  document.getElementById('addSheetTitle').textContent = 'Edit expense';
  document.getElementById('txSaveBtn').textContent = 'Save changes';
  document.getElementById('txAmount').value = t.amount;
  document.getElementById('txCategory').value = t.categoryId;
  document.getElementById('txMethod').value = t.method || '';
  document.getElementById('txDesc').value = t.desc || '';
  document.getElementById('txDate').value = t.date;
  document.getElementById('txRecurring').checked = t.recurTemplateId != null;
  refreshDebtLinkField(t.debtId);
  refreshLoanLinkField(t);
  activeSheet = addSheet; openSheetEl(addSheet);
}
document.getElementById('txCancelBtn').addEventListener('click', ()=>{ closeSheetEl(addSheet); activeSheet=null; editingTxId=null; });
document.getElementById('txSaveBtn').addEventListener('click', ()=>{
  const amount = Number(document.getElementById('txAmount').value);
  const categoryId = document.getElementById('txCategory').value;
  const method = document.getElementById('txMethod').value;
  const desc = document.getElementById('txDesc').value.trim();
  const date = document.getElementById('txDate').value || toDateInput(new Date());
  const wantsRecurring = document.getElementById('txRecurring').checked;
  if(!amount || amount<=0){ showToast('Enter a valid amount'); return; }
  if(!state.recurringTemplates) state.recurringTemplates = [];

  // Only relevant when categoryId is 'debt' — the field is hidden (and its
  // value ignored) for every other category, so this naturally clears any
  // stale debtId if the category was changed away from Debt repayment.
  const debtLinkVal = document.getElementById('txDebtLink').value;
  const debtId = (categoryId === 'debt' && debtLinkVal) ? debtLinkVal : null;
  const loanBorrowerInput = document.getElementById('txLoanLinkInput');
  const newLoanBorrowerName = (categoryId === 'lend' && !loanBorrowerInput.disabled) ? loanBorrowerInput.value.trim() : '';

  let t;
  if(editingTxId != null){
    t = state.transactions.find(x=>x.id===editingTxId);
    if(t){
      Object.assign(t, {amount, categoryId, method, desc, date});
      if(debtId) t.debtId = debtId; else delete t.debtId;
      // If there's a name typed here and no valid existing link (either it
      // never had one, or the loan it pointed to no longer exists), create
      // the loan now — same one-step behavior as a fresh log. This is the
      // recovery path: previously, editing silently ignored this field
      // entirely, so a missed link could never be fixed from here.
      if(newLoanBorrowerName && !(t.loanId && loanById(t.loanId))){
        const newLoan = {id: uniqueId('loan'), borrower: newLoanBorrowerName, reason: desc||'', amount};
        state.loans.push(newLoan);
        t.loanId = newLoan.id;
        queueLoanDebtOp('addLoan', {loan: newLoan});
      }
    }
    showToast(newLoanBorrowerName && t && t.loanId ? '✓ Expense updated and loan linked' : 'Expense updated');
  } else {
    t = {id: uniqueId(), amount, categoryId, desc, date, method};
    if(debtId) t.debtId = debtId;
    if(newLoanBorrowerName){
      const newLoan = {id: uniqueId('loan'), borrower: newLoanBorrowerName, reason: desc||'', amount};
      state.loans.push(newLoan);
      t.loanId = newLoan.id;
      queueLoanDebtOp('addLoan', {loan: newLoan});
    }
    state.transactions.push(t);
    if(newLoanBorrowerName){
      showToast('✓ Loan created for ' + newLoanBorrowerName + ' — check the Lent Out tab');
    } else {
      showToast(isSavingsCat(categoryId) ? 'Added to savings — not counted as spending' : 'Expense added');
    }
  }

  // Keep the recurring template in sync with the checkbox: create one if
  // newly checked, update it in place if it already existed, or remove it
  // if unchecked (this only stops FUTURE auto-logging — past instances of
  // it are ordinary transactions and are untouched).
  if(t){
    if(wantsRecurring){
      if(t.recurTemplateId){
        const tpl = state.recurringTemplates.find(rt=>rt.id===t.recurTemplateId);
        if(tpl) Object.assign(tpl, {categoryId, desc, amount, method});
      } else {
        const tplId = uniqueId('rt');
        state.recurringTemplates.push({id: tplId, categoryId, desc, amount, method});
        t.recurTemplateId = tplId;
      }
    } else if(t.recurTemplateId){
      state.recurringTemplates = state.recurringTemplates.filter(rt=>rt.id!==t.recurTemplateId);
      delete t.recurTemplateId;
    }
  }

  saveState(); renderAll();

  // Quick visual feedback on how this expense landed in its category —
  // skipped for Savings categories, which already get their own goal-hit
  // celebration elsewhere, and for debt/lend where "over budget" framing
  // doesn't fit (paying down debt setting off a red flash sends the wrong
  // message). Reuses statusForAmt(), the same status the bar colors use.
  if(t && !isSavingsCat(t.categoryId) && t.categoryId!=='debt' && t.categoryId!=='lend'){
    const cat = catById(t.categoryId);
    if(cat){
      const cls = statusForAmt(cat, spentFor(cat.id)).cls;
      triggerBudgetReaction(cls==='st-over' ? 'over' : cls==='st-near' ? 'near' : 'ok');
    }
  }

  closeSheetEl(addSheet); activeSheet=null; editingTxId=null;
  document.getElementById('txAmount').value=''; document.getElementById('txDesc').value='';
});

const extraSheet = document.getElementById('extraSheet');
let lastFxQuote = null; // {rate, from, to, date} — cached result of the most recent live rate check

function populateExtraCurrency(){
  const sel = document.getElementById('extraCurrency');
  if(!sel.options.length){
    sel.innerHTML = CURRENCY_OPTIONS.map(c=>`<option value="${c.sym}">${escapeHtml(c.label)}</option>`).join('');
  }
  sel.value = state.currency || '₦';
}
document.getElementById('addExtraBtn').addEventListener('click', ()=>{
  document.getElementById('extraDate').value = toDateInput(new Date());
  populateExtraCurrency();
  document.getElementById('fxPreview').style.display = 'none';
  lastFxQuote = null;
  activeSheet = extraSheet; openSheetEl(extraSheet);
});
document.getElementById('extraCancelBtn').addEventListener('click', ()=>{ closeSheetEl(extraSheet); activeSheet=null; });

let fxCheckTimer = null;
async function checkFxRate(){
  const previewEl = document.getElementById('fxPreview');
  const amount = Number(document.getElementById('extraAmount').value);
  const fromSym = document.getElementById('extraCurrency').value;
  const homeSym = state.currency || '₦';

  if(fromSym === homeSym || !amount || amount<=0){
    previewEl.style.display = 'none';
    lastFxQuote = null;
    return;
  }

  const fromCode = currencyCodeFor(fromSym);
  const toCode = currencyCodeFor(homeSym);
  previewEl.style.display = 'block';
  previewEl.className = 'fx-preview loading';
  previewEl.textContent = 'Checking live exchange rate…';

  try{
    // v2 endpoint (api.frankfurter.dev) — the old v1 (api.frankfurter.app) is
    // now frozen at 31 ECB-only currencies and doesn't cover NGN, GHS, or KES,
    // three of the currencies this app itself offers. v2 covers 165 and
    // includes all of them. It returns a bare rate, not a converted amount,
    // so the multiplication happens here instead of via a `?amount=` param.
    const res = await fetch(`https://api.frankfurter.dev/v2/rate/${fromCode}/${toCode}`);
    if(!res.ok) throw new Error('rate lookup failed (' + res.status + ')');
    const data = await res.json();
    if(typeof data.rate !== 'number') throw new Error('no rate in response');
    const rate = data.rate;
    const converted = amount * rate;
    lastFxQuote = { rate, from: fromCode, to: toCode, date: data.date };
    previewEl.className = 'fx-preview';
    previewEl.textContent = `≈ ${fmt(converted)} at today's rate (1 ${fromCode} = ${rate.toFixed(2)} ${toCode}, ${data.date})`;
  }catch(e){
    lastFxQuote = null;
    previewEl.className = 'fx-preview error';
    previewEl.textContent = 'Could not fetch a live rate — enter the amount in ' + homeSym + ' instead, or try again.';
  }
}
document.getElementById('extraAmount').addEventListener('input', ()=>{
  clearTimeout(fxCheckTimer);
  fxCheckTimer = setTimeout(checkFxRate, 500);
});
document.getElementById('extraCurrency').addEventListener('change', checkFxRate);

document.getElementById('extraSaveBtn').addEventListener('click', ()=>{
  const rawAmount = Number(document.getElementById('extraAmount').value);
  const fromSym = document.getElementById('extraCurrency').value;
  const homeSym = state.currency || '₦';
  const source = document.getElementById('extraSource').value.trim();
  const date = document.getElementById('extraDate').value || toDateInput(new Date());
  if(!rawAmount || rawAmount<=0){ showToast('Enter a valid amount'); return; }

  const entry = { id: uniqueId(), source, date };
  if(fromSym !== homeSym){
    if(!lastFxQuote || lastFxQuote.from !== currencyCodeFor(fromSym)){
      showToast('Still checking the exchange rate — wait a second and try again');
      return;
    }
    entry.amount = Math.round(rawAmount * lastFxQuote.rate);
    entry.fxOriginalAmount = rawAmount;
    entry.fxOriginalCurrency = fromSym;
    entry.fxRate = lastFxQuote.rate;
    entry.fxRateDate = lastFxQuote.date;
  } else {
    entry.amount = rawAmount;
  }

  state.extraIncome.push(entry);
  saveState(); renderAll();
  closeSheetEl(extraSheet); activeSheet=null;
  document.getElementById('extraAmount').value=''; document.getElementById('extraSource').value='';
  document.getElementById('fxPreview').style.display = 'none';
  showToast(entry.fxOriginalCurrency
    ? `Converted ${entry.fxOriginalCurrency}${entry.fxOriginalAmount} → ${fmt(entry.amount)} and added`
    : 'Extra income added — buffered into your totals');
});

/* ============================================================
   AI ASSISTANT (floating widget, chat-style, persisted history)
   ============================================================ */
const aiSheet = document.getElementById('aiSheet');
function renderAiChat(){
  const wrap = document.getElementById('aiChat');
  if(!state.aiHistory.length){
    wrap.innerHTML = '<div class="ai-empty">Ask me anything about this cycle — e.g. "Am I overspending on transport?" or "How much more can I save?"</div>';
  } else {
    wrap.innerHTML = '';
    state.aiHistory.forEach(msg=>{
      const bubble = document.createElement('div');
      bubble.className = 'ai-bubble ' + msg.role + (msg.error ? ' error' : '');
      bubble.textContent = msg.text;
      wrap.appendChild(bubble);
    });
    wrap.scrollTop = wrap.scrollHeight;
  }
  renderAiChips();
}
// A handful of one-tap starting points, so the assistant doesn't just stare
// back at an empty input box. Only shown before the first message — once a
// real conversation is underway, suggested starters would just be clutter.
// A couple are personalized from real data where it's available (the
// biggest category, an active debt) rather than always being generic.
function renderAiChips(){
  const wrap = document.getElementById('aiChips');
  if(!wrap) return;
  if(state.aiHistory.length){ wrap.innerHTML = ''; wrap.style.display = 'none'; return; }
  const chips = ['How am I doing this cycle?', 'Where can I cut back?'];
  const spentMap = spentByCategoryMap();
  const topCat = spendingCategories()
    .map(c=>({name:c.name, spent:spentMap[c.id]||0}))
    .filter(x=>x.spent>0).sort((a,b)=>b.spent-a.spent)[0];
  if(topCat) chips.push('Am I overspending on ' + topCat.name + '?');
  if(activeDebts().length) chips.push('What\'s the fastest way to pay off my debt?');
  chips.push('Any tips to boost my savings rate?');
  wrap.style.display = 'flex';
  wrap.innerHTML = chips.slice(0,4).map(c=>`<button class="ai-chip">${escapeHtml(c)}</button>`).join('');
  wrap.querySelectorAll('.ai-chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.getElementById('aiQuestion').value = btn.textContent;
      sendAiQuestion();
    });
  });
}
document.getElementById('askAiFab').addEventListener('click', ()=>{
  if(!API_URL){
    showToast('Connect a backend first (see Settings) — the AI assistant needs one');
    return;
  }
  renderAiChat();
  activeSheet = aiSheet; openSheetEl(aiSheet);
  setTimeout(()=>document.getElementById('aiQuestion').focus(), 300);
});
document.getElementById('aiCloseBtn').addEventListener('click', ()=>{ closeSheetEl(aiSheet); activeSheet=null; });
document.getElementById('aiClearBtn').addEventListener('click', async ()=>{
  if(!state.aiHistory.length) return;
  const ok = await askConfirm('Clear conversation?', 'This deletes your AI chat history. This can\'t be undone.');
  if(!ok) return;
  state.aiHistory = [];
  saveState(); renderAiChat();
});
async function sendAiQuestion(){
  const input = document.getElementById('aiQuestion');
  const q = input.value.trim();
  if(!q) return;
  state.aiHistory.push({id: uniqueId(), role:'user', text:q});
  input.value = '';
  renderAiChat();
  const thinkingId = Date.now()+1;
  state.aiHistory.push({id: thinkingId, role:'bot', text:'Thinking…'});
  renderAiChat();
  try{
    const data = await apiPost('askAI', {
      question: q,
      // Last few PRIOR turns (excluding the question/placeholder just pushed
      // above) give the assistant real conversational memory — e.g. "what
      // about last week?" — instead of answering blind every time.
      history: state.aiHistory.slice(0, -2).filter(m => !m.error).slice(-8).map(m => ({role: m.role, text: m.text}))
    });
    const msg = state.aiHistory.find(m=>m.id===thinkingId);
    if(msg){
      msg.text = data.answer || data.error || 'No response — try again.';
      msg.error = !data.answer;
    }
  }catch(e){
    const msg = state.aiHistory.find(m=>m.id===thinkingId);
    if(msg){ msg.text = 'Could not reach the AI assistant — check your connection.'; msg.error = true; }
  }
  saveState(); renderAiChat();
}
document.getElementById('aiAskBtn').addEventListener('click', sendAiQuestion);
document.getElementById('aiQuestion').addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){ e.preventDefault(); sendAiQuestion(); }
});

/* ============================================================
   KEYBOARD SHORTCUTS (desktop/browser use — app is otherwise fully
   gesture-driven for mobile, so these are pure bonus for a keyboard+mouse
   session and never required)
   ============================================================ */
document.addEventListener('keydown', (e)=>{
  const tag = (e.target && e.target.tagName || '').toLowerCase();
  const isTyping = tag==='input' || tag==='textarea' || tag==='select' || (e.target && e.target.isContentEditable);

  if(e.key === 'Escape'){
    if(activeSheet){ closeSheetEl(activeSheet); activeSheet = null; }
    else if(isTyping) e.target.blur();
    return;
  }
  if(isTyping) return; // don't hijack typing in any field below this point

  if(e.key === 'n' || e.key === 'N'){
    e.preventDefault();
    document.getElementById('fabAdd').click();
  } else if(e.key === '/'){
    e.preventDefault();
    document.querySelector('.nav-btn[data-view="history"]')?.click();
    document.getElementById('txSearchInput').focus();
  }
});

/* ============================================================
   TRANSACTION SEARCH (History tab) — filters live, no backend round trip
   ============================================================ */
document.getElementById('txSearchInput').addEventListener('input', (e)=>{
  txSearchTerm = e.target.value;
  document.getElementById('txSearchClearBtn').style.display = txSearchTerm ? '' : 'none';
  renderHistory();
});
document.getElementById('txSearchClearBtn').addEventListener('click', ()=>{
  txSearchTerm = '';
  document.getElementById('txSearchInput').value = '';
  document.getElementById('txSearchClearBtn').style.display = 'none';
  renderHistory();
});

/* ============================================================
   PERSONAL NOTES (Guide tab) — auto-saves as you type
   ============================================================ */
let notesSaveTimer = null;
document.getElementById('personalNotesInput').addEventListener('input', (e)=>{
  state.personalNotes = e.target.value;
  clearTimeout(notesSaveTimer);
  const label = document.getElementById('notesSavedLabel');
  label.textContent = 'Saving…';
  notesSaveTimer = setTimeout(()=>{
    saveState();
    label.textContent = 'Saved ' + new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  }, 700);
});

/* ============================================================
   SETTINGS ACTIONS
   ============================================================ */
document.getElementById('saveIncomeBtn').addEventListener('click', ()=>{
  const incomeVal = document.getElementById('incomeInput').value;
  const payVal = document.getElementById('paydayInput').value;
  const emailVal = document.getElementById('emailInput').value.trim();
  const currencyVal = document.getElementById('currencySelect').value;

  if(incomeVal !== '') state.income = Math.max(Number(incomeVal)||0, 0);
  if(payVal !== '') state.paydayDay = Math.min(Math.max(Number(payVal)||25, 1), 28);
  if(emailVal !== '') state.email = emailVal;
  if(currencyVal) state.currency = currencyVal;

  refreshCycleDates();
  saveState(); renderAll();

  document.getElementById('incomeInput').value = '';
  document.getElementById('emailInput').value = '';
  showToast('Saved');
});

document.getElementById('addCatBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newCatName').value.trim();
  const group = document.getElementById('newCatGroup').value;
  if(!name){ showToast('Enter a category name'); return; }

  const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'category';
  let id = baseId, n = 1;
  while(catById(id)){ id = baseId + '-' + (++n); }

  const icon = DEFAULT_ICON_BY_GROUP[group] || '📌';
  const newCat = group === 'Savings'
    ? { id, name, group, budget:0, threshold:null, goal:0, icon }
    : { id, name, group, budget:0, threshold:0.85, icon };
  state.categories.push(newCat);
  saveState(); renderAll();
  document.getElementById('newCatName').value = '';
  showToast('"' + name + '" added');
});

document.getElementById('resetBudgetsBtn').addEventListener('click', async ()=>{
  const ok = await askConfirm('Reset all budgets to ₦0?',
    'This clears the Budget/Target amount on every category (Needs, Wants, and Savings). Category names, alert %, and goals are kept. This can\'t be undone.');
  if(!ok) return;
  state.categories.forEach(c => c.budget = 0);
  saveState(); renderAll();
  showToast('All budgets reset to ₦0');
});

/* ============================================================
   REPORT: DATA + CHARTS + PDF
   ============================================================ */
function buildReportData(snapshot){
  const txs = snapshot ? snapshot.transactions : state.transactions;
  const income = snapshot ? snapshot.income : combinedIncome();
  const spent = txs.filter(t=>!isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
  const budget = snapshot ? (snapshot.budget!=null ? snapshot.budget : 0) : totalBudget();
  const savingsContrib = txs.filter(t=>isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
  const remaining = Math.max(income - spent - savingsContrib, 0);
  const savingsRate = income>0 ? Math.round((savingsContrib/income)*100) : 0;

  const catSpentMap = {};
  txs.forEach(t=>{ catSpentMap[t.categoryId] = (catSpentMap[t.categoryId]||0) + Number(t.amount); });

  const spentByCat = spendingCategories().map(c => ({ name:c.name, spent:catSpentMap[c.id]||0, budget:c.budget }))
    .filter(x=>x.spent>0).sort((a,b)=>b.spent-a.spent);

  const byDay = {};
  txs.filter(t=>!isSavingsCat(t.categoryId)).forEach(t=>{ byDay[t.date] = (byDay[t.date]||0) + Number(t.amount); });
  const dailyEntries = Object.keys(byDay).sort().map(d=>({date:d, amount:byDay[d]}));
  const highestDay = dailyEntries.slice().sort((a,b)=>b.amount-a.amount)[0];

  const overBudget = [];
  const nearLimit = [];
  if(!snapshot){
    state.categories.forEach(c=>{
      const st = statusForAmt(c, catSpentMap[c.id]||0);
      if(st.cls==='st-over') overBudget.push(c);
      else if(st.cls==='st-near') nearLimit.push(c);
    });
  }

  return { income, spent, budget, savingsContrib, remaining, savingsRate, spentByCat, dailyEntries, highestDay, overBudget, nearLimit, txs,
    editedCount: txs.filter(t=>t.updatedAt).length, totalCount: txs.length };
}

function padR(s, w){ s=String(s); return s.length>=w ? s.slice(0,w) : s+' '.repeat(w-s.length); }
function padL(s, w){ s=String(s); return s.length>=w ? s.slice(0,w) : ' '.repeat(w-s.length)+s; }
function generateReportText(d, periodLabel, note){
  const L = [];
  const rule = '='.repeat(70), thin = '-'.repeat(70);
  const genAt = new Date();
  const ref = 'BC-' + genAt.toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();

  L.push(rule);
  L.push(padR('BUDGET COCKPIT', 40) + padL('PERSONAL FINANCIAL STATEMENT', 30));
  L.push(rule);
  L.push('Statement Reference : ' + ref);
  L.push('Statement Period    : ' + (periodLabel || ('Cycle: ' + cycleLabelText())));
  L.push('Generated           : ' + genAt.toLocaleString('en-GB'));
  if(note) L.push('Note                : ' + note);
  L.push(thin);
  L.push('');
  L.push('SUMMARY');
  L.push(thin);
  L.push(padR('Total income', 40) + padL(fmt(d.income), 26));
  L.push(padR('Total expenditure (excl. savings)', 40) + padL(fmt(d.spent), 26));
  L.push(padR('Total budgeted', 40) + padL(fmt(d.budget), 26));
  L.push(padR('Savings / Emergency Fund contributed', 40) + padL(fmt(d.savingsContrib) + ' (' + d.savingsRate + '%)', 26));
  L.push(thin);
  L.push(padR('Balance remaining', 40) + padL(fmt(d.remaining), 26));
  L.push('');

  const items = (d.txs||[]).slice().sort((a,b)=> String(a.date||'').localeCompare(String(b.date||'')) || String(a.id).localeCompare(String(b.id)));
  L.push('TRANSACTION DETAIL (' + items.length + (items.length===1?' entry':' entries') + ')');
  L.push(thin);
  if(items.length===0){
    L.push('No transactions recorded this period.');
  } else {
    L.push(padR('Date',12) + padR('Description',24) + padR('Category',18) + padL('Amount',12));
    items.forEach(t=>{
      const cat = catById(t.categoryId);
      L.push(padR(t.date||'—',12) + padR(t.desc||'(no description)',24) + padR(cat?cat.name:'Uncategorized',18) + padL(fmt(t.amount),12) + (t.updatedAt ? '  *' : ''));
    });
  }
  L.push('');

  L.push('CATEGORY SUBTOTALS');
  L.push(thin);
  if(d.spentByCat.length===0){
    L.push('No expenditure logged this period.');
  } else {
    d.spentByCat.forEach(x=> L.push(padR(x.name,40) + padL(fmt(x.spent),26)));
  }
  L.push('');

  if(d.highestDay) L.push('Highest single-day spend : ' + d.highestDay.date + '  (' + fmt(d.highestDay.amount) + ')');
  L.push('Over budget               : ' + (d.overBudget.length ? d.overBudget.map(c=>c.name).join(', ') : 'none'));
  L.push('Near limit                : ' + (d.nearLimit.length ? d.nearLimit.map(c=>c.name).join(', ') : 'none'));
  L.push('');

  L.push('SUGGESTIONS');
  L.push(thin);
  const suggestions = [];
  if(d.savingsRate < 20 && d.income>0) suggestions.push('Savings rate is below the commonly-cited 20% baseline — consider trimming ' + (d.spentByCat[0] ? d.spentByCat[0].name : 'your largest category') + ' next cycle.');
  if(d.overBudget.length) suggestions.push('Set a firm cap or cut back next cycle on: ' + d.overBudget.map(c=>c.name).join(', ') + '.');
  if(!d.overBudget.length && !d.nearLimit.length && d.savingsRate>=20) suggestions.push('Solid cycle — spending stayed within budget and savings rate is at/above the general benchmark.');
  if(suggestions.length===0) suggestions.push('Log a few more expenses for a more useful pattern report next cycle.');
  suggestions.forEach(s=>L.push('- ' + s));
  L.push('');

  L.push('RECORD INTEGRITY');
  L.push(thin);
  if((d.editedCount||0) > 0){
    L.push('* ' + d.editedCount + ' of ' + d.totalCount + ' entries above were modified after their original entry.');
    L.push('Marked entries (*) reflect the most recently saved values as of the');
    L.push('generation time above; prior versions are not retained in this statement.');
  } else {
    L.push('No entries in this statement have been modified since they were first recorded.');
  }
  L.push(thin);
  L.push('This statement is generated from information entered by the account');
  L.push('holder into Budget Cockpit for personal budgeting purposes. It is not');
  L.push('an official record from any bank or financial institution.');
  L.push(rule);
  return L.join('\n');
}

const PIE_COLORS = ['#FFC24D','#00E5C7','#FF3B30','#FFB020','#7B8494','#B8790A','#0E8A76'];
function drawPieChart(canvas, data){
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const total = data.reduce((s,x)=>s+x.spent,0);
  if(!total){ ctx.fillStyle='#7B8494'; ctx.font='11px sans-serif'; ctx.fillText('No spending yet', 20, canvas.height/2); return; }
  const cx = 70, cy = canvas.height/2, r = 60;
  let start = -Math.PI/2;
  data.slice(0,6).forEach((x,i)=>{
    const slice = (x.spent/total) * Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+slice);
    ctx.closePath();
    ctx.fillStyle = PIE_COLORS[i % PIE_COLORS.length];
    ctx.fill();
    start += slice;
  });
  let ly = 14;
  data.slice(0,6).forEach((x,i)=>{
    ctx.fillStyle = PIE_COLORS[i % PIE_COLORS.length];
    ctx.fillRect(148, ly, 8, 8);
    ctx.fillStyle = '#333'; ctx.font = '9px sans-serif';
    ctx.fillText(x.name.slice(0,14), 160, ly+8);
    ly += 14;
  });
}
function drawBarChart(canvas, entries){
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!entries.length){ ctx.fillStyle='#7B8494'; ctx.font='11px sans-serif'; ctx.fillText('No daily spend yet', 20, canvas.height/2); return; }
  const max = Math.max(...entries.map(e=>e.amount), 1);
  const w = canvas.width, h = canvas.height, pad=20, barW = Math.max((w-pad*2)/entries.length - 4, 2);
  entries.forEach((e,i)=>{
    const barH = (e.amount/max) * (h - pad*2);
    const x = pad + i*((w-pad*2)/entries.length);
    ctx.fillStyle = '#00E5C7';
    ctx.fillRect(x, h-pad-barH, barW, barH);
  });
  ctx.fillStyle = '#7B8494'; ctx.font = '9px sans-serif';
  ctx.fillText(entries[0].date.slice(5), pad, h-6);
  ctx.fillText(entries[entries.length-1].date.slice(5), w-pad-28, h-6);
}

/* ============================================================
   WHAT-IF SIMULATOR
   ============================================================ */
const whatIfSheet = document.getElementById('whatIfSheet');
function openWhatIf(){
  const sel = document.getElementById('whatIfCategory');
  sel.innerHTML = spendingCategories().filter(c=>spentFor(c.id)>0)
    .map(c=>`<option value="${c.id}">${c.icon?escapeHtml(c.icon)+' ':''}${escapeHtml(c.name)}</option>`).join('');
  if(!sel.options.length){
    sel.innerHTML = '<option value="">No spending logged yet this cycle</option>';
  }
  document.getElementById('whatIfSlider').value = 20;
  document.getElementById('whatIfPctLabel').textContent = '20%';
  updateWhatIf();
  activeSheet = whatIfSheet; openSheetEl(whatIfSheet);
}
document.getElementById('whatIfBtn').addEventListener('click', openWhatIf);

/* Insights accordion (quote + weekday pattern) — collapsed by default, remembered per device */
(function initInsightsToggle(){
  const toggleBtn = document.getElementById('insightsToggle');
  const body = document.getElementById('insightsBody');
  if(!toggleBtn || !body) return;
  const STORAGE_KEY = 'insightsOpen';
  const isOpen = localStorage.getItem(STORAGE_KEY) === '1';
  toggleBtn.classList.toggle('open', isOpen);
  body.classList.toggle('open', isOpen);
  toggleBtn.addEventListener('click', () => {
    const nowOpen = !body.classList.contains('open');
    toggleBtn.classList.toggle('open', nowOpen);
    body.classList.toggle('open', nowOpen);
    localStorage.setItem(STORAGE_KEY, nowOpen ? '1' : '0');
  });
})();
document.getElementById('whatIfCloseBtn').addEventListener('click', ()=>{ closeSheetEl(whatIfSheet); activeSheet=null; });
document.getElementById('whatIfCategory').addEventListener('change', updateWhatIf);
document.getElementById('whatIfSlider').addEventListener('input', (e)=>{
  document.getElementById('whatIfPctLabel').textContent = e.target.value + '%';
  updateWhatIf();
});
function updateWhatIf(){
  const catId = document.getElementById('whatIfCategory').value;
  const pct = Number(document.getElementById('whatIfSlider').value) / 100;
  const resultEl = document.getElementById('whatIfResult');
  if(!catId){ resultEl.innerHTML = '<div class="whatif-row">Nothing to simulate yet — log an expense first.</div>'; return; }

  const cat = catById(catId);
  const currentSpend = spentFor(catId);
  const saved = currentSpend * pct;
  const income = combinedIncome();
  const spent = totalSpent();
  const savingsContrib = savingsContribThisCycle();
  const newSpent = spent - saved;
  const newRemaining = Math.max(income - newSpent - savingsContrib, 0);
  const newSavingsRate = income>0 ? Math.round(((income - newSpent - savingsContrib)/income)*100) : 0;
  const oldSavingsRate = income>0 ? Math.round(((income - spent - savingsContrib)/income)*100) : 0;

  resultEl.innerHTML = `
    <div class="whatif-row"><span>${escapeHtml(cat.name)} would become</span><b>${fmt(currentSpend-saved)}</b></div>
    <div class="whatif-row"><span>You'd free up</span><b>${fmt(saved)}</b></div>
    <div class="whatif-row"><span>New remaining to spend</span><b>${fmt(newRemaining)}</b></div>
    <div class="whatif-row highlight"><span>Savings rate: ${oldSavingsRate}% → </span><b>${newSavingsRate}%</b></div>
  `;
}

const reportSheet = document.getElementById('reportSheet');
let currentReportFilename = 'budget-report';
let currentPeriodLabel = '';
let currentReportD = null;

function showReport(d, opts){
  opts = opts || {};
  currentReportD = d;
  document.getElementById('reportTitle').textContent = opts.title || 'Cycle report';
  document.getElementById('reportPieLabel').textContent = 'By category' + (opts.pieNote ? ' (' + opts.pieNote + ')' : '');
  document.getElementById('reportBarLabel').textContent = opts.barLabel || 'Daily spend';
  document.getElementById('reportText').value = generateReportText(d, opts.periodLabel, opts.note);
  drawPieChart(document.getElementById('reportPieCanvas'), d.spentByCat);
  drawBarChart(document.getElementById('reportBarCanvas'), d.dailyEntries);
  currentReportFilename = opts.filename || 'budget-report';
  currentPeriodLabel = opts.periodLabel || ('Cycle: ' + cycleLabelText());
  activeSheet = reportSheet; openSheetEl(reportSheet);
}

function openReport(){
  const d = buildReportData();
  showReport(d, {
    title: 'Cycle report',
    periodLabel: 'Cycle: ' + cycleLabelText(),
    barLabel: 'Daily spend',
    filename: 'budget-report-' + state.nextPayDate
  });
}

// Past cycle: rebuilt from the transaction snapshot captured at archive time.
// Note: uses that cycle's own budget total, but current category names/order —
// a category renamed since then will show under its current name.
function openReportForHistory(h){
  const snapshot = {
    transactions: h.transactions || [],
    extraIncome: h.extraIncome || [],
    income: h.income,
    budget: h.totalBudget
  };
  const d = buildReportData(snapshot);
  const hasDetail = (h.transactions||[]).length > 0 || (h.totalSpent||0) === 0;
  showReport(d, {
    title: 'Past cycle report',
    periodLabel: 'Cycle: ' + h.label,
    barLabel: 'Daily spend',
    note: hasDetail ? null : 'Note: detailed transaction breakdown wasn\'t saved for this cycle (archived with an older version) — totals only.',
    filename: 'budget-report-' + h.label.replace(/[^\d]+/g,'-')
  });
}

// Year-end: aggregates every archived cycle whose archive date falls in the chosen year.
function availableYears(){
  const years = new Set();
  state.history.forEach(h=>{ if(h.archivedAt) years.add(h.archivedAt.slice(0,4)); });
  const thisYear = String(new Date().getFullYear());
  years.add(thisYear);
  return [...years].sort().reverse();
}
function openYearReport(year){
  const entries = state.history.filter(h => (h.archivedAt||'').slice(0,4) === String(year));
  const income = entries.reduce((s,h)=>s+Number(h.income||0),0);
  const budget = entries.reduce((s,h)=>s+Number(h.totalBudget||0),0);
  const savingsContrib = entries.reduce((s,h)=>s+Number(h.savingsContributed||0),0);

  const allTx = [];
  entries.forEach(h => (h.transactions||[]).forEach(t => allTx.push(t)));
  const spent = allTx.filter(t=>!isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
  const remaining = Math.max(income - spent - savingsContrib, 0);
  const savingsRate = income>0 ? Math.round((savingsContrib/income)*100) : 0;

  const yearSpentMap = {};
  allTx.forEach(t=>{ yearSpentMap[t.categoryId] = (yearSpentMap[t.categoryId]||0) + Number(t.amount); });
  const spentByCat = spendingCategories().map(c => ({ name:c.name, spent:yearSpentMap[c.id]||0, budget:0 }))
    .filter(x=>x.spent>0).sort((a,b)=>b.spent-a.spent);

  // Bar chart here shows spend per archived cycle across the year, not per day
  const dailyEntries = entries.map(h=>({date:(h.archivedAt||'').slice(5,10)||h.label.slice(0,5), amount:Number(h.totalSpent||0)}));

  const d = { income, spent, budget, savingsContrib, remaining, savingsRate, spentByCat, dailyEntries, highestDay:null, overBudget:[], nearLimit:[] };

  showReport(d, {
    title: 'Year-end review — ' + year,
    periodLabel: 'Period: Year ' + year + ' (' + entries.length + ' archived cycle' + (entries.length===1?'':'s') + ')',
    pieNote: 'whole year',
    barLabel: 'Spend per archived cycle',
    note: entries.length===0 ? 'No cycles archived in ' + year + ' yet.' : null,
    filename: 'budget-year-review-' + year
  });
}

document.getElementById('reportBtn').addEventListener('click', openReport);
document.getElementById('reportCloseBtn').addEventListener('click', ()=>{ closeSheetEl(reportSheet); activeSheet=null; });
document.getElementById('copyReportBtn').addEventListener('click', async ()=>{
  const ta = document.getElementById('reportText');
  try{ await navigator.clipboard.writeText(ta.value); showToast('Report copied'); }
  catch(e){
    ta.focus(); ta.select();
    try{ document.execCommand('copy'); showToast('Report copied'); }
    catch(e2){ showToast('Could not copy — select the text manually'); }
  }
});
document.getElementById('emailReportBtn').addEventListener('click', ()=>{
  const to = state.email || '';
  const subject = encodeURIComponent('Budget Cockpit — ' + document.getElementById('reportTitle').textContent + ' (' + currentPeriodLabel + ')');
  const body = encodeURIComponent(document.getElementById('reportText').value);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
document.getElementById('shareReportBtn').addEventListener('click', async ()=>{
  if(!API_URL){ showToast('Connect a backend first — sharing needs one'); return; }
  const resultEl = document.getElementById('shareResult');
  resultEl.style.display = 'block';
  resultEl.innerHTML = '<div class="share-result-note">Creating link…</div>';
  try{
    const data = await apiPost('createShare', { reportData: currentReportD, periodLabel: currentPeriodLabel });
    if(data && data.url){
      resultEl.innerHTML = `
        <div class="share-result">
          <input type="text" readonly value="${escapeHtml(data.url)}" id="shareUrlInput">
          <button class="btn btn-primary" id="copyShareBtn" style="margin:0;">Copy link</button>
          <div class="share-result-note" style="margin-top:8px;">Anyone with this link can view a read-only snapshot of this report — no login needed. Expires in 7 days, or revoke it anytime from Settings → Shared links.</div>
        </div>`;
      document.getElementById('shareUrlInput').addEventListener('click', (e)=>e.target.select());
      document.getElementById('copyShareBtn').addEventListener('click', async ()=>{
        try{ await navigator.clipboard.writeText(data.url); showToast('Link copied'); }
        catch(e){ document.getElementById('shareUrlInput').select(); showToast('Select and copy the link above'); }
      });
    } else {
      resultEl.innerHTML = '<div class="share-result-note" style="color:var(--red);">' + (data.error || 'Could not create link.') + '</div>';
    }
  }catch(e){
    resultEl.innerHTML = '<div class="share-result-note" style="color:var(--red);">Could not reach backend.</div>';
  }
});
let jsPdfLoading = null;
function loadJsPdf(){
  if(window.jspdf) return Promise.resolve();
  if(jsPdfLoading) return jsPdfLoading;
  jsPdfLoading = new Promise((resolve, reject)=>{
    const CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    // Computed directly from the official jsPDF 2.5.1 npm package (which is
    // what cdnjs mirrors byte-for-byte for JS libraries like this one) —
    // sha384sum of dist/jspdf.umd.min.js, base64-encoded. The previous value
    // here was a literal, never-filled-in placeholder, so this script load
    // was failing its integrity check and aborting on every single attempt.
    const SRI_HASH = 'sha384-JcnsjUPPylna1s1fvi1u12X5qjY5OL56iySh75FdtrwhO/SWXgMjoVqcKyIIWOLk';
    function attempt(withIntegrity){
      const s = document.createElement('script');
      s.src = CDN_URL;
      if(withIntegrity){
        s.integrity = SRI_HASH;
        s.crossOrigin = 'anonymous';
      }
      s.onload = resolve;
      s.onerror = () => {
        if(withIntegrity){
          // Falls back to loading without the integrity check rather than
          // permanently breaking PDF export again if this hash ever turns
          // out to be stale (e.g. cdnjs re-serves a rebuilt file for this
          // version) — a warning in the console either way, but the
          // feature itself keeps working.
          console.warn('jsPDF failed its integrity check — retrying without SRI. If this persists, regenerate the hash at srihash.org against the URL above.');
          document.head.removeChild(s);
          attempt(false);
        } else {
          reject();
        }
      };
      document.head.appendChild(s);
    }
    attempt(true);
  });
  return jsPdfLoading;
}
document.getElementById('downloadPdfBtn').addEventListener('click', async ()=>{
  try{
    showToast('Preparing PDF…');
    await loadJsPdf();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const d = currentReportD;
    const pageW = 210;
    const marginX = 16;
    let y = 20;

    // Header
    doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(20,25,40);
    doc.text('Budget Cockpit', marginX, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(140);
    doc.text('Personal Financial Statement', pageW-marginX, y-3, {align:'right'});
    doc.setFontSize(11); doc.setTextColor(120);
    doc.text(document.getElementById('reportTitle').textContent, marginX, y+7);
    doc.setFontSize(9);
    doc.text(currentPeriodLabel, marginX, y+13);
    const pdfRef = 'BC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
    doc.text('Ref: ' + pdfRef, pageW-marginX, y+13, {align:'right'});
    doc.setDrawColor(220); doc.line(marginX, y+18, pageW-marginX, y+18);
    y += 28;

    function sectionTitle(text){
      doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(184,128,42);
      doc.text(text, marginX, y);
      y += 7;
    }
    function labelValueRow(label, value, opts){
      opts = opts || {};
      doc.setFont('helvetica','normal'); doc.setFontSize(10.5); doc.setTextColor(90);
      doc.text(label, marginX, y);
      doc.setFont('helvetica','bold');
      if(Array.isArray(opts.color)) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2]);
      else doc.setTextColor(opts.color || 30);
      doc.text(String(value), pageW-marginX, y, {align:'right'});
      y += 6.5;
    }
    function bodyText(text, opts){
      opts = opts || {};
      doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(90);
      const lines = doc.splitTextToSize(text, pageW - marginX*2 - (opts.indent||0));
      doc.text(lines, marginX + (opts.indent||0), y);
      y += lines.length * 4.6 + 2;
    }
    function ensureSpace(needed){
      if(y + needed > 275){ doc.addPage(); y = 20; }
    }

    // Overview
    ensureSpace(50);
    sectionTitle('Overview');
    labelValueRow('Total income', fmt(d.income));
    labelValueRow('Total spent (excludes savings)', fmt(d.spent));
    labelValueRow('Total budgeted', fmt(d.budget));
    labelValueRow('Savings / Emergency Fund contributed', fmt(d.savingsContrib) + '  (' + d.savingsRate + '%)', {color: [63,150,130]});
    labelValueRow('Remaining to spend', fmt(d.remaining));
    y += 4;

    // Transaction detail — the itemized register a real statement shows,
    // not just top categories. Capped at 40 rows to keep this from
    // generating an unbounded number of pages for a very active cycle;
    // the CSV export covers the full list if someone needs every row.
    const items = (d.txs||[]).slice().sort((a,b)=> String(a.date||'').localeCompare(String(b.date||'')) || String(a.id).localeCompare(String(b.id)));
    ensureSpace(20);
    sectionTitle('Transaction detail (' + items.length + (items.length===1?' entry':' entries') + ')');
    if(items.length===0){
      bodyText('No transactions recorded this period.');
    } else {
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(140);
      doc.text('DATE', marginX, y);
      doc.text('DESCRIPTION', marginX+22, y);
      doc.text('CATEGORY', marginX+95, y);
      doc.text('AMOUNT', pageW-marginX, y, {align:'right'});
      y += 4.5;
      doc.setDrawColor(230); doc.line(marginX, y-2.5, pageW-marginX, y-2.5);
      items.slice(0,40).forEach(t=>{
        ensureSpace(6);
        const cat = catById(t.categoryId);
        doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(90);
        doc.text(String(t.date||'—'), marginX, y);
        doc.text(String(t.desc||'(no description)').slice(0,32), marginX+22, y);
        doc.text(String(cat?cat.name:'Uncategorized').slice(0,20), marginX+95, y);
        doc.setTextColor(40);
        doc.text(fmt(t.amount) + (t.updatedAt ? ' *' : ''), pageW-marginX, y, {align:'right'});
        y += 5;
      });
      if(items.length > 40){
        y += 1;
        doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(140);
        doc.text('+ ' + (items.length-40) + ' more entries — see the full list in the CSV export.', marginX, y);
        y += 5;
      }
    }
    y += 5;

    // Top categories
    ensureSpace(15 + Math.min(d.spentByCat.length,5)*7);
    sectionTitle('Top spending categories');
    if(d.spentByCat.length===0){
      bodyText('No expenses logged for this period.');
    } else {
      d.spentByCat.slice(0,5).forEach((x,i)=>{
        doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(40);
        doc.text((i+1) + '.  ' + x.name, marginX, y);
        doc.setFont('helvetica','bold');
        doc.text(fmt(x.spent), pageW-marginX, y, {align:'right'});
        y += 6;
      });
    }
    y += 4;

    // Highest day
    if(d.highestDay){
      ensureSpace(10);
      sectionTitle('Highest single-day spend');
      bodyText(d.highestDay.date + '  —  ' + fmt(d.highestDay.amount));
      y += 2;
    }

    // Alerts
    ensureSpace(20);
    sectionTitle('Alerts');
    if(d.overBudget && d.overBudget.length){
      bodyText('Over budget: ' + d.overBudget.map(c=>c.name).join(', '));
    } else {
      bodyText('No categories over budget.');
    }
    if(d.nearLimit && d.nearLimit.length){
      bodyText('Near limit: ' + d.nearLimit.map(c=>c.name).join(', '));
    }
    y += 2;

    // Suggestions
    ensureSpace(20);
    sectionTitle('Suggestions');
    const suggestions = [];
    if(d.savingsRate < 20 && d.income>0) suggestions.push('Savings rate is below the commonly-cited 20% baseline — consider trimming ' + (d.spentByCat[0] ? d.spentByCat[0].name : 'your largest category') + ' next cycle.');
    if(d.overBudget && d.overBudget.length) suggestions.push('Set a firmer cap next cycle on: ' + d.overBudget.map(c=>c.name).join(', ') + '.');
    if((!d.overBudget || !d.overBudget.length) && (!d.nearLimit || !d.nearLimit.length) && d.savingsRate>=20) suggestions.push('Solid cycle — spending stayed within budget and savings rate met the general benchmark.');
    if(suggestions.length===0) suggestions.push('Log a few more expenses for a more useful pattern report next cycle.');
    suggestions.forEach(s => { bodyText('•  ' + s, {indent:2}); });
    y += 4;

    // Charts
    ensureSpace(80);
    sectionTitle('Charts');
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(120);
    doc.text(document.getElementById('reportPieLabel').textContent, marginX, y);
    doc.text(document.getElementById('reportBarLabel').textContent, marginX + 92, y);
    y += 3;
    doc.addImage(document.getElementById('reportPieCanvas').toDataURL('image/png'), 'PNG', marginX, y, 84, 63);
    doc.addImage(document.getElementById('reportBarCanvas').toDataURL('image/png'), 'PNG', marginX + 92, y, 84, 63);
    y += 70;

    // Record integrity
    ensureSpace(20);
    sectionTitle('Record integrity');
    if((d.editedCount||0) > 0){
      bodyText('* ' + d.editedCount + ' of ' + d.totalCount + ' entries above were modified after their original entry. Marked entries reflect the most recently saved values as of the generation time below; prior versions are not retained in this statement.');
    } else {
      bodyText('No entries in this statement have been modified since they were first recorded.');
    }
    y += 2;

    // Footer
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(160);
    doc.text('Generated ' + new Date().toLocaleString('en-GB') + '  ·  Ref: ' + pdfRef, marginX, 282);
    doc.setFontSize(7);
    const disclaimerLines = doc.splitTextToSize(
      'This statement is generated from information entered by the account holder into Budget Cockpit for personal budgeting purposes. It is not an official record from any bank or financial institution.',
      pageW - marginX*2
    );
    doc.text(disclaimerLines, marginX, 286);

    doc.save(currentReportFilename + '.pdf');
    showToast('PDF downloaded');
  }catch(e){
    showToast('Could not generate PDF — try Copy instead');
  }
});

function csvEscape(v){
  v = String(v==null ? '' : v);
  // Same formula-injection guard sanitizeForSheet() already applies before
  // writing to Google Sheets — csvEscape() only handled commas/quotes/
  // newlines, so a description like =HYPERLINK("http://x","y") would land
  // in the exported CSV unescaped and could execute if later opened in
  // Excel/Numbers. A leading apostrophe neutralizes it in both, the same
  // way it already does for the Sheets writer.
  if(/^[=+\-@]/.test(v)) v = "'" + v;
  return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v;
}
document.getElementById('downloadCsvBtn').addEventListener('click', ()=>{
  if(!currentReportD || !currentReportD.txs){ showToast('No transaction data for this report'); return; }
  const rows = [['Date','Category','Description','Amount','Method','Created','Last Edited']];
  [...currentReportD.txs].sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>{
    const cat = catById(t.categoryId);
    rows.push([t.date, cat ? cat.name : 'Uncategorized', t.desc || '', t.amount, t.method || '', t.createdAt || '', t.updatedAt || '']);
  });
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = currentReportFilename + '.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('CSV downloaded');
});

/* ============================================================
   CUSTOM CONFIRM MODAL
   ============================================================ */
const confirmBox = document.getElementById('confirmBox');
let confirmResolver = null;
// Shared small sheet for manually correcting an accumulated total — used by
// Savings (set the lifetime total directly, e.g. if money was withdrawn
// outside the app or a goal is no longer realistic), and Debt/Loans (add a
// past payment/repayment that already happened but was never logged, without
// it hitting this cycle's budget the way a normal transaction would).
const adjustSheet = document.getElementById('adjustSheet');
let adjustContext = null;
function openAdjustSheet(opts){
  adjustContext = opts;
  document.getElementById('adjustSheetTitle').textContent = opts.title;
  document.getElementById('adjustSheetLabel').textContent = opts.label;
  document.getElementById('adjustSheetHint').textContent = opts.hint || '';
  document.getElementById('adjustSheetInput').value = opts.prefill != null ? opts.prefill : '';
  activeSheet = adjustSheet; openSheetEl(adjustSheet);
}
document.getElementById('adjustSheetCancelBtn').addEventListener('click', ()=>{ closeSheetEl(adjustSheet); activeSheet=null; adjustContext=null; });
document.getElementById('adjustSheetSaveBtn').addEventListener('click', ()=>{
  if(!adjustContext) return;
  const raw = document.getElementById('adjustSheetInput').value;
  const val = Number(raw);
  if(raw==='' || isNaN(val)){ showToast('Enter a valid number'); return; }
  if(adjustContext.type==='savings'){
    // lifetimeSaved = savingsAccumulated + this-cycle contributions, so back
    // out the live contribution to land exactly on the total they typed.
    const contributed = spentFor(adjustContext.id);
    state.savingsAccumulated[adjustContext.id] = Math.max(val - contributed, 0);
  } else if(adjustContext.type==='debt'){
    state.debtPaidAccumulated[adjustContext.id] = Math.max((state.debtPaidAccumulated[adjustContext.id]||0) + val, 0);
    queueLoanDebtOp('adjustDebtPaid', {debtId: adjustContext.id, delta: val});
  } else if(adjustContext.type==='loan'){
    state.loanPaidAccumulated[adjustContext.id] = Math.max((state.loanPaidAccumulated[adjustContext.id]||0) + val, 0);
    queueLoanDebtOp('adjustLoanPaid', {loanId: adjustContext.id, delta: val});
  }
  saveState(); renderAll();
  closeSheetEl(adjustSheet); activeSheet=null; adjustContext=null;
  showToast('Updated');
});

function askConfirm(title, msg){
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  overlay.classList.add('show'); confirmBox.classList.add('show');
  return new Promise(resolve => { confirmResolver = resolve; });
}
document.getElementById('confirmOkBtn').addEventListener('click', ()=>{
  confirmBox.classList.remove('show'); overlay.classList.remove('show');
  if(confirmResolver) confirmResolver(true); confirmResolver = null;
});
document.getElementById('confirmCancelBtn').addEventListener('click', ()=>{
  confirmBox.classList.remove('show'); overlay.classList.remove('show');
  if(confirmResolver) confirmResolver(false); confirmResolver = null;
});

/* ============================================================
   ARCHIVE / ROLLOVER
   ============================================================ */
document.getElementById('archiveBtn').addEventListener('click', async ()=>{
  const ok = await askConfirm('Archive this cycle?',
    'This saves ' + cycleLabelText() + ' to History, folds savings contributions into your lifetime totals, and clears transactions + extra income. Category budgets and goals stay the same.');
  if(!ok) return;

  const closedLabel = cycleLabelText();
  const d = buildReportData();
  state.history.push({
    label: closedLabel,
    income: d.income, totalBudget: d.budget, totalSpent: d.spent, savingsContributed: d.savingsContrib,
    archivedAt: toDateInput(new Date()),
    transactions: JSON.parse(JSON.stringify(state.transactions)),
    extraIncome: JSON.parse(JSON.stringify(state.extraIncome))
  });

  savingsCategories().forEach(c=>{
    const contributed = spentFor(c.id);
    state.savingsAccumulated[c.id] = (state.savingsAccumulated[c.id]||0) + contributed;
  });

  state.transactions = [];
  state.extraIncome = [];

  saveState(); renderAll();

  if(d.overBudget.length===0 && d.income>0 && d.savingsRate>=20){
    celebrate();
    showToast('🎉 Great cycle — under budget and ' + d.savingsRate + '% saved!');
  } else {
    showToast('Cycle archived — fresh start!');
  }

  showReport(d, {
    title: 'Cycle report',
    periodLabel: 'Cycle: ' + closedLabel,
    barLabel: 'Daily spend',
    filename: 'budget-report-' + closedLabel.replace(/[^\d]+/g,'-')
  });
});

/* ============================================================
   LOCK SCREEN / LOGIN + SIGNUP
   ============================================================ */
let lockMode = 'login'; // 'login' | 'signup'

function showLockScreen(msg){
  hideLoadingScreen();
  const resetReq = document.getElementById('pwResetRequestScreen'); if(resetReq) resetReq.style.display = 'none';
  const resetComplete = document.getElementById('pwResetCompleteScreen'); if(resetComplete) resetComplete.style.display = 'none';
  document.getElementById('lockScreen').style.display = 'flex';
  document.getElementById('lockError').textContent = msg || '';
  document.getElementById('lockPasswordInput').value = '';
  setTimeout(()=>document.getElementById('lockEmailInput').focus(), 50);
}
function hideLockScreen(){
  document.getElementById('lockScreen').style.display = 'none';
}
function hideLoadingScreen(){
  const el = document.getElementById('loadingScreen');
  if(el) el.style.display = 'none';
}
function setLockMode(mode){
  lockMode = mode;
  const sub = document.getElementById('lockSub');
  const submitBtn = document.getElementById('lockSubmitBtn');
  const toggleBtn = document.getElementById('lockToggleModeBtn');
  const pwInput = document.getElementById('lockPasswordInput');
  document.getElementById('lockError').textContent = '';
  if(mode === 'signup'){
    sub.textContent = 'Create your own private budget';
    submitBtn.textContent = 'Create account';
    toggleBtn.textContent = 'Already have an account? Log in';
    pwInput.setAttribute('autocomplete', 'new-password');
    pwInput.setAttribute('placeholder', 'Password (at least 6 characters)');
  } else {
    sub.textContent = 'Log in to your budget';
    submitBtn.textContent = 'Log in';
    toggleBtn.textContent = "New here? Create an account";
    pwInput.setAttribute('autocomplete', 'current-password');
    pwInput.setAttribute('placeholder', 'Password');
  }
}
document.getElementById('lockToggleModeBtn').addEventListener('click', ()=>{
  setLockMode(lockMode === 'login' ? 'signup' : 'login');
});

/* ============================================================
   PASSWORD RESET — "Forgot password?" on the login screen, and the
   completion screen someone lands on after clicking the link in their
   reset email. redirect_to is built from window.location itself (never
   hardcoded), so the emailed link always points at wherever this app is
   actually hosted — but Supabase will still refuse to use it unless that
   same URL is also added under Authentication → URL Configuration →
   Redirect URLs in the Supabase dashboard; that allowlist is a server-side
   setting this code can't change for you.
   ============================================================ */
function showAuthScreen(id){
  ['lockScreen','pwResetRequestScreen','pwResetCompleteScreen'].forEach(sid=>{
    const el = document.getElementById(sid); if(el) el.style.display = (sid===id ? 'flex' : 'none');
  });
}
document.getElementById('lockForgotPwBtn')?.addEventListener('click', ()=>{
  const emailField = document.getElementById('pwResetEmailInput');
  if(emailField) emailField.value = document.getElementById('lockEmailInput').value.trim();
  const errEl = document.getElementById('pwResetError'); if(errEl) errEl.textContent = '';
  const okEl = document.getElementById('pwResetSuccess'); if(okEl) okEl.textContent = '';
  showAuthScreen('pwResetRequestScreen');
});
document.getElementById('pwResetBackBtn')?.addEventListener('click', ()=> showAuthScreen('lockScreen'));

document.getElementById('pwResetSendBtn')?.addEventListener('click', async ()=>{
  const email = document.getElementById('pwResetEmailInput').value.trim();
  const errEl = document.getElementById('pwResetError');
  const okEl = document.getElementById('pwResetSuccess');
  const spinner = document.getElementById('pwResetSpinner');
  const btn = document.getElementById('pwResetSendBtn');
  errEl.textContent = ''; okEl.textContent = '';
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ errEl.textContent = 'Enter a valid email address'; return; }
  if(btn.disabled) return;
  btn.disabled = true; spinner.style.display = '';
  try{
    const redirectTo = window.location.origin + window.location.pathname;
    const res = await fetchWithTimeout(AUTH_URL + '/recover?redirect_to=' + encodeURIComponent(redirectTo), {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY},
      body: JSON.stringify({ email })
    }, 15000);
    // Supabase intentionally returns success here whether or not the email
    // is registered, so this can't be used to probe which emails have
    // accounts — the message below reflects that on purpose, it isn't
    // hiding a real error.
    if(res.ok){
      okEl.textContent = "If an account exists for that email, a reset link is on its way — check your inbox (and spam folder).";
    } else {
      const data = await res.json().catch(()=>({}));
      errEl.textContent = (data && (data.error_description || data.msg)) || 'Could not send the reset email — try again shortly.';
    }
  }catch(e){
    errEl.textContent = e.name === 'AbortError' ? 'Request timed out — try again' : 'Could not reach the backend — try again shortly.';
  }finally{
    btn.disabled = false; spinner.style.display = 'none';
  }
});

// The link in the reset email redirects back here with the new session's
// tokens in the URL fragment (never sent to any server, so this is the
// only place they can be read from). Checked once at boot, before anything
// else — if this fragment exists, the person just clicked a reset link and
// needs the "set new password" screen, not the ordinary login screen.
function parseAuthHash(){
  const hash = window.location.hash || '';
  if(!hash.includes('access_token')) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  const type = params.get('type');
  const expires_in = Number(params.get('expires_in')) || 3600;
  if(!access_token) return null;
  return { access_token, refresh_token, type, expires_in };
}
let pendingRecovery = null;
function checkForRecoveryLink(){
  const parsed = parseAuthHash();
  // Clear the fragment immediately regardless of outcome — it holds live
  // credentials and must not linger in the address bar, browser history,
  // or survive a page refresh to be reused a second time.
  if(parsed) history.replaceState(null, '', window.location.pathname + window.location.search);
  if(parsed && parsed.type === 'recovery'){
    pendingRecovery = parsed;
    return true;
  }
  return false;
}

document.getElementById('pwResetCompleteBtn')?.addEventListener('click', async ()=>{
  const pw = document.getElementById('pwNewInput').value;
  const confirm = document.getElementById('pwNewConfirmInput').value;
  const errEl = document.getElementById('pwResetCompleteError');
  const spinner = document.getElementById('pwResetCompleteSpinner');
  const btn = document.getElementById('pwResetCompleteBtn');
  errEl.textContent = '';
  if(pw.length < 6){ errEl.textContent = 'Password must be at least 6 characters'; return; }
  if(pw !== confirm){ errEl.textContent = "Those didn't match — try again"; return; }
  if(!pendingRecovery){ errEl.textContent = 'This reset link has expired — request a new one'; return; }
  if(btn.disabled) return;
  btn.disabled = true; spinner.style.display = '';
  try{
    const res = await fetchWithTimeout(AUTH_URL + '/user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + pendingRecovery.access_token},
      body: JSON.stringify({ password: pw })
    }, 15000);
    if(res.ok){
      storeSession({ access_token: pendingRecovery.access_token, refresh_token: pendingRecovery.refresh_token, expires_in: pendingRecovery.expires_in });
      pendingRecovery = null;
      noteActivity();
      showToast('Password updated — you\'re logged in');
      showAuthScreen('lockScreen');
      hideLockScreen();
      loadState();
    } else {
      const data = await res.json().catch(()=>({}));
      errEl.textContent = (data && (data.error_description || data.msg)) || 'Could not update the password — the link may have expired.';
    }
  }catch(e){
    errEl.textContent = e.name === 'AbortError' ? 'Request timed out — try again' : 'Could not reach the backend — try again shortly.';
  }finally{
    btn.disabled = false; spinner.style.display = 'none';
  }
});

async function doLogin(){
  const email = document.getElementById('lockEmailInput').value.trim();
  const pw = document.getElementById('lockPasswordInput').value;
  const errEl = document.getElementById('lockError');
  const btn = document.getElementById('lockSubmitBtn');
  const spinner = document.getElementById('lockSpinner');
  const checkingText = document.getElementById('lockCheckingText');
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ errEl.textContent = 'Enter a valid email address'; return; }
  if(!pw){ errEl.textContent = 'Enter your password'; return; }
  if(lockMode === 'signup' && pw.length < 6){ errEl.textContent = 'Password must be at least 6 characters'; return; }
  if(btn.disabled) return; // a check is already in flight — ignore repeat taps/Enter
  errEl.textContent = '';
  spinner.style.display = '';
  checkingText.style.display = '';
  checkingText.textContent = lockMode === 'signup' ? 'Creating your account…' : 'Checking your details…';
  btn.disabled = true;
  const originalBtnText = btn.textContent;
  btn.textContent = lockMode === 'signup' ? 'Creating…' : 'Checking…';
  try{
    if(lockMode === 'signup'){
      // Public Supabase Auth signup endpoint. This is what triggers the
      // database's on_auth_user_created trigger (see schema.sql), which
      // instantly gives this new account its own 16 default categories —
      // nothing else needs to run for a brand-new person to have a usable
      // budget straight away.
      const res = await fetchWithTimeout(AUTH_URL + '/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY},
        body: JSON.stringify({ email, password: pw })
      }, 15000);
      const data = await res.json();
      if(res.ok && data && data.access_token){
        // Email confirmation is OFF for this project — the new account is
        // immediately usable.
        storeSession(data);
        errEl.textContent = '';
        hideLockScreen();
        noteActivity();
        loadState();
      } else if(res.ok && data && data.id && !data.access_token){
        // Email confirmation is ON — Supabase created the account but is
        // waiting for the confirmation link to be clicked before issuing a
        // session. This is a normal, successful outcome, not an error.
        errEl.textContent = '';
        setLockMode('login');
        document.getElementById('lockError').innerHTML = 'Account created — check <b>' + escapeHtml(email) + '</b> for a confirmation link, then log in here.';
      } else {
        const raw = (data && (data.error_description || data.msg || data.error_code || data.error)) || '';
        errEl.textContent = /already registered|user already exists/i.test(String(raw))
          ? 'An account already exists for that email — try logging in instead.'
          : (String(raw) || 'Could not create account');
      }
    } else {
      // Supabase Auth password grant.
      const res = await fetchWithTimeout(AUTH_URL + '/token?grant_type=password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY},
        body: JSON.stringify({ email, password: pw })
      }, 15000);
      const data = await res.json();
      if(res.ok && data && data.access_token){
        storeSession(data);
        errEl.textContent = '';
        hideLockScreen();
        noteActivity();
        loadState();
      } else {
        // Supabase returns error_description / msg / error depending on the
        // failure. Don't echo the raw message for a wrong password — it leaks
        // whether the account exists.
        const raw = (data && (data.error_description || data.msg || data.error_code || data.error)) || '';
        errEl.textContent = /invalid login|invalid_grant|credentials|email not confirmed/i.test(String(raw))
          ? (/not confirmed/i.test(String(raw)) ? 'Check your email for the confirmation link first' : 'Incorrect email or password')
          : (String(raw) || 'Could not sign in');
      }
    }
  }catch(e){
    if(e.name === 'AbortError'){
      errEl.textContent = 'Request timed out — check your connection and try again';
    } else if(navigator.onLine === false){
      errEl.textContent = 'You appear to be offline — check your connection and try again';
    } else {
      // The device has a working connection (navigator.onLine is true) but
      // the fetch itself still failed outright — not a proper error
      // response, an actual failure to connect. The two most common real
      // causes, in order: a free-tier Supabase project that auto-paused
      // itself after a period of inactivity (the fix is a couple of taps in
      // the Supabase dashboard, not anything in this app), or a browser
      // privacy/ad-block extension blocking the request outright. Naming
      // both directly beats a generic "check your connection" that sends
      // someone checking their Wi-Fi for a problem that was never there.
      errEl.innerHTML = "Can't reach the backend. If your internet is fine, the most likely cause is the Supabase project is paused (free-tier projects pause after inactivity — resume it from the Supabase dashboard) or a browser extension is blocking the request. <a href=\"#\" id=\"lockRetryLink\" style=\"color:var(--gold);\">Try again</a>";
      const retryLink = document.getElementById('lockRetryLink');
      if(retryLink) retryLink.addEventListener('click', (ev)=>{ ev.preventDefault(); doLogin(); });
    }
  }finally{
    spinner.style.display = 'none';
    checkingText.style.display = 'none';
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
}
document.getElementById('lockSubmitBtn').addEventListener('click', doLogin);
document.getElementById('lockPasswordInput').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
document.getElementById('lockEmailInput').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });

async function renderSharesList(){
  const wrap = document.getElementById('sharesList');
  if(!wrap || !API_URL) return;
  wrap.innerHTML = '<div class="empty-hist">Loading…</div>';
  try{
    const data = await apiGet('listShares');
    const shares = Array.isArray(data) ? data : [];
    document.getElementById('sharesTag').textContent = shares.length + ' active';
    if(!shares.length){ wrap.innerHTML = '<div class="empty-hist">No active shared links.</div>'; return; }
    wrap.innerHTML = '';
    shares.forEach(s=>{
      const row = document.createElement('div');
      row.className = 'extra-row';
      row.innerHTML = `
        <div class="extra-left">
          <div class="src">${escapeHtml(s.periodLabel||'Report')}</div>
          <div class="dt">Expires ${new Date(s.expiresAt).toLocaleDateString('en-GB')}</div>
        </div>
        <button class="tx-del" data-token="${s.token}" aria-label="Revoke link">✕</button>
      `;
      row.querySelector('.tx-del').addEventListener('click', async ()=>{
        await apiPost('revokeShare', {shareToken: s.token});
        showToast('Link revoked');
        renderSharesList();
      });
      wrap.appendChild(row);
    });
  }catch(e){
    wrap.innerHTML = '<div class="empty-hist">Could not load shared links.</div>';
  }
}

/* ============================================================
   PIN LOCK — auto-locks after 5 minutes of inactivity, unlocked with a
   fast local 6-digit PIN instead of retyping your full email/password.
   The PIN never leaves this device: it's hashed with SHA-256 and stored
   only in localStorage, and never touches Supabase — it's a screen lock,
   not a second factor on your account. "Lock app now" and 5 wrong PIN
   attempts both still fall back to the full password login (see
   lockNow() below), which stays the stronger option for when you're
   actually handing the device to someone else rather than just stepping
   away for a few minutes.
   ============================================================ */
const PIN_HASH_KEY = 'budget-cockpit-pin-hash';
const IDLE_LOCK_MS = 5 * 60 * 1000;
const PIN_MAX_ATTEMPTS = 5;

async function hashPin(pin){
  const data = new TextEncoder().encode('budget-cockpit-pin:' + pin);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function hasPinSet(){
  try{ return !!localStorage.getItem(PIN_HASH_KEY); }catch(e){ return false; }
}

// Pure so it's directly testable: given when the last activity was, the
// current time, and the threshold, should the app lock? No DOM, no state.
function shouldIdleLock(lastActivityAt, now, thresholdMs){
  return (now - lastActivityAt) >= thresholdMs;
}

let lastActivityAt = Date.now();
function noteActivity(){ lastActivityAt = Date.now(); }
['mousemove','keydown','touchstart','click','scroll'].forEach(evt=>{
  document.addEventListener(evt, noteActivity, {passive:true});
});

function isUnlockedAndUsable(){
  // Only idle-lock once someone's actually logged in and looking at the
  // app — never on the login screen itself, and never mid-way through
  // setting up a PIN (that would be a uniquely bad moment to lock them out).
  // Optional chaining throughout: if any of these elements are ever missing
  // (a partial deploy where index.html and app.js briefly don't match), this
  // must fail safe and quiet — never throw and take the whole script down.
  return !!sessionToken
    && document.getElementById('lockScreen')?.style.display !== 'flex'
    && document.getElementById('pinLockScreen')?.style.display !== 'flex'
    && document.getElementById('pinSetupOverlay')?.style.display !== 'flex';
}
function checkIdleLock(){
  if(!isUnlockedAndUsable()) return;
  if(shouldIdleLock(lastActivityAt, Date.now(), IDLE_LOCK_MS)) triggerIdleLock();
}
// A periodic check rather than one long setTimeout: mobile browsers
// throttle timers heavily once a tab is backgrounded, so a single timer
// set for "5 minutes from now" can't be trusted to fire on time. Checking
// the actual elapsed time — both on this interval and again the moment the
// tab becomes visible — is what makes this reliable after the app's been
// backgrounded for a while, which is exactly the case that matters most.
setInterval(checkIdleLock, 15000);
document.addEventListener('visibilitychange', ()=>{
  if(document.visibilityState === 'visible') checkIdleLock();
});

let pinFailCount = 0;
function triggerIdleLock(){
  if(!hasPinSet()){ lockNow(); return; } // no PIN configured — fall back to the full, stronger lock
  pinFailCount = 0;
  unlockBuffer = '';
  resetPinDots('pinUnlockDots');
  const errEl = document.getElementById('pinUnlockError'); if(errEl) errEl.textContent = '';
  const screenEl = document.getElementById('pinLockScreen'); if(screenEl) screenEl.style.display = 'flex';
}

function resetPinDots(dotsId){ updatePinDots(dotsId, 0); }
function updatePinDots(dotsId, count){
  document.querySelectorAll('#'+dotsId+' .pin-dot').forEach((d,i)=>d.classList.toggle('filled', i<count));
}
function shakeDots(dotsId){
  const el = document.getElementById(dotsId);
  if(!el) return;
  el.classList.remove('pin-shake'); void el.offsetWidth; el.classList.add('pin-shake');
}
function refreshPinStatusUI(){
  const has = hasPinSet();
  const setupBtn = document.getElementById('pinSetupBtn'); if(setupBtn) setupBtn.textContent = has ? 'Change PIN' : 'Set up a PIN';
  const removeBtn = document.getElementById('pinRemoveBtn'); if(removeBtn) removeBtn.style.display = has ? '' : 'none';
  const statusText = document.getElementById('pinStatusText');
  if(statusText) statusText.textContent = has
    ? 'PIN lock is on — auto-locks after 5 min idle'
    : 'No PIN set — inactivity falls back to the full login';
}

// ---- PIN setup (Settings → Security) ----
let setupBuffer = '';
let setupFirstEntry = null;
function openPinSetup(){
  setupBuffer = ''; setupFirstEntry = null;
  const titleEl = document.getElementById('pinSetupTitle'); if(titleEl) titleEl.textContent = 'Set a 6-digit PIN';
  const subEl = document.getElementById('pinSetupSub'); if(subEl) subEl.textContent = "Choose a PIN you'll remember — this isn't sent anywhere, it only unlocks this device.";
  const errEl = document.getElementById('pinSetupError'); if(errEl) errEl.textContent = '';
  resetPinDots('pinSetupDots');
  const overlay = document.getElementById('pinSetupOverlay'); if(overlay) overlay.style.display = 'flex';
}
function closePinSetup(){
  const overlay = document.getElementById('pinSetupOverlay'); if(overlay) overlay.style.display = 'none';
  setupBuffer = ''; setupFirstEntry = null;
}
// Every PIN control below is wired defensively: this whole feature must
// never be able to take the rest of the app down just because one element
// is missing (an out-of-sync deploy, a typo in an id, an older cached
// index.html briefly serving alongside a newer app.js). An unguarded
// document.getElementById('x').addEventListener(...) throws immediately if
// 'x' doesn't exist — and since these run the moment the script loads, that
// throw happens BEFORE boot() ever runs, which looks exactly like the app
// being stuck on the loading screen forever. Guarding each one is what
// stops one missing PIN element from being able to break login entirely.
document.getElementById('pinSetupBtn')?.addEventListener('click', openPinSetup);
document.getElementById('pinSetupKeypad')?.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const key = btn.dataset.key;
  if(key==='cancel'){ closePinSetup(); return; }
  if(key==='back'){ setupBuffer = setupBuffer.slice(0,-1); updatePinDots('pinSetupDots', setupBuffer.length); return; }
  if(!/^[0-9]$/.test(key) || setupBuffer.length>=6) return;
  setupBuffer += key;
  updatePinDots('pinSetupDots', setupBuffer.length);
  if(setupBuffer.length!==6) return;

  if(setupFirstEntry===null){
    setupFirstEntry = setupBuffer; setupBuffer = '';
    const titleEl = document.getElementById('pinSetupTitle'); if(titleEl) titleEl.textContent = 'Confirm your PIN';
    const subEl = document.getElementById('pinSetupSub'); if(subEl) subEl.textContent = 'Enter the same 6 digits again.';
    setTimeout(()=>updatePinDots('pinSetupDots',0), 150);
    return;
  }
  if(setupBuffer===setupFirstEntry){
    const hash = await hashPin(setupBuffer);
    try{ localStorage.setItem(PIN_HASH_KEY, hash); }catch(err){}
    closePinSetup();
    refreshPinStatusUI();
    showToast('PIN set — the app will auto-lock after 5 min idle');
  } else {
    const errEl = document.getElementById('pinSetupError'); if(errEl) errEl.textContent = "Those didn't match — try again";
    shakeDots('pinSetupDots');
    setupFirstEntry = null; setupBuffer = '';
    setTimeout(()=>{
      const titleEl = document.getElementById('pinSetupTitle'); if(titleEl) titleEl.textContent = 'Set a 6-digit PIN';
      const subEl = document.getElementById('pinSetupSub'); if(subEl) subEl.textContent = "Choose a PIN you'll remember — this isn't sent anywhere, it only unlocks this device.";
      updatePinDots('pinSetupDots',0);
    }, 450);
  }
});
document.getElementById('pinRemoveBtn')?.addEventListener('click', async ()=>{
  const ok = await askConfirm('Remove PIN?', "You'll go back to the full password log-in after inactivity instead of a quick PIN.");
  if(!ok) return;
  try{ localStorage.removeItem(PIN_HASH_KEY); }catch(e){}
  refreshPinStatusUI();
  showToast('PIN removed');
});

// ---- PIN unlock (the idle-lock screen itself) ----
let unlockBuffer = '';
document.getElementById('pinForgotBtn')?.addEventListener('click', ()=> lockNow());
document.getElementById('pinUnlockKeypad')?.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const key = btn.dataset.key;
  if(key==='forgot') return; // its own listener above handles this
  if(key==='back'){ unlockBuffer = unlockBuffer.slice(0,-1); updatePinDots('pinUnlockDots', unlockBuffer.length); return; }
  if(!/^[0-9]$/.test(key) || unlockBuffer.length>=6) return;
  unlockBuffer += key;
  updatePinDots('pinUnlockDots', unlockBuffer.length);
  if(unlockBuffer.length!==6) return;

  const enteredHash = await hashPin(unlockBuffer);
  unlockBuffer = '';
  let stored = '';
  try{ stored = localStorage.getItem(PIN_HASH_KEY) || ''; }catch(err){}

  if(stored && enteredHash===stored){
    pinFailCount = 0;
    const screenEl = document.getElementById('pinLockScreen'); if(screenEl) screenEl.style.display = 'none';
    noteActivity();
    return;
  }
  pinFailCount++;
  shakeDots('pinUnlockDots');
  setTimeout(()=>updatePinDots('pinUnlockDots',0), 150);
  const errEl = document.getElementById('pinUnlockError');
  if(pinFailCount>=PIN_MAX_ATTEMPTS){
    if(errEl) errEl.textContent = 'Too many attempts — log in again';
    setTimeout(()=>lockNow(), 900);
  } else {
    const left = PIN_MAX_ATTEMPTS - pinFailCount;
    if(errEl) errEl.textContent = 'Incorrect PIN (' + left + ' attempt' + (left===1?'':'s') + ' left)';
  }
});

function lockNow(){
  // Best-effort server-side revoke so the refresh token can't be replayed
  // from a copy of localStorage taken before the reload. Fire-and-forget:
  // the local teardown below must happen whether or not this reaches the
  // network, and it must not delay the reload.
  if(sessionToken){
    try{
      fetch(AUTH_URL + '/logout', {
        method: 'POST',
        headers: {'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + sessionToken},
        keepalive: true
      }).catch(()=>{});
    }catch(e){}
  }
  clearSession();
  try{ localStorage.removeItem(LOCAL_MIRROR_KEY); }catch(e){}
  // A reload (not just showLockScreen()) is deliberate: the lock screen is
  // a CSS overlay, not a teardown — the fully-rendered DOM underneath (every
  // transaction, balance, category) would otherwise still be sitting there,
  // inspectable via DevTools, even with the mirror and session cleared.
  // Only a fresh page load guarantees nothing sensitive is left behind.
  location.reload();
}
document.getElementById('lockNowBtn').addEventListener('click', ()=>{
  if(!API_URL){ showToast('No backend connected — nothing to lock'); return; }
  lockNow();
});

/* ============================================================
   INIT
   ============================================================ */
async function boot(){
  if(checkForRecoveryLink()){
    hideLoadingScreen();
    showAuthScreen('pwResetCompleteScreen');
    return;
  }
  if(!API_URL){ loadState(); return; } // no backend configured — nothing to lock
  const mirror = loadLocalMirror();

  // An access token that expired while the app was closed is normal, not a
  // logout: if we still hold a refresh token, trade it for a fresh access
  // token before deciding anything. Without this, reopening the app after an
  // hour would land on the lock screen every single time.
  if(!sessionToken && refreshToken && navigator.onLine){
    await refreshSession();
  }

  if(sessionToken){
    // Cached session (and, if offline, a local mirror to boot from) — go
    // straight in. loadState()/apiGet() will call showLockScreen() itself
    // via onSessionInvalid() if the session turns out to be expired once
    // we do reach the server.
    await loadState();
    return;
  }

  if(!navigator.onLine && mirror){
    showLockScreen('You\'re offline and not logged in yet. Connect once to log in — after that, this device works offline until you Lock it.');
    return;
  }

  let pendingLockMsg = '';
  try{ pendingLockMsg = sessionStorage.getItem('pendingLockMessage') || ''; sessionStorage.removeItem('pendingLockMessage'); }catch(e){}
  showLockScreen(pendingLockMsg);
}
boot();

/* ============================================================
   PWA — register service worker (safe no-op if hosted somewhere
   that can't serve sw.js, e.g. this preview inside Claude)
   ============================================================ */
if('serviceWorker' in navigator && location.protocol !== 'about:'){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      if(!reg) return;

      // Registration alone was never enough: sw.js calls skipWaiting() +
      // clients.claim(), so a new worker takes control immediately, but the
      // PAGE that's already open keeps running the old app.js until it's
      // reloaded — with nothing telling you that. On an installed PWA that
      // may not be fully closed for days, that's the classic "I deployed the
      // fix but the app still behaves like the old version" trap. Now the
      // app actively checks for a new version and offers a one-tap reload.
      function promptForUpdate(){
        if(document.getElementById('swUpdateBar')) return; // already showing
        const bar = document.createElement('div');
        bar.id = 'swUpdateBar';
        bar.style.cssText = 'position:fixed;left:16px;right:16px;bottom:78px;z-index:9999;'
          + 'background:var(--panel);border:1px solid var(--gold);border-radius:14px;'
          + 'padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow);';
        const txt = document.createElement('div');
        txt.style.cssText = 'flex:1;font-size:12.5px;color:var(--text);';
        txt.textContent = 'A new version is ready.';
        const btn = document.createElement('button');
        btn.textContent = 'Reload';
        btn.style.cssText = 'background:var(--gold);color:#1B2030;border:none;border-radius:9px;'
          + 'padding:7px 14px;font-size:12.5px;font-weight:700;cursor:pointer;flex:none;';
        btn.addEventListener('click', () => location.reload());
        const dismiss = document.createElement('button');
        dismiss.setAttribute('aria-label', 'Dismiss');
        dismiss.textContent = '✕';
        dismiss.style.cssText = 'background:none;border:none;color:var(--muted);font-size:14px;cursor:pointer;flex:none;';
        dismiss.addEventListener('click', () => bar.remove());
        bar.appendChild(txt); bar.appendChild(btn); bar.appendChild(dismiss);
        document.body.appendChild(bar);
      }

      reg.addEventListener('updatefound', () => {
        const incoming = reg.installing;
        if(!incoming) return;
        incoming.addEventListener('statechange', () => {
          // controller check distinguishes a genuine UPDATE from the very
          // first install (where there's no previous version to replace, so
          // there's nothing to prompt about).
          if(incoming.state === 'installed' && navigator.serviceWorker.controller){
            promptForUpdate();
          }
        });
      });

      // Check on load and whenever the app is brought back to the
      // foreground — an installed PWA can sit backgrounded for days without
      // ever re-running the load handler.
      reg.update().catch(()=>{});
      document.addEventListener('visibilitychange', () => {
        if(document.visibilityState === 'visible') reg.update().catch(()=>{});
      });
    }).catch(() => {
      // No service worker available here (e.g. previewing inside Claude,
      // or opened as a local file) — app still works fully online.
    });
  });
}
