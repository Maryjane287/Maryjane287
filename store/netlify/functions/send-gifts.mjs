// Every hour, wakes the email sender so gifts go out on the morning of the day
// the buyer picked, and anything that failed earlier is tried again.
export default async () => {
  const origin = process.env.URL;
  if (origin) await fetch(`${origin}/.netlify/functions/deliver-background`, { method: 'POST' });
};

export const config = { schedule: '@hourly' };
