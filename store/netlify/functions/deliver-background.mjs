// Sends the emails that are due: "your magazine is ready" to buyers once they
// have paid, and gifts to the people they are for on the chosen day. Runs in
// the background because a magazine attached to an email can take a while.
import { getStore } from '@netlify/blobs';
import { mailReady, gmailSender, deliverPending } from '../lib/mail.mjs';

export default async req => {
  if (!mailReady(process.env)) return console.log('Emails are not set up yet (GMAIL_USER, GMAIL_APP_PASSWORD)');
  const origin = process.env.URL || new URL(req.url).origin;
  const done = await deliverPending(getStore({ name: 'orders', consistency: 'strong' }), { origin, send: await gmailSender(process.env) });
  console.log(`Finished emailing ${done} orders`);
};
