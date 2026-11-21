// Netlify runs this by itself after every form submission. Email sign ups
// (footer, welcome card and the checkout tick box) are copied into MailerLite,
// so the monthly reminder emails can be sent from there. Without
// MAILERLITE_API_KEY it does nothing and the emails stay in Netlify Forms.
export default async req => {
  const key = process.env.MAILERLITE_API_KEY;
  const { payload } = await req.json().catch(() => ({}));
  if (!key || payload?.form_name !== 'newsletter') return new Response('skipped');
  const email = String(payload.data?.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return new Response('no email');
  const body = { email };
  if (process.env.MAILERLITE_GROUP_ID) body.groups = [process.env.MAILERLITE_GROUP_ID];
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  }).catch(e => ({ ok: false, status: 0, text: async () => e.message }));
  if (!res.ok) console.error('MailerLite said', res.status, (await res.text()).slice(0, 300));
  return new Response('ok');
};
