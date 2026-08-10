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
const API_URL = 'https://script.google.com/macros/s/AKfycbwW8NdhL066LtcUCYPrNuPesWF-87y-poiJ-T-04X5b6kGKzqnZt92qTtofabayooIN/exec';
const API_TOKEN = ''; // legacy fallback — only used if no password has been set up in Code.gs
const STORAGE_KEY = 'budget-cockpit-state';
const SESSION_KEY = 'budget-cockpit-session';
const LOCAL_MIRROR_KEY = 'budget-cockpit-local-mirror';

// Session lives in localStorage (not sessionStorage) on purpose: it survives
// closing and reopening the app, so you can log expenses offline without
// needing a network round-trip just to log back in every time. Trade-off:
// it persists until you explicitly "Lock app now" or it expires server-side
// (12h) — use Lock now before handing the device to someone else.
let sessionToken = '';
try{ sessionToken = localStorage.getItem(SESSION_KEY) || ''; }catch(e){ /* private browsing may block storage */ }

// isDirty = true means there are local changes not yet confirmed saved to
// the backend (either never attempted, or the attempt failed/was offline).
let isDirty = false;
function saveLocalMirror(){
  try{ localStorage.setItem(LOCAL_MIRROR_KEY, JSON.stringify({ state, dirty: isDirty, savedAt: Date.now() })); }catch(e){}
}
function loadLocalMirror(){
  try{
    const raw = localStorage.getItem(LOCAL_MIRROR_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

// Centralized request helpers — every backend call goes through these,
// so auth (session/token) is attached consistently and a session that's
// expired or invalid triggers the lock screen instead of silently failing.
async function apiGet(action, extraParams){
  let qs = '?action=' + encodeURIComponent(action);
  if(sessionToken) qs += '&session=' + encodeURIComponent(sessionToken);
  if(API_TOKEN) qs += '&token=' + encodeURIComponent(API_TOKEN);
  if(extraParams) Object.keys(extraParams).forEach(k => qs += '&'+k+'='+encodeURIComponent(extraParams[k]));
  const res = await fetch(API_URL + qs);
  const data = await res.json();
  if(data && data.error === 'Unauthorized') onSessionInvalid();
  return data;
}
async function apiPost(action, payload){
  const body = Object.assign({action, token: API_TOKEN, session: sessionToken}, payload||{});
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'text/plain;charset=utf-8'}, // avoids a CORS preflight Apps Script doesn't handle
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if(data && data.error === 'Unauthorized') onSessionInvalid();
  return data;
}
function onSessionInvalid(){
  sessionToken = '';
  try{ localStorage.removeItem(SESSION_KEY); }catch(e){}
  showLockScreen('Your session expired — please log in again.');
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
  if(!state.debts) state.debts = [];
  if(!state.debtStrategy) state.debtStrategy = 'avalanche';
  if(state.debtFocusId == null) state.debtFocusId = '';
  if(!state.aiHistory) state.aiHistory = [];
  if(state.personalNotes == null) state.personalNotes = '';
  if(state.lastArchivedPayday == null) state.lastArchivedPayday = '';
  if(!state.currency) state.currency = '₦';
  if(!state.bills) state.bills = [];
  if(!state.shares) state.shares = [];
  state.categories.forEach(c=>{ if(c.group==='Savings' && c.goal==null) c.goal = 0; });
  refreshCycleDates();

  applyTheme(state.theme);
  document.getElementById('personalNotesInput').value = state.personalNotes || '';
  renderAll();
  updateSyncIndicator();
  loadQuote();
  startClock();
  hideLoadingScreen();

  if(isDirty) trySyncNow(); // push anything queued from an earlier offline session
}

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
          // The backend auto-archived a cycle while this device was offline
          // and had to filter our stale transactions out to protect History.
          // Adopt its authoritative post-merge state instead of drifting.
          state = Object.assign(state, data.state);
          renderAll();
          showToast('A cycle auto-archived while you were offline — synced up');
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
  if(!API_URL || !navigator.onLine || !isDirty) return;
  updateSyncIndicator();
  apiPost('saveState', {state}).then(data=>{
    if(data && !data.error){
      isDirty = false; saveLocalMirror(); updateSyncIndicator();
      if(data.conflictResolved && data.state){
        state = Object.assign(state, data.state);
        renderAll();
        showToast('A cycle auto-archived while you were offline — synced up');
      } else {
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
  return sym + n.toLocaleString('en-NG');
}
function catById(id){ return state.categories.find(c=>c.id===id); }
function isSavingsCat(id){ const c = catById(id); return !!(c && c.group==='Savings'); }

function spendingCategories(){ return state.categories.filter(c=>c.group!=='Savings'); }
function savingsCategories(){ return state.categories.filter(c=>c.group==='Savings'); }

function spentFor(catId){ return state.transactions.filter(t=>t.categoryId===catId).reduce((s,t)=>s+Number(t.amount),0); }
function spentForIn(txs, catId){ return txs.filter(t=>t.categoryId===catId).reduce((s,t)=>s+Number(t.amount),0); }

function totalSpent(){
  return state.transactions.filter(t=>!isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
}
function savingsContribThisCycle(){
  return state.transactions.filter(t=>isSavingsCat(t.categoryId)).reduce((s,t)=>s+Number(t.amount),0);
}
function totalBudget(){ return spendingCategories().reduce((s,c)=>s+Number(c.budget),0); }
function totalSavingsBudget(){ return savingsCategories().reduce((s,c)=>s+Number(c.budget),0); }
function extraTotal(){ return state.extraIncome.reduce((s,e)=>s+Number(e.amount),0); }
function combinedIncome(){ return Number(state.income||0) + extraTotal(); }
function lifetimeSaved(catId){ return (state.savingsAccumulated[catId]||0) + spentFor(catId); }

function debtById(id){ return state.debts.find(d=>d.id===id); }
function paidForDebt(debtId){ return state.transactions.filter(t=>t.debtId===debtId).reduce((s,t)=>s+Number(t.amount),0); }
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
function escapeHtml(str){
  if(str==null) return '';
  return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2400);
}
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
function startClock(){
  function tick(){
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    document.getElementById('liveClock').textContent = dateStr + ' · ' + timeStr;
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
function statusForAmt(cat, s){
  if(cat.threshold==null){
    if(cat.budget<=0) return { label: s>0 ? '✅ Target met' : 'In progress', cls:'st-target' };
    return s>=cat.budget ? {label:'✅ Target met', cls:'st-target'} : {label:'In progress', cls:'st-target'};
  }
  if(cat.budget<=0) return s>0 ? {label:'OVER BUDGET', cls:'st-over'} : {label:'No budget set', cls:'st-target'};
  if(s>cat.budget) return {label:'OVER BUDGET', cls:'st-over'};
  if(s/cat.budget >= cat.threshold) return {label:'NEAR LIMIT', cls:'st-near'};
  return {label:'On track', cls:'st-ok'};
}
function statusFor(cat){ return statusForAmt(cat, spentFor(cat.id)); }
function barColor(status){
  if(status.cls==='st-over') return 'var(--red)';
  if(status.cls==='st-near') return 'var(--amber)';
  if(status.cls==='st-target') return 'var(--muted-2)';
  return 'var(--teal)';
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
  setTextFlash('statIncome', fmt(income));
  setTextFlash('statSpent', fmt(spent));
  setTextFlash('statRemaining', fmt(remaining));

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
  const spendPct = Math.min(spendPctRaw, 1);
  const { daysLeft, pacePct } = cyclePace();

  const spendCirc = 276.46, paceCirc = 351.86;
  const spendEl = document.getElementById('gaugeSpend');
  const paceEl = document.getElementById('gaugePace');
  spendEl.setAttribute('stroke-dasharray', spendCirc);
  spendEl.setAttribute('stroke-dashoffset', spendCirc - spendPct*spendCirc);
  spendEl.style.stroke = spendPctRaw > 1 ? 'var(--red)' : 'var(--teal)';
  paceEl.setAttribute('stroke-dasharray', paceCirc);
  paceEl.setAttribute('stroke-dashoffset', paceCirc - Math.min(pacePct,1)*paceCirc);

  const gaugePctEl = document.getElementById('gaugePct');
  gaugePctEl.textContent = Math.round(spendPctRaw*100)+'%';
  gaugePctEl.style.color = spendPctRaw > 1 ? 'var(--red)' : 'var(--text)';

  const budgetPct = budget>0 ? spent/budget : 0;
  const paceBadge = document.getElementById('paceBadge');
  const paceDiff = budgetPct - pacePct;
  if(paceDiff <= -0.05){ paceBadge.textContent = '↓ Ahead of pace'; paceBadge.className = 'pace-badge pace-ahead'; }
  else if(paceDiff >= 0.05){ paceBadge.textContent = '↑ Behind pace — spending fast'; paceBadge.className = 'pace-badge pace-behind'; }
  else { paceBadge.textContent = '→ On track'; paceBadge.className = 'pace-badge pace-ontrack'; }

  const remainingBudget = Math.max(budget - spent, 0);
  document.getElementById('daysLeft').textContent = daysLeft;
  document.getElementById('safeToday').textContent = fmt(remainingBudget/Math.max(daysLeft,1));

  const grandTotal = budget + totalSavingsBudget();
  const bc = document.getElementById('budgetCheck');
  document.getElementById('budgetCheckVal').textContent = fmt(grandTotal) + (income>0 ? ' (' + Math.round(grandTotal/income*100) + '% of income)' : '');
  bc.classList.toggle('over', income>0 && grandTotal > income);

  let alerts = 0;
  state.categories.forEach(c=>{ const st = statusFor(c); if(st.cls==='st-over' || st.cls==='st-near') alerts++; });
  document.getElementById('alertCount').textContent = alerts;

  renderExtraIncome();
  renderCategoryList();
  renderTxPreview();
  renderStreakAndBadges();
  renderWeekdayChart();
  renderBillReminders();
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
function computeBadges(){
  const badges = [];
  const streak = loggingStreak();
  if(streak >= 3) badges.push({icon:'🔥', label: streak + '-day logging streak'});
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
  wrap.innerHTML = badges.map(b=>`<span class="badge-pill">${b.icon} ${escapeHtml(b.label)}</span>`).join('');
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
    ctx.fillStyle = i===highestIdx && v>0 ? '#E8B14C' : '#3FC7B0';
    ctx.fillRect(x, h-pad-barH, barW, Math.max(barH,1));
    ctx.fillStyle = '#8892A6'; ctx.font='9px sans-serif'; ctx.textAlign='center';
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

function renderCategoryList(){
  const list = document.getElementById('catList');
  list.innerHTML = '';
  const cats = spendingCategories();
  document.getElementById('catTag').textContent = cats.length + ' tracked';
  cats.forEach(cat=>{
    const spent = spentFor(cat.id);
    const pct = cat.budget>0 ? Math.min(spent/cat.budget,1) : (spent>0?1:0);
    const status = statusFor(cat);
    const div = document.createElement('div');
    div.className = 'cat';
    div.innerHTML = `
      <div class="cat-top">
        <div>
          <div class="cat-name">${cat.icon ? escapeHtml(cat.icon)+' ' : ''}${escapeHtml(cat.name)}</div>
          <div class="cat-group">${escapeHtml(cat.group)}</div>
        </div>
        <div class="cat-amt"><b>${fmt(spent)}</b><br>/ ${fmt(cat.budget)}</div>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct*100}%; background:${barColor(status)};"></div>
        ${cat.threshold!=null ? `<div class="bar-thresh" style="left:${cat.threshold*100}%;"></div>` : ''}
      </div>
      <div class="status-row">
        <span class="status-badge ${status.cls}">${status.label}</span>
        <span style="font-size:10px;color:var(--muted);">${cat.budget>0?Math.round(pct*100):0}% used</span>
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

function renderTxRow(container, t, showDelete){
  const cat = catById(t.categoryId);
  const savingsTag = cat && cat.group==='Savings' ? '<span class="tx-tag-savings">SAVINGS</span>' : '';
  const methodTag = t.method ? ' · ' + escapeHtml(t.method) : '';

  const wrap = document.createElement('div');
  wrap.className = 'tx-swipe-wrap';
  wrap.innerHTML = `
    <div class="tx-swipe-actions">
      <button class="tx-swipe-btn tx-swipe-edit" aria-label="Edit">✏️</button>
      ${showDelete ? `<button class="tx-swipe-btn tx-swipe-del" aria-label="Delete">🗑</button>` : ''}
    </div>
    <div class="tx-row" style="cursor:pointer;">
      <div class="tx-left">
        <div class="tx-cat">${cat && cat.icon ? escapeHtml(cat.icon)+' ' : ''}${escapeHtml(cat?cat.name:'Uncategorized')}${savingsTag}</div>
        <div class="tx-desc">${escapeHtml(t.desc)||'—'}${methodTag}</div>
      </div>
      <div style="display:flex;align-items:center;">
        <div class="tx-right">
          <div class="tx-amt">${fmt(t.amount)}</div>
          <div class="tx-date">${t.date}</div>
        </div>
        ${showDelete ? `<button class="tx-del" data-id="${t.id}" aria-label="Delete">✕</button>` : ''}
      </div>
    </div>
  `;
  container.appendChild(wrap);
  const row = wrap.querySelector('.tx-row');

  // Tap / click to edit (desktop and a non-drag tap on mobile)
  row.addEventListener('click', (e)=>{
    if(e.target.closest('.tx-del')) return;
    if(row.dataset.dragged==='1'){ row.dataset.dragged='0'; return; }
    openEditTx(t);
  });
  wrap.querySelector('.tx-swipe-edit').addEventListener('click', (e)=>{
    e.stopPropagation(); resetSwipe(row); openEditTx(t);
  });
  if(showDelete){
    row.querySelector('.tx-del').addEventListener('click', (e)=>{
      e.stopPropagation();
      state.transactions = state.transactions.filter(x=>x.id!==t.id);
      saveState(); renderAll();
      showToast('Expense removed');
    });
    const delBtn = wrap.querySelector('.tx-swipe-del');
    if(delBtn) delBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      state.transactions = state.transactions.filter(x=>x.id!==t.id);
      saveState(); renderAll();
      showToast('Expense removed');
    });
  }
  attachSwipe(row);
}

/* Swipe-to-reveal: drag a transaction row left to expose Edit/Delete buttons underneath. */
const SWIPE_REVEAL = 76;
let openSwipeRow = null;
function resetSwipe(row){ row.style.transition='transform .2s ease'; row.style.transform='translateX(0)'; if(openSwipeRow===row) openSwipeRow=null; }
function attachSwipe(row){
  let startX=0, dx=0, dragging=false;
  row.addEventListener('touchstart', e=>{
    if(openSwipeRow && openSwipeRow!==row) resetSwipe(openSwipeRow);
    startX = e.touches[0].clientX; dragging = true; dx = 0;
    row.dataset.dragged = '0';
    row.style.transition = 'none';
  }, {passive:true});
  row.addEventListener('touchmove', e=>{
    if(!dragging) return;
    dx = e.touches[0].clientX - startX;
    if(Math.abs(dx) > 6) row.dataset.dragged = '1';
    const x = Math.min(0, Math.max(-SWIPE_REVEAL, dx));
    row.style.transform = 'translateX(' + x + 'px)';
  }, {passive:true});
  row.addEventListener('touchend', ()=>{
    dragging = false;
    row.style.transition = 'transform .2s ease';
    if(dx < -SWIPE_REVEAL*0.5){
      row.style.transform = 'translateX(-' + SWIPE_REVEAL + 'px)';
      openSwipeRow = row;
    } else {
      row.style.transform = 'translateX(0)';
      if(openSwipeRow===row) openSwipeRow = null;
    }
  });
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
      <div class="save-top">
        <div class="save-name">${cat.icon?escapeHtml(cat.icon)+' ':''}${escapeHtml(cat.name)}</div>
        <div class="save-amt">${fmt(total)}</div>
      </div>
      <div class="save-sub">+${fmt(thisCycle)} contributed this cycle</div>
      ${goal>0 ? `
        <div class="save-bar-track"><div class="save-bar-fill" style="width:${pct*100}%;"></div></div>
        <div class="save-foot"><span>${Math.round(pct*100)}% of goal</span><span>Goal: ${fmt(goal)}</span></div>
      ` : `<div class="save-foot"><span>No goal set — add one in Settings</span></div>`}
    `;
    wrap.appendChild(div);
  });
}

/* ============================================================
   RENDER: DEBT TRACKER
   ============================================================ */
function renderDebtTab(){
  document.getElementById('stratAvalanche').classList.toggle('active', state.debtStrategy==='avalanche');
  document.getElementById('stratSnowball').classList.toggle('active', state.debtStrategy==='snowball');
  document.getElementById('stratManual').classList.toggle('active', state.debtStrategy==='manual');

  const owed = totalDebtOwed(), paid = totalDebtPaid(), remaining = totalDebtRemaining();
  document.getElementById('debtSummary').innerHTML = `
    <div class="hist-card"><div class="v">${fmt(owed)}</div><div class="l">Total owed</div></div>
    <div class="hist-card"><div class="v">${fmt(paid)}</div><div class="l">Total paid</div></div>
    <div class="hist-card"><div class="v">${fmt(remaining)}</div><div class="l">Remaining</div></div>
  `;

  const focus = suggestedFocusDebt();
  const focusWrap = document.getElementById('debtFocusCard');
  if(!focus){
    focusWrap.innerHTML = '<div class="debt-focus-empty">No active debt to focus on — add a debt below, or you\'re debt-free! 🎉</div>';
  } else {
    const why = state.debtStrategy==='avalanche' ? 'Highest interest rate (' + (focus.interestRate||0) + '%/yr) — clearing this first saves the most money over time.'
      : state.debtStrategy==='snowball' ? 'Smallest remaining balance — clearing this first builds momentum fastest.'
      : 'Manually selected as your current focus.';
    const rem = remainingForDebt(focus);
    const pct = focus.amount>0 ? Math.min(paidForDebt(focus.id)/focus.amount,1) : 0;
    focusWrap.innerHTML = `
      <div class="debt-focus-card">
        <div class="focus-badge">CURRENTLY SERVICING</div>
        <div class="debt-top"><div class="debt-name">${escapeHtml(focus.creditor)}</div><div class="debt-amt">${fmt(rem)} left</div></div>
        <div class="debt-reason">${escapeHtml(focus.reason)||'—'}</div>
        <div class="debt-bar-track"><div class="debt-bar-fill" style="width:${pct*100}%;"></div></div>
        <div class="debt-foot"><span>${Math.round(pct*100)}% paid off</span><span>Owed: ${fmt(focus.amount)}</span></div>
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
      const rem = remainingForDebt(debt);
      const pct = debt.amount>0 ? Math.min(paidForDebt(debt.id)/debt.amount,1) : 0;
      const isFocused = focus && focus.id===debt.id;
      const div = document.createElement('div');
      div.className = 'debt-card' + (isFocused ? ' focused' : '');
      div.innerHTML = `
        <div class="debt-top">
          <div class="debt-name">${escapeHtml(debt.creditor)}${isFocused ? ' <span style="color:var(--gold);font-size:10px;">★ FOCUS</span>' : ''}</div>
          <div class="debt-amt">${rem<=0 ? '✅ Cleared' : fmt(rem)+' left'}</div>
        </div>
        <div class="debt-reason">${escapeHtml(debt.reason)||'—'}${debt.interestRate ? ' · '+debt.interestRate+'%/yr' : ''}</div>
        <div class="debt-bar-track"><div class="debt-bar-fill" style="width:${pct*100}%;"></div></div>
        <div class="debt-foot"><span>${Math.round(pct*100)}% paid</span><span>Owed: ${fmt(debt.amount)}</span></div>
        <div class="debt-actions">
          ${rem>0 ? `<button class="debt-btn-pay" data-pay="${debt.id}">Log payment</button>` : ''}
          ${state.debtStrategy==='manual' && rem>0 ? `<button class="debt-btn-focus" data-focus="${debt.id}">${isFocused?'Focused':'Set as focus'}</button>` : ''}
          <button class="debt-btn-del" data-del="${debt.id}" data-name="${escapeHtml(debt.creditor)}" aria-label="Delete debt">🗑</button>
        </div>
      `;
      listWrap.appendChild(div);
    });
    listWrap.querySelectorAll('[data-pay]').forEach(b=>b.addEventListener('click', ()=>openDebtPaySheet(b.dataset.pay)));
    listWrap.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click', ()=>{
      state.debtFocusId = b.dataset.focus; saveState(); renderAll();
    }));
    listWrap.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', async ()=>{
      const paidAmt = paidForDebt(b.dataset.del);
      const msg = paidAmt>0
        ? `${b.dataset.name} has ${fmt(paidAmt)} in logged payments. Deleting it keeps those as regular Debt repayment expenses, just no longer tied to this creditor. Continue?`
        : `Delete "${b.dataset.name}"? This can't be undone.`;
      const ok = await askConfirm('Delete debt?', msg);
      if(!ok) return;
      state.debts = state.debts.filter(d=>d.id!==b.dataset.del);
      if(state.debtFocusId===b.dataset.del) state.debtFocusId = '';
      saveState(); renderAll();
      showToast('Debt deleted');
    }));
  }
}

document.getElementById('financeTabDebt').addEventListener('click', ()=>{
  document.getElementById('financeTabDebt').classList.add('active');
  document.getElementById('financeTabSavings').classList.remove('active');
  document.getElementById('financePanelDebt').style.display = '';
  document.getElementById('financePanelSavings').style.display = 'none';
});
document.getElementById('financeTabSavings').addEventListener('click', ()=>{
  document.getElementById('financeTabSavings').classList.add('active');
  document.getElementById('financeTabDebt').classList.remove('active');
  document.getElementById('financePanelSavings').style.display = '';
  document.getElementById('financePanelDebt').style.display = 'none';
});
document.getElementById('financeTabDebt').classList.add('active');

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
  state.debts.push({ id: 'debt-'+Date.now(), creditor, reason, amount, interestRate });
  saveState(); renderAll();
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
    id: Date.now(), amount, categoryId: 'debt',
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
  const sorted = [...state.transactions].sort((a,b)=> b.date.localeCompare(a.date) || b.id-a.id);
  document.getElementById('txTagFull').textContent = sorted.length + ' logged';
  txWrap.innerHTML = sorted.length ? '' : '<div class="empty-hist">No expenses logged this cycle yet.</div>';
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
function renderSettings(){
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
  document.getElementById('budgetTotalVal').textContent = fmt(budget) + (income>0 ? ' (' + Math.round(budget/income*100) + '% of income)' : '');
  totalLine.classList.toggle('over', income>0 && (budget + totalSavingsBudget()) > income);

  const wrap = document.getElementById('settingsCatList');
  wrap.innerHTML = '';
  state.categories.forEach(cat=>{
    const div = document.createElement('div');
    div.className = 'settings-cat';
    const isSavings = cat.group === 'Savings';
    div.innerHTML = `
      <div class="settings-cat-name" style="display:flex;justify-content:space-between;align-items:center;">
        <span>${cat.icon?escapeHtml(cat.icon)+' ':''}${escapeHtml(cat.name)} <span style="color:var(--muted-2); font-weight:400;">(${escapeHtml(cat.group)})</span></span>
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
  state.bills.push({ id: 'bill-'+Date.now(), name, amount, dueDay });
  saveState(); renderAll();
  document.getElementById('newBillName').value = '';
  document.getElementById('newBillAmount').value = '';
  document.getElementById('newBillDueDay').value = '';
  showToast('Bill added');
});

/* ============================================================
   RENDER ALL + NAV
   ============================================================ */
function renderAll(){
  refreshCycleDates();
  renderDashboard();
  renderSavingsTab();
  renderDebtTab();
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

  statusEl.textContent = 'Heard: "' + text + '"' +
    (matchedAmount ? ' · amount ' + fmt(Number(matchedAmount)) : ' · no amount detected, check the field') +
    (matchedCat ? ' · category: ' + matchedCat.name : ' · pick a category below');
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
  activeSheet = addSheet; openSheetEl(addSheet);
}
document.getElementById('txCancelBtn').addEventListener('click', ()=>{ closeSheetEl(addSheet); activeSheet=null; editingTxId=null; });
document.getElementById('txSaveBtn').addEventListener('click', ()=>{
  const amount = Number(document.getElementById('txAmount').value);
  const categoryId = document.getElementById('txCategory').value;
  const method = document.getElementById('txMethod').value;
  const desc = document.getElementById('txDesc').value.trim();
  const date = document.getElementById('txDate').value || toDateInput(new Date());
  if(!amount || amount<=0){ showToast('Enter a valid amount'); return; }

  if(editingTxId != null){
    const t = state.transactions.find(x=>x.id===editingTxId);
    if(t){ Object.assign(t, {amount, categoryId, method, desc, date}); }
    showToast('Expense updated');
  } else {
    state.transactions.push({id: Date.now(), amount, categoryId, desc, date, method});
    showToast(isSavingsCat(categoryId) ? 'Added to savings — not counted as spending' : 'Expense added');
  }
  saveState(); renderAll();
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
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCode}&to=${toCode}`);
    const data = await res.json();
    const converted = data.rates && data.rates[toCode];
    if(!converted) throw new Error('no rate');
    const rate = converted / amount;
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

  const entry = { id: Date.now(), source, date };
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
    return;
  }
  wrap.innerHTML = '';
  state.aiHistory.forEach(msg=>{
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble ' + msg.role + (msg.error ? ' error' : '');
    bubble.textContent = msg.text;
    wrap.appendChild(bubble);
  });
  wrap.scrollTop = wrap.scrollHeight;
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
  state.aiHistory.push({id: Date.now(), role:'user', text:q});
  input.value = '';
  renderAiChat();
  const thinkingId = Date.now()+1;
  state.aiHistory.push({id: thinkingId, role:'bot', text:'Thinking…'});
  renderAiChat();
  try{
    const data = await apiPost('askAI', {question: q});
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

  const spentByCat = spendingCategories().map(c => ({ name:c.name, spent:spentForIn(txs,c.id), budget:c.budget }))
    .filter(x=>x.spent>0).sort((a,b)=>b.spent-a.spent);

  const byDay = {};
  txs.filter(t=>!isSavingsCat(t.categoryId)).forEach(t=>{ byDay[t.date] = (byDay[t.date]||0) + Number(t.amount); });
  const dailyEntries = Object.keys(byDay).sort().map(d=>({date:d, amount:byDay[d]}));
  const highestDay = dailyEntries.slice().sort((a,b)=>b.amount-a.amount)[0];

  const overBudget = snapshot ? [] : state.categories.filter(c => statusFor(c).cls==='st-over');
  const nearLimit = snapshot ? [] : state.categories.filter(c => statusFor(c).cls==='st-near');

  return { income, spent, budget, savingsContrib, remaining, savingsRate, spentByCat, dailyEntries, highestDay, overBudget, nearLimit };
}

function generateReportText(d, periodLabel, note){
  const lines = [];
  lines.push('BUDGET COCKPIT — REPORT');
  lines.push(periodLabel || ('Cycle: ' + cycleLabelText()));
  lines.push('Generated: ' + new Date().toLocaleString('en-GB'));
  if(note) lines.push(note);
  lines.push('');
  lines.push('INCOME & SPENDING');
  lines.push('Total income: ' + fmt(d.income));
  lines.push('Total spent (excludes savings contributions): ' + fmt(d.spent));
  lines.push('Total budgeted: ' + fmt(d.budget));
  lines.push('Savings/Emergency Fund contributed: ' + fmt(d.savingsContrib) + ' (' + d.savingsRate + '% of income)');
  lines.push('Remaining to spend: ' + fmt(d.remaining));
  lines.push('');
  lines.push('TOP SPENDING CATEGORIES');
  if(d.spentByCat.length===0) lines.push('No expenses logged this period.');
  d.spentByCat.slice(0,3).forEach((x,i)=> lines.push((i+1) + '. ' + x.name + ': ' + fmt(x.spent) + (x.budget>0 ? ' of ' + fmt(x.budget) + ' budgeted' : ' (no budget set)')));
  lines.push('');
  if(d.highestDay) lines.push('Highest single-day spend: ' + d.highestDay.date + ' (' + fmt(d.highestDay.amount) + ')');
  lines.push('');
  lines.push('ALERTS');
  lines.push(d.overBudget.length ? 'Over budget: ' + d.overBudget.map(c=>c.name).join(', ') : 'No categories over budget.');
  lines.push(d.nearLimit.length ? 'Near limit: ' + d.nearLimit.map(c=>c.name).join(', ') : 'No categories near their limit.');
  lines.push('');
  lines.push('SUGGESTIONS');
  const suggestions = [];
  if(d.savingsRate < 20 && d.income>0) suggestions.push('Savings rate is below the commonly-cited 20% baseline — consider trimming ' + (d.spentByCat[0] ? d.spentByCat[0].name : 'your largest category') + ' next cycle.');
  if(d.overBudget.length) suggestions.push('Set a firm cap or cut back next cycle on: ' + d.overBudget.map(c=>c.name).join(', ') + '.');
  if(!d.overBudget.length && !d.nearLimit.length && d.savingsRate>=20) suggestions.push('Solid cycle — spending stayed within budget and savings rate is at/above the general benchmark.');
  if(suggestions.length===0) suggestions.push('Log a few more expenses for a more useful pattern report next cycle.');
  suggestions.forEach(s=>lines.push('• ' + s));
  return lines.join('\n');
}

const PIE_COLORS = ['#E8B14C','#3FC7B0','#FF6B6B','#F2B84B','#8892A6','#B8802A','#128C77'];
function drawPieChart(canvas, data){
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const total = data.reduce((s,x)=>s+x.spent,0);
  if(!total){ ctx.fillStyle='#8892A6'; ctx.font='11px sans-serif'; ctx.fillText('No spending yet', 20, canvas.height/2); return; }
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
  if(!entries.length){ ctx.fillStyle='#8892A6'; ctx.font='11px sans-serif'; ctx.fillText('No daily spend yet', 20, canvas.height/2); return; }
  const max = Math.max(...entries.map(e=>e.amount), 1);
  const w = canvas.width, h = canvas.height, pad=20, barW = Math.max((w-pad*2)/entries.length - 4, 2);
  entries.forEach((e,i)=>{
    const barH = (e.amount/max) * (h - pad*2);
    const x = pad + i*((w-pad*2)/entries.length);
    ctx.fillStyle = '#3FC7B0';
    ctx.fillRect(x, h-pad-barH, barW, barH);
  });
  ctx.fillStyle = '#8892A6'; ctx.font = '9px sans-serif';
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

  const spentByCat = spendingCategories().map(c => ({ name:c.name, spent:spentForIn(allTx,c.id), budget:0 }))
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
          <input type="text" readonly value="${data.url}" id="shareUrlInput">
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
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    // SRI: generated at srihash.org against this exact URL (jsPDF's own README points there too).
    // If this ever needs regenerating (e.g. bumping the jsPDF version), paste the new sha384-... value below.
    s.integrity = 'sha384-REPLACE_WITH_HASH_FROM_SRIHASH_ORG';
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = reject; // also fires on an SRI mismatch — caught below, shows a friendly toast, never a silent break
    document.head.appendChild(s);
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
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(120);
    doc.text(document.getElementById('reportTitle').textContent, marginX, y+7);
    doc.setFontSize(9);
    doc.text(currentPeriodLabel, marginX, y+13);
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

    // Footer
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(160);
    doc.text('Generated ' + new Date().toLocaleString('en-GB'), marginX, 289);

    doc.save(currentReportFilename + '.pdf');
    showToast('PDF downloaded');
  }catch(e){
    showToast('Could not generate PDF — try Copy instead');
  }
});

/* ============================================================
   CUSTOM CONFIRM MODAL
   ============================================================ */
const confirmBox = document.getElementById('confirmBox');
let confirmResolver = null;
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
   LOCK SCREEN / LOGIN
   ============================================================ */
function showLockScreen(msg){
  hideLoadingScreen();
  document.getElementById('lockScreen').style.display = 'flex';
  document.getElementById('lockError').textContent = msg || '';
  document.getElementById('lockPasswordInput').value = '';
  setTimeout(()=>document.getElementById('lockPasswordInput').focus(), 50);
}
function hideLockScreen(){
  document.getElementById('lockScreen').style.display = 'none';
}
function hideLoadingScreen(){
  const el = document.getElementById('loadingScreen');
  if(el) el.style.display = 'none';
}
async function doLogin(){
  const pw = document.getElementById('lockPasswordInput').value;
  const errEl = document.getElementById('lockError');
  if(!pw){ errEl.textContent = 'Enter your password'; return; }
  errEl.textContent = 'Checking…';
  try{
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify({action:'login', password: pw})
    });
    const data = await res.json();
    if(data && data.sessionToken){
      sessionToken = data.sessionToken;
      try{ localStorage.setItem(SESSION_KEY, sessionToken); }catch(e){}
      errEl.textContent = '';
      hideLockScreen();
      loadState();
    } else {
      errEl.textContent = (data && data.error) || 'Incorrect password';
    }
  }catch(e){
    errEl.textContent = 'Could not reach backend — check your connection';
  }
}
document.getElementById('lockSubmitBtn').addEventListener('click', doLogin);
document.getElementById('lockPasswordInput').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });

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

function lockNow(){
  sessionToken = '';
  try{ localStorage.removeItem(SESSION_KEY); }catch(e){}
  showLockScreen('');
}
document.getElementById('lockNowBtn').addEventListener('click', ()=>{
  if(!API_URL){ showToast('No backend connected — nothing to lock'); return; }
  lockNow();
});

/* ============================================================
   INIT
   ============================================================ */
async function boot(){
  if(!API_URL){ loadState(); return; } // no backend configured — nothing to lock
  const mirror = loadLocalMirror();

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

  showLockScreen();
}
boot();

/* ============================================================
   PWA — register service worker (safe no-op if hosted somewhere
   that can't serve sw.js, e.g. this preview inside Claude)
   ============================================================ */
if('serviceWorker' in navigator && location.protocol !== 'about:'){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // No service worker available here (e.g. previewing inside Claude,
      // or opened as a local file) — app still works fully online.
    });
  });
}
