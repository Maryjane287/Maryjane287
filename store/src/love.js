// The love pages for "Happy Birthday, My Love": pages we write ourselves, so
// the magazine feels rich even when the husband only answers a few questions.
// Every page is about her by name, and the last one is a note from us.
import { esc } from './covers.js';

const ICON = {
  spark: '<path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/>',
  hands: '<path d="M4 14c2-1 3-3 5-3h4a2 2 0 0 1 0 4h-3M8 18h7l5-4a2 2 0 0 0-3-3l-3 2"/>',
  pulse: '<path d="M2 12h5l2-5 4 10 2-5h7"/>',
  hug: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  moon: '<path d="M20 15A8 8 0 1 1 9 4a6.5 6.5 0 0 0 11 11z"/>',
};
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg>';
// A small sprig of leaves and a bud, for the corners of the note from us.
const sprig = '<svg class="lv-sprig" viewBox="0 0 100 100" aria-hidden="true"><path d="M8 92C30 70 52 52 92 8" fill="none"/><path d="M30 70c-8-10-6-20 2-24 4 10 4 18-2 24zM46 54c-2-12 4-20 12-20 0 10-4 16-12 20zM62 38c0-10 6-16 14-14-2 8-6 12-14 14zM34 66c10-6 20-4 24 4-10 4-18 3-24-4zM50 50c10-4 18 0 20 8-10 2-16 0-20-8z"/><circle cx="92" cy="8" r="5"/></svg>';

export function lovePages({ who, from, age, page, style }) {
  const her = esc(who);
  const him = esc(from);

  const science = [
    ['spark', 'A fifth of a second', 'That is roughly how long the brain needs to feel the first spark of attraction.'],
    ['pulse', 'Hearts in time', 'When two people in love sit close together, their heartbeats and breathing can begin to match.'],
    ['hands', 'The power of a hand', 'Holding the hand of someone you love can calm the body and even make pain feel smaller.'],
    ['hug', 'The twenty second hug', 'A long, warm hug releases oxytocin, often called the cuddle hormone. It is the body saying, you are safe here.'],
    ['eye', 'Look into my eyes', 'Gazing into each other\'s eyes for just a few minutes can make two people feel deeply close.'],
    ['moon', 'Love keeps you up', 'New love really can steal your sleep and your appetite. The brain is too busy being happy.'],
  ];

  const stories = [
    ['1632', 'Shah Jahan and Mumtaz Mahal', 'He built the Taj Mahal in her memory. It took about twenty thousand workers and over twenty years, and it still makes the world gasp.'],
    ['1845', 'Elizabeth and Robert Browning', 'They wrote each other nearly six hundred letters before running away together to Italy, where they lived happily ever after.'],
    ['1895', 'Marie and Pierre Curie', 'They fell in love over science, and in 1903 they shared the Nobel Prize. Two brilliant minds, one beautiful life.'],
    ['1968', 'Johnny Cash and June Carter', 'He proposed to her on stage, in front of thousands of people. She said yes, and they stayed together for thirty five years.'],
  ];

  const letters = [
    ['How do I love thee? Let me count the ways.', 'Elizabeth Barrett Browning, 1850'],
    ['Ever thine, ever mine, ever ours.', 'Ludwig van Beethoven, to his Immortal Beloved, 1812'],
    ['I have not spent a day without loving you.', 'Napoleon Bonaparte, to Josephine, 1796'],
    ['I realise how lucky I am to share my life with the greatest woman I ever met. You still fascinate and inspire me.', 'Johnny Cash, to June, 1994'],
  ];

  const gifts = [
    'A laugh that makes the whole room join in.',
    'Someone who remembers the little things.',
    'A kindness that never asks for anything back.',
    'Hugs that can fix the worst of days.',
    `A smile ${him} would cross the world for.`,
    'A daughter, a friend, a partner, a home.',
    `And the very best part of ${him}'s every single day.`,
  ];
  const years = /^\d+$/.test(String(age).trim()) ? `${esc(age)} years ago` : 'Years ago';

  return {
    science: page('lv lv-sci', `<p class="pg-kicker">Fun facts</p><h3>The Science of Falling in Love</h3><div class="lv-facts">${science.map(([k, t, d]) => `<div class="lv-fact"><i>${icon(k)}</i><b>${t}</b><p>${d}</p></div>`).join('')}</div><p class="lv-hand">Science can measure all of this. It still cannot explain how ${him} looked at ${her} and just knew.</p>`),
    stories: page('lv lv-fame', `<p class="pg-kicker">Love through the ages</p><h3>Famous Love Stories</h3><ol class="lv-line">${stories.map(([y, t, d]) => `<li><span class="lv-year">${y}</span><b>${t}</b><p>${d}</p></li>`).join('')}<li class="lv-us"><span class="lv-year">Today</span><b>${him} and ${her}</b><p>Not in any history book yet. But ask ${him}, and he will tell you it is the greatest love story he knows.</p></li></ol>`),
    letters: page('lv lv-letters', `<p class="pg-kicker">From the archives</p><h3>Love Letters Through History</h3><div class="lv-notes">${letters.map(([q, s], i) => `<figure class="lv-note lv-n${i + 1}"><blockquote>&ldquo;${q}&rdquo;</blockquote><figcaption>${s}</figcaption><i class="lv-seal">${heart}</i></figure>`).join('')}</div><p class="lv-hand">The greatest love letters were never written for the world. They were written for one person. ${her}, yours is on page 3.</p>`),
    world: page('lv lv-world', `<div class="lv-sun" aria-hidden="true"></div><p class="pg-kicker">On this day, ${years}</p><h3>Why the World Is Better Because You Were Born</h3><p class="lv-lead">The world got a little brighter. Here is what it gained:</p><ul class="lv-gifts">${gifts.map(g => `<li>${g}</li>`).join('')}</ul><p class="lv-close">The world is better because you were born, ${her}. ${him}'s world most of all.</p>`),
    note: `<div class="pg pg-lv lv-us-note" ${style}>${sprig}${sprig}<div class="pg-in"><p class="pg-kicker">A note from all of us at Cover Story</p><h3>What we believe love is</h3><div class="lv-letter"><p>We make magazines for a living, but some feel different. This was one of them.</p><p>We believe love is not only the big moments. It is the cup of tea made just right. The hand reached for in a crowd. The person who remembers how you like things, and the one who chooses you again and again, on ordinary days.</p><p>${her}, someone came to us wanting something special for you. Not a card anyone could buy, but pages full of you: your name, your face, your story. He wanted you to hold something in your hands and know, without any doubt, how deeply you are loved.</p><p>That someone is ${him}. And from everything he told us, you are his favourite person in the whole world.</p><p class="lv-wish">Happy birthday, ${her}. You are loved more than any magazine could ever hold.</p></div><p class="lv-sign">With warm wishes,<b>everyone at Cover Story</b></p></div></div>`,
  };
}
