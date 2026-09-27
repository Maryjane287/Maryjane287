import json, csv, re, datetime, sys
tools = {t['id']: t for t in json.load(open('tools.json'))}
SITE = 'https://printpals.web.app'
BOARDS = {
 'packs': 'Homeschool Plans and Learning Packs',
 'handwriting': 'Handwriting and Tracing Worksheets',
 'reading': 'Phonics and Reading Worksheets',
 'maths': 'Math Worksheets for Kids',
 'puzzles': 'Screen Free Activities and Printable Games',
 'crafts': 'Kids Crafts and Coloring Pages',
 'charts': 'Printable Charts for Kids',
 'world': 'Positive Parenting Printables',
}
BASE = ['free printables for kids', 'educational activities for kids', 'printable worksheets', 'homeschool', 'learning at home']
CATKW = {
 'packs': ['homeschool planner', 'preschool curriculum', 'kindergarten homeschool', 'toddler learning activities', 'learning activities for kids'],
 'handwriting': ['handwriting practice', 'tracing worksheets', 'preschool worksheets', 'fine motor skills', 'kindergarten worksheets'],
 'reading': ['phonics activities', 'kindergarten reading', 'sight words', 'literacy activities', 'first grade reading'],
 'maths': ['math worksheets', 'kindergarten math', 'first grade math', 'math activities for kids', 'maths worksheets'],
 'puzzles': ['screen free activities', 'printable games for kids', 'quiet time activities', 'rainy day activities', 'brain games for kids'],
 'crafts': ['art and craft activities', 'coloring pages for kids', 'kids crafts', 'crafts for kids', 'birthday party ideas'],
 'charts': ['routine chart for kids', 'positive discipline', 'chore chart', 'reward chart', 'parenting tips'],
 'world': ['screen free activities', 'family traditions ideas', 'social emotional learning', 'positive parenting', 'montessori at home'],
}
US = [('Colouring', 'Coloring'), ('colouring', 'coloring'), ('Colour', 'Color'), ('colour', 'color'), ('Maths', 'Math'), ('maths', 'math'), ('Personalised', 'Personalized'), ('personalised', 'personalized')]
def us(s):
    for a, b in US: s = s.replace(a, b)
    return s
def title(t):
    s = re.sub(r'\s*\|\s*PrintPals\s*$', '', t['title'])
    parts = [p.strip() for p in s.split('|')]
    s = parts[0] + (': ' + ', '.join(parts[1:]) if len(parts) > 1 else '')
    if t['plus']: s = re.sub(r'^Free (Printable )?', 'Printable ', s)
    if len(s) > 100: s = s[:100].rsplit(' ', 1)[0].rstrip(',:')
    return s
def desc(t):
    d = t['desc'].rstrip('.') + '.'
    if t['plus']: d = re.sub(r'\bA free printable\b', 'A printable', d).replace('Free printable', 'Printable')
    tail = (f" Part of PrintPals Plus: try it free for 7 days, no card needed. {t['ages']}." if t['plus']
            else f" Free to print, no sign up, ready in seconds. {t['ages']}. A4 and US Letter.")
    s = d + tail + ' Tap to make yours at PrintPals.'
    return s[:500]
def keywords(t):
    first = re.sub(r'^Free (Printable )?', '', re.split(r'\s*\|\s*', t['title'])[0]).strip().lower()
    base = [('printables for kids' if t['plus'] and k.startswith('free ') else k) for k in BASE]
    kw = [first, us(first)] + CATKW[t['cat']] + base
    seen, out = set(), []
    for k in kw:
        if k and k not in seen: seen.add(k); out.append(k)
    return ', '.join(out[:10])
# Order: trending and flagship first, then the rest interleaved by category.
PRIORITY = ['pack', 'coding', 'papergames', 'calmkit', 'names', 'countdown', 'colouring', 'routine', 'maths', 'letters', 'science', 'hunt', 'reward',
 'comprehension', 'storybook', 'sleep', 'familyrules', 'sight', 'invites', 'tenframes', 'scissors', 'potty', 'teeth', 'chores', 'cvc', 'mazes', 'dots',
 'quickpack', 'faraway', 'feelings', 'socialstory', 'activitybook', 'monthplan', 'holidayplan', 'prewriting', 'wordsearch', 'party', 'coupons', 'talkcards',
 'screentime', 'sequencing', 'diary', 'petcare', 'packing', 'mealplan', 'habits', 'gratitude', 'factfile', 'savings', 'mathsminute', 'schoolready']
rest = [i for i in tools if i not in PRIORITY]
cats = {}
for i in rest: cats.setdefault(tools[i]['cat'], []).append(i)
while any(cats.values()):
    for c in list(cats):
        if cats[c]: PRIORITY.append(cats[c].pop(0))
assert len(PRIORITY) == len(tools) == len(set(PRIORITY))
def write(ids, start, per_day, fn):
    times = ['13:00', '15:30', '18:00', '20:30', '23:00', '14:45', '21:45'][:per_day]
    with open(fn, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'])
        for n, i in enumerate(ids):
            t = tools[i]; day = start + datetime.timedelta(days=n // per_day)
            w.writerow([title(t), f"{SITE}/pins/{i}.jpg", BOARDS[t['cat']], '', desc(t), f"{SITE}/{t['slug']}", f"{day.isoformat()}T{times[n % per_day]}:00", keywords(t)])
    return start + datetime.timedelta(days=(len(ids) - 1) // per_day)
start = datetime.date.fromisoformat(sys.argv[1]); which = sys.argv[2]
ids = PRIORITY[:65] if which == '1' else PRIORITY[65:]
end = write(ids, start, 5, sys.argv[3])
print(which, len(ids), 'pins', start, '->', end)
