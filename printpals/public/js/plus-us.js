// PrintPals Plus: 7 free days on this device (no card), then a Stripe subscription.
// Paying on Stripe sends the family back to /plus?plan=...&session_id=..., which unlocks Plus here.
(function () {
  const LINKS = {
    monthly: 'https://buy.stripe.com/14A00igGPbu309ygcW1kA00',
    yearly: 'https://buy.stripe.com/7sYcN43U39lV6xW1i21kA01',
    teacher: 'https://buy.stripe.com/aFa28qaircy7bSgbWG1kA02',
  };
  const PORTAL = 'https://billing.stripe.com/p/login/14A00igGPbu309ygcW1kA00';
  const TRIAL = 7, DAY = 864e5;
  const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const paid = () => { try { return JSON.parse(get('pp-plus') || 'null'); } catch { return null; } };
  function trialStart() { let t = +get('pp-plus-trial'); if (!t) { t = Date.now(); set('pp-plus-trial', String(t)); } return t; }
  function trialLeft() { const t = +get('pp-plus-trial'); if (!t) return TRIAL; return Math.max(0, Math.ceil(TRIAL - (Date.now() - t) / DAY)); }
  /** Does this device have Plus? Class packs need the teacher plan. */
  function has(teacher) { const p = paid(); return !!p && (!teacher || p.plan === 'teacher'); }
  function save(plan, ref) { set('pp-plus', JSON.stringify({ plan, since: Date.now(), ref })); }

  // Coming back from a Stripe payment.
  let welcome = null;
  const q = new URLSearchParams(location.search);
  const plan = q.get('plan'), sid = q.get('session_id') || '';
  if (/^(monthly|yearly|teacher)$/.test(plan || '') && /^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(sid)) {
    save(plan, sid.slice(-12));
    welcome = plan;
    try { history.replaceState(null, '', location.pathname); } catch {}
  }

  /** Paid on another device: the receipt number from Stripe's email unlocks this one too. */
  function unlock(code, teacher) {
    const c = String(code || '').trim().replace(/^#/, '');
    if (!/^[A-Z0-9]{4,}-[0-9]{3,}$/i.test(c)) return false;
    save(teacher ? 'teacher' : 'monthly', c);
    return true;
  }

  const money = { monthly: '$4.99 a month', yearly: '$39 a year', teacher: '$59 a year' };

  /** The friendly box that offers the plans (used on Plus tool pages). */
  function offerHtml(teacher) {
    const btn = (p, label, alt) => `<a class="btn${alt ? ' alt' : ''}" href="${LINKS[p]}" rel="noopener">${label}</a>`;
    const plans = teacher
      ? btn('teacher', `Get the teacher plan, ${money.teacher}`)
      : btn('yearly', `Yearly, ${money.yearly} (save 35%)`) + btn('monthly', `Monthly, ${money.monthly}`, true);
    return `<div class="plus-offer"><span class="new plus">Plus</span>
<h3>${teacher ? 'Class packs are part of the teacher plan' : 'Your free Plus week has finished'}</h3>
<p>${teacher ? 'Your free week has finished. The teacher plan gives you class packs for up to 40 children, plus everything in PrintPals Plus.' : 'We hope you loved it! Keep monthly learning plans and personalised activity books coming. Everything else on PrintPals stays free.'}</p>
<div class="plus-btns">${plans}</div>
<p class="small">Cancel any time. Prices in US dollars, tax included. <a href="/us/plus">Compare plans</a></p>
<details class="small"><summary>Already paid on another phone or computer?</summary>
<p>Type the receipt number from your PrintPals payment email (it looks like 1234-5678).</p>
<p><input type="text" class="unlock-code" placeholder="1234-5678" autocomplete="off"> <button type="button" class="btn alt small unlock-go">Unlock</button></p>
<p class="unlock-msg"></p></details></div>`;
  }

  window.PPPlus = { LINKS, PORTAL, TRIAL, money, trialStart, trialLeft, has, paid, unlock, welcome, offerHtml };
})();
