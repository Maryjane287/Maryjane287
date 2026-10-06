// PrintPals Kids Club: a parent joins with an email (saved in Firebase, create only,
// one entry per email), then the free welcome pack opens for printing.
(function () {
  var KEY = 'AIzaSyDDxRhWQLp_Tr1J_Gdxfykt2Kk-61w8A_0';
  var URL = 'https://firestore.googleapis.com/v1/projects/brainlings-6b9cf/databases/(default)/documents/pp_signups';
  var us = document.documentElement.lang === 'en-US';
  var packUrl = us ? '/us/kids-club' : '/kids-club';
  function joined() { try { return localStorage.getItem('pp-club') === '1'; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem('pp-club', '1'); } catch (e) {} }

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }

  function done(form, msg, already) {
    remember();
    var here = document.querySelector('#maker[data-tool="kidsclub"]');
    form.classList.add('club-done');
    msg.innerHTML = (already ? 'You are already in the club. Welcome back! ' : '🎉 Welcome to the PrintPals Kids Club! ') +
      (here ? 'Your welcome pack is ready: press Print or save as PDF.' : '<a href="' + packUrl + '">Open your free welcome pack →</a>');
    document.body.classList.add('club-joined');
  }

  document.querySelectorAll('.club-form').forEach(function (form) {
    var msg = form.querySelector('.club-msg');
    if (joined()) { form.classList.add('club-done'); msg.innerHTML = '💌 You are in the PrintPals Kids Club. <a href="' + packUrl + '">Your welcome pack →</a>'; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = String(form.clubemail.value || '').trim().toLowerCase();
      if (!/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email) || email.length > 254) { msg.textContent = 'Please type your full email address, like name@example.com.'; form.clubemail.focus(); return; }
      if (!form.clubconsent.checked) { msg.textContent = 'Please tick the box to say yes to the club emails.'; return; }
      var btn = form.querySelector('button'); btn.disabled = true; msg.textContent = 'Joining…';
      var body = JSON.stringify({ fields: { email: { stringValue: email }, lang: { stringValue: us ? 'us' : 'uk' }, src: { stringValue: location.pathname.slice(0, 120) }, consent: { booleanValue: true } } });
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)).then(function (h) {
        return fetch(URL + '?documentId=' + hex(h) + '&key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body });
      }).then(function (r) {
        btn.disabled = false;
        if (r.ok) done(form, msg, false);
        else if (r.status === 409) done(form, msg, true);
        else msg.textContent = 'Sorry, that did not work. Please check your email address and try again.';
      }).catch(function () { btn.disabled = false; msg.textContent = 'Sorry, we could not connect. Please check your internet and try again.'; });
    });
  });

  // The welcome pack prints once you have joined.
  var maker = document.querySelector('#maker[data-tool="kidsclub"]');
  if (maker) document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-action="print"]');
    if (!b || joined()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var box = document.querySelector('.club-form');
    if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); box.querySelector('.club-msg').textContent = 'Join the club (it is free) to print your welcome pack.'; box.clubemail.focus(); }
  }, true);
})();
