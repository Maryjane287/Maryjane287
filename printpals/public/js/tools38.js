// PrintPals batch 38: the PrintPals Kids Club welcome pack (free, unlocked by joining the email club).

// The busy colouring scene follows the season, so the welcome pack always feels fresh.
function clubSeasonKey(month) {
  return ['snowman', 'hearts', 'eggs', 'eggs', 'sunflower', 'sunflower', 'whale', 'whale', 'leaves', 'pumpkin', 'leaves', 'tree'][month];
}

function makeKidsClub(o, paper) {
  const name = nameOf(o.name, '') || '';
  const age = +o.age || 5, seed = +o.seed || 1;
  const level = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const ring = '#e0457b', tint = '#fff0f6';
  const badge = (svg) => packBadge(svg, 'Kids Club', ring);
  const pages = [seriesCover(paper, 'PRINTPALS KIDS CLUB', name ? `Welcome to the club, ${name}!` : 'Welcome to the club!', 'Your free welcome pack', ['🎉', '⭐', '🖍️', '💌', '🎈', '🌈'], ring, tint, 'welcome pack',
    ['A busy colouring scene', 'A maze', 'Dot to dot', 'Spot the difference', 'Roll and draw', 'Club certificate'])];
  pages.push(seasonColour(paper, clubSeasonKey(new Date().getMonth()), name));
  pages.push(...packRun('mazes', { level, per: '1', theme: 'mix' }, paper, seed).sheets.map(badge));
  pages.push(...packRun('dots', { dots: age <= 4 ? '20' : '30', count: '1', puzzles: '1', layout: 'one' }, paper, seed + 1).sheets.map(badge));
  pages.push(...packRun('spotdiff', { level }, paper, seed + 2).sheets.map(badge));
  pages.push(...packRun('rolldraw', { theme: 'monster', name }, paper, seed + 3).sheets.map(badge));
  if (age >= 5) pages.push(...packRun('wordsearch', { words: 'CLUB, STAR, FUN, PLAY, DRAW, READ', size: '8', level: 'easy', title: 'Club word search' }, paper, seed + 4).sheets.map(badge));
  pages.push(seriesCert(paper, 'PRINTPALS KIDS CLUB', 'Club Member', name, 'for joining the PrintPals Kids Club!', "Look out for next month's free pack!", ring));
  return pages;
}

Object.assign(MAKERS, { kidsclub: makeKidsClub });
