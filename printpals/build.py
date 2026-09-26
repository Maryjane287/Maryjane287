#!/usr/bin/env python3
"""Builds the PrintPals pages (home + one page per worksheet maker) into public/.

Run: python3 printpals/build.py
"""
import html
import json
import os

SITE = 'https://printpals.web.app'
OUT = os.path.join(os.path.dirname(__file__), 'public')
VERSION = '1'

LOGO = '''<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a7a"/><stop offset="1" stop-color="#ff6b9e"/></linearGradient></defs>
<rect x="2" y="2" width="44" height="44" rx="13" fill="url(#lg)"/><rect x="12" y="9" width="24" height="30" rx="4" fill="#fff"/>
<circle cx="19.5" cy="20" r="2" fill="#2d2350"/><circle cx="28.5" cy="20" r="2" fill="#2d2350"/><path d="M18.5 27 Q24 32 29.5 27" fill="none" stroke="#2d2350" stroke-width="2.4" stroke-linecap="round"/>
<path d="M31 38 L41 28 L44 31 L34 41 L30 42 Z" fill="#ffc93c" stroke="#2d2350" stroke-width="1.6" stroke-linejoin="round"/></svg>'''

PRINT_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10v4H7zM5 8h14a3 3 0 0 1 3 3v6h-4v4H6v-4H2v-6a3 3 0 0 1 3-3zm3 8v3h8v-3zm10-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'


def seg(name, options, checked):
    out = '<div class="seg">'
    for value, label in options:
        c = ' checked' if value == checked else ''
        out += f'<label><input type="radio" name="{name}" value="{value}"{c}><span>{label}</span></label>'
    return out + '</div>'


def field(label, inner, small=''):
    s = f'<small>{small}</small>' if small else ''
    return f'<div class="field"><span class="label">{label}</span>{inner}{s}</div>'


def check(name, label, on=True):
    c = ' checked' if on else ''
    return f'<label class="check"><input type="checkbox" name="{name}"{c}> {label}</label>'


PAPER = field('Paper size', '<select name="paper" aria-label="Paper size"><option value="a4">A4 (UK, Europe, Africa, Asia)</option><option value="letter">US Letter (USA, Canada)</option></select>')
SIZE = field('Letter size', seg('size', [('large', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'large'), 'Big is best for ages 3 to 5.')
DOTS = check('dots', 'Show where to start (green dots)')
SHUFFLE = '<button type="button" class="btn alt" data-action="shuffle">🔀 Make a new set</button>'

TOOLS = [
    {
        'id': 'names', 'slug': 'name-tracing-worksheets', 'tint': '#fff1f1', 'icon': '✏️',
        'nav': 'Name tracing',
        'title': 'Free Name Tracing Worksheets | Printable & Personalised | PrintPals',
        'desc': 'Make free personalised name tracing worksheets in seconds. Type any name, choose the size and print or save as PDF. Great for preschool and kindergarten.',
        'h1': 'Name tracing worksheets',
        'lead': 'Type your child\'s name and get a free personalised tracing sheet, with dotted letters and green start dots showing where each letter begins. Add a whole class list for one page per child.',
        'card': 'Type any name and get a personalised tracing sheet in seconds. Add a whole class at once.',
        'form': field('Name (or names)', '<textarea name="names" rows="3" spellcheck="false">Emma</textarea>', 'For a class, put each name on a new line or separate them with commas. You get one page per child.')
        + field('Letters', seg('case', [('title', 'Emma'), ('upper', 'EMMA'), ('lower', 'emma'), ('as', 'As typed')], 'title'))
        + SIZE + DOTS + check('practice', 'Leave empty lines to write alone') + PAPER,
        'article': '''
<h2>How to make a name tracing worksheet</h2>
<ul><li>Type your child's first name in the box. The worksheet updates straight away.</li>
<li>Choose capital letters, small letters or a capital first letter (the way most schools teach names).</li>
<li>Pick <b>Big</b> letters for 3 to 5 year olds, or <b>Medium</b> and <b>Small</b> as their writing gets steadier.</li>
<li>Tap <b>Print or save as PDF</b>. On a phone, choose "Save as PDF" in the print screen to keep it or send it.</li></ul>
<h2>Why children love tracing their own name</h2>
<p>A name is the first word most children want to write. It is theirs, so they care about it. Tracing it again and again builds the small hand muscles and the letter shapes they need for all other writing. The first row shows the name in solid letters with green start dots, the next rows are dotted to trace, and the last lines are empty so your child can try on their own and feel proud.</p>
<h2>Tips for teachers and parents</h2>
<ul><li>Laminate the sheet or slip it into a plastic sleeve and use a whiteboard pen, so it can be used every day.</li>
<li>Put the whole class list in the box to print one sheet per child in one go.</li>
<li>Talk about each letter while tracing: "E starts at the top, down, then three lines across."</li></ul>''',
        'faq': [
            ('Are these name tracing worksheets really free?', 'Yes. Every worksheet on PrintPals is free to make, print and share, with no sign up.'),
            ('Can I make sheets for a whole class?', 'Yes. Type each name on a new line (or separate them with commas) and you get one page per child, ready to print together.'),
            ('Do you keep the names I type?', 'No. Your worksheet is made inside your own browser. Names are never sent to us or stored anywhere.'),
            ('What handwriting style do the letters use?', 'Simple print letters, the way most schools in the UK, USA, Africa and Asia teach young children to write, with a single-storey a and g.'),
        ],
    },
    {
        'id': 'letters', 'slug': 'alphabet-tracing-worksheets', 'tint': '#fff8e6', 'icon': '🔤',
        'nav': 'Alphabet',
        'title': 'Free Alphabet Tracing Worksheets A to Z | Printable PDF | PrintPals',
        'desc': 'Free printable alphabet tracing worksheets for every letter A to Z, with capital and small letters, stroke order and a picture word. Print one letter or the whole alphabet.',
        'h1': 'Alphabet tracing worksheets',
        'lead': 'One page for every letter, with capital and small letters, numbered stroke order, a picture to learn the sound, and plenty of rows to trace. Print a single letter or the whole alphabet A to Z.',
        'card': 'Every letter A to Z with stroke order, a picture word and rows to trace.',
        'form': field('Letter', '<select name="letter">' + ''.join(f'<option value="{c}">{c} {c.lower()}</option>' for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') + '<option value="all">The whole alphabet (26 pages)</option></select>')
        + field('Tracing size', seg('size', [('large', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'medium'))
        + DOTS + PAPER,
        'article': '''
<h2>What is on each alphabet worksheet</h2>
<ul><li>The capital and small letter in large print, with a green start dot and numbers showing the order of each stroke.</li>
<li>A picture word so children link the letter to its sound: A is for Apple, B is for Balloon, C is for Cat.</li>
<li>Rows of dotted capitals, small letters, the pair together and the picture word to trace.</li>
<li>An empty row to write the letter all alone.</li></ul>
<h2>Teaching tips</h2>
<p>Say the letter's sound, not just its name, while your child traces: "a, a, apple". Start every letter at the green dot and follow the numbers. Good habits with where to start make joined handwriting much easier later. One letter a day, or one a week alongside phonics lessons, works well.</p>
<p>Printing the whole alphabet gives you a 26 page workbook. Staple it together or put it in a folder, and let your child colour the picture when a page is finished.</p>''',
        'faq': [
            ('Can I print the whole alphabet at once?', 'Yes. Choose "The whole alphabet" in the letter box to get all 26 pages in one print, or save them as a single PDF.'),
            ('Why are there numbers on the letters?', 'They show the stroke order: where to start each line and which comes next. Learning the right order early makes writing faster and neater.'),
            ('What age are these for?', 'Most children enjoy them from about age 3 to 6, in nursery, preschool, reception and kindergarten.'),
        ],
    },
    {
        'id': 'numbers', 'slug': 'number-tracing-worksheets', 'tint': '#eef9ff', 'icon': '🔢',
        'nav': 'Numbers',
        'title': 'Free Number Tracing Worksheets 0 to 20 | Printable | PrintPals',
        'desc': 'Free printable number tracing worksheets from 0 to 20 with ten frames, number words and counting. Great for preschool and kindergarten maths.',
        'h1': 'Number tracing worksheets',
        'lead': 'Trace, count and write numbers 0 to 20. Each page has the number with stroke order, a ten frame that shows how many, the number word to trace, and stars to colour.',
        'card': 'Numbers 0 to 20 with ten frames, number words and stars to colour.',
        'form': '<div class="row2">' + field('From', '<select name="from">' + ''.join(f'<option value="{n}"{" selected" if n == 1 else ""}>{n}</option>' for n in range(21)) + '</select>')
        + field('To', '<select name="to">' + ''.join(f'<option value="{n}"{" selected" if n == 5 else ""}>{n}</option>' for n in range(21)) + '</select>') + '</div>'
        + field('Tracing size', seg('size', [('large', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'medium'))
        + DOTS + PAPER,
        'article': '''
<h2>Counting, tracing and writing in one page</h2>
<p>Children understand a number best when they see it, count it and write it. Every page shows the number in large print with a green start dot, a ten frame with the right number of dots, the number word (like "seven") to trace, rows of the number to trace and a row to write it alone. At the bottom, children colour the right number of stars.</p>
<h2>Ideas for using these sheets</h2>
<ul><li>Print 1 to 10 as a little counting book, one page a day.</li>
<li>Count real things together first: 7 raisins, 7 toy cars, 7 jumps. Then trace the 7.</li>
<li>For older children, print 11 to 20. The two ten frames show clearly how teen numbers are "ten and some more".</li></ul>''',
        'faq': [
            ('Which numbers can I print?', 'Any number from 0 to 20. Choose where to start and where to finish, and you get one page for each number.'),
            ('What is a ten frame?', 'It is a box of 10 squares used in schools to show numbers. Children can see at a glance how many there are and how many more make 10.'),
        ],
    },
    {
        'id': 'maths', 'slug': 'addition-subtraction-worksheets', 'tint': '#effaf6', 'icon': '➕',
        'nav': 'Maths',
        'title': 'Free Addition and Subtraction Worksheets with Answers | PrintPals',
        'desc': 'Make free printable addition and subtraction worksheets with answer keys. Numbers within 5, 10, 20 or 100, with or without pictures. A new set every click.',
        'h1': 'Addition and subtraction worksheets',
        'lead': 'Make a new maths sheet in one click, with the answers on a separate page for grown-ups. Choose adding, taking away or both, how big the numbers are, and add dots to count for little ones.',
        'card': 'Adding and taking away, within 5, 10, 20 or 100, with answer keys. New sums every click.',
        'form': field('Type of sums', seg('op', [('add', 'Adding +'), ('sub', 'Taking away −'), ('mix', 'Both')], 'add'))
        + field('Numbers up to', seg('within', [('5', '5'), ('10', '10'), ('20', '20'), ('100', '100')], '10'))
        + field('How many sums', seg('count', [('10', '10'), ('20', '20'), ('40', '40')], '20'))
        + field('Layout', seg('layout', [('horizontal', '3 + 4 = ▢'), ('vertical', 'In columns')], 'horizontal'))
        + check('pictures', 'Add dots to count (numbers up to 10)', False) + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': '''
<h2>A fresh maths sheet every time</h2>
<p>Tap <b>Make a new set</b> and you get brand new sums, so there is always something new to practise. Taking away never goes below zero, and every sheet comes with an answer page so marking takes seconds.</p>
<h2>Which settings to choose</h2>
<ul><li><b>Up to 5</b> with dots: first sums for ages 4 to 5.</li>
<li><b>Up to 10</b>: number bonds and quick facts, ages 5 to 6.</li>
<li><b>Up to 20</b>: bridging through ten, ages 6 to 7.</li>
<li><b>Up to 100</b> in columns: two digit sums, ages 7 to 8.</li></ul>
<p>Short and often works best: 10 sums a day beats 100 sums once a week.</p>''',
        'faq': [
            ('Do the worksheets include answers?', 'Yes. The last page is an answer key for grown-ups. You can switch it off if you only want the sums.'),
            ('Will I get the same sums every time?', 'No. Every time you open the page or tap "Make a new set", you get a new set of sums.'),
            ('Can I make taking away worksheets only?', 'Yes. Choose "Taking away" to get only subtraction, or "Both" for a mix.'),
        ],
    },
    {
        'id': 'wordsearch', 'slug': 'word-search-maker', 'tint': '#f4f0ff', 'icon': '🔍',
        'nav': 'Word search',
        'title': 'Free Word Search Maker | Make Printable Word Searches with Answers | PrintPals',
        'desc': 'Make your own word search puzzle for free. Type your words, choose the size and difficulty, and print with an answer key. Perfect for spelling lists, classrooms and parties.',
        'h1': 'Word search maker',
        'lead': 'Type your own words and get a printable word search in seconds, with an answer key. Great for spelling lists, topic words, birthday parties and rainy days.',
        'card': 'Type your own words and get a word search with an answer key in seconds.',
        'form': field('Title', '<input type="text" name="title" value="Animal Word Search" maxlength="40">')
        + field('Your words', '<textarea name="words" rows="5" spellcheck="false">lion, tiger, zebra, monkey, giraffe, panda, rabbit, horse</textarea>', 'Up to 20 words, separated by commas or new lines.')
        + field('Grid size', seg('size', [('8', '8 × 8'), ('10', '10 × 10'), ('12', '12 × 12'), ('15', '15 × 15')], '10'))
        + field('Difficulty', seg('level', [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], 'easy'), 'Easy: across and down. Medium: adds diagonals. Hard: words can also go backwards.')
        + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': '''
<h2>How to make a word search</h2>
<ul><li>Give your puzzle a title, then type your words.</li>
<li>Choose a grid size. Longer words need bigger grids.</li>
<li>Pick the difficulty. Easy is perfect for early readers. Hard hides words backwards and on diagonals.</li>
<li>Print it, or save it as a PDF to share with your class or family.</li></ul>
<h2>Ideas</h2>
<p>Use this week's spelling list, topic words (space, dinosaurs, the human body), everyone's names for a birthday party, or new words in another language. Word searches help children look closely at the order of letters, which supports spelling and reading.</p>''',
        'faq': [
            ('Is the word search maker free?', 'Yes, completely free, with no sign up and no limit on how many puzzles you make.'),
            ('Can I get the answers?', 'Yes. Every puzzle comes with an answer page where each word is highlighted.'),
            ('Why did some words not fit?', 'A word must be shorter than the grid. If the grid is too crowded, try a bigger grid or fewer words.'),
        ],
    },
    {
        'id': 'spelling', 'slug': 'spelling-practice-worksheets', 'tint': '#fff0f7', 'icon': '📝',
        'nav': 'Spelling',
        'title': 'Free Spelling Practice Worksheets | Trace and Write Your Word List | PrintPals',
        'desc': 'Turn any spelling list into a free printable handwriting worksheet. Each word is shown, traced and written alone. Great for weekly spelling tests and sight words.',
        'h1': 'Spelling practice worksheets',
        'lead': 'Type this week\'s spelling words and get a handwriting sheet where each word is shown, traced and then written alone. Perfect for spelling tests, sight words and new vocabulary.',
        'card': 'Turn any spelling list into a look, trace and write sheet.',
        'form': field('Title', '<input type="text" name="title" value="My spelling words" maxlength="40">')
        + field('Spelling words', '<textarea name="words" rows="5" spellcheck="false">friend, because, school, happy, said, little</textarea>', 'Separate words with commas or new lines. Short phrases work too.')
        + field('Letters', seg('case', [('as', 'As typed'), ('lower', 'small'), ('title', 'Capital first')], 'as'))
        + field('Letter size', seg('size', [('large', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'medium'))
        + DOTS + PAPER,
        'article': '''
<h2>Look, trace, write</h2>
<p>This is the method many teachers use for spelling. First your child looks at the word in solid letters, then traces it along the dots, then writes it alone on the empty line. Saying the letters out loud while writing helps the spelling stick.</p>
<h2>Tips for spelling week</h2>
<ul><li>Do a few words a day instead of all of them at once.</li>
<li>Cover the word and see if your child can write it from memory on a spare line.</li>
<li>Use the word search maker with the same list for a fun Friday review.</li></ul>''',
        'faq': [
            ('How many words can I add?', 'Up to 40 words. Pages are added automatically as needed.'),
            ('Can I use sentences?', 'Short phrases work well. Long sentences are made smaller to fit the line.'),
        ],
    },
]


def head(title, desc, path, extra=''):
    url = SITE + path
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ff6b6b">
<link rel="icon" href="/img/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css?v={VERSION}">
{extra}
</head>'''


def top(active=''):
    cur = ' aria-current="page"'
    nav = ''.join(
        f'<a href="/{t["slug"]}"{cur if t["id"] == active else ""}>{t["nav"]}</a>' for t in TOOLS)
    return f'''<header class="top"><div class="wrap"><a class="brand" href="/">{LOGO}<span>Print<b>Pals</b></span></a><nav class="nav">{nav}</nav></div></header>'''


FOOT = '''<footer><div class="wrap"><div><div class="brand" style="font-size:24px;color:#fff">Print<b style="color:#ff8a8a">Pals</b></div>
<p style="max-width:420px;margin-top:8px">Free printable worksheets for children, made in seconds. Everything is made inside your own browser: nothing you type is sent to us or stored.</p></div>
<div><p><b style="color:#fff">Worksheets</b></p><p>''' + ''.join(f'<a href="/{t["slug"]}">{t["nav"]}</a>' for t in TOOLS) + '''</p>
<p style="margin-top:14px">© PrintPals. Free for home and classroom use.</p></div></div></footer>'''


def tool_page(t):
    faq_html = ''.join(f'<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in t['faq'])
    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'WebApplication', 'name': t['h1'] + ' | PrintPals', 'url': f'{SITE}/{t["slug"]}', 'applicationCategory': 'EducationalApplication',
             'operatingSystem': 'Any', 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'}, 'description': t['desc']},
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in t['faq']]},
        ],
    }
    others = ''.join(f'<a href="/{o["slug"]}">{o["icon"]} {o["h1"]}</a>' for o in TOOLS if o is not t)
    return head(t['title'], t['desc'], '/' + t['slug'], f'<style id="pageStyle">@page {{ size: A4 portrait; margin: 0; }}</style>\n<script type="application/ld+json">{json.dumps(ld)}</script>') + f'''
<body class="tool-page">
{top(t['id'])}
<main>
<div class="wrap">
<div class="crumbs"><a href="/">PrintPals</a> › {html.escape(t['h1'])}</div>
<div class="tool-head"><h1>{html.escape(t['h1'])}</h1><p>{html.escape(t['lead'])}</p><a class="jump" href="#preview">See your worksheet ↓</a></div>
<div class="maker">
<form class="panel" id="maker" data-tool="{t['id']}" autocomplete="off">
{t['form']}
<button type="button" class="btn" data-action="print">{PRINT_ICON} Print or save as PDF</button>
<p class="hint">Free. No sign up. Nothing you type leaves your device.</p>
</form>
<section aria-label="Worksheet preview"><div class="preview-head"><span>Preview</span><span id="pageCount"></span></div><div id="preview"></div></section>
</div>
<article class="article">
{t['article']}
<h2>Questions parents and teachers ask</h2>
{faq_html}
<h2>More free worksheets</h2>
<div class="more">{others}</div>
</article>
</div>
</main>
<div class="mobile-print no-print"><button type="button" class="btn" data-action="print">{PRINT_ICON} Print or save as PDF</button></div>
{FOOT}
<script src="/js/glyphs.js?v={VERSION}"></script>
<script src="/js/sheet.js?v={VERSION}"></script>
<script src="/js/tools.js?v={VERSION}"></script>
<script src="/js/app.js?v={VERSION}"></script>
</body>
</html>
'''


def home():
    cards = ''.join(f'''<a class="tool" href="/{t['slug']}" style="--tint:{t['tint']}"><div class="thumb"><img src="/img/thumb-{t['id']}.webp" alt="{html.escape(t['h1'])} example" loading="lazy" width="400" height="566"></div>
<h3>{t['icon']} {html.escape(t['h1'])}</h3><p>{html.escape(t['card'])}</p><span class="go">Make one free →</span></a>''' for t in TOOLS)
    ld = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'PrintPals', 'url': SITE + '/',
          'description': 'Free printable worksheets for children: name tracing, alphabet, numbers, maths, word searches and spelling.'}
    shapes = ''.join(f'<span style="width:{s}px;height:{s}px;left:{x}%;top:{y}%;background:{c};animation-delay:{d}s"></span>'
                     for s, x, y, c, d in [(90, 6, 18, '#ffe08a', 0), (60, 88, 12, '#bfe8ff', 1.5), (46, 80, 70, '#ffc6d9', 3), (70, 12, 72, '#c9f2e6', 4.5)])
    return head('PrintPals | Free Printable Worksheets for Kids, Made in Seconds',
                'Free printable worksheets for kids: name tracing, alphabet and number tracing, addition and subtraction, word searches and spelling practice. Personalise, print or save as PDF.',
                '/', f'<script type="application/ld+json">{json.dumps(ld)}</script>') + f'''
<body>
{top()}
<main>
<section class="hero"><div class="shapes" aria-hidden="true">{shapes}</div><div class="wrap" style="position:relative">
<h1>Free printable worksheets,<br><span class="hl">made in seconds</span></h1>
<p class="lead">Personalised tracing, maths, word searches and spelling sheets for children aged 3 to 8. Type, tap print, done.</p>
<div class="chips"><span class="chip">✓ 100% free</span><span class="chip">✓ No sign up</span><span class="chip">✓ A4 and US Letter</span><span class="chip">✓ Save as PDF</span></div>
</div></section>
<div class="wrap"><div class="tools">{cards}</div></div>
<section class="band"><div class="wrap">
<h2>Made for busy parents and teachers</h2>
<div class="why">
<div><span>✏️</span><b>Real handwriting</b>Every letter is drawn the way children are taught, with green start dots and stroke order.</div>
<div><span>⚡</span><b>Ready in seconds</b>Type a name or a word list and the worksheet appears instantly. Tap print, or save it as a PDF.</div>
<div><span>🎒</span><b>Whole class at once</b>Add every child's name and print one personalised sheet each, in one go.</div>
<div><span>🔒</span><b>Private by design</b>Worksheets are made on your own device. Nothing you type is sent to us or stored.</div>
</div></div></section>
<div class="wrap article" style="margin:0 auto">
<h2>Free worksheets for home and school</h2>
<p>PrintPals makes printable worksheets for early learners in nursery, preschool, kindergarten, reception and the first years of primary school. Make a name tracing sheet for a child who is just learning to write their name, print the whole alphabet with pictures and stroke order, practise numbers 0 to 20 with ten frames, or make a fresh page of addition and subtraction with an answer key. Teachers can turn the weekly spelling list into a handwriting sheet and a word search in under a minute.</p>
<p>Every worksheet is free for home and classroom use. Print as many as you like.</p>
</div>
</main>
{FOOT}
</body>
</html>
'''


def main():
    with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(home())
    for t in TOOLS:
        with open(os.path.join(OUT, t['slug'] + '.html'), 'w', encoding='utf-8') as f:
            f.write(tool_page(t))
    urls = ['/'] + ['/' + t['slug'] for t in TOOLS]
    with open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + ''.join(f'  <url><loc>{SITE}{u}</loc></url>\n' for u in urls) + '</urlset>\n')
    with open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
    with open(os.path.join(OUT, 'img', 'logo.svg'), 'w', encoding='utf-8') as f:
        f.write(LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))
    print('built', len(urls), 'pages')


if __name__ == '__main__':
    main()
