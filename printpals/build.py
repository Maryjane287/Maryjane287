import urllib.parse
#!/usr/bin/env python3
"""Builds the PrintPals pages (home + one page per worksheet maker) into public/.

Run: python3 printpals/build.py
"""
import datetime
import html
import re
import json
import os
from usenglish import us_text, us_js, us_html, us_fix_js

SITE = 'https://printpals.web.app'
OUT = os.path.join(os.path.dirname(__file__), 'public')
VERSION = '59'

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
        'id': 'names', 'cat': 'writing', 'slug': 'name-tracing-worksheets', 'tint': '#fff1f1', 'icon': '✏️',
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
<li>Talk about each letter while tracing: "E starts at the top and goes down, then three lines go across."</li></ul>''',
        'faq': [
            ('Are these name tracing worksheets really free?', 'Yes. Every worksheet on PrintPals is free to make, print and share, with no sign up.'),
            ('Can I make sheets for a whole class?', 'Yes. Type each name on a new line (or separate them with commas) and you get one page per child, ready to print together.'),
            ('Do you keep the names I type?', 'No. Your worksheet is made inside your own browser. Names are never sent to us or stored anywhere.'),
            ('What handwriting style do the letters use?', 'Simple print letters, the way most schools in the UK, USA, Africa and Asia teach young children to write, with a single-storey a and g.'),
        ],
    },
    {
        'id': 'letters', 'cat': 'writing', 'slug': 'alphabet-tracing-worksheets', 'tint': '#fff8e6', 'icon': '🔤',
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
        'id': 'numbers', 'cat': 'maths', 'slug': 'number-tracing-worksheets', 'tint': '#eef9ff', 'icon': '🔢',
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
        'id': 'maths', 'cat': 'maths', 'slug': 'addition-subtraction-worksheets', 'tint': '#effaf6', 'icon': '➕',
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
        'id': 'wordsearch', 'cat': 'puzzles', 'slug': 'word-search-maker', 'tint': '#f4f0ff', 'icon': '🔍',
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
            ('Why did some words not fit?', 'Each word must fit inside the grid. If the grid is too crowded, try a bigger grid or fewer words.'),
        ],
    },
    {
        'id': 'spelling', 'cat': 'writing', 'slug': 'spelling-practice-worksheets', 'tint': '#fff0f7', 'icon': '📝',
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

TOOLS += [
    {
        'id': 'routine', 'cat': 'charts', 'slug': 'visual-routine-chart', 'tint': '#eef2ff', 'icon': '🌅',
        'nav': 'Routine charts',
        'title': 'Free Visual Routine Chart Maker for Kids | Morning & Bedtime | PrintPals',
        'desc': 'Make a free printable visual routine chart for your child: morning, bedtime or after school, with pictures for every step. Weekly tick chart or cut-out picture cards. Great for autistic children and children with ADHD.',
        'h1': 'Visual routine charts',
        'lead': 'Pictures make routines easy, even for children who cannot read yet. Choose a morning, bedtime or after school routine, change any step, and print a weekly tick chart or big picture cards to cut out.',
        'card': 'Morning, bedtime and after school routines with pictures. Great for little ones, and for autistic children and children with ADHD.',
        'form': field("Child's name", '<input type="text" name="name" value="Mia" maxlength="30">')
        + field('Routine', '<select name="routine"><option value="morning">Morning</option><option value="bedtime">Bedtime</option><option value="school">After school</option><option value="weekend">Weekend</option><option value="custom">My own routine</option></select>')
        + field('Steps', '<textarea name="steps" rows="8" spellcheck="false"></textarea>', 'One step per line. Pictures are added for you, or start a line with your own emoji.')
        + field('Style', seg('layout', [('week', 'Weekly tick chart'), ('cards', 'Picture cards to cut out')], 'week'))
        + field('Days', seg('week', [('all', 'Every day'), ('school', 'School days')], 'all'))
        + PAPER,
        'article': """
<h2>Why visual routines work</h2>
<p>Young children cannot hold a list of steps in their heads, and many cannot read yet. A picture for each step lets them see what comes next and do it themselves, which means fewer reminders, fewer battles and a proud child. Visual schedules are used every day in nurseries and by occupational therapists, and they are especially helpful for autistic children and children with ADHD, who find changes and transitions hard.</p>
<h2>Two ways to use it</h2>
<ul><li><b>Weekly tick chart:</b> stick it on the fridge. Your child ticks or adds a sticker for each step, every day.</li>
<li><b>Picture cards:</b> cut them out, laminate them, and stick them in order with sticky tack or Velcro. Your child can move each card to a "done" pocket.</li></ul>
<h2>Tips</h2>
<ul><li>Keep it short: 5 to 8 steps is plenty.</li><li>Walk through it together the first few days and praise every step.</li><li>Use the same words every day ("teeth, pyjamas, story").</li></ul>""",
        'faq': [
            ('Can I change the steps?', 'Yes. Edit the list any way you like. A picture is chosen for each step automatically, or you can start a line with your own emoji.'),
            ('Is this suitable for autistic children?', 'Visual routines are one of the most recommended supports for autistic children and children with ADHD. Always follow any advice from your child\'s own therapist or teacher.'),
            ('Can I make routines for school days only?', 'Yes. Choose "School days" to show Monday to Friday only.'),
        ],
    },
    {
        'id': 'money', 'cat': 'maths', 'slug': 'money-worksheets', 'tint': '#fff6e0', 'icon': '🪙',
        'nav': 'Money',
        'title': 'Free Money Worksheets in Your Currency | Pounds, Dollars, Euros, Naira & More | PrintPals',
        'desc': 'Free printable counting money worksheets in your own currency: pounds, US dollars, euros, naira, cedis, shillings, rand, rupees and more. Count coins, make amounts, can I buy it. With answers.',
        'h1': 'Money worksheets in your currency',
        'lead': 'Most money worksheets only use US dollars. Here your child learns with the money they really see: pounds, dollars, euros, naira, cedis, shillings, rand, rupees and more. Count it, make amounts and go shopping.',
        'card': 'Count coins and notes in pounds, dollars, euros, naira, cedis, rand and more.',
        'form': field('Currency', '<select name="currency"><option value="GBP">Pounds £ (UK)</option><option value="USD">US dollars $</option><option value="EUR">Euros €</option><option value="NGN">Naira ₦ (Nigeria)</option><option value="GHS">Cedis GH₵ (Ghana)</option><option value="KES">Shillings KSh (Kenya)</option><option value="ZAR">Rand R (South Africa)</option><option value="CAD">Canadian dollars $</option><option value="AUD">Australian dollars $</option><option value="INR">Rupees ₹ (India)</option></select>')
        + field('Activity', seg('kind', [('count', 'Count it'), ('buy', 'Can I buy it?'), ('make', 'Make the amount'), ('mix', 'Mix')], 'count'))
        + field('Level', seg('level', [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Harder')], 'easy'), 'Easy uses small coins. Harder adds notes and bigger amounts.')
        + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>Learning money with the money they know</h2>
<p>Children learn money best with the coins and notes they see in shops at home. That is why you can choose your own currency here. The coins and notes are friendly drawings with the value written on them, so children focus on adding up.</p>
<h2>Three activities</h2>
<ul><li><b>Count it:</b> add up the coins and notes and write the total.</li>
<li><b>Can I buy it?</b> Compare the money with a price tag and circle yes or no.</li>
<li><b>Make the amount:</b> circle the coins that make a given amount.</li></ul>
<p>Play shop at home with real coins after the worksheet. It makes the learning stick.</p>""",
        'faq': [
            ('Which currencies can I use?', 'British pounds, US dollars, euros, Nigerian naira, Ghana cedis, Kenyan shillings, South African rand, Canadian dollars, Australian dollars and Indian rupees.'),
            ('Are these pictures of real money?', 'No. They are simple, friendly drawings with the value on them, designed to be clear for children.'),
        ],
    },
    {
        'id': 'wordproblems', 'cat': 'maths', 'slug': 'maths-word-problems', 'tint': '#fff0f7', 'icon': '📖',
        'nav': 'Story sums',
        'title': 'Free Personalised Maths Word Problems for Kids | Story Sums | PrintPals',
        'desc': 'Make free printable maths word problems starring your child and their friends. Adding, taking away and groups, with pictures and answer keys. Great for ages 5 to 8.',
        'h1': 'Personalised maths word problems',
        'lead': 'Children love maths stories about themselves. Type your child\'s name and their friends, and every sum becomes a little story starring them, with pictures to count for younger children.',
        'card': 'Story sums starring your child and their friends, with pictures and answers.',
        'form': field('Names in the stories', '<textarea name="names" rows="2" spellcheck="false">Mia, Leo, Grandma, Sam</textarea>', 'Your child, friends, family or pets. Separate with commas.')
        + field('Type', seg('op', [('add', 'Adding'), ('sub', 'Taking away'), ('mix', 'Both'), ('mult', 'Groups (×)')], 'add'))
        + field('Numbers up to', seg('within', [('5', '5'), ('10', '10'), ('20', '20'), ('50', '50')], '10'))
        + field('Theme', seg('theme', [('mix', 'Mix'), ('fruit', 'Fruit'), ('toys', 'Toys'), ('treats', 'Treats'), ('nature', 'Nature'), ('school', 'School')], 'mix'))
        + field('How many', seg('count', [('6', '6'), ('12', '12')], '6'))
        + check('pictures', 'Add pictures to count') + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>Why story sums matter</h2>
<p>Word problems teach children when to add and when to take away, not just how. They are also where many children get stuck, because the maths is hidden inside words. Putting your child and the people they love into the story makes them want to read it, and pictures help younger ones count it out.</p>
<h2>Tips</h2>
<ul><li>Read the story aloud together, then ask "Will there be more or fewer at the end?"</li><li>Act it out with real toys or snacks.</li><li>Encourage a quick drawing before the answer.</li></ul>""",
        'faq': [
            ('Can I use my child\'s name?', 'Yes, that is the idea. Add your child, their friends, family members or even pets, and they will star in the stories.'),
            ('Do you store the names?', 'No. Everything is made inside your browser and nothing is sent to us.'),
        ],
    },
    {
        'id': 'times', 'cat': 'maths', 'slug': 'times-tables-worksheets', 'tint': '#e8f8f4', 'icon': '✖️',
        'nav': 'Times tables',
        'title': 'Free Times Tables Worksheets, Tests & Certificates | PrintPals',
        'desc': 'Free printable times tables worksheets from 1 to 12: practice sheets, mixed tests, missing number questions, answer keys and a personalised certificate.',
        'h1': 'Times tables worksheets',
        'lead': 'Choose the times tables your child is learning, practise them in order, then try a mixed test. Finish with a personalised certificate to celebrate.',
        'card': 'Practice sheets and mixed tests for 1 to 12, with answers and a certificate.',
        'form': field('Times tables', '<div class="seg">' + ''.join(f'<label><input type="checkbox" name="t{t}"{" checked" if t in (2, 5, 10) else ""}><span>{t}</span></label>' for t in range(1, 13)) + '</div>')
        + field('Sheet', seg('mode', [('practice', 'Practice in order'), ('test', 'Mixed test')], 'test'))
        + field('Questions in the test', seg('count', [('20', '20'), ('30', '30'), ('40', '40')], '30'))
        + check('missing', 'Include missing number questions (__ × 3 = 12)', False)
        + check('key', 'Include the answer page')
        + check('certificate', 'Add a certificate', True)
        + field('Name for the certificate', '<input type="text" name="name" value="" maxlength="30" placeholder="e.g. Leo">')
        + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>From practice to confidence</h2>
<p>Start with <b>Practice in order</b> so your child sees the pattern (2, 4, 6, 8...). When they are ready, switch to a <b>Mixed test</b> and time it. Doing the same test again next week and beating the time is a great motivator. Add missing number questions to build understanding of division.</p>
<h2>The certificate</h2>
<p>Type your child's name to add a colourful certificate at the end. Celebrating each table they master keeps them going.</p>""",
        'faq': [
            ('Which times tables are included?', 'Every table from 1 to 12. Choose one or mix several.'),
            ('Can I print a new test every day?', 'Yes. Tap "Make a new set" for new questions each time.'),
        ],
    },
    {
        'id': 'clocks', 'cat': 'maths', 'slug': 'telling-time-worksheets', 'tint': '#e6f6fc', 'icon': '🕒',
        'nav': 'Telling time',
        'title': 'Free Telling the Time Worksheets | Clock Faces, O\'clock to 5 Minutes | PrintPals',
        'desc': 'Free printable telling the time worksheets with clock faces. O\'clock, half past, quarter past and to, 5 minutes and 1 minute. Read the clock or draw the hands. Answer keys included.',
        'h1': 'Telling the time worksheets',
        'lead': 'Twelve clear clock faces per page. Children read the time, or draw the hands to show it. Start with o\'clock and work up to five minutes, in words ("half past 3") or digital (3:30).',
        'card': 'Clock faces from o\'clock to 5 minutes. Read it or draw the hands.',
        'form': field('Level', seg('level', [('oclock', "O'clock"), ('half', 'Half past'), ('quarter', 'Quarters'), ('five', '5 minutes'), ('minute', '1 minute')], 'half'))
        + field('Activity', seg('mode', [('read', 'Read the clock'), ('draw', 'Draw the hands'), ('mix', 'Both')], 'read'))
        + field('Show times as', seg('style', [('words', 'Half past 3'), ('digital', '3:30')], 'words'))
        + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>Step by step to telling the time</h2>
<ul><li><b>O'clock:</b> the long hand points to 12.</li><li><b>Half past:</b> the long hand points to 6.</li><li><b>Quarter past and quarter to:</b> the long hand points to 3 or 9.</li><li><b>5 minutes:</b> count in fives around the clock.</li></ul>
<p>On every clock the short hand moves along between the numbers, just like a real clock, so children learn to read it properly.</p>""",
        'faq': [
            ('Can children draw the hands?', 'Yes. Choose "Draw the hands" for empty clocks with a time written underneath, or "Both" for a mix.'),
            ('Is the time written in words or numbers?', 'Your choice: words like "quarter past 4" or digital like 4:15.'),
        ],
    },
    {
        'id': 'mazes', 'cat': 'puzzles', 'slug': 'maze-maker', 'tint': '#f1f8e6', 'icon': '🌀',
        'nav': 'Mazes',
        'title': 'Free Printable Mazes for Kids | Maze Maker, Easy to Hard | PrintPals',
        'desc': 'Make free printable mazes for kids in one click. Easy, medium and hard, 1, 2 or 4 mazes per page, fun characters and a solution page. A new maze every time.',
        'h1': 'Maze maker',
        'lead': 'A brand new maze every click, from easy for little hands to tricky for big kids. Help the mouse find the cheese, the bunny find the carrot, or the rocket reach the moon.',
        'card': 'A new maze every click, easy to hard, with solutions.',
        'form': field('Difficulty', seg('level', [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], 'easy'))
        + field('Mazes per page', seg('per', [('1', '1'), ('2', '2'), ('4', '4')], '1'))
        + field('Characters', '<select name="theme"><option value="mix">Surprise me</option><option value="0">Mouse and cheese</option><option value="1">Bunny and carrot</option><option value="2">Bee and flower</option><option value="3">Rocket and moon</option><option value="4">Puppy and bone</option><option value="5">Monkey and banana</option><option value="6">Turtle and island</option><option value="7">Fairy and castle</option></select>')
        + check('key', 'Include the solution page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>More than just fun</h2>
<p>Mazes build pencil control, planning and patience. Children learn to look ahead, spot dead ends and try again, all while having fun. Easy mazes have wide paths for young children; hard mazes keep older children busy on a rainy day or a long journey.</p>""",
        'faq': [
            ('Will I get a different maze each time?', 'Yes. Every maze is created fresh. Tap "Make a new set" for new ones.'),
            ('Is there an answer?', 'Yes, a solution page shows the way through each maze.'),
        ],
    },
    {
        'id': 'crossword', 'cat': 'puzzles', 'slug': 'crossword-maker', 'tint': '#f5edff', 'icon': '🧩',
        'nav': 'Crosswords',
        'title': 'Free Crossword Maker for Teachers and Kids | Printable with Answers | PrintPals',
        'desc': 'Make your own printable crossword puzzle for free. Type words and clues, and get a numbered crossword with an answer key and optional word bank. Perfect for spelling and topic words.',
        'h1': 'Crossword maker',
        'lead': 'Type your words and clues, and the crossword builds itself, with numbered clues across and down and an answer page. Add a word bank to make it easier for younger children.',
        'card': 'Type words and clues and get a numbered crossword with answers.',
        'form': field('Title', '<input type="text" name="title" value="Animal Crossword" maxlength="40">')
        + field('Words and clues', '<textarea name="words" rows="8" spellcheck="false">lion: The king of the jungle\nzebra: A horse with black and white stripes\nmonkey: It swings from trees and loves bananas\nelephant: It has a long trunk\nturtle: It carries its house on its back\nrabbit: It hops and has long ears\ntiger: A big orange cat with stripes</textarea>', 'One per line: word, then a colon, then the clue.')
        + check('bank', 'Show a word bank (easier)', False) + check('key', 'Include the answer page') + SHUFFLE + '<div style="height:14px"></div>' + PAPER,
        'article': """
<h2>How to make a great crossword</h2>
<ul><li>Use 6 to 12 words that share common letters, so they can cross each other.</li><li>Write clues children can understand: "It has a long trunk" beats "Large grey mammal".</li><li>Add the word bank for younger children or spelling practice.</li></ul>
<p>Crosswords are perfect for spelling lists, topic vocabulary (space, the body, animals) and new words in another language.</p>""",
        'faq': [
            ('How do I type the clues?', 'Put one word per line, then a colon, then the clue. For example: lion: The king of the jungle.'),
            ('Why was a word left out?', 'Every word must cross another. If a word shares no letters with the rest, try adding more words or a different one.'),
        ],
    },
    {
        'id': 'reward', 'cat': 'charts', 'slug': 'reward-chart-maker', 'tint': '#fff6e0', 'icon': '🏆',
        'nav': 'Reward charts',
        'title': 'Free Reward Chart Maker for Kids | Printable Sticker Charts | PrintPals',
        'desc': 'Make a free printable reward chart for your child: potty training, reading, brushing teeth, good behaviour. Choose the goal, number of spaces, theme and reward.',
        'h1': 'Reward and sticker charts',
        'lead': 'A colourful path to a prize. Write the goal, pick how many spaces and a theme, and add the reward your child is working towards. Great for potty training, reading, sleeping in their own bed and more.',
        'card': 'A colourful path to a prize for potty training, reading and good habits.',
        'form': field("Child's name", '<input type="text" name="name" value="Leo" maxlength="30">')
        + field('Goal', '<input type="text" name="goal" value="I use the potty!" maxlength="60">', 'For example: I read every day, I brush my teeth, I sleep in my own bed.')
        + field('Spaces', seg('spaces', [('10', '10'), ('15', '15'), ('20', '20'), ('30', '30')], '15'))
        + field('Theme', seg('theme', [('stars', '⭐ Stars'), ('hearts', '💖 Hearts'), ('rockets', '🚀 Rockets'), ('flowers', '🌸 Flowers'), ('dinos', '🦕 Dinos'), ('balls', '⚽ Football')], 'stars'))
        + field('Reward (optional)', '<input type="text" name="reward" value="A trip to the park" maxlength="50">')
        + PAPER,
        'article': """
<h2>Making reward charts work</h2>
<ul><li>Pick one clear goal at a time.</li><li>Start with fewer spaces (10 or 15) so the first reward comes quickly.</li><li>Praise the effort every time a space is coloured.</li><li>Choose rewards that are about time together, like a park trip or baking, not only toys.</li></ul>""",
        'faq': [
            ('What can I use a reward chart for?', 'Potty training, reading every day, brushing teeth, staying in bed, tidying up, trying new foods and much more.'),
            ('How many spaces should I choose?', 'For little ones, 10 or 15 so the reward comes soon. Older children can aim for 20 or 30.'),
        ],
    },
]


TOOLS += [
    {
        'id': 'photo', 'cat': 'fun', 'slug': 'photo-to-colouring-page', 'tint': '#fff0f7', 'icon': '📸', 'new': False,
        'nav': 'Photo to colouring page',
        'title': 'Turn a Photo into a Colouring Page Free | Private, No Upload | PrintPals',
        'desc': 'Turn any photo into a printable colouring page for free: your child, your pet, a family day out. Made inside your browser, so your photo never leaves your device.',
        'h1': 'Photo to colouring page',
        'lead': 'Choose a photo of your child, your pet or a special day, and it becomes a colouring page in seconds. Your photo stays on your own device. It is never uploaded.',
        'card': 'Your child, your pet, your family day out, turned into a colouring page. Private: photos never leave your device.',
        'form': field('Photo', '<input type="file" name="photo" accept="image/*">', 'Clear photos with one or two people or animals work best.')
        + field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="30" placeholder="Mia">')
        + field('Title (optional)', '<input type="text" name="title" value="" maxlength="40" placeholder="My Colouring Page">')
        + field('Lines', seg('detail', [('simple', 'Bold and simple'), ('medium', 'Medium'), ('detailed', 'Lots of detail')], 'simple'), 'Bold and simple is best for little hands.')
        + check('frame', 'Starry frame around the picture')
        + PAPER,
        'article': """
<h2>A colouring page they will actually care about</h2>
<p>Children colour for longer when the picture means something to them. A photo of themselves on their birthday, the family dog, grandma's visit or a day at the beach becomes a page they are proud to colour and keep. It also makes a lovely gift: colour it together and post it to a grandparent.</p>
<h2>Your photo stays private</h2>
<p>Most photo-to-colouring sites upload your picture to their servers. PrintPals does not. The lines are drawn by your own phone or computer, inside the page, and nothing is sent anywhere.</p>
<h2>Tips for the best result</h2>
<ul><li>Use a bright, sharp photo with a plain background.</li><li>Close-up faces and pets work beautifully.</li><li>Try "Bold and simple" for ages 3 to 5 and "Lots of detail" for older children.</li></ul>""",
        'faq': [
            ('Is my photo uploaded anywhere?', 'No. The colouring page is made inside your browser on your own device. Your photo is never sent to us or stored.'),
            ('Which photos work best?', 'Bright, sharp photos with one or two people or animals and a simple background. Very dark or busy photos give messier lines.'),
            ('Can I use it on my phone?', 'Yes. Choose a photo from your gallery or take a new one, then print or save it as a PDF.'),
        ],
    },
    {
        'id': 'story', 'cat': 'writing', 'slug': 'personalised-story-worksheets', 'tint': '#eef2ff', 'icon': '📖', 'new': False,
        'nav': 'Story sheets',
        'title': 'Free Personalised Reading Comprehension Worksheets | Your Child in the Story | PrintPals',
        'desc': 'Free printable reading comprehension for early readers where your child is the hero of the story. Short stories, words to know, questions with pictures and a drawing box.',
        'h1': 'Story sheets starring your child',
        'lead': "Short stories where your child is the hero, with their best friend beside them. Children read more happily when the story is about them. Each sheet has words to know, three questions and a space to draw.",
        'card': 'Ten short stories where your child is the hero, with questions and a space to draw.',
        'form': field("Child's name", '<input type="text" name="name" value="Mia" maxlength="24">')
        + field("Friend's name", '<input type="text" name="friend" value="Leo" maxlength="24">', 'A friend, brother, sister or cousin.')
        + field('Story', '<select name="story"><option value="balloon">The Big Red Balloon</option><option value="kitten">Finds a Kitten</option><option value="picnic">Picnic in the Park</option><option value="rocket">Goes to the Moon</option><option value="rain">The Rainy Day</option><option value="turtle">The Turtle Race</option><option value="beach">Goes to the Beach</option><option value="snowman">Builds a Snowman</option><option value="teddy">The Lost Teddy</option><option value="baking">Bakes a Cake</option><option value="all">All ten stories</option></select>')
        + field('Text size', seg('text', [('big', 'Big (ages 4 to 5)'), ('small', 'Smaller (ages 6 to 7)')], 'big'))
        + field('Answers', seg('answers', [('tick', 'Tick the answer'), ('write', 'Write the answer')], 'tick'))
        + PAPER,
        'article': """
<h2>Why a story about them works</h2>
<p>When a child sees their own name in a story, they lean in. They want to know what happens next, they reread it, and they show it to everyone. That motivation is exactly what early readers need.</p>
<h2>What is on each sheet</h2>
<ul><li><b>Words to know:</b> three key words to read together first.</li><li><b>The story:</b> short, clear sentences with plenty of space between the lines.</li><li><b>Questions:</b> three questions with picture answers to tick, or lines to write on.</li><li><b>Draw your favourite part:</b> a big box to show what they understood.</li></ul>""",
        'faq': [
            ('What age are the stories for?', 'Ages 4 to 7. Choose big text for new readers and smaller text for children who read more confidently.'),
            ('Can I print all the stories at once?', 'Yes. Choose "All ten stories" to get a little reading book of ten sheets.'),
        ],
    },
    {
        'id': 'bingo', 'cat': 'puzzles', 'slug': 'picture-bingo-maker', 'tint': '#fff6e0', 'icon': '🎱', 'new': False,
        'nav': 'Bingo maker',
        'title': 'Free Picture Bingo Card Maker for Kids | Class Sets, Sight Words | PrintPals',
        'desc': 'Make free printable bingo cards for kids: animals, food, party pictures or your own sight words. Every card is different, with a name on each and calling cards to cut out.',
        'h1': 'Picture bingo maker',
        'lead': "Every card is different, so everyone has a fair chance. Add each child's name to print a whole class set in one go, with calling cards to cut out. Use pictures for little ones or type your own sight words.",
        'card': "Unique bingo cards for a whole class, each with a child's name. Pictures or your own sight words.",
        'form': field('Theme', '<select name="theme"><option value="animals">Animals</option><option value="food">Food</option><option value="things">Toys and things</option><option value="party">Party</option><option value="mix">Mixed pictures</option><option value="words">My own words</option></select>')
        + field('Grid', seg('grid', [('3', '3 by 3'), ('4', '4 by 4'), ('5', '5 by 5')], '3'))
        + field("Children's names (optional)", '<textarea name="names" rows="4" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma"></textarea>', 'One name per line. You get one card for each child.')
        + field('Number of cards', '<select name="cards"><option>2</option><option>4</option><option selected>6</option><option>8</option><option>10</option><option>16</option><option>20</option><option>30</option></select>', 'Used when no names are typed.')
        + field('My own words', '<textarea name="words" rows="3" spellcheck="false" placeholder="the, and, is, see, can"></textarea>', 'For the "My own words" theme: sight words, spellings or vocabulary.')
        + check('labels', 'Show the word under each picture')
        + check('free', 'Free space in the middle (3 by 3 and 5 by 5)')
        + check('caller', 'Calling cards to cut out')
        + PAPER,
        'article': """
<h2>How to play</h2>
<ul><li>Cut out the calling cards and put them in a bag or a hat.</li><li>Pull out one card at a time and say the word (or show the picture).</li><li>Children cover or colour the matching square. The first to get a full line shouts "Bingo!"</li></ul>
<h2>Great for learning</h2>
<p>Bingo is a brilliant way to practise sight words, new vocabulary and listening. Type your own words for this week's spellings, or use pictures with children who cannot read yet.</p>""",
        'faq': [
            ('Is every card different?', 'Yes. Each card is shuffled separately and checked so no two are the same.'),
            ('Can I make cards with each child\'s name?', 'Yes. Type the names, one per line, and each child gets their own card.'),
            ('Can I use my own words?', 'Yes. Choose "My own words" and type sight words, spellings or any words you like.'),
        ],
    },
    {
        'id': 'party', 'cat': 'fun', 'slug': 'birthday-party-printables', 'tint': '#fff0f0', 'icon': '🎂', 'new': False,
        'nav': 'Birthday party pack',
        'title': 'Free Personalised Birthday Party Printables for Kids | PrintPals',
        'desc': "Free personalised birthday printables: a Happy Birthday poster with your child's name and age, All About Me page, party word search with the guests' names, party bingo and thank-you cards.",
        'h1': 'Birthday party pack',
        'lead': "Everything for a little party, made for your child. A birthday poster with their name and age, an All About Me page to keep, a word search with the guests' names, party bingo and thank-you cards for each friend.",
        'card': "A poster, All About Me page, word search with guests' names, party bingo and thank-you cards.",
        'form': field("Birthday child's name", '<input type="text" name="name" value="Emma" maxlength="20">')
        + field('Age they are turning', '<select name="age">' + ''.join(f'<option{" selected" if a == 6 else ""}>{a}</option>' for a in range(1, 13)) + '</select>')
        + field("Guests' names (optional)", '<textarea name="guests" rows="4" spellcheck="false" placeholder="Leo&#10;Mia&#10;Sam&#10;Chris"></textarea>', 'Guests appear in the word search and each gets a bingo card and a thank-you card.')
        + '<div class="field"><span class="label">Pages</span>' + check('poster', 'Birthday poster') + check('aboutme', 'All about me') + check('search', 'Party word search') + check('bingo', 'Party bingo') + check('thanks', 'Thank-you cards') + '</div>'
        + PAPER,
        'article': """
<h2>A party pack in two minutes</h2>
<p>Type the birthday child's name, their age and the guests, and the whole pack is ready. Put the poster on the door, use the word search and bingo as party games, and send a thank-you card home with every friend.</p>
<h2>The All About Me page</h2>
<p>Fill it in on every birthday and keep them together. Looking back at them years later, with the drawings and the "when I grow up" answers, is a lovely memory.</p>""",
        'faq': [
            ('Does each guest get their own bingo card?', 'Yes. Type the guests\' names and each gets a different party bingo card with their name on it.'),
            ('Can I print only some pages?', 'Yes. Untick any page you do not need.'),
        ],
    },
    {
        'id': 'certificate', 'cat': 'charts', 'slug': 'certificate-maker', 'tint': '#fff6e0', 'icon': '🏅', 'new': False,
        'nav': 'Certificates',
        'title': 'Free Certificate Maker for Kids | Awards for Home and School | PrintPals',
        'desc': 'Make beautiful free printable certificates for children: Star of the Week, Super Reader, Kindness Award, Potty Champion and more. Print one for every child in the class at once.',
        'h1': 'Certificates and awards',
        'lead': "Beautiful certificates to celebrate every win, big or small. Choose an award, add the names and print one for each child. Four designs: rainbow, gold, space and nature.",
        'card': 'Star of the Week, Super Reader, Kindness Award and more, in four beautiful designs.',
        'form': field('Award', '<select name="award"><option value="star">Star of the Week</option><option value="reading">Super Reader</option><option value="writing">Wonderful Writer</option><option value="maths">Maths Whizz</option><option value="kindness">Kindness Award</option><option value="listening">Great Listener</option><option value="brave">Bravery Award</option><option value="helper">Super Helper</option><option value="potty">Potty Champion</option><option value="sports">Sports Star</option><option value="times">Times Tables Champion</option><option value="custom">My own award</option></select>')
        + field('Names', '<textarea name="names" rows="4" spellcheck="false">Emma</textarea>', 'One name per line. Each gets their own certificate.')
        + field('My own award title', '<input type="text" name="title" value="" maxlength="36" placeholder="Amazing Artist">', 'Used when you choose "My own award".')
        + field('Reason (optional)', '<input type="text" name="reason" value="" maxlength="90" placeholder="for always trying your best">')
        + field('From', '<input type="text" name="from" value="" maxlength="40" placeholder="Miss Emma, or Mum and Dad">')
        + field('Date', '<input type="text" name="date" value="" maxlength="30" placeholder="Today">')
        + field('Design', seg('style', [('rainbow', '🌈 Rainbow'), ('gold', '⭐ Gold'), ('space', '🚀 Space'), ('nature', '🌸 Nature')], 'rainbow'))
        + PAPER,
        'article': """
<h2>Celebrate the small wins too</h2>
<p>A certificate tells a child: I noticed. It works for the big moments, like finishing a reading book or learning the times tables, and for the everyday ones, like being brave at the dentist or kind to a friend.</p>
<h2>A whole class in one go</h2>
<p>Teachers can paste the class list and print a certificate for every child at once. Each prints on its own landscape page.</p>""",
        'faq': [
            ('Can I print certificates for the whole class?', 'Yes. Type or paste every name, one per line, and each child gets their own certificate.'),
            ('Can I write my own award?', 'Yes. Choose "My own award" and type the title and the reason.'),
            ('Do the certificates print in landscape?', 'Yes. They print sideways on A4 or US Letter automatically.'),
        ],
    },
    {
        'id': 'dots', 'cat': 'puzzles', 'slug': 'dot-to-dot-maker', 'tint': '#e6f6fc', 'icon': '✨', 'new': False,
        'nav': 'Dot to dot',
        'title': 'Free Dot to Dot Printables for Kids | Count by 1s, 2s, 5s, 10s or ABC | PrintPals',
        'desc': 'Free printable dot to dot puzzles for kids: stars, animals, rockets and more. Choose 10 to 50 dots and count in ones, twos, fives, tens or join the alphabet. Answer key included.',
        'h1': 'Dot to dot puzzles',
        'lead': 'Join the dots and watch a picture appear. Choose how many dots and how to count: in ones, twos, fives, tens, or from A to Z. A gentle way to practise counting and pencil control.',
        'card': 'Count in ones, twos, fives, tens or join the alphabet, from 10 to 50 dots.',
        'form': field('Picture', '<select name="shape"><option value="">Surprise me</option>' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('star', 'Star'), ('heart', 'Heart'), ('house', 'House'), ('fish', 'Fish'), ('rocket', 'Rocket'), ('apple', 'Apple'), ('cat', 'Cat'), ('umbrella', 'Umbrella'), ('balloon', 'Balloon'), ('crown', 'Crown'), ('moon', 'Moon'), ('butterfly', 'Butterfly'), ('tree', 'Tree'), ('duck', 'Duck'), ('mushroom', 'Mushroom')]) + '</select>')
        + field('Dots', seg('dots', [('10', '10'), ('20', '20'), ('30', '30'), ('50', '50')], '20'))
        + field('Count in', seg('count', [('1', '1s'), ('2', '2s'), ('5', '5s'), ('10', '10s'), ('abc', 'A to Z')], '1'))
        + field('How many puzzles', seg('puzzles', [('1', '1'), ('2', '2'), ('4', '4'), ('6', '6')], '2'))
        + field('Layout', seg('layout', [('one', 'One big per page'), ('two', 'Two per page')], 'one'))
        + check('key', 'Answer page')
        + PAPER,
        'article': """
<h2>More than a puzzle</h2>
<p>Dot to dot practises number order, counting and the careful pencil control children need for handwriting. Counting in twos, fives and tens turns it into times tables practice, and the A to Z option helps with the alphabet.</p>
<h2>Which to choose</h2>
<ul><li><b>Ages 3 to 4:</b> 10 dots, counting in ones.</li><li><b>Ages 5 to 6:</b> 20 or 30 dots, or A to Z.</li><li><b>Ages 6 to 8:</b> 50 dots, or counting in twos, fives and tens.</li></ul>""",
        'faq': [
            ('Can I count in twos or fives?', 'Yes. Choose 2s, 5s or 10s and the dots are numbered in that step, which is great for early times tables.'),
            ('Is there an answer key?', 'Yes. The answer page shows each finished picture.'),
        ],
    },
    {
        'id': 'sudoku', 'cat': 'puzzles', 'slug': 'sudoku-for-kids', 'tint': '#effaf6', 'icon': '🔢', 'new': False,
        'nav': 'Sudoku for kids',
        'title': 'Free Picture Sudoku for Kids | 4x4 and 6x6 Printable Puzzles | PrintPals',
        'desc': 'Free printable sudoku for kids with pictures or numbers: 4x4 for beginners and 6x6 for older children, easy to hard, every puzzle checked to have one answer. Answer key included.',
        'h1': 'Sudoku for kids',
        'lead': 'Little sudoku puzzles with pictures or numbers. Start with 4 by 4 picture puzzles and move up to 6 by 6. Every puzzle is checked to have exactly one answer.',
        'card': '4 by 4 picture puzzles for beginners and 6 by 6 for older children, easy to hard.',
        'form': field('Size', seg('size', [('4', '4 by 4'), ('6', '6 by 6')], '4'))
        + field('Use', seg('symbols', [('pictures', 'Pictures'), ('numbers', 'Numbers')], 'pictures'))
        + field('Level', seg('level', [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], 'easy'))
        + field('Pages', seg('pages', [('1', '1'), ('2', '2'), ('3', '3')], '1'))
        + check('key', 'Answer page')
        + PAPER,
        'article': """
<h2>Logic for little ones</h2>
<p>Sudoku builds careful thinking: looking along a row, checking a column and working out what is missing. Picture sudoku makes it possible even before a child knows their numbers.</p>
<h2>How to play</h2>
<p>Every row, every column and every box must have each picture once. Children can draw the picture or write its number from the key.</p>""",
        'faq': [
            ('Does every puzzle have one answer?', 'Yes. Each puzzle is checked by the computer so there is exactly one correct answer.'),
            ('What age is picture sudoku for?', 'The 4 by 4 picture puzzles suit ages 4 to 6. The 6 by 6 puzzles suit ages 6 to 9.'),
        ],
    },
    {
        'id': 'mixups', 'cat': 'writing', 'slug': 'b-d-reversal-worksheets', 'tint': '#fdf6e3', 'icon': '🔁', 'new': False,
        'nav': 'b and d mix-ups',
        'title': 'Free b and d Reversal Worksheets | Dyslexia Friendly b d p q Practice | PrintPals',
        'desc': 'Free printable worksheets to stop b and d (and p and q) mix-ups: the bed trick, tracing with stroke order, find and colour, and missing letter words. Choose cream, blue or green tinted paper.',
        'h1': 'b and d mix-ups',
        'lead': 'Many children mix up b and d, and p and q. These gentle sheets teach the famous bed trick, practise the right stroke order and mix the letters in fun activities. Choose tinted paper, which many children with dyslexia find easier to read.',
        'card': 'The bed trick, tracing, find and colour and missing letters. Dyslexia friendly tinted paper.',
        'form': field('Letters', seg('letters', [('bd', 'b and d'), ('pq', 'p and q'), ('all', 'b d p q')], 'bd'))
        + field('Paper colour', seg('tint', [('white', 'White'), ('cream', 'Cream'), ('blue', 'Blue'), ('green', 'Green')], 'cream'), 'Tinted paper can make letters easier to read for some children.')
        + PAPER,
        'article': """
<h2>Mixing up b and d is normal</h2>
<p>Almost every young child reverses letters while learning. b, d, p and q are the same shape turned around, so they are the hardest. With practice most children grow out of it by about age 7 or 8. If reversals carry on for longer alongside other reading difficulties, talk to your child's teacher.</p>
<h2>What helps</h2>
<ul><li><b>The bed trick:</b> the word bed looks like a bed, with b at the headboard and d at the footboard.</li><li><b>Start in the right place:</b> b starts with a tall stick, d starts with a round tummy. The green dots show where.</li><li><b>Little and often:</b> five minutes a day works better than one long session.</li></ul>""",
        'faq': [
            ('Why tinted paper?', 'Some children, especially those with dyslexia or visual stress, find black text on bright white paper harder to read. A soft cream, blue or green page can help. Try each one and see which your child prefers.'),
            ('Does mixing up b and d mean my child has dyslexia?', 'Not on its own. Letter reversals are a normal part of learning to write. If you are worried, speak to your child\'s teacher.'),
        ],
    },
]

TOOLS += [
    {
        'id': 'sight', 'cat': 'writing', 'slug': 'sight-words-worksheets', 'tint': '#eef2ff', 'icon': '👀', 'new': False,
        'nav': 'Sight words',
        'title': 'Free Sight Words Worksheets | Dolch, Fry and Year 1 Common Exception Words | PrintPals',
        'desc': 'Free printable sight word worksheets: read it, trace it, write it and find it. Dolch pre-primer, primer and first grade, Fry first 100, UK Year 1 common exception words, or your own list.',
        'h1': 'Sight words worksheets',
        'lead': 'Read it, trace it, write it, find it. Choose a Dolch or Fry list, the UK Year 1 common exception words, or type the words your child is learning this week.',
        'card': 'Read, trace, write and find. Dolch, Fry, UK Year 1 lists or your own words.',
        'form': field('Word list', '<select name="list"><option value="dolch-pre">Dolch pre-primer (40 words)</option><option value="dolch-primer">Dolch primer (52 words)</option><option value="dolch-first">Dolch first grade (41 words)</option><option value="fry-1">Fry words 1 to 50</option><option value="fry-2">Fry words 51 to 100</option><option value="uk-y1">UK Year 1 common exception words</option><option value="own">My own words</option></select>')
        + field('Words', '<textarea name="words" rows="4" spellcheck="false"></textarea>', 'Change or type any words, separated by commas.')
        + field('How many words', seg('count', [('4', '4'), ('8', '8'), ('12', '12'), ('20', '20'), ('all', 'All')], '8'))
        + field('Order', seg('order', [('list', 'In order'), ('mix', 'Mixed up')], 'list'))
        + field('Size', seg('size', [('big', 'Big, 4 a page'), ('medium', 'Medium, 5 a page')], 'big'))
        + DOTS + PAPER,
        'article': """
<h2>Why sight words matter</h2>
<p>Sight words are the little words that appear again and again in every book: the, said, was, you. Many cannot be sounded out, so children learn to recognise them at a glance. Knowing the first hundred makes reading much smoother and more enjoyable.</p>
<h2>Four steps for every word</h2>
<ul><li><b>Read it:</b> say the word together.</li><li><b>Trace it:</b> follow the dots, starting at the green dot.</li><li><b>Write it:</b> write it on your own.</li><li><b>Find it:</b> draw a ring around the word each time it appears.</li></ul>""",
        'faq': [
            ('What is the difference between Dolch and Fry?', 'Both are lists of the most common words in children\'s books. Dolch is grouped by grade and Fry is ordered by how often words appear. Use whichever your school uses.'),
            ('Do you have the UK common exception words?', 'Yes. Choose "UK Year 1 common exception words" for the list used in English schools.'),
        ],
    },
    {
        'id': 'cvc', 'cat': 'writing', 'slug': 'cvc-words-worksheets', 'tint': '#e8f8f4', 'icon': '🐱', 'new': False,
        'nav': 'CVC words',
        'title': 'Free CVC Words Worksheets with Pictures | Short Vowel Phonics | PrintPals',
        'desc': 'Free printable CVC word worksheets with pictures: sound it out, missing vowel, first sound and cut and stick word building. Short a, e, i, o and u.',
        'h1': 'CVC words with pictures',
        'lead': 'Three-letter words like cat, dog and sun are the first words children learn to blend. Sound them out, find the missing vowel, or cut and stick the letters to build each word.',
        'card': 'Cat, dog, sun: sound it out, missing vowel, first sound, or cut and build.',
        'form': field('Vowel', seg('vowel', [('mix', 'Mixed'), ('a', 'a'), ('e', 'e'), ('i', 'i'), ('o', 'o'), ('u', 'u')], 'mix'))
        + field('Activity', seg('activity', [('sound', 'Sound it out'), ('middle', 'Missing vowel'), ('first', 'First sound'), ('build', 'Cut and build')], 'sound'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>What are CVC words?</h2>
<p>CVC stands for consonant, vowel, consonant: three sounds, like c-a-t. They are the first words children learn to read by blending sounds together, usually in the first year of school.</p>
<h2>Four ways to practise</h2>
<ul><li><b>Sound it out:</b> trace each letter while saying its sound, then blend.</li><li><b>Missing vowel:</b> listen for the middle sound.</li><li><b>First sound:</b> listen for the beginning.</li><li><b>Cut and build:</b> cut out letter tiles and build each word.</li></ul>""",
        'faq': [
            ('What age are CVC words for?', 'Usually ages 4 to 6, once children know most letter sounds.'),
            ('Can I practise one vowel at a time?', 'Yes. Choose a, e, i, o or u, or mix them for a challenge.'),
        ],
    },
    {
        'id': 'bonds', 'cat': 'maths', 'slug': 'number-bonds-worksheets', 'tint': '#fff6e0', 'icon': '🔗', 'new': False,
        'nav': 'Number bonds',
        'title': 'Free Number Bonds Worksheets to 5, 10 and 20 | Part Whole Models | PrintPals',
        'desc': 'Free printable number bonds worksheets with part-whole circles and pictures to count. Number bonds to 5, 10, 20 or mixed, with an answer key.',
        'h1': 'Number bonds',
        'lead': 'Two parts make a whole. Part-whole circles with pictures to count help children see how numbers split and join, the key to quick mental maths.',
        'card': 'Part-whole circles to 5, 10 and 20, with pictures to count.',
        'form': field('Number bonds', seg('to', [('5', 'To 5'), ('10', 'To 10'), ('upto10', 'Mixed up to 10'), ('20', 'To 20')], '10'))
        + field('Missing', seg('missing', [('part', 'A part'), ('whole', 'The whole'), ('mix', 'Mixed')], 'part'))
        + check('pictures', 'Pictures to count (up to 10)') + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Why number bonds?</h2>
<p>Knowing that 7 and 3 make 10 without counting is one of the most useful things a young child can learn. Number bonds make adding and taking away much faster later on.</p>
<h2>How to use the part-whole circles</h2>
<p>The big circle is the whole. The two small circles are the parts. Count the pictures in the parts, then find the missing number.</p>""",
        'faq': [('What are number bonds to 10?', 'Pairs of numbers that add up to 10: 0 and 10, 1 and 9, 2 and 8, and so on.'), ('Is there an answer key?', 'Yes, on the second page.')],
    },
    {
        'id': 'flashcards', 'cat': 'writing', 'slug': 'flashcard-maker', 'tint': '#fff0f7', 'icon': '🃏', 'new': False,
        'nav': 'Flashcards',
        'title': 'Free Printable Flashcards for Kids | Pictures, Alphabet, Numbers, Sight Words | PrintPals',
        'desc': 'Make free printable flashcards: animals, food, alphabet, numbers 0 to 20, sight words or your own words. Picture and word together, or double-sided with the word on the back.',
        'h1': 'Flashcard maker',
        'lead': 'Beautiful picture flashcards to cut out. Choose picture and word together, or print double-sided with the picture on the front and the word on the back.',
        'card': 'Picture, alphabet, number and word cards. Double-sided if you like.',
        'form': field('Cards', '<select name="set"><option value="animals">Animals</option><option value="food">Food</option><option value="things">Toys and things</option><option value="abc">Alphabet</option><option value="numbers">Numbers 0 to 20</option><option value="sight">Sight words</option><option value="words">My own words</option></select>')
        + field('My own words', '<textarea name="words" rows="3" spellcheck="false" placeholder="cat, sun, apple, rainbow"></textarea>', 'Pictures are added when we have one.')
        + field('Sides', seg('sides', [('both', 'Picture and word together'), ('double', 'Double-sided')], 'both'), 'Double-sided: print on both sides, flipping on the long edge.')
        + field('Card size', seg('cardsize', [('small', '8 a page'), ('big', '4 big a page')], 'small'))
        + PAPER,
        'article': """
<h2>Playing with flashcards</h2>
<ul><li><b>Snap and pairs:</b> print two sets and play memory.</li><li><b>Guess the word:</b> show the picture, then turn it over.</li><li><b>Treasure hunt:</b> hide cards around the room and say each word when found.</li></ul>
<h2>Printing double-sided</h2>
<p>Choose "Double-sided" and print on both sides of the paper, flipping on the long edge. The backs are mirrored so each word lands behind its picture.</p>""",
        'faq': [('Can I make flashcards with my own words?', 'Yes. Choose "My own words". If we have a picture for a word, it is added automatically.'), ('How do I print double-sided?', 'Choose Double-sided, then in the print window turn on "Print on both sides" and flip on the long edge.')],
    },
    {
        'id': 'chores', 'cat': 'charts', 'slug': 'chore-chart-maker', 'tint': '#e6f6fc', 'icon': '🧹', 'new': False,
        'nav': 'Chore charts',
        'title': 'Free Chore Chart Maker for Kids | By Age, With Pocket Money | PrintPals',
        'desc': 'Make a free printable chore chart for kids with pictures: jobs by age, stars to colour every day, an optional pocket money column, and one chart for each child.',
        'h1': 'Chore charts',
        'lead': 'Age-right jobs with pictures and a star for every day. Add each child\'s name to print a chart for everyone, and turn on the pocket money column if you pay for jobs.',
        'card': 'Jobs by age with pictures, stars to colour and an optional pocket money column.',
        'form': field("Children's names", '<textarea name="names" rows="3" spellcheck="false">Chris</textarea>', 'One name per line. Each child gets their own chart.')
        + field('Age', '<select name="age"><option value="little">3 to 4 years</option><option value="middle" selected>5 to 7 years</option><option value="big">8 years and up</option></select>')
        + field('Jobs', '<textarea name="chores" rows="7" spellcheck="false"></textarea>', 'One job per line. Pictures are added for you.')
        + field('Days', seg('week', [('all', 'Every day'), ('school', 'School days')], 'all'))
        + check('money', 'Pocket money column', False) + PAPER,
        'article': """
<h2>Why children should help at home</h2>
<p>Little jobs teach children that they are an important part of the family. They build confidence, independence and a sense of responsibility, even when the job is only putting toys away.</p>
<h2>Ideas by age</h2>
<ul><li><b>Ages 3 to 4:</b> toys away, clothes in the basket, water plants.</li><li><b>Ages 5 to 7:</b> make the bed, set the table, feed the pet.</li><li><b>Ages 8 and up:</b> hoover, fold clothes, take out the bins.</li></ul>""",
        'faq': [('Can I make charts for several children?', 'Yes. Type each name on its own line and everyone gets their own chart.'), ('Should I pay pocket money for chores?', 'That is up to you. Turn on the pocket money column if you do.')],
    },
    {
        'id': 'feelings', 'cat': 'charts', 'slug': 'feelings-chart-for-kids', 'tint': '#fff0f0', 'icon': '😊', 'new': False,
        'nav': 'Feelings chart',
        'title': 'Free Feelings Chart for Kids | Emotions Check-In and Calm Down Ideas | PrintPals',
        'desc': 'Free printable feelings chart for kids with 12 friendly faces, a weekly feelings check-in and calm down ideas. Colour or colour-in versions.',
        'h1': 'Feelings chart',
        'lead': 'Twelve friendly faces help children put a name to how they feel. Add a weekly check-in and a page of calm down ideas for big feelings.',
        'card': 'Twelve friendly faces, a weekly check-in and calm down ideas.',
        'form': field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="24" placeholder="Leo">')
        + field('Faces', seg('faces', [('colour', 'In colour'), ('colour-in', 'To colour in')], 'colour'))
        + '<div class="field"><span class="label">Pages</span>' + check('chart', 'How do I feel today?') + check('week', 'My feelings week') + check('calm', 'Calm down ideas') + '</div>'
        + PAPER,
        'article': """
<h2>Naming feelings helps</h2>
<p>When children can say "I feel worried" instead of shouting or crying, they are already starting to calm down. A feelings chart gives them the words and the faces to point to.</p>
<h2>Using the check-in</h2>
<p>Once a day, ask your child to circle the face that feels like them and tell you why. There are no wrong answers: every feeling is OK, it is what we do with it that matters.</p>""",
        'faq': [('What age is this for?', 'Ages 3 to 8. Younger children can point to the faces; older children can write why they feel that way.'), ('Is it useful for anxious children?', 'Many families find a daily feelings check-in helpful. Always follow advice from your child\'s own doctor, teacher or therapist.')],
    },
    {
        'id': 'hunt', 'cat': 'fun', 'slug': 'scavenger-hunt-for-kids', 'tint': '#f1f8e6', 'icon': '🔎', 'new': False,
        'nav': 'Scavenger hunts',
        'title': 'Free Printable Scavenger Hunts for Kids | Indoor, Garden, Park, Colours, Shapes | PrintPals',
        'desc': 'Free printable scavenger hunts for kids with pictures: indoor treasure hunt, garden, park and nature walks, colour hunt and shape hunt.',
        'h1': 'Scavenger hunts',
        'lead': 'Pictures for children who cannot read yet, a tick box for every find and a medal at the end. Perfect for rainy days, garden time and walks in the park.',
        'card': 'Indoor, garden, park, colour and shape hunts with pictures to tick.',
        'form': field('Hunt', seg('theme', [('home', '🏠 Indoor'), ('garden', '🌼 Garden'), ('park', '🌳 Park'), ('beach', '🏖️ Beach'), ('shop', '🛒 Supermarket'), ('colours', '🎨 Colours'), ('shapes', '🔷 Shapes')], 'garden'))
        + PAPER,
        'article': """
<h2>Screen-free fun</h2>
<p>A scavenger hunt turns an ordinary walk or a rainy afternoon into an adventure. Children practise looking closely, naming things and counting what they found.</p>
<h2>Make it a game</h2>
<ul><li>Give each child a clipboard and a pencil.</li><li>Set a timer for 15 minutes.</li><li>Take a photo of each find instead of picking it up.</li></ul>""",
        'faq': [('Do children need to read?', 'No. Every item has a picture, so even little ones can join in.'), ('Which hunt is best indoors?', 'Try the indoor treasure hunt, the colour hunt or the shape hunt.')],
    },
    {
        'id': 'matching', 'cat': 'puzzles', 'slug': 'matching-worksheets', 'tint': '#f5edff', 'icon': '🔀', 'new': False,
        'nav': 'Matching',
        'title': 'Free Matching Worksheets for Preschool | Pictures, Letters, Numbers, Shadows | PrintPals',
        'desc': 'Free printable matching worksheets: match pictures to words, big and little letters, count and match numbers, or match the shadow. New sheet every click, answer key included.',
        'h1': 'Matching worksheets',
        'lead': 'Draw a line to match. Pictures to words, big letters to little ones, counting to numbers, or the favourite: match each picture to its shadow.',
        'card': 'Pictures to words, big to little letters, counting, or match the shadow.',
        'form': field('Match', seg('kind', [('word', 'Picture to word'), ('case', 'Big and little letters'), ('count', 'Count and match'), ('shadow', 'Match the shadow')], 'shadow'))
        + field('Pairs', seg('pairs', [('4', '4'), ('5', '5'), ('6', '6')], '5'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Small puzzle, big skills</h2>
<p>Matching builds visual discrimination, the ability to notice what is the same and what is different. It is an important step towards reading, where children must tell b from d and cat from cot.</p>
<h2>Match the shadow</h2>
<p>Shadow matching asks children to recognise a picture from its outline alone. It is a favourite with preschoolers and brilliant for careful looking.</p>""",
        'faq': [('What age are matching worksheets for?', 'Ages 2 to 6. Start with 4 pairs and move up to 6.'), ('Is every sheet different?', 'Yes. Press "Make a new set" for new pictures and a new order.')],
    },
]

TOOLS += [
    {
        'id': 'joined', 'cat': 'writing', 'slug': 'joined-handwriting-worksheets', 'tint': '#eef2ff', 'icon': '✍️', 'new': False,
        'nav': 'Joined handwriting',
        'title': 'Free Joined Handwriting Worksheets | Cursive Practice with Your Own Words | PrintPals',
        'desc': 'Free printable joined handwriting (cursive) worksheets in the style taught in UK schools: practise common joins, Year 2 words, sentences or your own words, with a dotted trace and a green start dot.',
        'h1': 'Joined handwriting',
        'lead': 'Real joined handwriting, drawn stroke by stroke, in the style many UK schools teach. Practise the common joins, tricky words, sentences, or type your own. Every line has a solid model, dotted letters to trace and a line to try alone.',
        'card': 'Joined (cursive) writing with your own words: joins, tricky words and sentences.',
        'form': field('Practise', '<select name="preset"><option value="joins">Common joins (an, ch, ing...)</option><option value="words">Tricky words</option><option value="sentences">Short sentences</option><option value="own">My own words</option></select>')
        + field('Words or sentences', '<textarea name="text" rows="6" spellcheck="false"></textarea>', 'One line of practice for each line you type.')
        + field('Letter size', seg('size', [('big', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'big'))
        + field('Rows for each line', seg('rows', [('normal', 'Model, trace, try'), ('more', 'Extra trace row')], 'normal'))
        + DOTS + PAPER,
        'article': """
<h2>Why joined handwriting?</h2>
<p>Joining letters helps children write faster and more smoothly, and many schools start teaching it in Year 1 or Year 2. Practising the joins that come up most often, like an, ch, th and ing, makes the biggest difference.</p>
<h2>How the joins work</h2>
<ul><li>Most letters join from the baseline with a little upward flick.</li><li>After o, r, v and w the join goes along the top.</li><li>Letters with tails or that end on the left, like b, g, j, p, q, s, x, y and z, do not join to the next letter.</li><li>Capitals are written on their own.</li></ul>""",
        'faq': [
            ('Which handwriting style is this?', 'A clear, upright joined style similar to the ones used in many UK primary schools. If your school uses a slightly different scheme, the joins will still be very familiar.'),
            ('Can I type my child\'s spelling words?', 'Yes. Choose "My own words" and type anything, one practice line per line.'),
        ],
    },
    {
        'id': 'alphabets', 'cat': 'writing', 'slug': 'alphabet-in-other-languages', 'tint': '#fff6e0', 'icon': '🌍', 'new': False,
        'nav': 'World alphabets',
        'title': 'Free Printable Alphabets in 15 Languages | Spanish, French, Swahili, Yoruba, Polish, Welsh and More | PrintPals',
        'desc': 'Free printable alphabet charts and tracing sheets in 15 languages: Spanish, French, German, Italian, Portuguese, Polish, Turkish, Vietnamese, Filipino, Welsh, Swahili, Yoruba, Igbo, Hausa and Twi, with the special letters highlighted.',
        'h1': 'Alphabets from around the world',
        'lead': 'Help your child learn the alphabet of another language, or of your family\'s home language. A colourful chart with the special letters starred, plus tracing sheets for every letter.',
        'card': '15 languages: Spanish, French, Polish, Welsh, Swahili, Yoruba, Igbo, Twi and more.',
        'form': field('Language', '<select name="language"><option value="spanish">Spanish</option><option value="french">French</option><option value="german">German</option><option value="italian">Italian</option><option value="portuguese">Portuguese</option><option value="swahili">Swahili</option><option value="yoruba">Yoruba</option><option value="igbo">Igbo</option><option value="hausa">Hausa</option><option value="twi">Twi (Akan)</option><option value="polish">Polish</option><option value="turkish">Turkish</option><option value="vietnamese">Vietnamese</option><option value="filipino">Filipino</option><option value="welsh">Welsh</option></select>')
        + '<div class="field"><span class="label">Pages</span>' + check('chart', 'Alphabet chart') + check('trace', 'Tracing sheets') + '</div>'
        + PAPER,
        'article': """
<h2>Keep a home language alive</h2>
<p>Many families speak more than one language. Learning the alphabet of a home language, with its own special letters, helps children read and write it, and feel proud of where their family comes from.</p>
<h2>What is included</h2>
<ul><li><b>Alphabet chart:</b> every letter, big and small, with the letters English does not have marked with a star.</li><li><b>Tracing sheets:</b> each letter to trace and then write alone.</li></ul>""",
        'faq': [
            ('Which languages are there?', 'Spanish, French, German, Italian, Portuguese, Polish, Turkish, Vietnamese, Filipino, Welsh, Swahili, Yoruba, Igbo, Hausa and Twi (Akan).'),
            ('Why are some letters starred?', 'Starred letters, like ñ in Spanish or ẹ in Yoruba, are not in the English alphabet, so they need a little extra practice.'),
        ],
    },
    {
        'id': 'families', 'cat': 'writing', 'slug': 'word-families-worksheets', 'tint': '#fff0f7', 'icon': '🏠', 'new': False,
        'nav': 'Word families',
        'title': 'Free Word Families Worksheets | -at, -an, -ig, -op, -ug and More | PrintPals',
        'desc': 'Free printable word family worksheets with a word family house: -at, -an, -ig, -op, -ug, -en, -ot, -ing, -ake and -ell. Pictures, first letter boxes and writing lines.',
        'h1': 'Word families',
        'lead': 'Words that end the same way live in the same house. Children fill in the first letter of each word, find the family words and write their own.',
        'card': 'A word family house for -at, -an, -ig, -op, -ug and more.',
        'form': field('Word family', '<select name="family"><option value="at">-at</option><option value="an">-an</option><option value="ig">-ig</option><option value="op">-op</option><option value="ug">-ug</option><option value="en">-en</option><option value="ot">-ot</option><option value="ing">-ing</option><option value="ake">-ake</option><option value="ell">-ell</option><option value="all">All ten families</option></select>')
        + SHUFFLE + PAPER,
        'article': """
<h2>Why word families help</h2>
<p>Once a child can read "at", they can read cat, hat, bat, mat and sat. Word families show children the patterns in English spelling, so every new word they learn unlocks many more.</p>""",
        'faq': [('Which word families are included?', '-at, -an, -ig, -op, -ug, -en, -ot, -ing, -ake and -ell. Choose "All ten families" for a little book.')],
    },
    {
        'id': 'rhyming', 'cat': 'writing', 'slug': 'rhyming-worksheets', 'tint': '#e8f8f4', 'icon': '🎵', 'new': False,
        'nav': 'Rhyming',
        'title': 'Free Rhyming Worksheets with Pictures | Match the Rhymes | PrintPals',
        'desc': 'Free printable rhyming worksheets with pictures for preschool and reception: match the rhyming pairs or find the picture that rhymes. New sheet every click, answer key included.',
        'h1': 'Rhyming worksheets',
        'lead': 'Cat and hat, moon and spoon, goat and boat. Rhyming is one of the first steps to reading. Match the rhymes or ring the picture that rhymes.',
        'card': 'Match the rhyming pictures or ring the one that rhymes.',
        'form': field('Activity', seg('kind', [('match', 'Match the rhymes'), ('circle', 'Which one rhymes?')], 'match'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Why rhyming matters</h2>
<p>Hearing that words rhyme shows a child is listening to the sounds inside words. That skill, called phonological awareness, is one of the strongest signs of reading success later on.</p>""",
        'faq': [('What age is rhyming for?', 'Ages 3 to 6. Say every word out loud together; it is all about listening.')],
    },
    {
        'id': 'numberlines', 'cat': 'maths', 'slug': 'number-line-worksheets', 'tint': '#e6f6fc', 'icon': '📏', 'new': False,
        'nav': 'Number lines',
        'title': 'Free Number Line Worksheets | Missing Numbers, Adding and Taking Away | PrintPals',
        'desc': 'Free printable number line worksheets: fill in the missing numbers to 10, 20 or 100, or add and take away by jumping along the line. Answer key with the jumps drawn.',
        'h1': 'Number lines',
        'lead': 'Fill in the missing numbers, or add and take away by jumping along the line. The answer key shows every jump.',
        'card': 'Missing numbers, and adding or taking away with jumps.',
        'form': field('Activity', seg('kind', [('missing', 'Missing numbers'), ('add', 'Adding'), ('sub', 'Taking away')], 'missing'))
        + field('Numbers', seg('range', [('10', '0 to 10'), ('20', '0 to 20'), ('100', '0 to 100 in tens')], '10'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Seeing numbers in order</h2>
<p>A number line helps children see that numbers have an order and a size. Jumping forward to add and back to take away makes sums something they can see, not just remember.</p>""",
        'faq': [('What does 0 to 100 in tens mean?', 'The line counts 0, 10, 20 and so on up to 100, great for learning to count in tens.')],
    },
    {
        'id': 'fractions', 'cat': 'maths', 'slug': 'fractions-worksheets', 'tint': '#fff0f0', 'icon': '🍕', 'new': False,
        'nav': 'Fractions',
        'title': 'Free Fractions Worksheets for Kids | Halves, Quarters, Thirds | PrintPals',
        'desc': 'Free printable fractions worksheets: colour the fraction, name the shaded fraction, equal parts or not, and fractions of a group. Halves, quarters, thirds and eighths with answer keys.',
        'h1': 'Fractions worksheets',
        'lead': 'Halves, quarters and thirds with circles, squares, bars and groups of pictures. Colour them, name them, or check whether the parts are equal.',
        'card': 'Halves, quarters and thirds: colour, name, equal parts and groups.',
        'form': field('Activity', seg('kind', [('colour', 'Colour the fraction'), ('name', 'Name the fraction'), ('fair', 'Equal parts?'), ('set', 'Fraction of a group')], 'colour'))
        + field('Fractions', seg('level', [('halves', 'Halves'), ('quarters', 'Halves and quarters'), ('thirds', 'Thirds'), ('mix', 'Mixed')], 'quarters'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Fractions start with fair shares</h2>
<p>Young children understand fractions first as sharing fairly: half a sandwich, a quarter of a pizza. These sheets build that idea step by step, from equal parts to naming and colouring fractions.</p>""",
        'faq': [('Which fractions are included?', 'Halves, quarters, thirds and, in the mixed option, eighths too.')],
    },
    {
        'id': 'colournum', 'cat': 'fun', 'slug': 'colour-by-number', 'tint': '#f5edff', 'icon': '🖍️', 'new': False,
        'nav': 'Colour by number',
        'title': 'Free Colour by Number Printables for Kids | With Sums Option | PrintPals',
        'desc': 'Free printable colour by number pages for kids: a heart, apple, house, fish, flower, star, cat, rainbow, butterfly, apple tree, rocket or duck appears as you colour. Choose numbers, adding sums or taking away sums.',
        'h1': 'Colour by number',
        'lead': 'Colour each square to reveal a hidden picture. Choose plain numbers, or turn it into maths practice with adding or taking away sums.',
        'card': 'Colour the squares to reveal a picture. Numbers or sums.',
        'form': field('Picture', '<select name="picture"><option value="">Surprise me</option><option value="heart">Heart</option><option value="apple">Apple</option><option value="house">House</option><option value="fish">Fish</option><option value="flower">Flower</option><option value="star">Star</option><option value="cat">Cat</option><option value="rainbow">Rainbow</option><option value="butterfly">Butterfly</option><option value="tree">Apple tree</option><option value="rocket">Rocket</option><option value="duck">Duck</option></select>')
        + field('Squares show', seg('mode', [('numbers', 'Numbers'), ('add', 'Adding sums'), ('sub', 'Taking away sums')], 'numbers'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Colouring with a surprise</h2>
<p>Children love watching the picture appear. Colour by number practises number recognition and careful colouring; the sums option adds quick mental maths to every square.</p>""",
        'faq': [('What does "Surprise me" do?', 'It picks a picture at random, so your child does not know what will appear.')],
    },
    {
        'id': 'spotdiff', 'cat': 'puzzles', 'slug': 'spot-the-difference', 'tint': '#f1f8e6', 'icon': '🔍', 'new': False,
        'nav': 'Spot the difference',
        'title': 'Free Spot the Difference Printables for Kids | New Puzzle Every Click | PrintPals',
        'desc': 'Free printable spot the difference puzzles for kids with colourful pictures. Easy, medium or hard, a brand new puzzle every click, with the answers circled.',
        'h1': 'Spot the difference',
        'lead': 'Two colourful pictures, a few sneaky differences. Something missing, something swapped, something bigger or turned around. A brand new puzzle every time.',
        'card': 'Two colourful pictures, 3 to 7 differences, new every click.',
        'form': field('Level', seg('level', [('easy', 'Easy: 3'), ('medium', 'Medium: 5'), ('hard', 'Hard: 7')], 'medium'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>A puzzle for sharp eyes</h2>
<p>Spot the difference builds concentration and careful looking, skills children use every day when reading and writing. Print in colour for the best result.</p>""",
        'faq': [('Is every puzzle different?', 'Yes. Press "Make a new set" for a brand new picture and new differences.')],
    },
]


TOOLS += [
    {
        'id': 'colouring', 'cat': 'fun', 'slug': 'colouring-pages', 'tint': '#fff6e0', 'icon': '🎨', 'new': False,
        'nav': 'Colouring pages',
        'title': 'Free Printable Colouring Pages for Kids | Personalised Colouring Book | PrintPals',
        'desc': 'Free printable colouring pages for kids: 31 friendly pictures with bold, clean lines. Add your child\'s name in bubble letters, or print a whole personalised colouring book with a cover.',
        'h1': 'Colouring pages',
        'lead': 'Friendly pictures with bold, clean lines that are easy for little hands: animals, a rocket, a castle, a birthday cake and more. Add your child\'s name in bubble letters, or print the whole personalised colouring book.',
        'card': '31 friendly pictures with bold lines, or a whole colouring book with your child\'s name.',
        'form': field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="20" placeholder="Mia">', 'Shown in bubble letters to colour in.')
        + field('Print', seg('book', [('one', 'One picture'), ('book', 'The whole colouring book')], 'one'))
        + field('Picture', '<select name="picture"><option value="">Surprise me</option>' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('cat', 'Cat'), ('dog', 'Puppy'), ('bunny', 'Bunny'), ('teddy', 'Teddy bear'), ('owl', 'Owl'), ('elephant', 'Elephant'), ('dino', 'Dinosaur'), ('turtle', 'Turtle'), ('snail', 'Snail'), ('bee', 'Bee'), ('butterfly', 'Butterfly'), ('fish', 'Fish'), ('whale', 'Whale'), ('house', 'House'), ('castle', 'Castle'), ('rocket', 'Rocket'), ('car', 'Car'), ('train', 'Train'), ('boat', 'Sailing boat'), ('sunflower', 'Sunflower'), ('rainbow', 'Rainbow'), ('icecream', 'Ice cream'), ('cake', 'Birthday cake'), ('penguin', 'Penguin'), ('giraffe', 'Giraffe'), ('robot', 'Robot'), ('plane', 'Aeroplane'), ('frog', 'Frog'), ('ladybird', 'Ladybird'), ('octopus', 'Octopus'), ('unicorn', 'Unicorn')]) + '</select>', 'Used when printing one picture.')
        + SHUFFLE + PAPER,
        'article': """
<h2>Bold lines for little hands</h2>
<p>Every picture is drawn with thick, clear lines and big spaces, so young children can colour without getting frustrated. There is no grey shading and nothing fades, so they print perfectly on any printer.</p>
<h2>A colouring book with their name on it</h2>
<p>Choose "The whole colouring book" to print a cover with your child's name in bubble letters, followed by all 31 pictures. Staple it together for a lovely rainy day gift.</p>""",
        'faq': [
            ('How many pictures are there?', '31: animals, vehicles, a house, a castle, flowers, a rainbow, ice cream and a birthday cake. More are added over time.'),
            ('Can I turn my own photo into a colouring page?', 'Yes. Try our photo to colouring page tool; your photo never leaves your device.'),
        ],
    },
]


TOOLS += [
    {
        'id': 'placevalue', 'cat': 'maths', 'slug': 'place-value-worksheets', 'tint': '#eef2ff', 'icon': '🧮', 'new': False,
        'nav': 'Place value',
        'title': 'Free Place Value Worksheets | Tens and Ones with Base Ten Blocks | PrintPals',
        'desc': 'Free printable place value worksheets with base ten blocks: count the tens and ones, draw them, or split numbers up to 50, 99 or 999. Answer key included.',
        'h1': 'Place value',
        'lead': 'Tens sticks and ones cubes make big numbers easy to see. Count them, draw them, or split each number into its parts.',
        'card': 'Tens and ones with base ten blocks: count, draw and split numbers.',
        'form': field('Activity', seg('kind', [('count', 'Count the blocks'), ('draw', 'Draw the blocks'), ('expand', 'Split the number')], 'count'))
        + field('Numbers', seg('range', [('to50', 'Up to 50'), ('to99', 'Up to 99'), ('to999', 'Hundreds')], 'to50'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Why place value matters</h2>
<p>Knowing that 34 is 3 tens and 4 ones is the key to adding, taking away and understanding big numbers. Base ten blocks let children see and count the tens and the ones.</p>""",
        'faq': [('What are base ten blocks?', 'Sticks of ten little cubes (tens) and single cubes (ones). Big squares of 100 are used for hundreds.')],
    },
    {
        'id': 'shapes', 'cat': 'maths', 'slug': 'shapes-and-symmetry-worksheets', 'tint': '#fff0f0', 'icon': '🔷', 'new': False,
        'nav': 'Shapes and symmetry',
        'title': 'Free 2D Shapes and Symmetry Worksheets | Name, Trace, Mirror | PrintPals',
        'desc': 'Free printable 2D shapes worksheets: name the shapes and count sides and corners, trace shapes and their names, or finish a symmetry pattern on a mirror grid.',
        'h1': 'Shapes and symmetry',
        'lead': 'Circles, hexagons, stars and more. Name them, count sides and corners, trace them, or finish a colourful mirror pattern.',
        'card': 'Name and trace 2D shapes, or finish a mirror pattern.',
        'form': field('Activity', seg('kind', [('name', 'Name the shapes'), ('trace', 'Trace the shapes'), ('symmetry', 'Mirror patterns')], 'name'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Shapes are everywhere</h2>
<p>Learning shape names, and counting sides and corners, helps children describe the world around them. Symmetry patterns build careful looking and early geometry.</p>""",
        'faq': [('Do the symmetry patterns need a colour printer?', 'Yes, for the best result. The coloured squares show which colour to use on the other side.')],
    },
    {
        'id': 'measuring', 'cat': 'maths', 'slug': 'measuring-worksheets', 'tint': '#fff6e0', 'icon': '📏', 'new': False,
        'nav': 'Measuring',
        'title': 'Free Measuring Worksheets | Centimetres, Inches and Cubes | PrintPals',
        'desc': 'Free printable measuring worksheets with real-size rulers in centimetres or inches, or count the cubes. Pencils, crayons, paintbrushes and caterpillars to measure.',
        'h1': 'Measuring',
        'lead': 'Real-size rulers in centimetres or inches, printed exactly to scale. Measure pencils, crayons and caterpillars, or start by counting cubes.',
        'card': 'Real-size rulers in cm or inches, or count the cubes.',
        'form': field('Measure in', seg('unit', [('cm', 'Centimetres'), ('inch', 'Inches'), ('cubes', 'Cubes')], 'cm'), 'Print at 100% (actual size) so the rulers are exact.')
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """
<h2>Real rulers, real sizes</h2>
<p>Every ruler and picture is printed at its true size, so children can check with their own ruler too. Make sure your printer is set to 100% or "actual size".</p>""",
        'faq': [('Why do the measurements not match my ruler?', 'Your printer may be shrinking the page. Choose "Actual size" or "100%" in the print settings.')],
    },
    {
        'id': 'graphs', 'cat': 'maths', 'slug': 'pictogram-and-bar-graph-worksheets', 'tint': '#e8f8f4', 'icon': '📊', 'new': False,
        'nav': 'Graphs and tallies',
        'title': 'Free Bar Graph and Tally Chart Worksheets for Kids | PrintPals',
        'desc': 'Free printable graph worksheets for kids: count the pictures, colour a bar graph or make a tally chart, then answer questions. Fruit, animals, toys and treats.',
        'h1': 'Graphs and tally charts',
        'lead': 'Count the pictures, colour the bar graph or make a tally chart, then answer the questions. A new set every click.',
        'card': 'Count the pictures, colour a bar graph or tally, then answer questions.',
        'form': field('Graph', seg('kind', [('bar', 'Bar graph'), ('tally', 'Tally chart')], 'bar'))
        + field('Pictures', seg('theme', [('fruit', 'Fruit'), ('animals', 'Animals'), ('toys', 'Toys'), ('treats', 'Treats')], 'fruit'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>First steps with data</h2><p>Counting, sorting and showing numbers in a graph is how children begin to understand data. Talk about the graph together: which is the most, which is the fewest, how many more?</p>""",
        'faq': [('How do tally marks work?', 'Draw one line for each thing you count. The fifth line goes across the other four, making a group of five.')],
    },
    {
        'id': 'readinglog', 'cat': 'charts', 'slug': 'reading-log-for-kids', 'tint': '#f5edff', 'icon': '📚', 'new': False,
        'nav': 'Reading log',
        'title': 'Free Printable Reading Log for Kids | Bookshelf and Reading Challenge | PrintPals',
        'desc': 'Free printable reading log for kids with a bookshelf to colour for every book read and a 16-square reading challenge. Personalised with your child\'s name.',
        'h1': 'Reading log',
        'lead': 'Make reading every day feel like an adventure. A reading log, a bookshelf to colour book by book, and a reading challenge card.',
        'card': 'A reading log, a bookshelf to colour and a reading challenge.',
        'form': field("Child's name", '<input type="text" name="name" value="Leo" maxlength="24">')
        + '<div class="field"><span class="label">Pages</span>' + check('log', 'Reading log') + check('shelf', 'My bookshelf') + check('challenge', 'Reading challenge') + '</div>'
        + PAPER,
        'article': """<h2>Little and often</h2><p>Ten minutes of reading every day makes a huge difference. Colouring a book on the shelf or ticking a challenge gives children something to be proud of.</p>""",
        'faq': [('What age is the reading log for?', 'Ages 4 to 8. Younger children can colour and circle a face while a grown-up writes the title.')],
    },
    {
        'id': 'writingpaper', 'cat': 'writing', 'slug': 'handwriting-paper', 'tint': '#e6f6fc', 'icon': '📄', 'new': False,
        'nav': 'Handwriting paper',
        'title': 'Free Printable Handwriting Paper for Kids | Big Lines, Picture Box | PrintPals',
        'desc': 'Free printable handwriting paper for kids: rainbow lines, four-line guides or plain lines in big, medium or small sizes, with an optional picture box and border.',
        'h1': 'Handwriting paper',
        'lead': 'The right paper for every stage: rainbow lines for beginners, four-line handwriting guides, or plain lines. Add a picture box for draw-and-write pages.',
        'card': 'Rainbow lines, four-line guides or plain lines, with a picture box.',
        'form': field('Title', '<input type="text" name="title" value="My writing" maxlength="40">')
        + field('Lines', seg('style', [('rainbow', 'Rainbow lines'), ('guides', 'Four-line guides'), ('plain', 'Plain lines')], 'rainbow'))
        + field('Line size', seg('lines', [('big', 'Big'), ('medium', 'Medium'), ('small', 'Small')], 'big'))
        + check('picture', 'Picture box at the top', False) + check('border', 'Pretty border', False)
        + PAPER,
        'article': """<h2>Which lines to choose</h2><ul><li><b>Rainbow lines:</b> blue sky line, green dotted middle and red ground line. Great for beginners.</li><li><b>Four-line guides:</b> the lines taught in many schools, with room for tails.</li><li><b>Plain lines:</b> for confident writers.</li></ul>""",
        'faq': [('Can I print several copies?', 'Yes. Print as many pages as you need from the print window.')],
    },
    {
        'id': 'storywriting', 'cat': 'writing', 'slug': 'story-writing-worksheets', 'tint': '#fff0f7', 'icon': '🖋️', 'new': False,
        'nav': 'Story writing',
        'title': 'Free Story Writing Worksheets for Kids | Story Starters and Comic Strips | PrintPals',
        'desc': 'Free printable story writing worksheets: a picture box, words to help and a story starter to trace, or a comic strip with speech bubbles. Eight story ideas.',
        'h1': 'Story writing',
        'lead': 'A dragon at the door, a magic seed, a talking cat. Each page has a story starter, a picture box and words to help, or choose a comic strip with speech bubbles.',
        'card': 'Story starters with pictures and word banks, or a comic strip.',
        'form': field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="24" placeholder="Mia">')
        + field('Story idea', '<select name="prompt"><option value="">Surprise me</option><option value="dragon">The Dragon at the Door</option><option value="seed">The Magic Seed</option><option value="moon">My Trip to the Moon</option><option value="cat">The Talking Cat</option><option value="sea">Under the Sea</option><option value="birthday">The Best Birthday</option><option value="puppy">The Lost Puppy</option><option value="power">If I Had a Superpower</option></select>')
        + field('Page', seg('layout', [('story', 'Story page'), ('comic', 'Comic strip')], 'story'))
        + field('Lines', seg('lines', [('big', 'Big'), ('small', 'Smaller')], 'big'))
        + SHUFFLE + PAPER,
        'article': """<h2>Getting started is the hardest part</h2><p>A blank page can feel scary. A story starter, a picture and a few helpful words give children a running start, so they can enjoy the fun part: deciding what happens next.</p>""",
        'faq': [('What age are these for?', 'Ages 5 to 8. Younger children can draw the story and tell it to a grown-up who writes it.')],
    },
    {
        'id': 'labels', 'cat': 'charts', 'slug': 'name-labels-for-kids', 'tint': '#f1f8e6', 'icon': '🏷️', 'new': False,
        'nav': 'Name labels',
        'title': 'Free Printable Name Labels and Desk Name Plates for Classrooms | PrintPals',
        'desc': 'Free printable desk name plates with an alphabet strip and number line 0 to 20, and name labels for books, pegs and drawers. Print the whole class at once.',
        'h1': 'Name labels',
        'lead': 'Paste your class list and print everything at once: desk name strips with an alphabet and a number line, or cheerful labels for books, pegs and drawers.',
        'card': 'Desk name strips with alphabet and number line, and labels for books and pegs.',
        'form': field('Names', '<textarea name="names" rows="5" spellcheck="false">Mia\nLeo\nEmma\nSam</textarea>', 'One name per line.')
        + field('Type', seg('kind', [('desk', 'Desk name strips'), ('labels', 'Book and peg labels')], 'desk'))
        + check('repeat', 'Fill the page with repeats (labels)')
        + PAPER,
        'article': """<h2>Ready for the first day</h2><p>Desk name strips help children find their seat, and the alphabet and number line are there every time they need them. Labels make books, pegs and drawers easy to find.</p>""",
        'faq': [('Can I print a whole class at once?', 'Yes. Paste every name, one per line, and every child gets their own strip or labels.')],
    },
]


TOOLS += [
    {
        'id': 'prewriting', 'cat': 'writing', 'slug': 'pre-writing-tracing-lines', 'tint': '#f1f8e6', 'icon': '〰️', 'new': False,
        'nav': 'Pre-writing lines',
        'title': 'Free Pre-Writing Tracing Lines for Toddlers and Preschool | PrintPals',
        'desc': 'Free printable pre-writing worksheets for ages 2 to 4: trace straight lines, bumps, waves, zigzags, castle lines and loops to help the bee reach the flower and the dog reach its bone.',
        'h1': 'Pre-writing tracing lines',
        'lead': 'Before letters come lines. Help the bee reach the flower and the puppy find its bone, tracing straight lines, bumps, waves, zigzags and loops.',
        'card': 'Help the bee reach the flower: lines, waves, zigzags and loops for ages 2 to 4.',
        'form': field('Lines', '<select name="type"><option value="mixed">A mix of every kind</option><option value="straight">Straight lines</option><option value="bumps">Bumps</option><option value="wave">Waves</option><option value="zigzag">Zigzags</option><option value="castle">Castle lines</option><option value="loops">Loops</option></select>')
        + field('Guide', seg('guide', [('thick', 'Thick guide path'), ('dots', 'Dots only')], 'thick'), 'The thick path helps the youngest children stay on track.')
        + SHUFFLE + PAPER,
        'article': """<h2>Why lines come first</h2><p>Every letter is made of lines and curves. Tracing waves, zigzags and loops builds the pencil control and hand strength children need before they start writing letters.</p>""",
        'faq': [('What age is this for?', 'Ages 2 to 4, and older children who need extra pencil practice.')],
    },
    {
        'id': 'cutpaste', 'cat': 'fun', 'slug': 'cut-and-paste-worksheets', 'tint': '#fff6e0', 'icon': '✂️', 'new': False,
        'nav': 'Cut and paste',
        'title': 'Free Cut and Paste Worksheets for Preschool | Sort, Count, Match | PrintPals',
        'desc': 'Free printable cut and paste worksheets: sort land and water animals, fruit and vegetables, hot and cold; count and stick; match pictures to their first letter. Answer on the page.',
        'h1': 'Cut and paste',
        'lead': 'Snip, sort and stick. Cutting and gluing builds strong little hands, and every activity teaches something too: sorting, counting and first sounds.',
        'card': 'Sort, count and match, then cut and stick.',
        'form': field('Activity', seg('kind', [('sort', 'Sort into groups'), ('count', 'Count and stick'), ('letters', 'First letters')], 'sort'))
        + field('Sort', seg('sort', [('land', 'Land or water'), ('food', 'Fruit or vegetable'), ('temp', 'Hot or cold')], 'land'), 'Used for the sorting activity.')
        + SHUFFLE + PAPER,
        'article': """<h2>Scissor skills</h2><p>Cutting along a line takes a lot of practice. Use child-safe scissors, and let younger children tear the pieces out if cutting is still tricky. Glue sticks are the least messy.</p>""",
        'faq': [('Where are the answers?', 'In very small grey writing at the bottom right of the page, for grown-ups.')],
    },
    {
        'id': 'homework', 'cat': 'charts', 'slug': 'homework-planner', 'tint': '#eef2ff', 'icon': '🗓️', 'new': False,
        'nav': 'Homework planner',
        'title': 'Free Printable Homework Planner for Kids | Weekly with Spellings and Reading | PrintPals',
        'desc': 'Free printable weekly homework planner for kids: homework for each day with a star to colour, spellings this week, a reading tracker, things to bring and notes.',
        'h1': 'Homework planner',
        'lead': 'One page for the whole school week: homework for each day, this week\'s spellings, a reading tracker and a "remember to bring" list.',
        'card': 'Homework, spellings, reading and things to bring, all on one page.',
        'form': field("Child's name", '<input type="text" name="name" value="Chris" maxlength="24">') + PAPER,
        'article': """<h2>Calmer school mornings</h2><p>Stick the planner on the fridge. Children colour a star when homework is done and tick off what to bring, which means fewer forgotten PE kits and calmer mornings.</p>""",
        'faq': [('Can I print one for each week?', 'Yes. Print a fresh one every Sunday evening.')],
    },
    {
        'id': 'crafts', 'cat': 'fun', 'slug': 'paper-crowns-and-masks', 'tint': '#fff0f7', 'icon': '👑', 'new': False,
        'nav': 'Crowns and masks',
        'title': 'Free Printable Paper Crowns and Animal Masks for Kids | Birthday Crown with Name | PrintPals',
        'desc': 'Free printable birthday crowns with your child\'s name and age, Star of the Day crowns, and animal masks to colour and cut out: cat, bear, lion, bunny and frog.',
        'h1': 'Paper crowns and masks',
        'lead': 'A birthday crown with their name and age, a Star of the Day crown, or animal masks to colour, cut and wear. Perfect for parties and dressing up.',
        'card': 'Birthday crowns with a name, and animal masks to colour and wear.',
        'form': field('Make', seg('kind', [('crown', 'Crown'), ('mask', 'Animal mask')], 'crown'))
        + field("Child's name", '<input type="text" name="name" value="Leo" maxlength="18">')
        + field('Crown says', seg('crown', [('birthday', 'Happy Birthday'), ('star', 'Star of the Day'), ('name', 'Their name')], 'birthday'))
        + field('Age', '<select name="age"><option value="0">No age</option>' + ''.join(f'<option{" selected" if a == 5 else ""}>{a}</option>' for a in range(1, 13)) + '</select>')
        + field('Mask', '<select name="animal"><option value="all">All five animals</option><option value="cat">Cat</option><option value="bear">Bear</option><option value="lion">Lion</option><option value="bunny">Bunny</option><option value="frog">Frog</option></select>')
        + PAPER,
        'article': """<h2>How to make them</h2><ul><li><b>Crown:</b> colour both strips, cut them out, and glue the short strip to the end of the long one so it fits around your child's head.</li><li><b>Mask:</b> colour it, then a grown-up cuts it out and cuts the eye holes. Tie elastic or string through the little holes.</li></ul>""",
        'faq': [('Do the crowns fit children and adults?', 'The two strips together fit most children. Add a strip of paper for bigger heads.')],
    },
    {
        'id': 'weather', 'cat': 'charts', 'slug': 'weather-chart-for-kids', 'tint': '#e6f6fc', 'icon': '🌦️', 'new': False,
        'nav': 'Weather chart',
        'title': 'Free Printable Weather Chart for Kids | Weekly and Monthly | PrintPals',
        'desc': 'Free printable weather chart for kids: circle the weather each day of the week, then draw the weather for a whole month and count sunny, cloudy, rainy, windy, snowy and stormy days.',
        'h1': 'Weather chart',
        'lead': 'Look out of the window every morning. Circle the weather for the week, draw it for the whole month, then count which weather you had the most.',
        'card': 'A weekly weather diary and a whole month to draw and count.',
        'form': field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="24" placeholder="Mia">')
        + '<div class="field"><span class="label">Pages</span>' + check('week', 'My weather week') + check('month', 'Weather this month') + '</div>'
        + PAPER,
        'article': """<h2>A little science every day</h2><p>Watching the weather teaches children to observe, record and compare. At the end of the month, count the days and talk about the seasons.</p>""",
        'faq': [('Is it good for the classroom?', 'Yes. Many classes fill in the weather together each morning.')],
    },
    {
        'id': 'cards', 'cat': 'fun', 'slug': 'cards-to-colour', 'tint': '#fff0f0', 'icon': '💌', 'new': False,
        'nav': 'Cards to colour',
        'title': "Free Printable Cards to Colour | Mother's Day, Father's Day, Birthday, Eid, Diwali, Christmas | PrintPals",
        'desc': "Free printable cards for kids to colour and fold: Mother's Day, Father's Day, birthday, thank you, thank you teacher, get well soon, Christmas, Eid, Diwali and You Are Amazing.",
        'h1': 'Cards to colour',
        'lead': "A card made by little hands means the world. Choose the occasion, add names, then colour the front, write inside and fold.",
        'card': "Mother's Day, birthday, thank you, Eid, Diwali, Christmas and more.",
        'form': field('Card', '<select name="card"><option value="birthday">Happy Birthday</option><option value="mum">Mother\'s Day</option><option value="dad">Father\'s Day</option><option value="thanks">Thank You</option><option value="teacher">Thank You, Teacher</option><option value="getwell">Get Well Soon</option><option value="christmas">Merry Christmas</option><option value="eid">Eid Mubarak</option><option value="diwali">Happy Diwali</option><option value="love">You Are Amazing</option></select>')
        + field('To', '<input type="text" name="to" value="" maxlength="24" placeholder="Grandma">')
        + field('From', '<input type="text" name="name" value="" maxlength="24" placeholder="Mia">')
        + PAPER,
        'article': """<h2>How to fold it</h2><p>Print the page, colour the front picture, and write your message inside. Then fold along the dashed line so the picture is on the front. The inside is printed upside down on purpose, so it reads the right way once folded.</p>""",
        'faq': [('Why is the inside upside down?', 'So that when you fold the page in half, the message reads the right way up inside the card.')],
    },
]


TOOLS += [
    {
        'id': 'calendar', 'cat': 'charts', 'slug': 'calendar-maker', 'tint': '#fff6e0', 'icon': '📅', 'new': False,
        'nav': 'Calendar maker',
        'title': 'Free Printable Calendar for Kids | Any Month, Birthdays Marked, Pictures to Colour | PrintPals',
        'desc': 'Make a free printable calendar for kids: any month or the whole year, a picture to colour for every month, and your family birthdays and special days marked on the right dates.',
        'h1': 'Calendar maker',
        'lead': 'A calendar children love to look at: a picture to colour for every month, big dates, and family birthdays and special days marked with a star.',
        'card': 'Any month or a whole year, with birthdays and special days marked.',
        'form': field('Month', '<select name="month"><option value="">This month</option><option value="0">January</option><option value="1">February</option><option value="2">March</option><option value="3">April</option><option value="4">May</option><option value="5">June</option><option value="6">July</option><option value="7">August</option><option value="8">September</option><option value="9">October</option><option value="10">November</option><option value="11">December</option><option value="all">The whole year (12 pages)</option></select>')
        + field('Year', '<input type="text" name="year" value="" maxlength="4" placeholder="This year" inputmode="numeric">')
        + field('Week starts on', seg('start', [('mon', 'Monday'), ('sun', 'Sunday')], 'mon'))
        + field('Special days', '<textarea name="specials" rows="4" spellcheck="false" placeholder="12 March Mum\'s birthday&#10;25/12 Christmas&#10;3 June School trip"></textarea>', 'One per line: the day, the month, then what it is.')
        + field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="24" placeholder="Mia">')
        + PAPER,
        'article': """<h2>Helping children understand time</h2><p>Days, weeks and months are hard to picture. A calendar on the wall, with birthdays and exciting days marked, helps children count down, plan and understand how time passes.</p>""",
        'faq': [('How do I add birthdays?', 'Type one per line, like "12 March Mum\'s birthday" or "12/3 Mum\'s birthday". They appear on the right date with a star.'), ('Can I print the whole year?', 'Yes. Choose "The whole year" to print twelve pages.')],
    },
    {
        'id': 'numberday', 'cat': 'maths', 'slug': 'number-of-the-day', 'tint': '#eef2ff', 'icon': '🔟', 'new': False,
        'nav': 'Number of the day',
        'title': 'Free Number of the Day Worksheets | Printable for Kindergarten and Year 1 | PrintPals',
        'desc': 'Free printable number of the day worksheets: trace it, write it in words, ten frames, tally marks, one more and one less, odd or even, number line and draw it. Up to 20 or 100.',
        'h1': 'Number of the day',
        'lead': 'One number, eight ways to show it: trace it, write it in words, ten frames, tally marks, one more and one less, odd or even, on a number line, and draw it.',
        'card': 'One number shown eight ways: words, ten frames, tally, number line and more.',
        'form': field('Number', '<input type="text" name="number" value="" maxlength="3" placeholder="Surprise me" inputmode="numeric">', 'Type a number from 0 to 100, or leave it empty for a surprise.')
        + field('Surprise numbers up to', seg('range', [('20', '20'), ('100', '100')], '20'))
        + check('week', 'Five pages for the whole week', False) + SHUFFLE + PAPER,
        'article': """<h2>A little maths every morning</h2><p>Number of the day is a favourite in classrooms. Looking at one number in many ways builds real number sense, not just counting.</p>""",
        'faq': [('Can I choose the number?', 'Yes. Type any number from 0 to 100.')],
    },
    {
        'id': 'compare', 'cat': 'maths', 'slug': 'greater-than-less-than-worksheets', 'tint': '#effaf6', 'icon': '🐊', 'new': False,
        'nav': 'Greater and less than',
        'title': 'Free Greater Than Less Than Worksheets | Hungry Crocodile | PrintPals',
        'desc': 'Free printable greater than, less than and equal to worksheets with the hungry crocodile: compare groups of pictures, numbers to 20 or numbers to 100. Answer key included.',
        'h1': 'Greater than, less than',
        'lead': 'The hungry crocodile always eats the bigger number! Compare groups of pictures or numbers and write &gt;, &lt; or =.',
        'card': 'The hungry crocodile eats the bigger number: pictures, to 20 or to 100.',
        'form': field('Compare', seg('kind', [('pictures', 'Pictures'), ('to20', 'Numbers to 20'), ('to100', 'Numbers to 100')], 'pictures'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>The crocodile trick</h2><p>The crocodile is hungry, so its mouth always opens towards the bigger number. That turns the tricky &gt; and &lt; signs into a picture children remember.</p>""",
        'faq': [('What does = mean?', 'Both sides are the same, so the crocodile cannot choose and closes its mouth.')],
    },
    {
        'id': 'sounds', 'cat': 'writing', 'slug': 'phonics-digraphs-and-blends', 'tint': '#fff0f7', 'icon': '🔤', 'new': False,
        'nav': 'Phonics sounds',
        'title': 'Free Phonics Digraphs and Blends Worksheets | sh ch th ck ng | PrintPals',
        'desc': 'Free printable phonics worksheets for digraphs (sh, ch, th, wh, ck, ng) and blends (cr, st, sn, tr, fr, bl) with pictures: say the word, ring the sound and write it in.',
        'h1': 'Phonics sounds',
        'lead': 'Two letters, one sound. Say the word, ring the sound you hear and write it in the gap: sh, ch, th, wh, ck, ng and blends like cr and st.',
        'card': 'sh, ch, th, ck, ng and blends like cr and st, with pictures.',
        'form': field('Sounds', seg('set', [('starts', 'sh ch th wh'), ('ends', 'ck ng sh'), ('blends', 'Blends: cr st sn tr fr bl')], 'starts'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>What are digraphs?</h2><p>A digraph is two letters that make one sound, like sh in ship. Blends are two sounds said quickly together, like c-r in crab. Both come after children know their single letter sounds.</p>""",
        'faq': [('What age is this for?', 'Usually ages 5 to 7, once children can blend simple words like cat and dog.')],
    },
    {
        'id': 'opposites', 'cat': 'writing', 'slug': 'opposites-worksheets', 'tint': '#fff6e0', 'icon': '↔️', 'new': False,
        'nav': 'Opposites',
        'title': 'Free Opposites Worksheets for Preschool | Match and Draw | PrintPals',
        'desc': 'Free printable opposites worksheets with pictures: big and small, hot and cold, fast and slow, day and night. Match the opposites or draw the opposite.',
        'h1': 'Opposites',
        'lead': 'Big and small, hot and cold, fast and slow. Match each word to its opposite, or draw the opposite in the empty box.',
        'card': 'Big and small, hot and cold: match them or draw the opposite.',
        'form': field('Activity', seg('kind', [('match', 'Match the opposites'), ('draw', 'Draw the opposite')], 'match'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>Words in pairs</h2><p>Learning opposites grows vocabulary fast, because every new word brings its partner with it. Act them out too: be big, be small, be fast, be slow!</p>""",
        'faq': [('How many opposites are there?', 'Twelve pairs. Each sheet shows six, and "Make a new set" picks new ones.')],
    },
    {
        'id': 'lifecycle', 'cat': 'fun', 'slug': 'life-cycle-worksheets', 'tint': '#f1f8e6', 'icon': '🦋', 'new': False,
        'nav': 'Life cycles',
        'title': 'Free Life Cycle Worksheets | Butterfly, Frog, Plant, Chicken | PrintPals',
        'desc': 'Free printable life cycle worksheets for kids: butterfly, frog, plant and chicken. Learn the stages, label them with a word bank, or cut and stick them in order.',
        'h1': 'Life cycles',
        'lead': 'From egg to butterfly, frogspawn to frog, seed to sunflower. Learn each stage, label them, or cut and stick them in the right order.',
        'card': 'Butterfly, frog, plant and chicken: learn, label, or cut and stick.',
        'form': field('Life cycle', seg('cycle', [('butterfly', '🦋 Butterfly'), ('frog', '🐸 Frog'), ('plant', '🌻 Plant'), ('chicken', '🐔 Chicken')], 'butterfly'))
        + field('Activity', seg('kind', [('learn', 'Learn it'), ('label', 'Label it'), ('cut', 'Cut and stick')], 'learn'))
        + PAPER,
        'article': """<h2>Science they can watch</h2><p>Life cycles are one of the first science topics in school. Pair the sheet with real life: plant a seed, visit a pond in spring, or watch caterpillars grow.</p>""",
        'faq': [('What is a chrysalis?', 'The hard case a caterpillar makes around itself while it turns into a butterfly.')],
    },
    {
        'id': 'family', 'cat': 'charts', 'slug': 'family-tree-for-kids', 'tint': '#fff0f0', 'icon': '🌳', 'new': False,
        'nav': 'Family tree',
        'title': 'Free Printable Family Tree for Kids | All About My Family | PrintPals',
        'desc': 'Free printable family tree for kids with frames to draw or stick photos of grandparents, parents, brothers and sisters, plus an All About My Family page: where we come from and languages we speak.',
        'h1': 'My family tree',
        'lead': 'Frames for grandparents, parents, brothers and sisters to draw or stick photos in, and a page to talk about where your family comes from, the languages you speak and the people who live far away.',
        'card': 'Frames for the whole family, plus where we come from and languages we speak.',
        'form': field("Child's name", '<input type="text" name="name" value="Sam" maxlength="24">')
        + field('Brothers and sisters', seg('siblings', [('0', 'None'), ('1', '1'), ('2', '2'), ('3', '3')], '1'))
        + check('about', 'All about my family page') + PAPER,
        'article': """<h2>Every family is special</h2><p>A family tree helps children understand who is who, and it starts wonderful conversations: where grandparents grew up, the languages the family speaks, and the family who live far away.</p>""",
        'faq': [('Our family is not a mum and a dad. Can I change it?', 'The labels are small, so you can simply write the right name in each frame, and leave any frame empty.')],
    },
    {
        'id': 'travel', 'cat': 'puzzles', 'slug': 'road-trip-activity-pack', 'tint': '#e6f6fc', 'icon': '🚗', 'new': False,
        'nav': 'Road trip pack',
        'title': 'Free Printable Road Trip Activities for Kids | Car Bingo, Noughts and Crosses | PrintPals',
        'desc': 'Free printable road trip pack for kids: car journey bingo with pictures for two players, noughts and crosses grids and dots and boxes. Perfect for long car journeys.',
        'h1': 'Road trip pack',
        'lead': 'Screen-free fun for long journeys: car bingo for two players, noughts and crosses and dots and boxes. Print, grab a clipboard and go.',
        'card': 'Car bingo, noughts and crosses and dots and boxes for long journeys.',
        'form': '<div class="field"><span class="label">Pages</span>' + check('bingo', 'Road trip bingo') + check('xo', 'Noughts and crosses') + check('boxes', 'Dots and boxes') + '</div>'
        + SHUFFLE + PAPER,
        'article': """<h2>Are we nearly there yet?</h2><p>Bingo keeps eyes out of the window, and pencil games are perfect for waiting at airports and restaurants too. A clipboard makes them easy in the car.</p>""",
        'faq': [('Is every bingo card different?', 'Yes. Both players get different cards, and "Make a new set" makes new ones.')],
    },
]



TOOLS += [
    {
        'id': 'hundred', 'cat': 'maths', 'slug': 'hundred-square-worksheets', 'tint': '#fff6e0', 'icon': '💯', 'new': False,
        'nav': 'Hundred square',
        'title': 'Free Printable Hundred Square | 100 Chart, Missing Numbers, Skip Counting | PrintPals',
        'desc': 'Free printable hundred squares (100 charts): a colourful full chart, missing numbers, a blank chart to fill, skip counting patterns in 2s, 3s, 5s and 10s, and hundred square puzzle pieces.',
        'h1': 'Hundred square',
        'lead': 'The most useful maths chart there is. Print a colourful 1 to 100 chart, fill in missing numbers, colour the counting patterns, or solve hundred square puzzle pieces.',
        'card': '1 to 100 charts: missing numbers, patterns in 2s, 5s and 10s, and puzzles.',
        'form': field('Activity', seg('kind', [('full', 'Full chart'), ('missing', 'Missing numbers'), ('blank', 'Fill it in'), ('pattern', 'Counting patterns'), ('pieces', 'Puzzle pieces')], 'missing'))
        + field('Missing', seg('level', [('easy', 'A few'), ('medium', 'Some'), ('hard', 'Lots')], 'medium'), 'For the missing numbers activity.')
        + field('Count in', seg('step', [('2', '2s'), ('3', '3s'), ('5', '5s'), ('10', '10s')], '5'), 'For the counting patterns activity.')
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>Patterns everywhere</h2><p>A hundred square shows how our numbers work: go right to add one, go down to add ten. Colouring the counting patterns makes the times tables visible.</p>""",
        'faq': [('What are the puzzle pieces?', 'Small pieces cut from a hundred square with only the middle number shown. Children work out the numbers above, below and on each side.')],
    },
    {
        'id': 'abcorder', 'cat': 'reading', 'slug': 'alphabet-order-worksheets', 'tint': '#eef2ff', 'icon': '🔡', 'new': False,
        'nav': 'Alphabet order',
        'title': 'Free Alphabet Order Worksheets | Missing Letters, Before and After, ABC Order | PrintPals',
        'desc': 'Free printable alphabet order worksheets: fill in the missing letters, write the letters before and after, and put picture words in ABC order. Small or capital letters.',
        'h1': 'Alphabet order',
        'lead': 'Knowing the order of the alphabet helps with dictionaries, word lists and so much more. Fill in missing letters, find the letters before and after, and put words in ABC order.',
        'card': 'Missing letters, before and after, and putting words in ABC order.',
        'form': field('Activity', seg('kind', [('missing', 'Missing letters'), ('between', 'Before and after'), ('words', 'ABC order words')], 'missing'))
        + field('Letters', seg('case', [('lower', 'Small letters'), ('upper', 'Capital letters')], 'lower'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>Sing it, then write it</h2><p>Singing the alphabet song helps children find missing letters. Point to each letter as you sing, then fill in the gaps.</p>""",
        'faq': [('What age is this for?', 'Ages 4 to 7, once children can say the alphabet.')],
    },
    {
        'id': 'colourwords', 'cat': 'reading', 'slug': 'colour-words-worksheets', 'tint': '#fff0f0', 'icon': '🖍️', 'new': False,
        'nav': 'Colour words',
        'title': 'Free Colour Words Worksheets | Learn Colour Names, Read and Colour | PrintPals',
        'desc': 'Free printable colour words worksheets: learn to read and write red, blue, green and more with tracing and shapes to colour, or read the colour word and colour the picture.',
        'h1': 'Colour words',
        'lead': 'Learn to read and write the colour names: trace the word, colour the shapes, then read and colour the pictures.',
        'card': 'Read, trace and write red, blue, green and more, then read and colour.',
        'form': field('Activity', seg('kind', [('learn', 'Learn a colour'), ('read', 'Read and colour')], 'learn'))
        + field('Colour', '<select name="colour"><option value="all">All 11 colours</option>' + ''.join(f'<option value="{c}">{c}</option>' for c in ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white', 'grey']) + '</select>')
        + SHUFFLE + PAPER,
        'article': """<h2>Colours are some of the first words</h2><p>Colour words are everywhere in picture books. Learning to read them early gives children quick wins and lots of confidence.</p>""",
        'faq': [('Can I print just one colour?', 'Yes. Choose a colour, or print all 11 as a little book.')],
    },
    {
        'id': 'sentences', 'cat': 'reading', 'slug': 'sentence-worksheets', 'tint': '#e8f8f4', 'icon': '✍️', 'new': False,
        'nav': 'Sentences',
        'title': 'Free Sentence Worksheets | Capital Letters and Full Stops, Unscramble, Finish | PrintPals',
        'desc': 'Free printable sentence worksheets for Year 1 and 2: fix the sentence with a capital letter and full stop, unscramble mixed-up sentences, and finish the sentence. Answer key included.',
        'h1': 'Sentence practice',
        'lead': 'Every sentence needs a capital letter and a full stop. Fix the sentences, put mixed-up words in order, or finish each sentence your own way.',
        'card': 'Capital letters and full stops, mixed-up sentences and sentence starters.',
        'form': field('Activity', seg('kind', [('fix', 'Fix the sentence'), ('unscramble', 'Mixed-up words'), ('finish', 'Finish it')], 'fix'))
        + check('key', 'Answer page') + SHUFFLE + PAPER,
        'article': """<h2>Building good sentences</h2><p>A sentence starts with a capital letter, ends with a full stop, and makes sense on its own. These short, picture-supported sentences help children practise all three.</p>""",
        'faq': [('What age is this for?', 'Ages 5 to 7, usually Year 1 and Year 2.')],
    },
    {
        'id': 'howtodraw', 'cat': 'crafts', 'slug': 'how-to-draw-for-kids', 'tint': '#f5edff', 'icon': '✏️', 'new': False,
        'nav': 'How to draw',
        'title': 'Free Step by Step Drawing for Kids | How to Draw a Cat, Owl, Unicorn and More | PrintPals',
        'desc': 'Free printable step by step drawing guides for kids: how to draw a cat, owl, teddy, penguin, robot, frog, puppy, bunny, unicorn, ladybird, fish and rocket, with a big box to try it.',
        'h1': 'How to draw',
        'lead': 'Draw a cat, a unicorn or a robot, one easy step at a time. The new lines in each step are dark and the old ones are light, so it is always clear what to draw next.',
        'card': 'Step by step drawing: cat, unicorn, robot, owl and more.',
        'form': field('Draw a', '<select name="picture"><option value="">Surprise me</option>' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('cat', 'Cat'), ('owl', 'Owl'), ('teddy', 'Teddy bear'), ('penguin', 'Penguin'), ('robot', 'Robot'), ('frog', 'Frog'), ('dog', 'Puppy'), ('bunny', 'Bunny'), ('unicorn', 'Unicorn'), ('ladybird', 'Ladybird'), ('fish', 'Fish'), ('rocket', 'Rocket')]) + '</select>')
        + SHUFFLE + PAPER,
        'article': """<h2>Anyone can draw</h2><p>Big drawings are just lots of small, simple shapes. Following steps builds confidence, pencil control and patience, and children love showing off what they made.</p>""",
        'faq': [('What age is this for?', 'Ages 4 to 9. Younger children may like a grown-up to draw alongside them.')],
    },
    {
        'id': 'bookmarks', 'cat': 'crafts', 'slug': 'bookmarks-to-colour', 'tint': '#fff0f7', 'icon': '🔖', 'new': False,
        'nav': 'Bookmarks',
        'title': 'Free Printable Bookmarks for Kids | To Colour, With Their Name | PrintPals',
        'desc': 'Free printable bookmarks for kids: bookmarks to colour or bright picture bookmarks, with reading quotes and each child\'s name. Print a whole class set.',
        'h1': 'Bookmarks',
        'lead': 'Four bookmarks on every page, to colour in or already bright. Add names for a whole class set, great for World Book Day and end of term gifts.',
        'card': 'Bookmarks to colour or bright ones, with each child\'s name.',
        'form': field('Style', seg('style', [('colour', 'To colour in'), ('bright', 'Bright pictures')], 'colour'))
        + field('Names (optional)', '<textarea name="names" rows="4" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam"></textarea>', 'One name per line. Each child gets a bookmark with their name.')
        + SHUFFLE + PAPER,
        'article': """<h2>Make them last</h2><p>Print on thicker paper or card, or cover with sticky-back plastic. Punch a hole at the top and add a ribbon or wool tassel.</p>""",
        'faq': [('Can I make one for every child in my class?', 'Yes. Type every name, one per line, and each bookmark gets a name.')],
    },
    {
        'id': 'clockcraft', 'cat': 'maths', 'slug': 'paper-clock-craft', 'tint': '#e6f6fc', 'icon': '🕰️', 'new': False,
        'nav': 'Make a clock',
        'title': 'Free Printable Paper Clock Craft | Learn to Tell the Time | PrintPals',
        'desc': 'Free printable paper clock for kids with cut-out hour and minute hands, minute numbers and past and to halves. Make your own clock to learn to tell the time.',
        'h1': 'Make your own clock',
        'lead': 'A big paper clock with hands that really move. Past and to are coloured differently, and the minutes are shown around the edge, which makes telling the time much easier.',
        'card': 'A paper clock with moving hands, minutes and past and to.',
        'form': check('helpers', 'Past and to colours and labels') + check('minutes', 'Minutes around the edge') + PAPER,
        'article': """<h2>How to make it</h2><p>Colour the clock, glue it onto card, and cut out the clock and both hands. Push a paper fastener (split pin) through the middle of the clock and both hands. Now set the time and ask: what time is it?</p>""",
        'faq': [('What is a split pin?', 'A small paper fastener with two legs that fold flat at the back. A grown-up can help push it through.')],
    },
    {
        'id': 'snakes', 'cat': 'puzzles', 'slug': 'snakes-and-ladders-printable', 'tint': '#f1f8e6', 'icon': '🎲', 'new': False,
        'nav': 'Snakes and ladders',
        'title': 'Free Printable Snakes and Ladders Board Game | New Board Every Time | PrintPals',
        'desc': 'Free printable snakes and ladders board game with a new board every click, a dice to cut and fold, and counters to cut out. A colourful family game night in minutes.',
        'h1': 'Snakes and ladders',
        'lead': 'A classic family game, printed in a minute. Every board is different, with a dice to fold and animal counters to cut out.',
        'card': 'A new board every click, with a dice to fold and counters.',
        'form': check('extras', 'Dice and counters page') + SHUFFLE + PAPER,
        'article': """<h2>Maths in disguise</h2><p>Snakes and ladders is secretly great counting practice: children count the dots on the dice and count along the squares. Great for learning numbers to 100.</p>""",
        'faq': [('Is every board different?', 'Yes. Press "Make a new set" for a new board with the snakes and ladders in new places.')],
    },
    {
        'id': 'oddone', 'cat': 'puzzles', 'slug': 'odd-one-out-worksheets', 'tint': '#fff6e0', 'icon': '🔍', 'new': False,
        'nav': 'Odd one out',
        'title': 'Free Odd One Out Worksheets for Kids | Picture Puzzles With Answers | PrintPals',
        'desc': 'Free printable odd one out worksheets with bright painted pictures: spot the different picture, or find the one that does not belong and say why. Three levels and an answer key.',
        'h1': 'Odd one out',
        'lead': 'Which one does not belong? Bright picture puzzles that build sorting and thinking skills, with a new set every click.',
        'card': 'Spot the one that does not belong, with bright pictures and answers.',
        'form': field('Level', seg('level', [('easy', 'Spot the different one'), ('medium', 'Which group? (4)'), ('hard', 'Trickier (5)')], 'medium'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Talk about the why</h2><p>The best part is the reason. Ask "why is that one different?" and let your child explain in their own words: "the others are all fruit, and that is an animal". That is real reasoning, the start of science and maths.</p>""",
        'faq': [('What age is this for?', 'Spot the different one suits ages 3 to 4. Which group suits ages 4 to 6, and the trickier level ages 5 to 7.')],
    },
    {
        'id': 'rolldraw', 'cat': 'crafts', 'slug': 'roll-and-draw-game', 'tint': '#f5edff', 'icon': '🎲', 'new': False,
        'nav': 'Roll and draw',
        'title': 'Free Roll and Draw Game for Kids | Roll a Monster or Robot | PrintPals',
        'desc': 'Free printable roll and draw game: roll the dice to pick the body, eyes, mouth, arms, legs and extras, then draw a silly monster or robot. Every drawing is different.',
        'h1': 'Roll and draw',
        'lead': 'Roll the dice six times and draw whatever it says. Every monster and robot is one of a kind, and every one is funny.',
        'card': 'Roll the dice, then draw a monster or robot like no other.',
        'form': field('Draw a', seg('theme', [('monster', 'Monster'), ('robot', 'Robot')], 'monster'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + PAPER,
        'article': """<h2>A game and a drawing lesson</h2><p>Children practise counting dice dots, following a key and drawing simple shapes, and they laugh the whole way through. Play together: everyone rolls the same parts and draws their own version, then compare!</p>""",
        'faq': [('No dice at home?', 'Print our snakes and ladders page: it has a dice to cut out and fold.')],
    },
    {
        'id': 'patterns', 'cat': 'maths', 'slug': 'pattern-worksheets', 'tint': '#e8f8f4', 'icon': '🔁', 'new': False,
        'nav': 'Patterns',
        'title': 'Free Pattern Worksheets for Kids | What Comes Next? | PrintPals',
        'desc': 'Free printable pattern worksheets: what comes next with bright pictures or coloured shapes. AB, AAB, ABB and ABC patterns in three levels, with an answer key.',
        'h1': 'Patterns: what comes next?',
        'lead': 'Spot the pattern and finish the row. Bright pictures or shapes to colour, from simple AB patterns to tricky ones with a gap in the middle.',
        'card': 'What comes next? Picture and shape patterns in three levels.',
        'form': field('Use', seg('kind', [('pictures', 'Pictures'), ('shapes', 'Coloured shapes')], 'pictures'))
        + field('Level', seg('level', [('easy', 'AB'), ('medium', 'AAB, ABB'), ('hard', 'ABC and gaps')], 'medium'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Patterns are the start of maths</h2><p>Noticing what repeats is the same skill children later use for times tables, number sequences and even reading. Say the pattern out loud together: "apple, banana, apple, banana, apple..." and the answer pops out.</p>""",
        'faq': [('What is an AB pattern?', 'Two things taking turns: red, blue, red, blue. AAB is two of one then one of another. ABC uses three things.')],
    },
    {
        'id': 'syllables', 'cat': 'reading', 'slug': 'syllable-worksheets', 'tint': '#fff0f7', 'icon': '🥁', 'new': False,
        'nav': 'Syllables',
        'title': 'Free Syllable Worksheets | Clap and Count the Beats | PrintPals',
        'desc': 'Free printable syllable worksheets with bright pictures: clap and count the beats, sort pictures into 1, 2 and 3 claps, or split words into syllables. With answer keys.',
        'h1': 'Syllables: clap the beats',
        'lead': 'Say the word, clap the beats, colour the drums. A playful way to hear the parts of words, a key step before reading and spelling longer words.',
        'card': 'Clap and count the beats in words, with bright pictures.',
        'form': field('Activity', seg('kind', [('count', 'Clap and count'), ('sort', 'Cut and sort'), ('split', 'Split the word')], 'count'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Clap, stamp or jump</h2><p>A syllable is a beat in a word. Ba-na-na has three. Clap it, stamp it or jump it! Hearing beats helps children read longer words one chunk at a time.</p>""",
        'faq': [('What age is this for?', 'Clap and count suits ages 4 to 5. Splitting words into boxes suits ages 5 to 7.')],
    },
    {
        'id': 'doorhangers', 'cat': 'crafts', 'slug': 'door-hangers-for-kids', 'tint': '#eef2ff', 'icon': '🚪', 'new': False,
        'nav': 'Door hangers',
        'title': 'Free Printable Door Hangers for Kids | To Colour, With Their Name | PrintPals',
        'desc': 'Free printable door hangers for kids: two sided signs like Shh! Sleeping and Good morning! Come in, to colour or bright, with the child\'s name or your own words.',
        'h1': 'Door hangers',
        'lead': 'A two sided sign for your child\'s bedroom door: sleepy on one side, awake on the other. Add their name and colour it in.',
        'card': 'Two sided door signs with their name, to colour or bright.',
        'form': field('Signs', '<select name="set"><option value="sleep">Shh! Sleeping / Good morning!</option><option value="reading">Do not disturb, reading / Come in</option><option value="play">Genius at work / Come in</option><option value="tidy">Tidying up / All tidy!</option><option value="custom">My own words</option></select>')
        + field('My own words (optional)', '<textarea name="custom" rows="2" spellcheck="false" placeholder="Dance party!&#10;Come and join in"></textarea>', 'One line for each side. Choose "My own words" above.')
        + field('Style', seg('style', [('colour', 'To colour in'), ('bright', 'Bright pictures')], 'colour'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + PAPER,
        'article': """<h2>Make it sturdy</h2><p>Print on card, or glue the two sides onto a cereal box before cutting. Cut out the circle and the slit, and slide it over the door handle.</p>""",
        'faq': [('Can I write my own message?', 'Yes. Choose "My own words" and type one line for each side of the sign.')],
    },
    {
        'id': 'challenge', 'cat': 'charts', 'slug': '30-day-challenge-for-kids', 'tint': '#fff6e0', 'icon': '🌟', 'new': False,
        'nav': '30 day challenges',
        'title': 'Free 30 Day Challenge for Kids | Kindness, Reading, Outdoors | PrintPals',
        'desc': 'Free printable 30 day challenges for kids: 30 days of kindness, a reading challenge, outdoor adventures and helping at home. Colour a star for each one done. 14 day versions too.',
        'h1': '30 day challenges',
        'lead': 'Thirty little missions to colour off one by one: kind acts, reading adventures, outdoor fun and helping at home.',
        'card': 'Kindness, reading, outdoor and helper challenges to colour off.',
        'form': field('Challenge', seg('theme', [('kindness', 'Kindness'), ('reading', 'Reading'), ('outdoors', 'Outdoors'), ('helper', 'Helper')], 'kindness'))
        + field('Days', seg('days', [('30', '30 days'), ('14', '14 days')], '30'))
        + field('Order', seg('order', [('list', 'Our order'), ('shuffle', 'Mixed up')], 'list'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + PAPER,
        'article': """<h2>Small steps, big pride</h2><p>Stick it on the fridge and let your child choose one each day. Colouring the star is the reward, and seeing the page fill up builds real pride. Great for school holidays.</p>""",
        'faq': [('Do they have to go in order?', 'No. Children can pick any mission they like each day. Choose "Mixed up" for a new order.')],
    },
    {
        'id': 'doubles', 'cat': 'maths', 'slug': 'doubles-and-halves-worksheets', 'tint': '#fff0f0', 'icon': '🐞', 'new': False,
        'nav': 'Doubles and halves',
        'title': 'Free Doubles and Halves Worksheets | Ladybird Doubles, Sharing | PrintPals',
        'desc': 'Free printable doubles and halves worksheets: ladybird doubles, sharing treats fairly between two friends, and double and half number facts. With answer keys.',
        'h1': 'Doubles and halves',
        'lead': 'Draw the same spots on both wings, share treats fairly between two friends, then practise the number facts.',
        'card': 'Ladybird doubles, fair sharing and double and half facts.',
        'form': field('Activity', seg('kind', [('ladybird', 'Ladybird doubles'), ('halves', 'Share it fairly'), ('facts', 'Number facts')], 'ladybird'))
        + field('Numbers up to', seg('max', [('5', '5'), ('10', '10')], '5'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Doubles are a superpower</h2><p>Once children know their doubles (3 + 3, 4 + 4) they can work out near doubles in their head: 4 + 5 is just double 4 and one more. Halving is simply sharing fairly, which every child already cares about!</p>""",
        'faq': [('What age is this for?', 'Ladybird doubles and sharing suit ages 4 to 6. Number facts to 10 suit ages 5 to 7.')],
    },
    {
        'id': 'position', 'cat': 'reading', 'slug': 'position-words-worksheets', 'tint': '#e6f6fc', 'icon': '📦', 'new': False,
        'nav': 'Position words',
        'title': 'Free Position Words Worksheets | In, On, Under, Behind | PrintPals',
        'desc': 'Free printable position words worksheets: in, on, under, next to, behind, in front of, above and between, with cute animals and boxes. Circle, write or draw, with answer keys.',
        'h1': 'Position words',
        'lead': 'Where is the cat? In the box, on the box, behind the box! Cute pictures that teach the little words children use every day.',
        'card': 'In, on, under, behind: circle, write or draw where it is.',
        'form': field('Activity', seg('kind', [('circle', 'Circle the word'), ('write', 'Write the word'), ('draw', 'Read and draw')], 'circle'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Play it for real</h2><p>After the sheet, hide a teddy around the room: "Teddy is under the table!" Children learn position words fastest when they move things around themselves.</p>""",
        'faq': [('Which words are included?', 'In, on, under, next to, behind, in front of, above and between. Each sheet uses six of them.')],
    },
    {
        'id': 'secretcode', 'cat': 'puzzles', 'slug': 'secret-code-worksheets', 'tint': '#f5edff', 'icon': '🕵️', 'new': False,
        'nav': 'Secret code',
        'title': 'Free Secret Code Worksheets for Kids | Picture Code, Number Code | PrintPals',
        'desc': 'Free printable secret code puzzles for kids: crack the picture code, number code or backwards alphabet to read kind messages, or type your own secret message. New code every click.',
        'h1': 'Secret code',
        'lead': 'Crack the code to read a secret message! Picture codes for early readers, number codes and backwards alphabets for bigger kids, or write your own message.',
        'card': 'Crack a picture or number code to read a secret message.',
        'form': field('Code', seg('code', [('pictures', 'Picture code'), ('numbers', 'Number code'), ('backwards', 'Backwards ABC')], 'pictures'))
        + field('Your own messages (optional)', '<textarea name="custom" rows="3" spellcheck="false" placeholder="I love you Mia&#10;Tidy your room"></textarea>', 'Up to 4 messages, one per line. Letters only.')
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Secret notes build readers</h2><p>Children will happily work hard to read a message that is just for them. Slip a coded note in a lunchbox or under a pillow, and let them write one back to you.</p>""",
        'faq': [('Can I write my own message?', 'Yes. Type up to four messages, one per line. Each one is turned into the code for your child to crack.')],
    },
    {
        'id': 'gridcopy', 'cat': 'crafts', 'slug': 'grid-drawing-for-kids', 'tint': '#eef2ff', 'icon': '🔲', 'new': False,
        'nav': 'Copy the picture',
        'title': 'Free Grid Drawing Worksheets for Kids | Copy the Picture, Finish the Half | PrintPals',
        'desc': 'Free printable grid drawing worksheets: copy a pixel picture square by square, or colour the other half to finish a symmetrical picture. With grid letters and numbers to help.',
        'h1': 'Copy the picture',
        'lead': 'Copy a little picture square by square into a big grid, or finish the other half. Great for concentration, counting and symmetry.',
        'card': 'Copy a pixel picture square by square, or finish the other half.',
        'form': field('Activity', seg('kind', [('copy', 'Copy the picture'), ('half', 'Finish the other half')], 'copy'))
        + field('Picture', '<select name="picture"><option value="random">Surprise me</option>' + ''.join(f'<option value="{k}">{n}</option>' for k, n in [('heart', 'Heart'), ('apple', 'Apple'), ('house', 'House'), ('fish', 'Fish'), ('flower', 'Flower'), ('star', 'Star'), ('butterfly', 'Butterfly'), ('tree', 'Apple tree'), ('rocket', 'Rocket'), ('duck', 'Duck'), ('cat', 'Cat'), ('rainbow', 'Rainbow')]) + '</select>', 'For "finish the other half", pictures that are the same on both sides are used.')
        + check('labels', 'Letters and numbers on the grid') + SHUFFLE + PAPER,
        'article': """<h2>Square by square</h2><p>Show your child how to find a square using the letter at the top and the number at the side, just like a map. It is early coordinates, and it makes careful copying much easier.</p>""",
        'faq': [('What age is this for?', 'Finish the other half suits ages 4 to 6. Copying the whole picture suits ages 5 to 8.')],
    },
    {
        'id': 'puppets', 'cat': 'crafts', 'slug': 'finger-puppets-printable', 'tint': '#fff0f7', 'icon': '🧤', 'new': False,
        'nav': 'Finger puppets',
        'title': 'Free Printable Finger Puppets for Kids | To Colour or Bright | PrintPals',
        'desc': 'Free printable finger puppets: nine animal puppets on a page, to colour in or bright and ready to cut. Wrap the band around a finger and put on a puppet show.',
        'h1': 'Finger puppets',
        'lead': 'Nine animal finger puppets on every page. Colour, cut, wrap and glue, then put on a show for the family!',
        'card': 'Nine animal puppets to colour, cut and wrap around a finger.',
        'form': field('Style', seg('style', [('colour', 'To colour in'), ('bright', 'Bright pictures')], 'colour')) + SHUFFLE + PAPER,
        'article': """<h2>Puppet shows grow talkers</h2><p>Children who feel shy often chat away through a puppet. Make up a story together, retell a favourite book, or let the puppets act out a feeling.</p>""",
        'faq': [('How do I make them sturdy?', 'Print on thin card, or glue the page onto a cereal box before cutting.')],
    },
    {
        'id': 'handprints', 'cat': 'crafts', 'slug': 'handprint-art-keepsakes', 'tint': '#fff6e0', 'icon': '🖐️', 'new': False,
        'nav': 'Handprint keepsakes',
        'title': 'Free Handprint Art Templates | Keepsake Poems for Kids | PrintPals',
        'desc': 'Free printable handprint and footprint keepsake templates with sweet poems: little hands, a handprint flower, tiny feet and a handprint heart. Add name, age and date.',
        'h1': 'Handprint keepsakes',
        'lead': 'A little poem, a painted handprint and the date. A keepsake to treasure, and a perfect gift for grandparents.',
        'card': 'Handprint and footprint keepsakes with sweet poems.',
        'form': field('Design', seg('kind', [('hands', 'Little hands'), ('flower', 'Handprint flower'), ('feet', 'Tiny feet'), ('heart', 'Handprint heart')], 'hands'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Age (optional)', '<input type="text" name="age" maxlength="12" placeholder="3 years" autocomplete="off">')
        + PAPER,
        'article': """<h2>Less mess tips</h2><p>Use washable paint on a plate, press the hand down firmly and lift straight up. Do one print a year on the same design, and watch how the hands grow.</p>""",
        'faq': [('Is the hand shape the real size?', 'It is a guide only. Every hand is different, so press anywhere inside the space.')],
    },
    {
        'id': 'heightchart', 'cat': 'charts', 'slug': 'printable-height-chart', 'tint': '#e8f8f4', 'icon': '🦒', 'new': False,
        'nav': 'Height chart',
        'title': 'Free Printable Height Chart for Kids | Growth Chart in cm or Inches | PrintPals',
        'desc': 'Free printable growth chart for kids in centimetres or inches, printed at real size in strips you stick on the wall. With their name and cute painted animals.',
        'h1': 'Height chart',
        'lead': 'A real size growth chart in four strips. Stick them on the wall, mark each birthday and watch your child grow.',
        'card': 'A real size growth chart in strips, in cm or inches.',
        'form': field('Units', seg('units', [('cm', 'Centimetres'), ('in', 'Inches')], 'cm'))
        + field('Start at', seg('start', [('50', '50 cm'), ('75', '75 cm')], '50'), 'For inches the chart runs from 20 to 60 inches.')
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Sam" autocomplete="off">')
        + PAPER,
        'article': """<h2>Print it the right size</h2><p>In the print window choose "Actual size" or 100% scale, not "Fit to page". Check one centimetre with a ruler before you stick it up. Measure from the floor to the bottom of strip 1 and stick it there.</p>""",
        'faq': [('Is it accurate?', 'Yes, when printed at 100% scale. Always check with a ruler first, because some printers shrink pages a little.')],
    },
    {
        'id': 'daysmonths', 'cat': 'world', 'slug': 'days-of-the-week-worksheets', 'tint': '#fff0f0', 'icon': '☀️', 'new': False,
        'nav': 'Days and months',
        'title': 'Free Days of the Week and Months of the Year Worksheets | PrintPals',
        'desc': 'Free printable days of the week and months of the year worksheets: fill in the missing days, what comes before and after, plus a daily "my day today" sheet with date, weather and feelings.',
        'h1': 'Days and months',
        'lead': 'Learn the days of the week and the months of the year, and fill in a cheerful "my day today" sheet each morning.',
        'card': 'Days of the week, months of the year and a daily calendar sheet.',
        'form': field('Activity', seg('kind', [('week', 'Days of the week'), ('months', 'Months of the year'), ('today', 'My day today')], 'week'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Make it a morning habit</h2><p>Put a "my day today" sheet in a plastic pocket and use a whiteboard pen each morning. Talking about yesterday and tomorrow builds a real sense of time.</p>""",
        'faq': [('Can I use it every day?', 'Yes. Slip the "my day today" sheet into a plastic sleeve and write on it with a whiteboard pen.')],
    },
    {
        'id': 'mybody', 'cat': 'world', 'slug': 'my-body-worksheets', 'tint': '#e6f6fc', 'icon': '🧒', 'new': False,
        'nav': 'My body',
        'title': 'Free My Body Worksheets for Kids | Label the Body, Face, Five Senses | PrintPals',
        'desc': 'Free printable my body worksheets for kids: label the parts of the body or the face with a word bank, and match the five senses. With answer keys.',
        'h1': 'My body',
        'lead': 'Label the parts of the body and face, and learn the five senses, with a friendly picture of a child and a word bank to help.',
        'card': 'Label the body and face, and match the five senses.',
        'form': field('Activity', seg('kind', [('body', 'Label my body'), ('face', 'Label my face'), ('senses', 'Five senses')], 'body'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Play Simon says</h2><p>After the sheet, play "Simon says touch your elbow!" Children remember body words best when they move the part they are naming.</p>""",
        'faq': [('What age is this for?', 'Ages 3 to 6. Younger children can point and say the words while a grown-up writes.')],
    },
    {
        'id': 'dominoes', 'cat': 'maths', 'slug': 'domino-maths-worksheets', 'tint': '#f1f8e6', 'icon': '🎴', 'new': False,
        'nav': 'Domino maths',
        'title': 'Free Domino Maths Worksheets | Domino Addition and a Printable Set | PrintPals',
        'desc': 'Free printable domino maths: count the dots and write the sum, draw the missing dots to make a number, or print a full double six domino set to cut out and play.',
        'h1': 'Domino maths',
        'lead': 'Count the dots, write the sum, or draw the missing dots. Plus a full set of 28 dominoes to cut out and play with.',
        'card': 'Domino sums, missing dots and a full set to cut out.',
        'form': field('Activity', seg('kind', [('add', 'Domino sums'), ('missing', 'Missing dots'), ('set', 'Domino set')], 'add'))
        + check('key', 'Answer key page') + SHUFFLE + PAPER,
        'article': """<h2>Dots before digits</h2><p>Dominoes help children see numbers as patterns, so they can spot "five" without counting each dot. That quick seeing is a big step towards adding in their head.</p>""",
        'faq': [('How do you play dominoes?', 'Share out the dominoes. Take turns to add one that matches a number at either end of the line. The first to use all theirs wins!')],
    },
    {
        'id': 'pack', 'cat': 'packs', 'slug': 'weekly-learning-pack', 'tint': '#fff6e0', 'icon': '🎒', 'new': False,
        'nav': 'Weekly learning pack',
        'title': 'Free Personalised Weekly Learning Pack for Kids | A Whole Week Planned in One Click | PrintPals',
        'desc': 'A free personalised learning week for your child: pick their age and a theme and get a balanced week of reading, maths and fun pages with their name, a star chart, a certificate and a grown-up guide. Siblings too.',
        'h1': 'Weekly learning pack',
        'lead': 'Stop searching for worksheets. Tell us your child\'s name, age and favourite theme, and get a whole balanced week in one click: reading, maths and fun, a star chart, a certificate and a simple guide for you.',
        'card': 'A whole week planned for your child in one click, with their name, a star chart and a grown-up guide.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '4'))
        + field('Theme', '<select name="theme">' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('animals', 'Animals'), ('space', 'Space'), ('sea', 'Under the sea'), ('go', 'Things that go'), ('magic', 'Magic and unicorns'), ('garden', 'Bugs and gardens')]) + '</select>')
        + field('Days', seg('days', [('3', '3 days'), ('5', '5 days')], '5'))
        + field('Pages a day', seg('per', [('1', '1'), ('2', '2'), ('3', '3')], '2'), 'About 10 minutes a page.')
        + field('Brothers and sisters (optional)', '<textarea name="siblings" rows="2" spellcheck="false" placeholder="Leo 6&#10;Sam 3"></textarea>', 'One child per line with their age. Each child gets their own pack at their own level, with the same theme, so they can sit and work together.')
        + check('cover', 'A cover to colour') + check('stars', 'Star chart') + check('certificate', 'Certificate at the end') + check('guide', 'Grown-up guide') + check('key', 'Answer pages')
        + SHUFFLE + PAPER,
        'article': """<h2>Why a planned week works</h2><p>Parents tell us the hardest part is not printing, it is choosing. Which sheet? Is it too hard? What comes next? The weekly pack answers all of that. Every day mixes words, numbers and something fun, at the right level for your child's age, with their name on every page. The grown-up guide tells you what each page teaches and exactly what to say to help.</p><h2>Little and often</h2><p>Ten to fifteen minutes a day is plenty for young children. Let them colour a star on the chart after each page, and hand over the certificate at the end of the week. Want next week? Press "Make a new set" for a brand new week on the same theme.</p>""",
        'faq': [('Is it really free?', 'Yes. No sign up, no email, no payment. The whole pack is made inside your own browser.'),
                ('Can I make packs for more than one child?', 'Yes. Add brothers and sisters with their ages. Each child gets their own pack at their own level, with the same theme so they can work side by side.'),
                ('What if it is too hard or too easy?', 'Change the age and press "Make a new set". Every single sheet on PrintPals also has Easier and Harder buttons.')],
    },
    {
        'id': 'quickpack', 'cat': 'packs', 'slug': 'quick-activity-packs', 'tint': '#e8f8f4', 'icon': '⚡', 'new': False,
        'nav': 'Quick packs',
        'title': 'Free Quick Activity Packs for Kids | Restaurant, Rainy Day, Sick Day, Bedtime | PrintPals',
        'desc': 'Free printable activity packs for the moments you need them most: waiting at a restaurant, a rainy day indoors, a sick day in bed, calm before bedtime and outdoor adventures. Ready in one click, at your child\'s level.',
        'h1': 'Quick packs for busy moments',
        'lead': 'Need twenty quiet minutes right now? Pick the moment, and get a ready-made pack of screen-free activities at your child\'s level.',
        'card': 'Screen-free packs for restaurants, rainy days, sick days and bedtime.',
        'form': field('The moment', seg('occasion', [('waiting', 'Restaurant or waiting room'), ('rainy', 'Rainy day'), ('sick', 'Sick day in bed'), ('bedtime', 'Calm before bed'), ('outside', 'Outdoors')], 'waiting'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '5'))
        + check('cover', 'A cover to colour') + check('key', 'Answer pages')
        + SHUFFLE + PAPER,
        'article': """<h2>Screen-free, without the guilt</h2><p>Keep a quiet pack in your bag with a few crayons for restaurants, queues and doctor visits. On rainy days, print the crafts pack. For sick days and bedtime, the gentle packs help little ones rest and settle.</p>""",
        'faq': [('Can I print it from my phone?', 'Yes. Tap "Print or save as PDF", save the PDF, and print it at home or at any print shop.')],
    },
    {
        'id': 'faraway', 'cat': 'packs', 'slug': 'family-far-away-activities', 'tint': '#fff0f5', 'icon': '💌', 'new': False,
        'nav': 'Family far away',
        'title': 'Free Activities for Kids With Family Far Away | Video Call Bingo, Postcards | PrintPals',
        'desc': 'Free printables that keep children close to family who live far away: postcards to send, video call bingo, questions to ask Grandma, a news page to photograph and share, and a countdown to the next visit.',
        'h1': 'Family far away pack',
        'lead': 'For grandparents abroad, a parent who travels for work, or cousins in another country. Little things to make and send, and games that turn video calls into real connection.',
        'card': 'Postcards, video call bingo and a countdown for family who live far away.',
        'form': field('Who is far away?', '<input type="text" name="family" maxlength="24" placeholder="Grandma" autocomplete="off">', 'For example Grandma, Grandpa, Daddy, Auntie or a cousin\'s name.')
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Pages', seg('kind', [('all', 'The whole pack'), ('postcards', 'Postcards'), ('bingo', 'Video call bingo'), ('interview', 'Interview questions'), ('news', 'My news'), ('countdown', 'Countdown')], 'all'))
        + field('Countdown days', seg('days', [('7', '7'), ('14', '14'), ('21', '21'), ('30', '30')], '14'))
        + SHUFFLE + PAPER,
        'article': """<h2>Love travels well</h2><p>Children feel close to people they do things with. A postcard they drew, a game played during a call, questions that start real conversations: small rituals like these build a bond across any distance. Take a photo of the finished pages and send them on WhatsApp or email in seconds.</p>""",
        'faq': [('Do I need to post anything?', 'No. Most families take a photo and send it by message. Posting the postcards is a lovely extra.')],
    },
    {
        'id': 'monthplan', 'cat': 'packs', 'slug': 'monthly-learning-plan', 'tint': '#eef2ff', 'icon': '🗓️', 'new': False, 'plus': True,
        'nav': 'Monthly learning plan',
        'title': 'Personalised Monthly Learning Plan for Kids | 4 Weeks That Grow With Your Child | PrintPals',
        'desc': 'A personalised four week learning plan for your child: reading, maths and fun pages with their name, getting a little harder each week, with a month chart, a weekly grown-up guide and a certificate.',
        'h1': 'Monthly learning plan',
        'lead': 'Four whole weeks planned in one click. Weeks 1 and 2 build confidence, weeks 3 and 4 gently stretch your child to the next level. Every week comes with a guide for you.',
        'card': 'Four weeks planned in one click, getting a little harder each week.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '5'))
        + field('Theme', '<select name="theme">' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('animals', 'Animals'), ('space', 'Space'), ('sea', 'Under the sea'), ('go', 'Things that go'), ('magic', 'Magic and unicorns'), ('garden', 'Bugs and gardens')]) + '</select>')
        + field('Days a week', seg('days', [('3', '3 days'), ('5', '5 days')], '5'))
        + field('Pages a day', seg('per', [('1', '1'), ('2', '2'), ('3', '3')], '2'))
        + check('guide', 'Grown-up guide for each week') + check('certificate', 'Certificate at the end') + check('key', 'Answer pages')
        + SHUFFLE + PAPER,
        'article': """<h2>Progress you can see</h2><p>Children grow in confidence when they finish things. The month chart lets them colour a star for every day, and the stretch weeks move them on just when they are ready. Print one week at a time if you prefer: the pages are grouped by week.</p>""",
        'faq': [('How does it get harder?', 'Weeks 1 and 2 are at your child\'s level. In week 3 the reading pages move up a level, and in week 4 the maths moves up too.'),
                ('Is this part of PrintPals Plus?', 'Yes. You can try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year, and you can cancel any time.')],
    },
    {
        'id': 'activitybook', 'cat': 'packs', 'slug': 'personalised-activity-book', 'tint': '#fff0f5', 'icon': '📚', 'new': False, 'plus': True,
        'nav': 'Activity book',
        'title': 'Personalised Activity Book for Kids | Printable, With Their Name | PrintPals',
        'desc': 'Make a personalised activity book for your child in one click: 10 to 40 pages of mazes, dot to dot, colouring, puzzles and drawing on their favourite theme, with their name, page numbers and a certificate.',
        'h1': 'Personalised activity book',
        'lead': 'A whole activity book with your child\'s name on the cover: mazes, dot to dot, puzzles, drawing and colouring on their favourite theme. Perfect for holidays, journeys and birthday gifts.',
        'card': 'A whole activity book with their name on the cover, up to 40 pages.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '5'))
        + field('Theme', '<select name="theme">' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('animals', 'Animals'), ('space', 'Space'), ('sea', 'Under the sea'), ('go', 'Things that go'), ('magic', 'Magic and unicorns'), ('garden', 'Bugs and gardens')]) + '</select>')
        + field('Pages', seg('pages', [('12', '12'), ('24', '24'), ('40', '40')], '24'))
        + check('certificate', 'Certificate at the end') + check('key', 'Answer pages at the back') + check('credit', 'Show printpals.web.app on the cover')
        + SHUFFLE + PAPER,
        'article': """<h2>A gift they will actually use</h2><p>Print it double sided, fold or staple it, and you have a real book with their name on it. Use the Pages option for a quick 12 page booklet for a restaurant, or a big 40 page book for a long journey or the school holidays.</p>""",
        'faq': [('Can I print it as a book?', 'Yes. Print double sided and staple along the left edge, or take the PDF to a print shop and ask for it to be bound.'),
                ('Is this part of PrintPals Plus?', 'Yes. You can try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year, and you can cancel any time.')],
    },
    {
        'id': 'passport', 'cat': 'packs', 'slug': 'learning-passport', 'tint': '#fff6e0', 'icon': '🛂', 'new': False,
        'nav': 'Learning passport',
        'title': 'Free Printable Learning Passport for Kids | Stamps, Skills and Goals | PrintPals',
        'desc': 'A free printable learning passport for children: a cover with their name, an all about me page, learning stamps to colour after every pack, and an "I can do it" skills page for their age.',
        'h1': 'Learning passport',
        'lead': 'A passport that grows with your child. Stamp it after every pack or week of learning, and colour a star for each new skill they master.',
        'card': 'Stamp it after every pack, and colour a star for each new skill.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '5'), 'Chooses the skills on the "I can do it" page.')
        + field('Stamps', seg('stamps', [('12', '12 stamps'), ('24', '24 stamps')], '12'))
        + PAPER,
        'article': """<h2>A reason to come back</h2><p>Keep the passport somewhere special. Each time your child finishes a weekly pack or a busy week, add a stamp or a sticker together and write the date. Watching the stamps fill up is a wonderful motivator.</p>""",
        'faq': [('Can I print more stamp pages?', 'Yes. Choose 24 stamps, or print the stamp page again whenever the first one is full.')],
    },
    {
        'id': 'classpack', 'cat': 'packs', 'slug': 'class-pack-for-teachers', 'tint': '#e8f8f4', 'icon': '🏫', 'new': False, 'plus': True,
        'nav': 'Class packs',
        'title': 'Class Packs for Teachers | Name Tracing, Labels, Certificates for Every Child | PrintPals',
        'desc': 'Paste your class list and get a personalised set for every child in one click: name tracing, desk labels, bookmarks, reward charts, a story starring each child and certificates.',
        'h1': 'Class packs for teachers',
        'lead': 'Paste your class list once. Get name tracing, desk labels, bookmarks, reward charts, a story starring each child and a certificate for everyone, all in one print.',
        'card': 'Paste the class list once and get a personalised set for every child.',
        'form': field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.')
        + check('trace', 'Name tracing sheets') + check('labels', 'Desk name labels') + check('bookmarks', 'Bookmarks') + check('reward', 'Reward charts') + check('story', 'A story starring each child') + check('certificates', 'Certificates')
        + field('Reward chart goal (optional)', '<input type="text" name="goal" maxlength="40" placeholder="I read every day" autocomplete="off">')
        + field('Certificate reads (optional)', '<input type="text" name="reason" maxlength="60" placeholder="for a brilliant first term!" autocomplete="off">')
        + SHUFFLE + PAPER,
        'article': """<h2>Your first week, done in a minute</h2><p>New class? Print the desk labels, name tracing and bookmarks for day one. End of term? Print a certificate and a story starring every child. Names are never sent anywhere: the whole pack is made inside your browser.</p>""",
        'faq': [('Is my class list private?', 'Yes. Everything is made on your own device. The names never leave your computer.'),
                ('Is this part of PrintPals Plus?', 'Yes, it is part of the teacher plan. You can try it free for 7 days, no card needed. After that, the teacher plan is $59 a year.')],
    },
    {
        'id': 'homelang', 'cat': 'reading', 'slug': 'bilingual-flashcards', 'tint': '#e6f6fc', 'icon': '🌍', 'new': False,
        'nav': 'Home language cards',
        'title': 'Free Bilingual Flashcards for Kids | Spanish, French, Swahili or Your Own Language | PrintPals',
        'desc': 'Free printable bilingual picture flashcards: English with Spanish, French, German, Italian, Portuguese or Swahili, or type the words in any language your family speaks. Flashcards or a word mat.',
        'h1': 'Home language flashcards',
        'lead': 'Keep your family\'s language alive. Picture flashcards in English and another language, or type the words yourself in any language you speak at home: Yoruba, Hindi, Polish, Tagalog, anything.',
        'card': 'Picture cards in English and your home language, any language at all.',
        'form': field('Language', '<select name="language"><option value="spanish">Spanish</option><option value="french">French</option><option value="german">German</option><option value="italian">Italian</option><option value="portuguese">Portuguese (Brazil)</option><option value="swahili">Swahili</option><option value="own">My own language (type the words)</option></select>')
        + field('Words', seg('set', [('animals', 'Animals'), ('food', 'Food'), ('things', 'Things')], 'animals'))
        + field('Layout', seg('layout', [('cards', 'Flashcards'), ('mat', 'Word mat')], 'cards'))
        + field('My own language (optional)', '<input type="text" name="langname" maxlength="24" placeholder="Yoruba" autocomplete="off">')
        + field('My own words (optional)', '<textarea name="custom" rows="5" spellcheck="false" placeholder="cat = ologbo&#10;dog = aja&#10;fish = eja"></textarea>', 'Choose "My own language" above. One word per line: English = your word. Animals, fruit and everyday words get a picture.')
        + PAPER,
        'article': """<h2>Two languages are a gift</h2><p>Children who grow up with two languages find it easier to learn more later, and they stay close to grandparents and family. Say both words out loud, play snap with two sets, or stick the word mat on the fridge. Whatever language your family speaks, you can type it in yourself.</p>""",
        'faq': [('My language is not in the list. Can I still use it?', 'Yes. Choose "My own language", type its name, and add your words one per line like this: cat = ologbo. The card shows the picture, your word big, and the English word small.')],
    },
    {
        'id': 'storydice', 'cat': 'reading', 'slug': 'story-dice-printable', 'tint': '#fff6e0', 'icon': '🎲', 'new': False,
        'nav': 'Story dice',
        'title': 'Free Printable Story Dice for Kids | Roll and Tell a Story | PrintPals',
        'desc': 'Free printable story dice: three picture dice to cut and fold (who, where and what), plus a story mat to draw and write the beginning, middle and end.',
        'h1': 'Story dice',
        'lead': 'Roll three dice, then tell a story with a hero, a place and a surprise. Brilliant for speaking, imagination and early writing.',
        'card': 'Picture dice to cut and fold, then roll and tell a story.',
        'form': field('Dice', seg('set', [('adventure', 'Adventure'), ('feelings', 'Feelings')], 'adventure'))
        + check('mat', 'Story mat (start, middle, end)') + PAPER,
        'article': """<h2>Talk first, write later</h2><p>Young children can tell far better stories than they can write. Let them tell the story out loud first, then draw it on the story mat. Older children can write a sentence for each part.</p>""",
        'faq': [('How do I make the dice stronger?', 'Print on thin card, or glue the page onto a cereal box before cutting.')],
    },
    {
        'id': 'signs', 'cat': 'charts', 'slug': 'first-day-of-school-sign', 'tint': '#fff0f5', 'icon': '📸', 'new': False,
        'nav': 'Milestone signs',
        'title': 'Free First Day of School Sign Printable | Last Day, 100 Days, Birthday | PrintPals',
        'desc': 'Free printable milestone signs for photos: first day of school, last day of school, 100 days of school, birthday, first lost tooth and big brother or sister. Add their name and favourites.',
        'h1': 'Milestone signs',
        'lead': 'The photo you will treasure forever. A bright sign for the first day of school and every big moment, with their name and favourite things.',
        'card': 'First day of school, birthday and big moment signs for photos.',
        'form': field('Moment', '<select name="kind"><option value="firstday">First day of school</option><option value="lastday">Last day of school</option><option value="hundred">100 days of school</option><option value="birthday">Birthday</option><option value="tooth">First lost tooth</option><option value="sibling">Big brother or sister</option></select>')
        + field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Class, year or grade (optional)', '<input type="text" name="grade" maxlength="24" placeholder="Year 1" autocomplete="off">', 'For "big brother or sister", type brother! or sister!')
        + field('Age (optional)', '<input type="text" name="age" maxlength="3" placeholder="5" autocomplete="off">')
        + field('Favourites (optional)', '<input type="text" name="colour" maxlength="30" placeholder="Favourite colour" autocomplete="off"><input type="text" name="food" maxlength="30" placeholder="Favourite food" autocomplete="off" style="margin-top:8px"><input type="text" name="teacher" maxlength="30" placeholder="Teacher\'s name" autocomplete="off" style="margin-top:8px"><input type="text" name="grow" maxlength="30" placeholder="When I grow up I want to be" autocomplete="off" style="margin-top:8px">', 'Leave any empty to write it by hand.')
        + PAPER,
        'article': """<h2>A photo every year</h2><p>Take the same photo on the first day of every school year, holding the sign, in the same spot. Put them side by side at the end of school and you will have the most precious timeline of all.</p>""",
        'faq': [('Can I leave the favourites blank?', 'Yes. Empty boxes stay blank so your child can write or draw their answers.')],
    },
    {
        'id': 'screentime', 'cat': 'charts', 'slug': 'screen-time-tickets', 'tint': '#eef2ff', 'icon': '🎟️', 'new': False,
        'nav': 'Screen time tickets',
        'title': 'Free Printable Screen Time Tickets for Kids | End the Screen Time Battles | PrintPals',
        'desc': 'Free printable screen time tickets: children earn tickets for reading, playing outside and helping, then swap them for 15 or 30 minutes of screen time. With a "how to earn" chart.',
        'h1': 'Screen time tickets',
        'lead': 'No more arguments about screens. Children earn tickets for reading, playing outside and helping, then choose when to spend them.',
        'card': 'Earn tickets for good things, then swap them for screen time.',
        'form': field('Each ticket is', seg('minutes', [('15', '15 minutes'), ('30', '30 minutes')], '15'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Sam" autocomplete="off">')
        + check('chart', '"How to earn a ticket" chart')
        + field('Ways to earn (optional)', '<textarea name="earn" rows="4" spellcheck="false" placeholder="Read a book: 1 ticket&#10;Play outside: 1 ticket"></textarea>', 'One per line. Leave empty for our ideas.')
        + PAPER,
        'article': """<h2>Why tickets work</h2><p>Tickets turn "no" into "yes, when you have a ticket". Children feel in control, and screens become something they earn rather than something they fight for. Keep the tickets in a jar where everyone can see them.</p>""",
        'faq': [('How many tickets should they earn?', 'Start small: two or three a day is plenty for most families. You can change the ways to earn at any time.')],
    },
    {
        'id': 'siblings', 'cat': 'world', 'slug': 'sibling-turn-taking-chart', 'tint': '#f1f8e6', 'icon': '👫', 'new': False,
        'nav': 'Sibling peace pack',
        'title': 'Free Sibling Turn Taking Chart and Kindness Coupons | Sibling Peace Pack | PrintPals',
        'desc': 'Free printables to stop sibling arguments: a whose turn is it chart, a turn spinner, team rules to sign and kindness coupons for brothers and sisters.',
        'h1': 'Sibling peace pack',
        'lead': '"It\'s my turn!" "No, it\'s mine!" A turn taking chart, a spinner, team rules and kindness coupons to bring a little peace to your home.',
        'card': 'A turn taking chart, spinner, team rules and kindness coupons.',
        'form': field('Children\'s names', '<textarea name="names" rows="3" spellcheck="false" placeholder="Mia&#10;Leo"></textarea>', 'Two to four names, one per line.')
        + field('Things to take turns with (optional)', '<textarea name="jobs" rows="3" spellcheck="false" placeholder="Goes first&#10;Chooses the film"></textarea>')
        + check('turns', 'Whose turn chart') + check('spinner', 'Turn spinner') + check('rules', 'Team rules') + check('coupons', 'Kindness coupons')
        + PAPER,
        'article': """<h2>Fair is calm</h2><p>Most sibling fights are about fairness. When the chart decides whose turn it is, nobody has to argue, and nobody has to be the referee. Praise every kind moment you see: children do more of what gets noticed.</p>""",
        'faq': [('Does it work for more than two children?', 'Yes. Add up to four names and the chart, spinner and signatures share turns between everyone.')],
    },
    {
        'id': 'lunchnotes', 'cat': 'world', 'slug': 'lunchbox-notes-for-kids', 'tint': '#fff0f0', 'icon': '🥪', 'new': False,
        'nav': 'Lunchbox notes',
        'title': 'Free Printable Lunchbox Notes for Kids | Love Notes and Jokes | PrintPals',
        'desc': 'Free printable lunchbox notes with love notes and funny jokes, personalised with your child\'s name and signed from you. Ten notes a page, bright or to colour in.',
        'h1': 'Lunchbox notes',
        'lead': 'A little note that says "I\'m thinking of you". Love notes and silly jokes to tuck into a lunchbox, a bag or under a pillow.',
        'card': 'Love notes and silly jokes to tuck into their lunchbox.',
        'form': field('Notes', seg('kind', [('mix', 'Love notes and jokes'), ('love', 'Love notes'), ('jokes', 'Jokes'), ('blank', 'Write my own')], 'mix'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Signed from (optional)', '<input type="text" name="from" maxlength="20" placeholder="Mummy" autocomplete="off">')
        + field('Style', seg('style', [('bright', 'Bright'), ('colour', 'To colour in')], 'bright'))
        + SHUFFLE + PAPER,
        'article': """<h2>Small notes, big smiles</h2><p>A note in a lunchbox tells a child they are loved, even on a hard day. The joke answers are printed upside down, so they can share the fun with their friends.</p>""",
        'faq': [('Can I write my own messages?', 'Yes. Choose "Write my own" for blank notes to write by hand.')],
    },
    {
        'id': 'schoolready', 'cat': 'packs', 'slug': 'ready-for-school-pack', 'tint': '#e8f8f4', 'icon': '🏫', 'new': False,
        'nav': 'Ready for school',
        'title': 'Free Starting School Pack | Ready for School Checklist, All About Me, Countdown | PrintPals',
        'desc': 'A free ready for school pack for children starting school or nursery: an "I can do it myself" checklist, All about me for the teacher, a school morning routine, bag checklist, feelings page, countdown and first day sign.',
        'h1': 'Ready for school pack',
        'lead': 'Starting school is a big step for little ones, and for grown-ups too. Practise the skills that matter, share what makes your child special with their teacher, and count down to the big day together.',
        'card': 'Everything for starting school: skills checklist, all about me, countdown and first day sign.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + field('Starting', seg('place', [('school', 'School'), ('nursery', 'Nursery'), ('preschool', 'Preschool'), ('kindergarten', 'Kindergarten'), ('reception', 'Reception')], 'school'))
        + field('Days to count down', seg('days', [('7', '7'), ('14', '14'), ('21', '21'), ('30', '30')], '14'))
        + PAPER,
        'article': """<h2>Confidence is the best school bag</h2><p>Teachers say the children who settle fastest are the ones who can do small things for themselves: open their lunchbox, put on their shoes, ask for help. Practise one skill a day, and talk about school as something exciting. The "All about me" page helps the teacher know your child from the very first morning.</p>""",
        'faq': [('When should we start?', 'Two to four weeks before the first day is perfect. Choose the countdown length to match.')],
    },
    {
        'id': 'holidayplan', 'cat': 'packs', 'slug': 'holiday-learning-plan', 'tint': '#fff6e0', 'icon': '🏖️', 'new': False, 'plus': True,
        'nav': 'Holiday learning plan',
        'title': 'Holiday Learning Plan for Kids | Stop the Summer Slide, 3 Days a Week | PrintPals',
        'desc': 'A personalised school holiday learning plan: 2, 4 or 6 weeks of short reading, maths and fun pages three days a week, a holiday bucket list, a reading log and a certificate. Keeps skills fresh without spoiling the holiday.',
        'h1': 'Holiday learning plan',
        'lead': 'Keep skills fresh over the holidays without spoiling the fun: a few short pages three days a week, a bucket list of adventures, a reading log and a certificate at the end.',
        'card': 'Light learning over the holidays, with a bucket list and reading log.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7+')], '5'))
        + field('Holiday length', seg('weeks', [('2', '2 weeks'), ('4', '4 weeks'), ('6', '6 weeks')], '4'))
        + field('Pages each learning day', seg('per', [('1', '1'), ('2', '2')], '1'))
        + field('Theme', '<select name="theme">' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('sea', 'Under the sea'), ('animals', 'Animals'), ('space', 'Space'), ('go', 'Things that go'), ('magic', 'Magic and unicorns'), ('garden', 'Bugs and gardens')]) + '</select>')
        + check('certificate', 'Certificate at the end') + check('key', 'Answer pages')
        + SHUFFLE + PAPER,
        'article': """<h2>Beat the summer slide</h2><p>Children can lose a little of what they learned over a long break. Just ten minutes, three days a week, keeps reading and maths fresh, and leaves plenty of time for adventures. The last weeks gently stretch reading ready for the new school year.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. You can try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year, and you can cancel any time.')],
    },
    {
        'id': 'calmkit', 'cat': 'world', 'slug': 'calm-down-kit-for-kids', 'tint': '#eef2ff', 'icon': '🌈', 'new': False,
        'nav': 'Big feelings toolkit',
        'title': 'Free Calm Down Kit for Kids | Breathing Cards, Feelings Thermometer, Worry Jar | PrintPals',
        'desc': 'A free printable calm down kit for children with big feelings: breathing exercises (star, rainbow, balloon), calm down choice cards, a feelings thermometer and a worry jar with slips.',
        'h1': 'Big feelings toolkit',
        'lead': 'Tantrums, worries and meltdowns are hard for everyone. Give your child simple tools to calm their body and name their feelings: breathing games, calm down choices, a feelings thermometer and a worry jar.',
        'card': 'Breathing games, calm down cards, a feelings thermometer and a worry jar.',
        'form': check('breathing', 'Breathing games') + check('choices', 'Calm down choice cards') + check('thermometer', 'Feelings thermometer') + check('worry', 'Worry jar and slips') + PAPER,
        'article': """<h2>Practise when calm</h2><p>Children cannot learn a new skill in the middle of a meltdown. Practise the breathing games at calm times, like bedtime, so they become easy to use when big feelings arrive. Stay close, keep your voice low, and name the feeling: "You are really cross. I am here."</p>""",
        'faq': [('What age is this for?', 'The breathing games work from about age 3. The thermometer and worry jar suit ages 4 to 10.')],
    },
    {
        'id': 'socialstory', 'cat': 'world', 'slug': 'social-stories-for-kids', 'tint': '#e6f6fc', 'icon': '📖', 'new': False,
        'nav': 'Social stories',
        'title': 'Free Personalised Social Stories for Kids | Dentist, Doctor, Haircut, New Baby, Flying | PrintPals',
        'desc': 'Free printable social stories with your child\'s name, to prepare them for new experiences: the dentist, doctor, a haircut, a new baby, moving house, flying and a first sleepover.',
        'h1': 'Social stories',
        'lead': 'New experiences can be scary. A short story with your child\'s name, read a few times beforehand, helps them know exactly what will happen. Wonderful for anxious children and for autistic children.',
        'card': 'Short stories with their name that prepare them for new experiences.',
        'form': field('The story', '<select name="topic"><option value="dentist">Going to the dentist</option><option value="doctor">Going to the doctor</option><option value="haircut">Having a haircut</option><option value="baby">A new baby is coming</option><option value="moving">Moving to a new home</option><option value="flying">Going on an aeroplane</option><option value="sleepover">My first sleepover</option></select>')
        + field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Who will come with them? (optional)', '<input type="text" name="who" maxlength="20" placeholder="Mummy" autocomplete="off">')
        + PAPER,
        'article': """<h2>Knowing what comes next</h2><p>Social stories describe a new situation calmly, step by step, from the child's point of view. Read the story together several times in the days before, and bring it along on the day. The last page lets your child draw how it went.</p>""",
        'faq': [('What is a social story?', 'A short, simple story that explains a situation and what to expect. They are widely used to help children feel safe and prepared.')],
    },
    {
        'id': 'foods', 'cat': 'world', 'slug': 'picky-eater-food-chart', 'tint': '#f1f8e6', 'icon': '🥦', 'new': False,
        'nav': 'Food explorer',
        'title': 'Free Picky Eater Chart | Food Explorer Passport and Eat the Rainbow Chart | PrintPals',
        'desc': 'Free printables for picky eaters: a food explorer passport where children rate new foods they try, an eat the rainbow weekly chart, and a favourite plate to draw.',
        'h1': 'Food explorer',
        'lead': 'Turn trying new food into an adventure. Children collect foods in their explorer passport, rate them with a face, and colour the rainbow as they eat fruit and vegetables.',
        'card': 'A food explorer passport and eat the rainbow chart for picky eaters.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Sam" autocomplete="off">')
        + check('passport', 'Food explorer passport') + check('rainbow', 'Eat the rainbow chart') + check('plate', 'My favourite plate') + PAPER,
        'article': """<h2>One tiny taste counts</h2><p>Children often need to try a new food many times before they like it. Celebrate every tiny taste, even if they do not like it yet: "You were so brave to try it!" No pressure, lots of praise, and let them see you enjoying the same food.</p>""",
        'faq': [('What if my child refuses to try anything?', 'Start with touching or smelling a new food, and count that as exploring. Tiny steps build confidence.')],
    },
    {
        'id': 'talkcards', 'cat': 'world', 'slug': 'conversation-cards-for-kids', 'tint': '#fff0f5', 'icon': '💬', 'new': False,
        'nav': 'Conversation cards',
        'title': 'Free Conversation Cards for Kids | Dinner Table, Car Journey, Bedtime, Grandparents | PrintPals',
        'desc': 'Free printable conversation starter cards for families: dinner table questions, car journey games, bedtime chats and questions to ask grandparents.',
        'h1': 'Conversation cards',
        'lead': 'Swap "How was school?" "Fine." for real conversations. Question cards for dinner, the car, bedtime and grandparents.',
        'card': 'Question cards for dinner, the car, bedtime and grandparents.',
        'form': field('Cards', seg('set', [('dinner', 'Dinner'), ('car', 'Car'), ('bedtime', 'Bedtime'), ('grandparents', 'Grandparents'), ('all', 'All four')], 'dinner')) + PAPER,
        'article': """<h2>Put the phones down</h2><p>Keep the cards in a jar on the table. Everyone takes a turn to pick one, and everyone answers, grown-ups too. The grandparents cards are perfect for video calls with family far away.</p>""",
        'faq': [('What age is this for?', 'Ages 3 and up. Younger children can answer with a picture or a single word.')],
    },
    {
        'id': 'sleep', 'cat': 'charts', 'slug': 'bedtime-chart-and-ok-to-wake-sign', 'tint': '#eef2ff', 'icon': '🌙', 'new': False,
        'nav': 'Sleep pack',
        'title': 'Free Bedtime Pass, OK to Wake Sign and Stay in Bed Chart | Sleep Pack | PrintPals',
        'desc': 'A free printable sleep pack for children who get out of bed: bedtime passes, a two sided OK to wake door sign, a stay in bed reward chart and a bedtime routine.',
        'h1': 'Sleep pack',
        'lead': 'For the child who pops out of bed again and again, or wakes at 5am. Bedtime passes, an "OK to wake" sign, a stay in bed chart and a calm routine.',
        'card': 'Bedtime passes, an OK to wake sign and a stay in bed chart.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + check('ok', '"OK to wake" sign') + check('pass', 'Bedtime passes') + check('chart', 'Stay in bed chart') + check('routine', 'Bedtime routine cards') + PAPER,
        'article': """<h2>How bedtime passes work</h2><p>Each night your child gets one pass. They can swap it for one quick thing after lights out: a drink, a hug or a trip to the toilet. Once it is used, it is time to stay in bed. Children feel in control, and the endless call-backs stop. Turn the sign to the sun side when it is time to get up.</p>""",
        'faq': [('How do I use the OK to wake sign?', 'Hang it on the door showing the moon at bedtime. At your chosen wake up time, turn it to the sun. Praise every morning they wait!')],
    },
    {
        'id': 'gratitude', 'cat': 'charts', 'slug': 'gratitude-journal-for-kids', 'tint': '#fff6e0', 'icon': '🙏', 'new': False,
        'nav': 'Gratitude journal',
        'title': 'Free Printable Gratitude Journal for Kids | Three Good Things | PrintPals',
        'desc': 'A free printable gratitude and happy journal for kids: three good things, a kind moment, something they are proud of and a picture every day, or a thankful week on one page.',
        'h1': 'Gratitude journal',
        'lead': 'Three good things a day builds a happier, kinder child. A week of journal pages, or a thankful week on one page for younger children.',
        'card': 'Three good things, kindness and pride, one page a day.',
        'form': field('Journal', seg('kind', [('daily', '7 daily pages'), ('week', 'A week on one page')], 'daily'))
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">') + PAPER,
        'article': """<h2>A happy habit</h2><p>Fill it in together at bedtime. Noticing good things, big or tiny, helps children feel calmer and more positive. Share your own three good things too.</p>""",
        'faq': [('What if my child cannot write yet?', 'They can draw, and you can write their words for them. Choose a week on one page for younger children.')],
    },
    {
        'id': 'potty', 'cat': 'charts', 'slug': 'potty-training-chart', 'tint': '#e8f8f4', 'icon': '🚽', 'new': False,
        'nav': 'Potty training',
        'title': 'Free Potty Training Chart and Printables | Picture Steps, Sticker Chart, Certificate | PrintPals',
        'desc': 'A free printable potty training pack: picture steps for using the potty, a sticker chart with your child\'s name and a certificate to celebrate.',
        'h1': 'Potty training pack',
        'lead': 'Everything for potty training in one print: picture steps to follow, a sticker chart with their name, and a certificate for the big day.',
        'card': 'Picture steps, a sticker chart and a certificate for potty training.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Chart pictures', seg('theme', [('stars', 'Stars'), ('hearts', 'Hearts'), ('rockets', 'Rockets'), ('dinos', 'Dinos')], 'stars'))
        + check('steps', 'Picture steps') + check('chart', 'Sticker chart') + check('certificate', 'Certificate') + PAPER,
        'article': """<h2>Patience and praise</h2><p>Stick the picture steps next to the potty or toilet, and go through them together every time. Celebrate each try, not only each success. Accidents are part of learning: stay calm and say "Let's try again next time."</p>""",
        'faq': [('When should we start?', 'Most children are ready between 2 and 3 years old, when they can tell you they need to go and stay dry for a couple of hours.')],
    },
    {
        'id': 'storybook', 'cat': 'packs', 'slug': 'personalised-storybook', 'tint': '#f5edff', 'icon': '📕', 'new': False, 'plus': True,
        'nav': 'Personalised storybook',
        'title': 'Personalised Storybook for Kids | Your Child Is the Hero, Printable and Colour In | PrintPals',
        'desc': 'A printable personalised storybook where your child is the hero: 12 pages with their name, pictures to colour, a dedication page from you and a page to draw their favourite part.',
        'h1': 'Personalised storybook',
        'lead': 'A real picture book where your child is the hero. Their name on the cover and every page, pictures to colour in, and a dedication from you. A gift they will keep.',
        'card': 'A picture book starring your child, with pictures to colour.',
        'form': field('Story', seg('story', [('star', 'The Lost Star'), ('party', 'Big Animal Party'), ('sea', 'Under the Sea'), ('dino', 'Sleepy Dinosaur'), ('garden', 'Magic Garden'), ('snow', 'Snowy Surprise'), ('jungle', 'Jungle Band'), ('kind', 'Kind Heart Day')], 'star'))
        + field('Cover design', seg('look', [('rainbow', '🌈 Rainbow'), ('ocean', '🐳 Ocean'), ('garden', '🌻 Garden'), ('space', '🚀 Space')], 'rainbow'))
        + field('Child\'s name', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + field('With love from (optional)', '<input type="text" name="from" maxlength="30" placeholder="Grandma and Grandpa" autocomplete="off">')
        + PAPER,
        'article': """<h2>Make it a keepsake</h2><p>Print double sided, fold and staple, or take the PDF to a print shop and ask for it to be bound. Grandparents far away can make one and post it, and it makes a beautiful birthday gift.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. You can try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year, and you can cancel any time.')],
    },
    {
        'id': 'invites', 'cat': 'crafts', 'slug': 'birthday-party-invitations', 'tint': '#fff0f5', 'icon': '💌', 'new': False,
        'nav': 'Party invitations',
        'title': 'Free Printable Birthday Party Invitations for Kids | Personalised, 4 per Page | PrintPals',
        'desc': 'Free printable kids birthday party invitations with your child\'s name, age, date, time, place and RSVP. Balloons, animals or sweet treats, bright or colour in. 4 per page.',
        'h1': 'Party invitations',
        'lead': 'Beautiful birthday invitations in two minutes. Add the details once, print, cut into four, and your child can colour their own if you choose the colour in style.',
        'card': 'Personalised birthday invitations, 4 per page, bright or colour in.',
        'form': field("Birthday child's name", '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Age they are turning (optional)', '<select name="age"><option value="">Leave out</option>' + ''.join(f'<option>{a}</option>' for a in range(1, 13)) + '</select>')
        + field('Date', '<input type="text" name="date" maxlength="34" placeholder="Saturday 14 June" autocomplete="off">')
        + field('Time', '<input type="text" name="time" maxlength="34" placeholder="2pm to 4pm" autocomplete="off">')
        + field('Where', '<input type="text" name="place" maxlength="34" placeholder="The park café" autocomplete="off">')
        + field('Please reply to', '<input type="text" name="rsvp" maxlength="34" placeholder="Emma, 07700 900123" autocomplete="off">', 'Leave any line empty to write it by hand.')
        + field('Theme', seg('theme', [('balloons', 'Balloons'), ('animals', 'Animals'), ('sweet', 'Sweet treats')], 'balloons'))
        + field('Style', seg('style', [('bright', 'Bright'), ('colour', 'Colour in')], 'bright')) + PAPER,
        'article': """<h2>Let them help</h2><p>Choose the colour in style and let your child decorate each invitation for their friends. It keeps them busy, builds excitement, and every guest gets a card like no other. For privacy, write your phone number by hand rather than typing it.</p>""",
        'faq': [('Can I print on card?', 'Yes. Thin card (160 to 200 gsm) makes lovely sturdy invitations and works in most home printers.')],
    },
    {
        'id': 'countdown', 'cat': 'charts', 'slug': 'countdown-calendar-for-kids', 'tint': '#fff6e0', 'icon': '⏳', 'new': False,
        'nav': 'Countdown calendar',
        'title': 'Free Printable Countdown Calendar for Kids | Christmas, Eid, Diwali, Birthday, Holiday | PrintPals',
        'desc': 'A free printable countdown calendar for children: count down to Christmas, Eid, Diwali, a birthday, a holiday or any big day, with a little family activity for each day.',
        'h1': 'Countdown calendar',
        'lead': '"How many more sleeps?" Now they can see it. Colour one box a day until the big day, with a small, lovely family activity in each box.',
        'card': 'Count down the sleeps to a big day, with an activity each day.',
        'form': field('Counting down to', '<select name="occasion"><option value="christmas">Christmas</option><option value="eid">Eid</option><option value="diwali">Diwali</option><option value="birthday">My birthday</option><option value="holiday">Our holiday</option><option value="newyear">New Year</option><option value="custom">Something else</option></select>')
        + field('Something else (optional)', '<input type="text" name="custom" maxlength="24" placeholder="Grandma\'s visit" autocomplete="off">')
        + field('Days', seg('days', [('24', '24'), ('12', '12'), ('7', '7')], '24'))
        + check('ideas', 'A little activity in each box') + PAPER + SHUFFLE,
        'article': """<h2>Making waiting fun</h2><p>Young children find waiting really hard, because time is hard to picture. Colouring a box each morning makes the wait visible. The little activities are free and simple, like calling someone you love or building a blanket fort, so the countdown becomes family time.</p>""",
        'faq': [('Is it only for festivals?', 'No. Choose "Something else" and type anything: a new baby, a visit from Grandma, the first day of school or moving house.')],
    },
    {
        'id': 'teeth', 'cat': 'charts', 'slug': 'tooth-brushing-chart', 'tint': '#e6f6fc', 'icon': '🪥', 'new': False,
        'nav': 'Tooth brushing chart',
        'title': 'Free Printable Tooth Brushing Chart for Kids | Morning and Night | PrintPals',
        'desc': 'A free printable tooth brushing chart for children: 31 days of morning and night teeth to colour, plus a picture guide showing how to brush properly.',
        'h1': 'Tooth brushing chart',
        'lead': 'No more toothbrush battles. Colour a tooth every morning and every night, and follow the picture steps for a proper two minute clean.',
        'card': 'Colour a tooth morning and night, plus how to brush.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Sam" autocomplete="off">')
        + check('guide', 'How to brush picture guide') + PAPER,
        'article': """<h2>Two minutes, twice a day</h2><p>Brush for two minutes, morning and night, with a blob of fluoride toothpaste the size of a pea. Spit, but do not rinse, so the toothpaste keeps working. Young children need a grown-up to help or check until they are about 7.</p>""",
        'faq': [('How much toothpaste should my child use?', 'A smear for babies and toddlers under 3, and an amount the size of a pea from age 3. Always check local dental advice.')],
    },
    {
        'id': 'familyrules', 'cat': 'world', 'slug': 'family-rules-poster', 'tint': '#fff0f5', 'icon': '🏡', 'new': False,
        'nav': 'Family rules poster',
        'title': 'Free Printable Family Rules Poster | Personalised House Rules for Kids | PrintPals',
        'desc': 'A free printable family rules poster with your family name and your own rules. Bright, or colour it in together.',
        'h1': 'Family rules poster',
        'lead': 'Write your family\'s rules together, then hang them up. Children follow rules they helped to make. Use ours or write your own.',
        'card': 'A house rules poster with your family name and your own rules.',
        'form': field('Family name (optional)', '<input type="text" name="family" maxlength="24" placeholder="Taylor" autocomplete="off">')
        + field('Your rules (one per line)', '<textarea name="rules" rows="6" spellcheck="true" placeholder="We say please and thank you&#10;We use kind words&#10;We tell the truth&#10;We help each other&#10;We laugh a lot&#10;We love each other, always"></textarea>', 'Leave empty to use our ten rules. Starting each rule with "We" works beautifully.')
        + field('Style', seg('style', [('bright', 'Bright'), ('colour', 'Colour in')], 'bright')) + PAPER,
        'article': """<h2>Make them together</h2><p>Sit down as a family and ask: "What makes our home a happy place?" Turn the answers into short, positive rules that start with "We", so they apply to grown-ups too. Hang the poster where everyone can see it.</p>""",
        'faq': [('How many rules should we have?', 'Five to eight is plenty for young children. Fewer rules are easier to remember.')],
    },
    {
        'id': 'sitter', 'cat': 'charts', 'slug': 'babysitter-information-sheet', 'tint': '#fff0f0', 'icon': '📋', 'new': False,
        'nav': 'Babysitter info sheet',
        'title': 'Free Printable Babysitter Information Sheet | Grandparents, Childminder, Emergency Contacts | PrintPals',
        'desc': 'A free printable babysitter and grandparent information sheet: allergies and medicines, bedtime, food, what calms your child, favourite games, house rules and emergency contacts.',
        'h1': 'Babysitter info sheet',
        'lead': 'Everything a babysitter, grandparent or friend needs to know about your child, on one page for the fridge. Leave boxes empty to fill in by hand.',
        'card': 'Allergies, bedtime, comforts and emergency contacts on one page.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Mia" autocomplete="off">')
        + field('Allergies and medicines', '<input type="text" name="allergies" maxlength="60" placeholder="None" autocomplete="off">')
        + field('Bedtime and naps', '<input type="text" name="bedtime" maxlength="60" placeholder="Bath at 6.30, bed at 7, one story" autocomplete="off">')
        + field('Food', '<input type="text" name="food" maxlength="60" placeholder="Loves pasta and apples" autocomplete="off">')
        + field('What calms them', '<input type="text" name="calm" maxlength="60" placeholder="A cuddle with Bunny and a song" autocomplete="off">')
        + field('Favourite games', '<input type="text" name="fun" maxlength="60" placeholder="Hide and seek, building blocks" autocomplete="off">')
        + field('House rules', '<input type="text" name="rules" maxlength="60" placeholder="No screens after 6pm" autocomplete="off">', 'Write phone numbers and your address by hand. They are never typed here.')
        + PAPER,
        'article': """<h2>Peace of mind</h2><p>Knowing how your child likes to be comforted makes a huge difference when you are not there. Update the sheet as your child grows, and keep a copy in the nappy bag or school bag too.</p>""",
        'faq': [('Why can I not type phone numbers?', 'To keep your family safe, we leave the emergency contacts for you to write by hand. Nothing you type ever leaves your device, but a printed sheet can.')],
    },
    {
        'id': 'science', 'cat': 'world', 'slug': 'kitchen-science-experiments-for-kids', 'tint': '#e8f8f4', 'icon': '🧪', 'new': False,
        'nav': 'Kitchen science',
        'title': 'Free Kitchen Science Experiments for Kids | Printable Worksheets | PrintPals',
        'desc': 'Free printable kitchen science experiments for children: sink or float, dancing raisins, walking water, fizzing volcano, magic pepper and ice melting race. Each with a need list, steps, a prediction and a drawing box.',
        'h1': 'Kitchen science',
        'lead': 'Real science with things already in your kitchen. Each sheet has what you need, simple steps, a space to guess what will happen, a box to draw what did, and why it works.',
        'card': 'Six easy experiments with things from your kitchen.',
        'form': field('Experiment', '<select name="experiment"><option value="float">Sink or float?</option><option value="raisins">Dancing raisins</option><option value="walking">Walking water</option><option value="volcano">Fizzing volcano</option><option value="pepper">Magic pepper</option><option value="ice">Ice melting race</option></select>') + PAPER,
        'article': """<h2>Guess first</h2><p>The most important part of science is making a guess before you start. It does not matter if the guess is wrong: that is where the learning happens. Ask "Why do you think that happened?" and listen to their ideas before reading the grown-up note.</p>""",
        'faq': [('Is it safe?', 'All six use everyday kitchen things, but always do them with a grown-up and keep ingredients away from eyes and mouths.')],
    },
    {
        'id': 'letterkit', 'cat': 'reading', 'slug': 'letter-writing-kit-for-kids', 'tint': '#fff6e0', 'icon': '✉️', 'new': False,
        'nav': 'Letter writing kit',
        'title': 'Free Letter Writing Kit for Kids | Letter Paper, Envelope Template and Guide | PrintPals',
        'desc': 'A free printable letter writing kit for children: pretty letter paper with "Dear" and "Love from", a fold your own envelope template and a simple guide to writing a letter.',
        'h1': 'Letter writing kit',
        'lead': 'Nothing beats real post. Pretty letter paper, an envelope to fold, and five easy steps. Perfect for writing to grandparents, a pen pal or a friend who moved away.',
        'card': 'Letter paper, a fold your own envelope and a how to guide.',
        'form': field('Writing to (optional)', '<input type="text" name="to" maxlength="24" placeholder="Grandma" autocomplete="off">')
        + field('From (child\'s name, optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + check('envelope', 'Envelope template and guide') + PAPER,
        'article': """<h2>A real letter</h2><p>Writing a real letter gives children a reason to write, and the joy of a reply is enormous. Younger children can draw a picture and write just their name. Older children can use the five steps to write a full letter.</p>""",
        'faq': [('Will the envelope fit the letter?', 'Fold the letter in half, then in half again, and it will fit inside.')],
    },
    {
        'id': 'comprehension', 'cat': 'reading', 'slug': 'reading-comprehension-worksheets', 'tint': '#fff6e0', 'icon': '📖', 'new': False,
        'nav': 'Reading comprehension',
        'title': 'Free Reading Comprehension Worksheets for Kids | Short Stories With Their Name, With Answers | PrintPals',
        'desc': 'Free printable reading comprehension worksheets where your child is in the story: short stories for ages 5 to 7 and longer stories for ages 7 to 9, with tick box questions, a written answer, a drawing box and an answer key.',
        'h1': 'Reading comprehension',
        'lead': 'Short, warm stories with your child as the star, then questions to show they understood. Tick the right answer, write a sentence, and draw a picture.',
        'card': 'Little stories starring your child, with questions and answers.',
        'form': field('Length', seg('level', [('short', 'Short (ages 5 to 7)'), ('longer', 'Longer (ages 7 to 9)')], 'short'))
        + field('Story', seg('story', [('1', 'Story 1'), ('2', 'Story 2'), ('3', 'Story 3')], '1'))
        + field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + check('key', 'Answer key') + PAPER,
        'article': """<h2>Read it together first</h2><p>Read the story aloud together, then let your child read it again by themselves. Show them that looking back at the story to find an answer is a clever thing to do, not cheating. Good readers check!</p>""",
        'faq': [('What age is this for?', 'The short stories suit ages 5 to 7. The longer stories, with a written answer, suit ages 7 to 9.')],
    },
    {
        'id': 'mathsminute', 'cat': 'maths', 'slug': 'maths-minute-worksheets', 'tint': '#fff0f0', 'icon': '⏱️', 'new': False,
        'nav': 'Maths minute',
        'title': 'Free Maths Minute Worksheets | Quick Fact Fluency Drills, Adding, Taking Away, Times Tables | PrintPals',
        'desc': 'Free printable one minute maths drills: 30 quick facts for adding and taking away within 10 and 20, doubles and times tables, with a daily score tracker and answers.',
        'h1': 'Maths minute',
        'lead': 'Thirty quick sums, one minute on the clock. Do it every day for a week and watch the score grow. Fast facts make all of maths easier.',
        'card': '30 quick facts in one minute, with a daily score tracker.',
        'form': field('Facts', seg('kind', [('add10', 'Add to 10'), ('sub10', 'Take away in 10'), ('add20', 'Add to 20'), ('sub20', 'Take away in 20'), ('doubles', 'Doubles'), ('times', 'Times tables')], 'add10'))
        + field('Times table (for times tables)', '<select name="table">' + ''.join(f'<option value="{t}">{t} times</option>' for t in range(2, 13)) + '<option value="mix">Mixed 2 to 10</option></select>')
        + check('key', 'Answer key') + PAPER + SHUFFLE,
        'article': """<h2>Beat your own score</h2><p>The aim is not to beat anyone else, only yesterday's score. Print the same sheet for the whole week, or press "Make a new set" for fresh sums each day. Stop at one minute, count the right answers, and celebrate every improvement.</p>""",
        'faq': [('What if one minute is too stressful?', 'Take the timer away. Let your child finish all 30 at their own pace, and time it only when they feel confident.')],
    },
    {
        'id': 'savings', 'cat': 'maths', 'slug': 'savings-jar-chart-for-kids', 'tint': '#fff6e0', 'icon': '🐷', 'new': False,
        'nav': 'Savings jar',
        'title': 'Free Printable Savings Chart for Kids | Money Jar Goal Tracker, Spend Save Share | PrintPals',
        'desc': 'A free printable savings jar chart for children in your own currency: set a goal, colour a coin each time you save, plus spend, save and share jar labels.',
        'h1': 'Savings jar',
        'lead': 'Teach children to save for something they really want. Choose the goal and the amount, then colour a coin every time money goes in the jar.',
        'card': 'Colour a coin each time you save towards a goal.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Leo" autocomplete="off">')
        + field('Saving for (optional)', '<input type="text" name="goal" maxlength="30" placeholder="a new football" autocomplete="off">')
        + field('Currency', '<select name="currency"><option value="GBP">Pounds £</option><option value="USD">US dollars $</option><option value="EUR">Euros €</option><option value="NGN">Naira ₦</option><option value="GHS">Cedis GH₵</option><option value="KES">Shillings KSh</option><option value="ZAR">Rand R</option><option value="CAD">Canadian dollars $</option><option value="AUD">Australian dollars $</option></select>')
        + field('Goal amount', '<input type="number" name="target" min="1" max="100000" value="20">')
        + field('Coins in the jar', seg('steps', [('10', '10'), ('20', '20'), ('30', '30')], '20'))
        + check('jars', 'Spend, save and share jar labels') + PAPER,
        'article': """<h2>Waiting is the lesson</h2><p>Saving teaches patience and planning. Keep the chart next to a real jar, so your child can see the chart and the jar fill up together. When they reach the goal, go shopping together and let them pay.</p>""",
        'faq': [('How do the three jars work?', 'Each time your child gets money, they split it between Spend (now), Save (for a goal) and Share (to give). It is a lovely first lesson in money and kindness.')],
    },
    {
        'id': 'coupons', 'cat': 'crafts', 'slug': 'love-coupons-for-kids-to-give', 'tint': '#fff0f5', 'icon': '💝', 'new': False,
        'nav': 'Love coupons',
        'title': 'Free Printable Love Coupons for Kids to Give | Mother\'s Day, Father\'s Day, Birthdays | PrintPals',
        'desc': 'Free printable love coupons for children to give to Mum, Dad or Grandma: a big hug, breakfast in bed, I will tidy my room and more, or write your own. Bright or colour in.',
        'h1': 'Love coupons',
        'lead': 'The perfect gift a child can give for free. Eight coupons like "One great big hug" and "I will set the table" to cut out, colour and give with love.',
        'card': 'Coupons for Mum, Dad or Grandma: hugs, help and breakfast in bed.',
        'form': field('For', '<input type="text" name="to" maxlength="20" placeholder="Mum" autocomplete="off">')
        + field('From (child\'s name)', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Your own coupons (optional, one per line)', '<textarea name="own" rows="3" spellcheck="true" placeholder="A picnic in the garden&#10;I will feed the cat"></textarea>')
        + field('Style', seg('style', [('bright', 'Bright'), ('colour', 'Colour in')], 'bright')) + PAPER + SHUFFLE,
        'article': """<h2>A gift from the heart</h2><p>Help your child choose coupons they will really do, then staple them into a little book or put them in an envelope. Perfect for Mother's Day, Father's Day, birthdays or just because.</p>""",
        'faq': [('Can the coupons be for anyone?', 'Yes. Type any name in "For": Grandpa, a teacher, a big sister or a best friend.')],
    },
    {
        'id': 'packing', 'cat': 'charts', 'slug': 'packing-list-for-kids', 'tint': '#e6f6fc', 'icon': '🧳', 'new': False,
        'nav': 'Packing lists',
        'title': 'Free Printable Packing List for Kids | Holiday, Beach, Sleepover, Camping, School Trip | PrintPals',
        'desc': 'Free printable picture packing lists for children: holiday, beach bag, sleepover, camping, school trip and staying with family. Add your own items.',
        'h1': 'Packing lists',
        'lead': 'Let children pack their own bag with a picture checklist. They feel grown-up, and nothing gets left behind.',
        'card': 'Picture checklists so children can pack their own bag.',
        'form': field('Trip', '<select name="trip"><option value="holiday">Holiday</option><option value="beach">Beach day</option><option value="sleepover">Sleepover</option><option value="camping">Camping</option><option value="school">School trip</option><option value="grandparents">Staying with family</option></select>')
        + field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Sam" autocomplete="off">')
        + field('Add your own (optional, one per line)', '<textarea name="extra" rows="3" spellcheck="true" placeholder="Swimming goggles&#10;Football"></textarea>') + PAPER,
        'article': """<h2>Independence, one sock at a time</h2><p>Lay the list next to the suitcase and let your child find each thing and colour the star. Check the bag together at the end. Even three year olds can do it with the pictures.</p>""",
        'faq': [('Can I use it again?', 'Slip it into a plastic sleeve and use a whiteboard pen, and it will last for every trip.')],
    },
    {
        'id': 'mealplan', 'cat': 'charts', 'slug': 'family-meal-planner-printable', 'tint': '#f1f8e6', 'icon': '🍽️', 'new': False,
        'nav': 'Family meal planner',
        'title': 'Free Printable Family Meal Planner With Kids | Weekly Menu, Shopping List, Chef Menu | PrintPals',
        'desc': 'A free printable family meal planner made for cooking with children: a weekly breakfast, lunch and dinner plan with a little chef column, a shopping list and a menu card to draw.',
        'h1': 'Family meal planner',
        'lead': '"What\'s for dinner?" answered for the whole week. Plan meals together, let a little chef help each day, and take the shopping list to the shop.',
        'card': 'A weekly meal plan, shopping list and a little chef\'s menu.',
        'form': field('Little chef\'s name (optional)', '<input type="text" name="name" maxlength="20" placeholder="Chris" autocomplete="off">')
        + check('shopping', 'Shopping list') + check('menu', 'Little chef\'s menu card') + PAPER,
        'article': """<h2>Children eat what they cook</h2><p>Children who help plan and cook meals are more likely to try them. Give each child a day to be chef: they choose the meal, help with safe jobs like washing and stirring, and design the menu card for the table.</p>""",
        'faq': [('How can young children help in the kitchen?', 'Washing vegetables, tearing lettuce, stirring, spreading, counting and laying the table are all great jobs for little chefs.')],
    },
    {
        'id': 'habits', 'cat': 'world', 'slug': 'handwashing-poster-for-kids', 'tint': '#e6f6fc', 'icon': '🧼', 'new': False,
        'nav': 'Healthy habits posters',
        'title': 'Free Handwashing Poster for Kids | Sneeze, Getting Dressed and Toilet Steps Posters | PrintPals',
        'desc': 'Free printable healthy habits posters for children: how to wash my hands, catch that sneeze, I can get dressed and toilet time steps, with pictures for every step.',
        'h1': 'Healthy habits posters',
        'lead': 'Picture step posters for the bathroom and bedroom: washing hands properly, catching sneezes, getting dressed and using the toilet by themselves.',
        'card': 'Handwashing, sneezing, dressing and toilet steps in pictures.',
        'form': field('Poster', '<select name="poster"><option value="handwash">How to wash my hands</option><option value="sneeze">Catch that sneeze!</option><option value="dressed">I can get dressed!</option><option value="toilet">Toilet time steps</option><option value="all">All four posters</option></select>') + PAPER,
        'article': """<h2>Put it at their height</h2><p>Stick the handwashing poster by the sink at your child's eye level, and the getting dressed poster in their bedroom. Point to each step as they do it, and soon they will not need you at all.</p>""",
        'faq': [('How long should children wash their hands?', 'About 20 seconds, which is the time it takes to sing Happy Birthday twice.')],
    },
    {
        'id': 'papergames', 'cat': 'puzzles', 'slug': 'paper-games-for-kids', 'tint': '#eef2ff', 'icon': '❌', 'new': False,
        'nav': 'Paper games',
        'title': 'Free Printable Paper Games for Kids | Noughts and Crosses, Dots and Boxes, Word Guess, Squiggles | PrintPals',
        'desc': 'Free printable pencil and paper games for kids: noughts and crosses grids, dots and boxes, a kind word guessing game with a silly monster, and squiggle drawing. Perfect for cafés, journeys and rainy days.',
        'h1': 'Paper games',
        'lead': 'Screen-free fun for two. Keep a few pages in your bag for cafés, waiting rooms and long journeys. All you need is a pencil.',
        'card': 'Noughts and crosses, dots and boxes, word guess and squiggles.',
        'form': check('noughts', 'Noughts and crosses') + check('dots', 'Dots and boxes') + check('guess', 'Guess the word, draw the monster') + check('squiggles', 'Squiggle pictures') + PAPER + SHUFFLE,
        'article': """<h2>Games that teach</h2><p>Paper games build more than you might think: taking turns, planning ahead, spelling and imagination. Let your child win sometimes, and talk about your moves out loud so they can learn your tricks.</p>""",
        'faq': [('What is "draw the monster"?', 'It is a friendly version of hangman. Each wrong guess adds a part to a silly monster instead.')],
    },
    {
        'id': 'scissors', 'cat': 'handwriting', 'slug': 'cutting-practice-worksheets', 'tint': '#fff0f0', 'icon': '✂️', 'new': False,
        'nav': 'Scissor skills',
        'title': 'Free Cutting Practice Worksheets | Scissor Skills for Toddlers and Preschool | PrintPals',
        'desc': 'Free printable scissor skills worksheets for toddlers and preschoolers: straight, zigzag and wavy lines, shapes to cut out and spirals. Help each animal reach its food!',
        'h1': 'Scissor skills',
        'lead': 'Cutting builds the hand strength children need for writing. Start with straight lines, then zigzags, waves, shapes and spirals.',
        'card': 'Straight, zigzag and wavy lines, shapes and spirals to cut.',
        'form': field('Lines', seg('level', [('straight', 'Straight'), ('zigzag', 'Zigzag'), ('wavy', 'Wavy'), ('shapes', 'Shapes'), ('spiral', 'Spirals')], 'straight')) + PAPER,
        'article': """<h2>Thumbs up!</h2><p>Teach "thumbs up": the thumb goes in the small hole, on top, and the other hand holds the paper and turns it. Use safety scissors, and cut slowly. Snipping playdough or straws is great practice too.</p>""",
        'faq': [('When can children use scissors?', 'Most children can start snipping with safety scissors, and a grown-up close by, at around 2 and a half to 3.')],
    },
    {
        'id': 'tenframes', 'cat': 'maths', 'slug': 'ten-frame-worksheets', 'tint': '#fff6e0', 'icon': '🔟', 'new': False,
        'nav': 'Ten frames',
        'title': 'Free Ten Frame Worksheets | Count, Show Numbers, Make 10, Count to 20 | PrintPals',
        'desc': 'Free printable ten frame worksheets: count the dots, show a number, make 10 and count to 20 with double ten frames. With answer keys.',
        'h1': 'Ten frames',
        'lead': 'Ten frames help children see numbers at a glance and understand how numbers make 10. The building block for all adding and taking away.',
        'card': 'Count, show numbers, make 10 and count to 20.',
        'form': field('Activity', seg('kind', [('count', 'How many?'), ('show', 'Show it'), ('make10', 'Make 10'), ('twenty', 'Count to 20')], 'count'))
        + check('key', 'Answer key') + PAPER + SHUFFLE,
        'article': """<h2>Seeing numbers</h2><p>With ten frames, children stop counting one by one and start seeing: "That's 5 and 2 more, so 7." Ask "How many more to make 10?" often. It is the secret to quick mental maths later.</p>""",
        'faq': [('What age is this for?', 'Ages 4 to 7. Start with "How many?" and "Show it", then move to "Make 10" and "Count to 20".')],
    },
    {
        'id': 'sequencing', 'cat': 'reading', 'slug': 'sequencing-worksheets', 'tint': '#f1f8e6', 'icon': '🔢', 'new': False,
        'nav': 'Story sequencing',
        'title': 'Free Sequencing Worksheets for Kids | Cut and Paste First, Next, Then, Last | PrintPals',
        'desc': 'Free printable picture sequencing worksheets: cut out the pictures and put them in order with first, next, then and last. Growing a flower, making a sandwich, a snowy day and more.',
        'h1': 'Story sequencing',
        'lead': 'Cut, order and glue. Putting pictures in order builds the thinking behind reading, retelling stories and writing.',
        'card': 'Cut out the pictures and put them in order.',
        'form': field('Stories', '<select name="set"><option value="plant">Growing a flower (and one more)</option><option value="sandwich">Making a sandwich (and one more)</option><option value="snowman">A snowy day (and one more)</option><option value="morning">Getting ready (and one more)</option><option value="chick">From egg to hen (and one more)</option><option value="rain">Rain and rainbow (and one more)</option><option value="all">All six (3 pages)</option></select>')
        + PAPER + SHUFFLE,
        'article': """<h2>Tell the story</h2><p>Once the pictures are glued in, ask your child to tell you the story using the words first, next, then and last. Then try it with real life: "What did we do first this morning?"</p>""",
        'faq': [('What age is this for?', 'Ages 3 to 7. Younger children can simply point to the order before cutting.')],
    },
    {
        'id': 'coding', 'cat': 'puzzles', 'slug': 'coding-worksheets-for-kids', 'tint': '#e6f6fc', 'icon': '🤖', 'new': False,
        'nav': 'Screen-free coding',
        'title': 'Free Coding Worksheets for Kids | Unplugged Arrow Coding Puzzles | PrintPals',
        'desc': 'Free printable unplugged coding worksheets: write the arrow code to move the robot, bunny, rocket or bee to its prize around the blocks. Easy, medium and hard, with answers.',
        'h1': 'Screen-free coding',
        'lead': 'Real coding thinking, no screen needed. Children write a list of arrow steps to guide a robot to its prize. New puzzles every time.',
        'card': 'Write the arrows to guide the robot to its prize.',
        'form': field('Level', seg('level', [('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], 'easy'))
        + check('key', 'Answer key') + PAPER + SHUFFLE,
        'article': """<h2>Thinking like a coder</h2><p>Coding is really about giving clear step by step instructions. After solving a puzzle, play it for real: one person is the robot and follows the arrows exactly. Mistakes are called bugs, and fixing them is called debugging!</p>""",
        'faq': [('Is there only one right answer?', 'No. The answer key shows the shortest route, but any route that reaches the prize without crossing a block is correct.')],
    },
    {
        'id': 'factfile', 'cat': 'world', 'slug': 'animal-fact-file-template', 'tint': '#f5edff', 'icon': '🦁', 'new': False,
        'nav': 'Animal fact files',
        'title': 'Free Animal Fact File Template for Kids | Research Worksheet | PrintPals',
        'desc': 'Free printable animal fact files and research templates for kids: lion, penguin, elephant, octopus, bee, sea turtle, giraffe and blue whale, or any topic you choose.',
        'h1': 'Animal fact files',
        'lead': 'For curious children who ask a hundred questions. Two amazing facts to start, then boxes to find out where it lives, what it eats and more.',
        'card': 'A research sheet for any animal, with amazing facts to start.',
        'form': field('Animal', '<select name="animal"><option value="lion">Lion</option><option value="penguin">Penguin</option><option value="elephant">Elephant</option><option value="octopus">Octopus</option><option value="bee">Honey bee</option><option value="turtle">Sea turtle</option><option value="giraffe">Giraffe</option><option value="whale">Blue whale</option><option value="own">My own topic</option></select>')
        + field('My own topic (optional)', '<input type="text" name="own" maxlength="24" placeholder="Dinosaurs" autocomplete="off">', 'Choose "My own topic" to use it.') + PAPER,
        'article': """<h2>Finding out together</h2><p>Look for answers in library books, nature programmes or safe websites together. The last box, "A question I still have", is the most important: it keeps curiosity going.</p>""",
        'faq': [('Can we use it for things that are not animals?', 'Yes. Choose "My own topic" and type anything, like volcanoes, space or a country.')],
    },
    {
        'id': 'petcare', 'cat': 'charts', 'slug': 'pet-care-chart-for-kids', 'tint': '#fff6e0', 'icon': '🐾', 'new': False,
        'nav': 'Pet care chart',
        'title': 'Free Pet Care Chart for Kids | Dog, Cat, Fish, Rabbit, Hamster, Bird | PrintPals',
        'desc': 'A free printable pet care chart for children: daily jobs for a dog, cat, fish, rabbit, hamster or bird, a paw to colour for each job, and an all about my pet page.',
        'h1': 'Pet care chart',
        'lead': '"I promise I will look after it!" Now they can. Daily pet jobs with a paw to colour, and a page all about your pet.',
        'card': 'Daily pet jobs with paws to colour, plus all about my pet.',
        'form': field('Pet', seg('pet', [('dog', 'Dog'), ('cat', 'Cat'), ('fish', 'Fish'), ('rabbit', 'Rabbit'), ('hamster', 'Hamster'), ('bird', 'Bird')], 'dog'))
        + field('Pet\'s name (optional)', '<input type="text" name="petname" maxlength="20" placeholder="Biscuit" autocomplete="off">')
        + check('profile', 'All about my pet page') + PAPER,
        'article': """<h2>Kindness and responsibility</h2><p>Caring for a pet teaches children gentleness and routine. Share the jobs out, write the helpers' names at the bottom, and keep a grown-up in charge of cleaning and anything tricky.</p>""",
        'faq': [('What age can children help with pets?', 'Even toddlers can help fill a food bowl with you. From about 5, children can do simple jobs each day with a reminder.')],
    },
    {
        'id': 'diary', 'cat': 'reading', 'slug': 'holiday-diary-for-kids', 'tint': '#e6f6fc', 'icon': '📔', 'new': False,
        'nav': 'Holiday diary',
        'title': 'Free Printable Holiday Diary for Kids | Travel Journal | PrintPals',
        'desc': 'A free printable holiday diary and travel journal for kids: a cover with their name, and a page for each day with date, weather, where we went, the best bit, feelings and a drawing box.',
        'h1': 'Holiday diary',
        'lead': 'Turn holidays into lasting memories and gentle writing practice. A page each evening, with space to stick in tickets, leaves and photos.',
        'card': 'A travel journal with a page for every day away.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="24" placeholder="Emma" autocomplete="off">')
        + field('Where are you going? (optional)', '<input type="text" name="where" maxlength="28" placeholder="Scotland" autocomplete="off">')
        + field('Days', seg('days', [('3', '3'), ('7', '7'), ('14', '14')], '7')) + PAPER,
        'article': """<h2>Small moments matter</h2><p>Fill it in at the end of each day while memories are fresh. Younger children can draw while you write their words. It will become a treasure they look back on for years.</p>""",
        'faq': [('Is it only for going away?', 'Not at all. It works just as well for days out and holidays at home.')],
    },
    {
        'id': 'halloween', 'cat': 'packs', 'slug': 'halloween-activity-pack-for-kids', 'tint': '#fff6e0', 'icon': '🎃', 'new': False, 'plus': True,
        'nav': 'Halloween pack',
        'title': 'Personalised Halloween Activity Pack for Kids | Friendly, Not Scary, Printable | PrintPals',
        'desc': 'A personalised Halloween activity pack for children aged 3 to 9: a cover with their name, colouring pages, counting, tracing, a word search, a maze, pumpkin face design, treat bag labels, bunting and a best costume award. Friendly, never scary.',
        'h1': 'Halloween fun pack',
        'lead': 'A whole Halloween pack with your child\'s name on the cover: colouring, counting, tracing, puzzles, pumpkin faces, treat bag labels, bunting and a best costume award. Friendly, never scary, in three beautiful designs.',
        'card': 'A personalised, friendly Halloween pack in three designs.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8+')], '5'), 'Puzzles get harder for older children.')
        + field('Design', seg('look', [('pumpkin', '🎃 Pumpkin Patch'), ('moon', '🌙 Moonlight'), ('candy', '🍭 Candy')], 'pumpkin'))
        + PAPER + SHUFFLE,
        'article': """<h2>A gentle Halloween</h2><p>Everything in this pack is friendly: smiling pumpkins, a waving ghost and a happy bat. Print it a week before Halloween, do a page each day, and use the treat bag labels and bunting for your party. Choose a different design each year, so it feels brand new.</p>""",
        'faq': [('Is it scary?', 'Not at all. Every picture is friendly and smiling, made for little ones.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'christmas', 'cat': 'packs', 'slug': 'christmas-advent-activity-book-for-kids', 'tint': '#e8f8f4', 'icon': '🎄', 'new': False, 'plus': True,
        'nav': 'Christmas & Advent book',
        'title': 'Personalised Christmas Activity Book and Advent Calendar for Kids | 24 Days of Printable Fun | PrintPals',
        'desc': 'A personalised Christmas activity book with a 24 day Advent calendar: a page for every day of December with a family moment and an activity, a letter to Santa or Father Christmas, a Nice List certificate, colouring, puzzles, gift tags, bunting and thank you notes.',
        'h1': 'Christmas activity book',
        'lead': 'The Advent calendar that brings your family together: 24 days, each with a small family moment and a page to colour, count, trace or draw. Plus a letter to Santa, a Nice List certificate, colouring, puzzles, gift tags, bunting and thank you notes. With your child\'s name, in three designs.',
        'card': 'A 24 day Advent book, a letter to Santa, gift tags and more.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8+')], '5'))
        + field('Design', seg('look', [('classic', '🎄 Classic'), ('snowy', '❄️ Snowy'), ('ginger', '🍪 Gingerbread')], 'classic'))
        + field('Letter to', seg('santa', [('santa', 'Santa'), ('fc', 'Father Christmas')], 'santa'))
        + '<div class="field"><span class="label">Pages</span>' + check('advent', '24 day Advent calendar and daily pages') + check('letter', 'Letter to Santa and Nice List certificate') + check('colouring', 'Christmas colouring pages') + check('puzzles', 'Word search, counting and maze') + check('crafts', 'Gift tags, bunting and thank you notes') + '</div>'
        + PAPER + SHUFFLE,
        'article': """<h2>An Advent calendar with no chocolate needed</h2><p>Each day in December, your child opens their page: a small family moment, like making a paper snowflake or calling someone you love, and an activity to do. Colour a door on the calendar each day. It becomes a memory book of your family's Christmas.</p>""",
        'faq': [('When should I print it?', 'Print it at the end of November, so it is ready for 1 December. Staple the day pages together or keep them in a folder.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'namebook', 'cat': 'packs', 'slug': 'personalised-name-book-for-kids', 'tint': '#fff0f5', 'icon': '🔤', 'new': False, 'plus': True,
        'nav': 'My Name Book',
        'title': 'Personalised Name Book for Kids | Every Letter of Their Name, Tracing and Affirmations | PrintPals',
        'desc': 'A personalised name book: every letter of your child\'s name gets its own page with a picture, tracing, and a special word about them, like M is for Marvellous. Ends with a name poster. Four beautiful designs.',
        'h1': 'My Name Book',
        'lead': 'A book all about the most important word in your child\'s world: their name. Every letter gets its own page with a picture to colour, letters to trace and a special word about them, like "M is for Marvellous". It ends with a poster they will want on their wall.',
        'card': 'Every letter of their name, a picture and a special word.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="12" placeholder="Mia" autocomplete="off">', 'Up to 12 letters.')
        + field('Design', seg('look', [('rainbow', '🌈 Rainbow'), ('ocean', '🐳 Ocean'), ('garden', '🌻 Garden'), ('space', '🚀 Space')], 'rainbow'))
        + PAPER,
        'article': """<h2>Words that grow confidence</h2><p>Children love seeing their own name. Read the book together and say each special word out loud: "Mia is Marvellous, Imaginative and Amazing." It builds letter knowledge and belief in themselves at the same time. It makes a lovely gift for a new sibling, cousin or friend too.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'timecapsule', 'cat': 'packs', 'slug': 'birthday-time-capsule-for-kids', 'tint': '#fff0f5', 'icon': '🎂', 'new': False, 'plus': True,
        'nav': 'Birthday time capsule',
        'title': 'Birthday Time Capsule for Kids | Printable Yearly Keepsake Book, All About Me and Interview | PrintPals',
        'desc': 'A personalised birthday time capsule for every year: all about me, favourite things, height and handprint, a drawing of themselves, a birthday interview, the best bits of the year, predictions for next year and a letter from you to read when they are grown up.',
        'h1': 'Birthday time capsule',
        'lead': 'A keepsake book to fill in on every birthday. Their favourite things, how big they are, a handprint, a funny birthday interview, their proudest moments and a letter from you. Seal it, and open it again next year. Collect one for every age.',
        'card': 'A keepsake to fill in every birthday: favourites, handprint, interview.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Age they are turning', '<select name="age">' + ''.join(f'<option{" selected" if a == 5 else ""}>{a}</option>' for a in range(1, 13)) + '</select>')
        + field('Design', seg('look', [('confetti', '🎉 Confetti'), ('balloons', '🎈 Balloons'), ('stars', '⭐ Stars')], 'confetti'))
        + PAPER,
        'article': """<h2>A tradition they will treasure</h2><p>Fill it in together on the birthday weekend, and keep each year's capsule in one folder. By the time they are grown, you will have a book of who they were at 3, 4, 5 and beyond: their favourite songs, their funny answers and your letters to them. Choose a new design each year.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'diwali', 'cat': 'packs', 'slug': 'diwali-activity-pack-for-kids', 'tint': '#fff6e0', 'icon': '🪔', 'new': False, 'plus': True,
        'nav': 'Diwali pack',
        'title': 'Personalised Diwali Activity Pack for Kids | Rangoli Colouring, Diya, Cards and Crafts | PrintPals',
        'desc': 'A personalised Diwali activity pack for children: new rangoli patterns to colour every time, finish the rangoli, diya and lantern colouring, counting, tracing, a word search, sweet box labels, a card, bunting and a Little Light award.',
        'h1': 'Diwali activity pack',
        'lead': 'Celebrate the festival of lights with a pack made just for your child: rangoli patterns that are new every time you print, diya and lantern colouring, puzzles, sweet box labels, a card, bunting and a Little Light award.',
        'card': 'Rangoli patterns that are new every time, diyas, cards and crafts.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8+')], '5'))
        + field('Design', seg('look', [('marigold', '🌼 Marigold'), ('jewel', '💜 Jewel'), ('peacock', '🦚 Peacock')], 'marigold'))
        + PAPER + SHUFFLE,
        'article': """<h2>A new rangoli every time</h2><p>Every time you press "Make a new set", PrintPals draws three brand new rangoli patterns, so children can colour a different one each day of the festival. The "finish the rangoli" page teaches symmetry in the most beautiful way.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'thankful', 'cat': 'packs', 'slug': 'thanksgiving-activity-pack-for-kids', 'tint': '#fff6e0', 'icon': '🦃', 'new': False, 'plus': True,
        'nav': 'Thankful pack',
        'title': 'Personalised Thanksgiving Activity Pack for Kids | Thankful Turkey, Gratitude Leaves, Place Cards | PrintPals',
        'desc': 'A personalised Thanksgiving and harvest activity pack for children: a thankful turkey, gratitude leaves for a thankful tree, colouring, counting, a word search, place cards for the family table, bunting and a Kind Heart award.',
        'h1': 'Thankful pack',
        'lead': 'Grow a grateful heart. A thankful turkey to fill with feathers, gratitude leaves for a thankful tree, place cards for the family table, colouring, puzzles and a Kind Heart award. For Thanksgiving or harvest time, in three cosy designs.',
        'card': 'A thankful turkey, gratitude leaves and place cards for the table.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8+')], '5'))
        + field('Celebrating', seg('occasion', [('thanksgiving', 'Thanksgiving'), ('harvest', 'Harvest')], 'thanksgiving'))
        + field('Design', seg('look', [('autumn', '🍂 Autumn'), ('cosy', '☕ Cosy'), ('pumpkin', '🎃 Pumpkin')], 'autumn'))
        + PAPER + SHUFFLE,
        'article': """<h2>Gratitude you can see</h2><p>Stick a paper tree on the wall and add one thankful leaf each day. By the big meal, it will be full of the people and things your child loves. The place cards give every guest a kind message, written by your child.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'easter', 'cat': 'packs', 'slug': 'easter-activity-pack-for-kids', 'tint': '#f5edff', 'icon': '🐣', 'new': False, 'plus': True,
        'nav': 'Easter & spring pack',
        'title': 'Personalised Easter Activity Pack for Kids | Egg Hunt Clues, Colouring and Crafts | PrintPals',
        'desc': 'A personalised Easter or spring activity pack: an egg hunt around your home with 12 rhyming clue cards, decorate the eggs, colouring, counting, tracing, a word search, a maze, bunting and an Egg Hunt Champion award.',
        'h1': 'Easter & spring pack',
        'lead': 'A whole Easter morning in one print: an egg hunt around your home with rhyming clue cards, eggs to decorate, colouring, puzzles, bunting and an Egg Hunt Champion award. Choose Easter or spring, in three fresh designs.',
        'card': 'An egg hunt with rhyming clues, colouring, crafts and more.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Age', seg('age', [('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8+')], '5'))
        + field('Celebrating', seg('occasion', [('easter', 'Easter'), ('spring', 'Spring')], 'easter'))
        + field('Design', seg('look', [('pastel', '🐣 Pastel'), ('meadow', '🌼 Meadow'), ('sunny', '☀️ Sunny')], 'pastel'))
        + check('hunt', 'Egg hunt with rhyming clue cards') + PAPER + SHUFFLE,
        'article': """<h2>An egg hunt that teaches reading</h2><p>Each rhyming clue leads to the next hiding place: under the bed, in the fridge, by the bath. Children read (or listen to) each clue and work it out. Hide a small treasure at the end. It turns Easter morning into an adventure.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'journal', 'cat': 'packs', 'slug': 'kids-journal-printable', 'tint': '#fff0f5', 'icon': '📓', 'new': False, 'plus': True,
        'nav': 'My Journal series',
        'title': 'Personalised Journal for Kids | Printable Drawing and Writing Journal, Four Volumes to Collect | PrintPals',
        'desc': 'A personalised drawing and writing journal for kids, in four volumes to collect: All about my world, Nature explorer, Big dreams and Kind and brave. Ten prompts in each, a feelings check and a completion page.',
        'h1': 'My Journal series',
        'lead': 'Four beautiful journals to collect, each with its own theme, colours and ten prompts to draw and write about. When one is finished, the next adventure is waiting: All about my world, Nature explorer, Big dreams, Kind and brave.',
        'card': 'Four journals to collect, each with ten prompts to draw and write.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Volume', seg('volume', [('1', '1. My world'), ('2', '2. Nature'), ('3', '3. Big dreams'), ('4', '4. Kind and brave')], '1'))
        + PAPER,
        'article': """<h2>A habit worth building</h2><p>A page a day, or a page a week: drawing and writing about their own life helps children find their words and feelings. Each journal ends with a completion page that invites them to the next volume, so there is always something to look forward to.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'levels', 'cat': 'packs', 'slug': 'little-learner-levels', 'tint': '#fff6e0', 'icon': '🏅', 'new': False, 'plus': True,
        'nav': 'Little Learner Levels',
        'title': 'Little Learner Levels | Printable Learning Journey, Badges and Certificates for Kids | PrintPals',
        'desc': 'Ten printable learning levels for children, from Pencil Pal to PrintPals Legend. Each level has five challenges, badges to colour and wear, and a certificate that points to the next level.',
        'h1': 'Little Learner Levels',
        'lead': 'A learning journey children love to climb: ten levels from Pencil Pal to PrintPals Legend. Each level has five real-life challenges, badges to colour and wear, and a certificate that shows the next adventure.',
        'card': 'Ten levels with challenges, badges and certificates to collect.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Level', seg('level', [(str(i + 1), f'{i + 1}') for i in range(10)], '1'), '1 Pencil Pal, 2 Shape Spotter, 3 Letter Lion, 4 Number Hero, 5 Word Builder, 6 Story Star, 7 Maths Magician, 8 Time Traveller, 9 Super Writer, 10 PrintPals Legend.')
        + check('map', 'My learning journey map') + PAPER,
        'article': """<h2>Something to work towards</h2><p>Children love levels in games, so we made learning feel the same. Stick the journey map on the wall, work through the five challenges together, then wear the badge with pride. The certificate always shows what comes next.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'poppy', 'cat': 'packs', 'slug': 'monthly-letters-from-poppy', 'tint': '#fff0f5', 'icon': '💌', 'new': False, 'plus': True,
        'nav': 'Letters from Poppy',
        'title': 'Monthly Letters for Kids From Poppy | A Printable Letter and Challenge Every Month | PrintPals',
        'desc': 'A personalised letter for your child every month from Poppy, the PrintPals friend, with a seasonal challenge, a challenge page and a page to write back.',
        'h1': 'Letters from Poppy',
        'lead': 'Every month, Poppy writes to your child by name with a little challenge: plant a seed, spot the moon, find five minibeasts. There is a page to do the challenge and a page to write back. Children start asking "Has Poppy written yet?"',
        'card': 'A letter with their name and a new challenge every month.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Month', '<select name="month"><option value="">This month</option>' + ''.join(f'<option value="{i}">{m}</option>' for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])) + '<option value="all">All twelve months</option></select>')
        + PAPER,
        'article': """<h2>The magic of real post</h2><p>Print Poppy's letter, fold it into an envelope and leave it on the doormat or by their breakfast. The challenge gets them outside and exploring, and writing back to Poppy is the best kind of writing practice.</p>""",
        'faq': [('Who is Poppy?', 'Poppy is the smiling PrintPals page with her yellow pencil. She loves learning and writes a new letter every month.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'classseason', 'cat': 'packs', 'slug': 'class-seasonal-books-for-teachers', 'tint': '#e8f8f4', 'icon': '🎁', 'new': False, 'plus': True, 'teacher': True,
        'nav': 'Class seasonal books',
        'title': 'Class Seasonal Books for Teachers | Personalised Christmas, Halloween, Easter and Diwali Books for Every Child | PrintPals',
        'desc': 'Paste your class list and get a personalised seasonal book for every child in one click: a named cover, colouring pages and a certificate. Christmas, Halloween, Diwali, Easter or spring.',
        'h1': 'Class seasonal books',
        'lead': 'Paste your class list once and make a personalised book for every child: their own named cover, colouring pages with their name, and a certificate. Christmas, Halloween, Diwali, Easter or spring, ready in seconds.',
        'card': 'A named seasonal book for every child in your class.',
        'form': field('Class list (one name per line)', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam"></textarea>', 'Up to 40 children.')
        + field('Class name (optional)', '<input type="text" name="cls" maxlength="24" placeholder="Class 2" autocomplete="off">')
        + field('Season', seg('occasion', [('christmas', '🎄 Christmas'), ('halloween', '🎃 Halloween'), ('diwali', '🪔 Diwali'), ('easter', '🐣 Easter'), ('spring', '🌷 Spring')], 'christmas'))
        + check('colouring', 'Colouring pages') + check('certificate', 'Certificate for every child') + PAPER,
        'article': """<h2>Thirty books, one click</h2><p>Every child gets a book with their own name on the cover and on every page. Perfect for the last week before a holiday, or as a small gift to send home.</p>""",
        'faq': [('Which plan includes this?', 'The teacher plan ($59 a year). You can try it free for 7 days, no card needed.')],
    },
    {
        'id': 'yearbook', 'cat': 'packs', 'slug': 'end-of-year-memory-book-for-class', 'tint': '#f5edff', 'icon': '🎓', 'new': False, 'plus': True, 'teacher': True,
        'nav': 'End of year memory books',
        'title': 'End of Year Memory Book for Every Child | Personalised, With Your Message | PrintPals',
        'desc': 'A personalised end of year memory book for every child in your class: a named cover, a message from you, friends\' signatures, what I learned, me at the start and now, and a certificate.',
        'h1': 'End of year memory books',
        'lead': 'Say goodbye beautifully. Every child gets their own memory book: a named cover, your personal message, a page for friends\' signatures, what they learned, a then and now portrait and a certificate.',
        'card': 'A named memory book for every child, with your message inside.',
        'form': field('Class list (one name per line)', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam"></textarea>')
        + field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 2" autocomplete="off">')
        + field('Your name', '<input type="text" name="teacher" maxlength="30" placeholder="Mrs Taylor" autocomplete="off">')
        + field('Your message to every child (optional)', '<textarea name="message" rows="3" maxlength="300" placeholder="It has been a joy to teach you this year. Keep being curious and kind!"></textarea>')
        + field('Year', '<input type="text" name="year" maxlength="12" placeholder="2026" autocomplete="off">')
        + field('Design', seg('look', [('rainbow', '🌈 Rainbow'), ('ocean', '🐳 Ocean'), ('garden', '🌻 Garden'), ('space', '🚀 Space')], 'rainbow'))
        + PAPER,
        'article': """<h2>A keepsake they will treasure</h2><p>Hand the books out in the last week and let children sign each other's friends pages. Families keep them for years.</p>""",
        'faq': [('Which plan includes this?', 'The teacher plan ($59 a year). You can try it free for 7 days, no card needed.')],
    },
    {
        'id': 'displays', 'cat': 'packs', 'slug': 'classroom-displays-printable', 'tint': '#fff6e0', 'icon': '🏫', 'new': False, 'plus': True, 'teacher': True,
        'nav': 'Classroom displays',
        'title': 'Printable Classroom Displays | Birthday Chart, Class Jobs and Welcome Bunting With Names | PrintPals',
        'desc': 'Printable classroom displays made from your class list: a birthday chart with every child in their month, class job cards, and welcome bunting with a flag for every child.',
        'h1': 'Classroom displays',
        'lead': 'Set up your classroom in minutes: a birthday chart with every child in their month, bright class job cards, and welcome bunting with a flag for every child to colour.',
        'card': 'A birthday chart, class jobs and name bunting from your class list.',
        'form': field('Class list with birthdays (one per line)', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia 12 March&#10;Leo 4 July&#10;Emma 21 November&#10;Sam 9 January"></textarea>', 'Write the name, then the day and month. Birthdays are optional.')
        + field('Class name (optional)', '<input type="text" name="cls" maxlength="24" placeholder="Class 2" autocomplete="off">')
        + field('Class jobs (optional, one per line)', '<textarea name="jobs" rows="3" spellcheck="false" placeholder="Line leader&#10;Plant waterer"></textarea>')
        + check('birthdays', 'Birthday chart') + check('jobcards', 'Class job cards') + check('welcome', 'Welcome bunting with every name') + PAPER,
        'article': """<h2>A room that says "you belong"</h2><p>Children light up when they see their own name on the wall. Laminate the job cards and move name pegs each week.</p>""",
        'faq': [('Which plan includes this?', 'The teacher plan ($59 a year). You can try it free for 7 days, no card needed.')],
    },
    {
        'id': 'toothfairy', 'cat': 'packs', 'slug': 'tooth-fairy-letter-and-kit', 'tint': '#f5edff', 'icon': '🧚', 'new': False, 'plus': True,
        'nav': 'Tooth Fairy kit',
        'title': 'Personalised Tooth Fairy Letter and Kit | Certificate, Lost Tooth Tracker, Tooth Envelope | PrintPals',
        'desc': 'A personalised Tooth Fairy kit: a letter from the Tooth Fairy with your child\'s name, a Brave Tooth certificate, a tracker for all 20 baby teeth, tiny tooth envelopes and a note to write to the fairy.',
        'h1': 'Tooth Fairy kit',
        'lead': 'Make every wobbly tooth magical. A letter from the Tooth Fairy with your child\'s name, a Brave Tooth certificate, a tracker for all 20 baby teeth, a tiny envelope for the tooth and a note to write back.',
        'card': 'A letter from the Tooth Fairy, a certificate and a tooth tracker.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Design', seg('look', [('sparkle', '✨ Sparkle'), ('rainbow', '🌈 Rainbow'), ('starry', '🌙 Starry')], 'sparkle')) + PAPER,
        'article': """<h2>A keepsake for every tooth</h2><p>Print the kit when the first tooth wobbles. The tracker records every tooth until the last one, a lovely keepsake of growing up. Leave the letter under the pillow with a little surprise.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'bigsibling', 'cat': 'packs', 'slug': 'big-sister-big-brother-kit', 'tint': '#fff0f5', 'icon': '👶', 'new': False, 'plus': True,
        'nav': 'Big Sibling kit',
        'title': 'Big Sister and Big Brother Kit | New Baby Printables: Certificate, Helper Chart, All About Baby | PrintPals',
        'desc': 'A personalised big sister or big brother kit for when a new baby arrives: a big sibling certificate, all about my new baby, a helper chart, things I will teach the baby, a card for the baby and a family drawing page.',
        'h1': 'Big Sibling kit',
        'lead': 'A new baby is huge news. Help your older child feel proud and included with their own big sister or big brother book: a certificate, all about the new baby, a helper chart, things they will teach the baby and a card to welcome them.',
        'card': 'A proud big sister or brother book for when a new baby arrives.',
        'form': field('Big sibling\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('They are a big', seg('role', [('sister', 'Sister'), ('brother', 'Brother'), ('sibling', 'Sibling')], 'sister'))
        + field('Baby\'s name (optional)', '<input type="text" name="baby" maxlength="20" placeholder="Rosie" autocomplete="off">')
        + field('Design', seg('look', [('soft', '💖 Soft pink'), ('sky', '💙 Sky blue'), ('sunny', '🌈 Sunny')], 'soft')) + PAPER,
        'article': """<h2>Feeling part of it</h2><p>Older children often feel left out when a baby arrives. Giving them a special role, and a book all about it, helps them feel important. Bring it to the hospital, or have it waiting at home.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'treasure', 'cat': 'packs', 'slug': 'treasure-hunt-clues-for-kids', 'tint': '#fff6e0', 'icon': '🗺️', 'new': False, 'plus': True,
        'nav': 'Treasure hunt',
        'title': 'Printable Treasure Hunt Clues for Kids | Indoor or Garden, Pirate, Birthday or Fairy | PrintPals',
        'desc': 'A printable treasure hunt for kids with 12 rhyming clue cards for indoors or the garden, a grown-up guide, a treasure map to draw and a Treasure Hunter award. Pirate, birthday or fairy designs.',
        'h1': 'Treasure hunt',
        'lead': 'Ten minutes to set up, an hour of excitement. Twelve rhyming clues lead your child around the house or garden to the treasure. Choose pirate, birthday or fairy, with a map to draw and an award at the end.',
        'card': 'Rhyming clues around the house or garden, a map and an award.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">')
        + field('Where', seg('place', [('indoor', '🏠 Indoors'), ('garden', '🌳 Garden')], 'indoor'))
        + field('Theme', seg('look', [('pirate', '🏴‍☠️ Pirate'), ('birthday', '🎈 Birthday'), ('fairy', '🧚 Fairy')], 'pirate')) + PAPER,
        'article': """<h2>Reading with a reason</h2><p>Children will read anything if it leads to treasure. Younger ones can listen and guess, older ones can read every clue themselves. Perfect for birthdays, rainy days and play dates.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'phonicsbook', 'cat': 'packs', 'slug': 'phonics-books-for-kids', 'tint': '#fff0f0', 'icon': '🔤', 'new': False, 'plus': True,
        'nav': 'My Phonics Books',
        'title': 'Personalised Phonics Books for Kids | Four Books in Teaching Order: s a t p i n and Beyond | PrintPals',
        'desc': 'A series of four personalised phonics books in the order schools teach: s a t p i n, then m d g o c k, then e u r h b f l, then sh ch th ng ck qu. A page for every sound, picture words, tracing, reading with sound buttons and a certificate.',
        'h1': 'My Phonics Books',
        'lead': 'Learn to read one sound at a time, in the same order schools teach. Four books, each with your child\'s name, a page for every sound with pictures and tracing, reading practice with sound buttons, and a certificate that leads to the next book.',
        'card': 'Four books of sounds in teaching order, with reading practice.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Book', seg('book', [('1', '1. s a t p i n'), ('2', '2. m d g o c k'), ('3', '3. e u r h b f l'), ('4', '4. sh ch th ng')], '1')) + PAPER,
        'article': """<h2>Little and often</h2><p>Do one sound page a day. Say the sound together, find things around the house that start with it, then trace. When all the sounds are learned, the reading page puts them together into real words.</p>""",
        'faq': [('What age is this for?', 'Ages 3 to 6, or whenever your child starts learning letter sounds at school.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'busters', 'cat': 'packs', 'slug': 'boredom-buster-jar-printable', 'tint': '#e8f8f4', 'icon': '🫙', 'new': False, 'plus': True,
        'nav': 'Boredom Buster jar',
        'title': 'Printable Boredom Buster Jar for Kids | 48 Screen-Free Activity Sticks | PrintPals',
        'desc': 'A printable boredom buster jar for kids: 48 screen-free activity sticks in four colours (get moving, make something, quiet time, be kind) and a personalised jar label.',
        'h1': 'Boredom Buster jar',
        'lead': 'The answer to "I\'m bored!" Forty-eight screen-free activity sticks in four colours: get moving, make something, quiet time and be kind. With a jar label that has your child\'s name.',
        'card': '48 screen-free activity sticks and a named jar label.',
        'form': field('Child\'s name (optional)', '<input type="text" name="name" maxlength="20" placeholder="Chris" autocomplete="off">') + PAPER,
        'article': """<h2>Colours for every mood</h2><p>Full of energy? Pick from the red sticks. Need to calm down before bed? Only blue. Want to be helpful? Green. Children love the lucky dip, and you never have to think of an idea again.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'mathsbook', 'cat': 'packs', 'slug': 'maths-books-for-kids', 'tint': '#eef2ff', 'icon': '🔢', 'plus': True,
        'nav': 'My Maths Books',
        'title': 'Personalised Maths Books for Kids | Counting, Adding, Numbers to 20, Times Tables: Four Books | PrintPals',
        'desc': 'A series of four personalised maths books: counting to 10, adding and taking away, numbers to 20 and doubles, and times tables fun. Pictures, ten frames, number bonds, number lines and a certificate that leads to the next book.',
        'h1': 'My Maths Books',
        'lead': 'Maths one step at a time, in four beautiful books with your child\'s name. Count to 10, add and take away, reach 20 with doubles, then discover times tables. Every book ends with a certificate that leads to the next.',
        'card': 'Four maths books from counting to times tables, with their name.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Book', seg('book', [('1', '1. Counting to 10'), ('2', '2. Adding'), ('3', '3. To 20'), ('4', '4. Times tables')], '1')) + PAPER + SHUFFLE,
        'article': """<h2>A page a day</h2><p>Each book builds on the one before, just like at school. Use toys, pasta or buttons to count along. Press "Make a new set" for fresh sums whenever you print again.</p>""",
        'faq': [('What age is this for?', 'Book 1 suits ages 3 to 5, books 2 and 3 ages 4 to 7, and book 4 ages 6 to 8.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'adventure', 'cat': 'packs', 'slug': 'outdoor-adventure-passport-for-kids', 'tint': '#f1f8e6', 'icon': '🧭', 'plus': True,
        'nav': 'Outdoor Adventure Passport',
        'title': 'Outdoor Adventure Passport for Kids | Nature Missions, Seasonal Scavenger Hunt, Bug Hunt | PrintPals',
        'desc': 'A printable outdoor adventure passport: 24 nature missions with stamp spaces, seasonal spotter sheets, a bug hunt log, nature bingo, cloud watching, leaf rubbing and a Nature Explorer certificate.',
        'h1': 'Outdoor Adventure Passport',
        'lead': 'Get them outside and exploring. Twenty-four nature missions to stamp, seasonal spotter sheets, a bug hunt log, nature bingo, cloud watching and a leaf rubbing lab. Screen-free learning in the real world.',
        'card': '24 nature missions to stamp, seasonal spotting and a bug hunt.',
        'form': field('Explorer\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Season', seg('season', [('now', 'This season'), ('spring', 'Spring'), ('summer', 'Summer'), ('autumn', 'Autumn'), ('winter', 'Winter'), ('all', 'All four')], 'now')) + PAPER,
        'article': """<h2>Outdoor learning</h2><p>Children learn so much outside: patience, curiosity, counting, colours and care for living things. Keep the passport in a bag with a pencil and a magnifying glass, and stamp a mission every time you go out.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'familynight', 'cat': 'packs', 'slug': 'family-fun-night-kit', 'tint': '#fff0f5', 'icon': '🎲', 'plus': True,
        'nav': 'Family Fun Night kit',
        'title': 'Family Fun Night Kit | Movie Night Tickets, Charades, Family Quiz and Bucket List Printables | PrintPals',
        'desc': 'A printable family fun night kit: a month of family nights, movie night tickets with your family name, a snack bar menu, 24 charades cards, a family quiz, a family bucket list and family awards.',
        'h1': 'Family Fun Night kit',
        'lead': 'Start a family tradition everyone looks forward to. A month of family nights, cinema tickets with your family name, a snack bar menu, charades, a family quiz, a bucket list and awards to hand out at the end.',
        'card': 'Movie tickets, charades, a family quiz and a bucket list.',
        'form': field('Family name (optional)', '<input type="text" name="family" maxlength="20" placeholder="Taylor" autocomplete="off">') + PAPER,
        'article': """<h2>Traditions children remember</h2><p>The small things done together, week after week, become the memories children treasure most. Pick one night a week, put the phones away, and let the children hand out the tickets and the awards.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'cookbook', 'cat': 'packs', 'slug': 'kids-cookbook-printable', 'tint': '#fff6e0', 'icon': '👩‍🍳', 'plus': True,
        'nav': 'Little Chef Cookbook',
        'title': 'Printable Cookbook for Kids | Easy Recipes With Picture Steps, Personalised | PrintPals',
        'desc': 'A personalised printable cookbook for kids: kitchen safety rules, eight easy recipes with ingredients and numbered steps, a rating for each recipe, a page to invent their own recipe, a shopping list and a Little Chef award.',
        'h1': 'Little Chef Cookbook',
        'lead': 'Eight easy recipes children can really make, with a grown-up close by: fruit kebabs, funny face crackers, pizza toasts and more. Ingredients, numbered steps, a drawing box, a star rating, their own recipe page and a Little Chef award.',
        'card': 'Eight easy recipes with steps, ratings and a Little Chef award.',
        'form': field('Little chef\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Recipes', seg('kind', [('all', 'All eight'), ('sweet', 'Sweet'), ('savoury', 'Savoury')], 'all')) + PAPER,
        'article': """<h2>Children eat what they make</h2><p>Cooking builds maths, reading, fine motor skills and confidence, and children are far more likely to try foods they made themselves. Choose recipes where they can do most of the work, and let the grown-up handle knives and heat.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'handwritingbook', 'cat': 'packs', 'slug': 'handwriting-books-for-kids', 'tint': '#e8f8f4', 'icon': '✏️', 'plus': True,
        'nav': 'My Handwriting Books',
        'title': 'Personalised Handwriting Books for Kids | Pencil Control, a to z, Capitals and Name Tracing: Four Books | PrintPals',
        'desc': 'A series of four personalised handwriting books: pencil control and shapes, letters a to m, letters n to z, then capitals, name writing and first sentences. Real letter shapes, numbered start dots and a certificate that leads to the next book.',
        'h1': 'My Handwriting Books',
        'lead': 'Beautiful handwriting, one happy page at a time. Four books that take your child from first pencil lines to writing their name and first sentences, with a picture for every letter, green start dots and a certificate that leads to the next book.',
        'card': 'Four handwriting books from pencil lines to first sentences.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Book', seg('book', [('1', '1. Pencil power'), ('2', '2. a to m'), ('3', '3. n to z'), ('4', '4. Capitals')], '1')) + PAPER + SHUFFLE,
        'article': """<h2>Little and often</h2><p>Five happy minutes a day builds better handwriting than one long, tired session. Sit side by side, use a chunky pencil and praise the effort, not just the neatness. Each letter page starts with tracing, fades to light letters, then leaves space to write alone.</p>""",
        'faq': [('What age is this for?', 'Book 1 suits ages 3 to 4, books 2 and 3 ages 4 to 6, and book 4 ages 5 to 7.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'superhero', 'cat': 'packs', 'slug': 'superhero-academy-printables', 'tint': '#fff0f0', 'icon': '🦸', 'plus': True,
        'nav': 'Superhero Academy',
        'title': 'Superhero Academy Printables for Kids | Hero ID Card, Kindness Missions, Mask and Badges | PrintPals',
        'desc': 'A printable superhero academy pack: an official hero ID card, design your own superhero, 20 kindness and courage missions, a hero training week, a mask and badges to cut out and an Official Superhero certificate.',
        'h1': 'Superhero Academy',
        'lead': 'Every child wants to be a hero, so let them train as one. A hero ID card with their name, 20 real missions of kindness and courage, a training week, a mask and badges to cut out, and an Official Superhero certificate at the end.',
        'card': 'Hero ID card, 20 kindness missions, a mask and badges.',
        'form': field('Hero\'s real name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">')
        + field('Hero colours', seg('look', [('red', 'Red and gold'), ('blue', 'Blue and gold'), ('purple', 'Purple and teal')], 'red')) + PAPER,
        'article': """<h2>Real heroes are kind</h2><p>The missions turn good habits into adventures: helping without being asked, trying a new food, saying sorry, being brave. Pin the missions on the fridge and celebrate each one. Children love being caught doing something heroic.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'flying', 'cat': 'packs', 'slug': 'kids-flying-activity-pack', 'tint': '#eef6ff', 'icon': '✈️', 'plus': True,
        'nav': 'Flying Adventure kit',
        'title': 'First Flight Activity Pack for Kids | Boarding Pass, Airport Bingo, Flight Log | PrintPals',
        'desc': 'A personalised flying activity pack for kids: boarding passes with their name and destination, a travel passport to stamp, airport and plane bingo, a window drawing and flight log, a hand luggage checklist, a colouring page, a maze and a Brave Flyer award.',
        'h1': 'Flying Adventure kit',
        'lead': 'Turn a flight into an adventure, whether it is their first or their fiftieth. Boarding passes with their name, a travel passport to stamp, airport bingo, a flight log, a hand luggage checklist and a Brave Flyer award for landing like a superstar.',
        'card': 'Boarding passes, airport bingo, a flight log and an award.',
        'form': field('Passenger\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Flying to (optional)', '<input type="text" name="dest" maxlength="22" placeholder="Grandma\'s house" autocomplete="off">')
        + field('Going to see (optional)', '<input type="text" name="who" maxlength="22" placeholder="Nana and Grandad" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>Calm, happy flyers</h2><p>Knowing what will happen makes flying less scary. Go through the travel passport together before the trip so every step feels familiar, then let them stamp each one on the day. Print it the week before and pack it in their own little bag.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'feelingsbook', 'cat': 'packs', 'slug': 'my-feelings-book-printable', 'tint': '#fff0f5', 'icon': '💛', 'plus': True,
        'nav': 'My Feelings Book',
        'title': 'My Feelings Book Printable for Kids | 10 Feelings, Body Clues, Calm Ideas and Weekly Check-in | PrintPals',
        'desc': 'A personalised feelings book for kids: a page for each of ten feelings with what makes me feel it, how it feels in my body and things that help, a weekly feelings check-in and a Feelings Explorer award.',
        'h1': 'My Feelings Book',
        'lead': 'Help your child name big feelings and know what to do with them. A gentle page for each of ten feelings, from happy to worried to proud, with body clues, things that help and space to draw, plus a weekly check-in you fill in together.',
        'card': 'Ten feelings, body clues, things that help and a weekly check-in.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + PAPER,
        'article': """<h2>All feelings are welcome</h2><p>Children who can name a feeling can start to manage it. Fill in one page a day, sitting close, and share your own answers too. The weekly check-in is a lovely bedtime habit that keeps little worries from growing big.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'readers', 'cat': 'packs', 'slug': 'sight-word-readers-for-kids', 'tint': '#fff0f5', 'icon': '📖', 'plus': True,
        'nav': 'My Sight Word Readers',
        'title': 'Personalised Sight Word Readers for Kids | Printable Early Reader Books, Four Levels | PrintPals',
        'desc': 'A series of four personalised sight word readers: five words per book to trace, write and find, then a little story starring your child with the new words in colour, and a certificate that leads to the next reader.',
        'h1': 'My Sight Word Readers',
        'lead': 'The magic moment when your child reads a whole story on their own. Each reader teaches five sight words, one page at a time, then gives them a little story where they are the star. Four readers to collect, each ending with a Super Reader award.',
        'card': 'Four readers: five sight words each, then a story starring them.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Reader', seg('book', [('1', '1. I can see'), ('2', '2. The park'), ('3', '3. My kite'), ('4', '4. Come and play')], '1')) + PAPER + SHUFFLE,
        'article': """<h2>Sight words, the quick way to reading</h2><p>Sight words are the little words that appear in almost every sentence. Once a child knows them by heart, reading suddenly flows. Do one word a day, then read the story together, pointing to each word. Let them read it to someone they love.</p>""",
        'faq': [('What age is this for?', 'Readers 1 and 2 suit ages 4 to 5, readers 3 and 4 ages 5 to 6.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'dinokit', 'cat': 'packs', 'slug': 'dinosaur-activity-pack-for-kids', 'tint': '#f1f8e6', 'icon': '🦖', 'plus': True,
        'nav': 'Dinosaur Explorer kit',
        'title': 'Dinosaur Printables for Kids | Dinosaur Fact Cards, Size Chart, Counting and Maze | PrintPals',
        'desc': 'A personalised dinosaur activity pack: 8 dinosaur fact cards with how to say each name, a how long was it size chart, dig site counting, design your own dinosaur, dinosaur words to trace, colouring, a maze and a Junior Palaeontologist award.',
        'h1': 'Dinosaur Explorer kit',
        'lead': 'For every little dinosaur fan. Eight fact cards that teach them to say the big names, a size chart that shows how many of them would fit along a Brachiosaurus, dig site counting, a dino to invent and a Junior Palaeontologist award.',
        'card': 'Dino fact cards, a size chart, counting and a palaeontologist award.',
        'form': field('Explorer\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Design', seg('look', [('jungle', 'Jungle green'), ('volcano', 'Volcano orange')], 'jungle')) + PAPER + SHUFFLE,
        'article': """<h2>Dinosaurs make learning huge</h2><p>Children who love dinosaurs will happily learn long words, big numbers and real science. Cut out the cards and play snap, sort them into meat and plant eaters, or line them up from shortest to longest.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'spacekit', 'cat': 'packs', 'slug': 'space-activity-pack-for-kids', 'tint': '#eef0ff', 'icon': '🚀', 'plus': True,
        'nav': 'Space Academy',
        'title': 'Space Printables for Kids | Planet Cards, Solar System Order, Constellations, Countdown | PrintPals',
        'desc': 'A personalised space activity pack: 8 planet fact cards, the planets in order with a rhyme to remember them, countdown number tracing, join the stars constellations, astronaut training missions, rocket colouring and a Space Cadet award.',
        'h1': 'Space Academy',
        'lead': 'Blast off into learning. Beautiful night sky planet cards, a rhyme that helps them remember the order of the planets, a countdown to trace, real constellations to find in the sky, astronaut training and a Space Cadet award.',
        'card': 'Planet cards, real constellations and astronaut training.',
        'form': field('Astronaut\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">') + PAPER,
        'article': """<h2>Look up together</h2><p>Space is the perfect reason for an evening adventure. Wrap up warm, find the Moon, and see if you can spot the Plough or Orion from the Join the Stars page. The planet cards make a lovely game: shuffle them and put them back in order.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'winter', 'cat': 'packs', 'slug': 'winter-activity-pack-for-kids', 'tint': '#eef6ff', 'icon': '❄️', 'plus': True,
        'nav': 'Winter Wonderland pack',
        'title': 'Winter Activity Pack for Kids | Winter Bingo, Snowflake Drawing, Roll a Snowman, New Year Goals | PrintPals',
        'desc': 'A personalised winter activity pack for January and February: winter counting, winter words to trace, finish the snowflake, roll a snowman game, winter bingo, a cosy winter bucket list, new year goals, colouring pages and a Winter Wonder Star award.',
        'h1': 'Winter Wonderland pack',
        'lead': 'For the long, cosy weeks after the holidays. Winter counting and words, a snowflake to finish, a roll a snowman game, winter bingo, a cosy bucket list, new year goals and a Winter Wonder Star award. No snow needed.',
        'card': 'Winter bingo, roll a snowman, a bucket list and new year goals.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Design', seg('look', [('snowy', 'Snowy blue'), ('frosty', 'Frosty purple')], 'snowy')) + PAPER + SHUFFLE,
        'article': """<h2>Cosy winter learning</h2><p>January can feel long for little ones. Pin the bucket list on the fridge and tick off one small joy each week, and keep the bingo sheet by the door for winter walks. The goals page is a lovely thing to look back on next year.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'oceankit', 'cat': 'packs', 'slug': 'ocean-activity-pack-for-kids', 'tint': '#e9f6fc', 'icon': '🐙', 'plus': True,
        'nav': 'Ocean Explorer kit',
        'title': 'Ocean Printables for Kids | Sea Creature Cards, Ocean Zones, Beach Bingo | PrintPals',
        'desc': 'A personalised ocean activity pack: 8 sea creature fact cards, the ocean zones from sunlight to the abyss, counting, rock pool and beach bingo, design a sea creature, an ocean promise, ocean words, colouring and an Ocean Explorer award.',
        'h1': 'Ocean Explorer kit',
        'lead': 'Dive into the deep blue sea. Sea creature cards with amazing facts, a journey from the bright sunlight zone down to the dark abyss, rock pool bingo for the seaside, a creature to invent and an ocean promise to help protect the sea.',
        'card': 'Sea creature cards, ocean zones, beach bingo and an ocean promise.',
        'form': field('Explorer\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>The explorer series</h2><p>The Ocean Explorer kit joins the Dinosaur Explorer kit and Space Academy. Each one ends with an award that invites the next adventure, so children can collect them all. Take the bingo page to the beach, and sort the creature cards from the shallowest to the deepest.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'garden', 'cat': 'packs', 'slug': 'gardening-activity-pack-for-kids', 'tint': '#f1f8e6', 'icon': '🌱', 'plus': True,
        'nav': 'Little Gardener kit',
        'title': 'Gardening Printables for Kids | Seed Diary, Plant Growth Chart, Parts of a Plant, Bug Hunt | PrintPals',
        'desc': 'A personalised gardening pack for kids: a seed diary, a plant growth chart in centimetres, parts of a plant to label, what plants need cards, a garden bug hunt, gardener jobs, garden words, colouring and a Green Fingers award.',
        'h1': 'Little Gardener kit',
        'lead': 'Plant a seed and watch a little scientist grow. A diary to draw their plant every few days, a growth chart to measure it, the parts of a plant, what plants need, a garden bug hunt and a Green Fingers award when it blooms.',
        'card': 'A seed diary, growth chart, plant parts and a bug hunt.',
        'form': field('Gardener\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('What are you growing? (optional)', '<input type="text" name="plant" maxlength="18" placeholder="bean" autocomplete="off">') + PAPER,
        'article': """<h2>The easiest first plant</h2><p>Put a broad bean or runner bean seed in a clear jar with damp kitchen paper, so your child can watch the roots grow. Cress on cotton wool is even faster. Measure once a week with a ruler and colour the growth chart together.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'kindness', 'cat': 'packs', 'slug': 'kindness-activity-pack-for-kids', 'tint': '#fff0f5', 'icon': '💗', 'plus': True,
        'nav': 'Love and Kindness pack',
        'title': 'Kindness Activities for Kids | 28 Day Kindness Calendar, Love Notes, Compliment Cards | PrintPals',
        'desc': 'A personalised love and kindness pack for February and all year: a 28 day kindness calendar, love notes to cut out, I love you because pages, compliment cards, kindness bingo, counting, kind words, colouring and a Kindness Champion award.',
        'h1': 'Love and Kindness pack',
        'lead': 'Kindness is a habit children can practise. Twenty-eight small kind acts, one a day, love notes to hide in lunch boxes, compliment cards to give away, I love you because pages and a Kindness Champion award. Perfect for February, lovely all year.',
        'card': 'A 28 day kindness calendar, love notes and compliment cards.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Design', seg('look', [('pink', 'Pink hearts'), ('rainbow', 'Rainbow purple')], 'pink')) + PAPER + SHUFFLE,
        'article': """<h2>Small acts, big hearts</h2><p>Stick the calendar on the fridge and pick one act each morning. Talk at bedtime about how it felt. Children who practise kindness every day become kinder, happier and more confident with others.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'lunar', 'cat': 'packs', 'slug': 'lunar-new-year-activities-for-kids', 'tint': '#fff3e6', 'icon': '🏮', 'plus': True,
        'nav': 'Lunar New Year pack',
        'title': 'Lunar New Year Activities for Kids | Zodiac Animals, Red Envelope, Paper Lantern Craft | PrintPals',
        'desc': 'A personalised Lunar New Year pack: the Great Race with all 12 zodiac animals, find my animal chart, a red envelope to fold, a paper lantern craft, new year wishes, lucky counting, words to trace, a lantern colouring page and a certificate.',
        'h1': 'Lunar New Year pack',
        'lead': 'Celebrate the new year with families all over the world. The story of the Great Race and its twelve animals, a chart to find their own animal, a red envelope to fold, a paper lantern to make and wishes for the year ahead.',
        'card': 'The Great Race, find my animal, a red envelope and a lantern craft.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>A festival for everyone</h2><p>Lunar New Year is celebrated by more than a billion people. Children love finding their animal and those of their family. Tell the story of the Great Race, then make the lantern and fill the red envelope with a kind wish instead of money.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'safari', 'cat': 'packs', 'slug': 'safari-animals-activity-pack', 'tint': '#fff4e6', 'icon': '🦁', 'plus': True,
        'nav': 'Safari Explorer kit',
        'title': 'Safari Animal Printables for Kids | Animal Fact Cards, Height Chart, Riddles, Zoo Bingo | PrintPals',
        'desc': 'A personalised safari activity pack: 8 safari animal fact cards, a how tall are they chart, who am I riddle cards, safari spotter bingo for the zoo, counting, design an animal, safari words, colouring and a Safari Ranger award.',
        'h1': 'Safari Explorer kit',
        'lead': 'Grab the binoculars. Safari animal cards with wonderful facts, a chart that shows how they measure up next to your child, riddles to guess, spotter bingo for a zoo trip, a mixed-up animal to invent and a Safari Ranger award.',
        'card': 'Safari animal cards, a height chart, riddles and zoo bingo.',
        'form': field('Explorer\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>The explorer series</h2><p>The Safari Explorer kit is the fourth in the explorer series, with dinosaurs, space and the ocean. Take the bingo sheet on your next zoo visit, and read the riddles in the car on the way.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'detective', 'cat': 'packs', 'slug': 'detective-activity-pack-for-kids', 'tint': '#eef0fb', 'icon': '🔍', 'plus': True,
        'nav': 'Detective Academy',
        'title': 'Detective Activities for Kids | Mystery Puzzles, Fingerprint Lab, Secret Codes, Detective ID | PrintPals',
        'desc': 'A personalised detective pack for kids: a detective ID badge, a fingerprint lab, secret code messages, two mysteries to solve with suspects and clues, a case notebook, detective training and a Master Detective award.',
        'h1': 'Detective Academy',
        'lead': 'Sharp eyes and clever thinking. A detective ID badge, a fingerprint lab, secret messages to crack, two real mysteries to solve with suspect cards and clues, a notebook for mysteries at home and a Master Detective award.',
        'card': 'Two mysteries to solve, a fingerprint lab and secret codes.',
        'form': field('Detective\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>Thinking skills in disguise</h2><p>Solving a mystery means reading carefully, ruling things out and explaining why. That is logic, reading and reasoning, all while playing detective. The answers are printed upside down at the bottom of each case for grown-ups.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'grownupbook', 'cat': 'packs', 'slug': 'all-about-my-mum-dad-book', 'tint': '#fff0f5', 'icon': '💝', 'plus': True,
        'nav': 'All About My Special Person',
        'title': 'All About My Mum, Dad or Grandma Printable Book | Mother\'s Day and Father\'s Day Gift From Kids | PrintPals',
        'desc': 'A personalised gift book children make for Mum, Dad, Grandma, Grandad or anyone special: a portrait page, favourite things, they always say, an interview, things we love doing together, love coupons and a World\'s Best award.',
        'h1': 'All About My Special Person',
        'lead': 'The gift grown-ups keep forever. Your child draws and writes all about Mum, Dad, Grandma or anyone special: how old they think they are, what they always say, their favourite things, an interview, love coupons and a World\'s Best award.',
        'card': 'A gift book for Mum, Dad, Grandma or anyone special.',
        'form': field('Who is it for?', '<input type="text" name="who" maxlength="20" placeholder="Mum" autocomplete="off">')
        + field('Made by (child\'s name)', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">')
        + field('Design', seg('look', [('rose', 'Rose pink'), ('sky', 'Sky blue'), ('sunny', 'Sunny yellow')], 'rose')) + PAPER,
        'article': """<h2>For Mother\'s Day, Father\'s Day and every birthday</h2><p>Type Mum, Mummy, Dad, Grandma, Nana, Auntie or any name, and the whole book changes. Let your child answer on their own. The funny guesses are the best part. Staple it together and wrap it with a ribbon.</p>""",
        'faq': [('Can I make it for more than one person?', 'Yes. Print one for each person: type a different name in the Who is it for box each time.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'farm', 'cat': 'packs', 'slug': 'farm-animals-activity-pack', 'tint': '#fff4ec', 'icon': '🐄', 'plus': True,
        'nav': 'Farm Friends kit',
        'title': 'Farm Animal Printables for Toddlers and Preschool | Baby Animals, Animal Sounds, Farm Bingo | PrintPals',
        'desc': 'A personalised farm animal pack for little ones: 8 farm animal cards, match mummies and babies, who says what animal sounds, what the farm gives us, farm counting, farm bingo, farm words, colouring and a Little Farmer award.',
        'h1': 'Farm Friends kit',
        'lead': 'Moo, baa, oink! Farm animal cards with sounds and baby names, mummies and babies to match, animal noises to read in your silliest voice, where milk, eggs and wool come from, farm bingo and a Little Farmer award.',
        'card': 'Farm animals, baby names, animal sounds and farm bingo.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">') + PAPER + SHUFFLE,
        'article': """<h2>Perfect for the youngest learners</h2><p>Farm animals are often among a child\'s first words. Make every animal sound together, sing Old MacDonald with the cards, and take the bingo sheet to a petting farm.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'handmonth', 'cat': 'packs', 'slug': 'handwriting-month-workbook', 'tint': '#f1f8e6', 'icon': '✏️', 'plus': True,
        'nav': 'Handwriting Month',
        'title': 'Handwriting Month Workbook for Kids | 20 Daily Pages, Name Tracing, Progress Stars | PrintPals Plus',
        'desc': 'The Plus edition of our free tracing sheets: a personalised 4 week handwriting workbook with 20 daily pages, a warm-up every day, a letter or word of the day, the child\'s name daily, weekly badges, a month plan and a certificate.',
        'h1': 'Handwriting Month',
        'lead': 'Our free tracing sheets, grown into a whole month. Twenty short daily pages, each with a warm-up, a letter or word of the day with a picture, and your child\'s name to write, plus a month plan with stars, a badge every Friday and a Handwriting Hero certificate.',
        'card': 'A 4 week handwriting workbook: 20 daily pages with their name.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Level', seg('level', [('starter', 'Starter (3 to 4)'), ('steady', 'Steady (4 to 5)'), ('confident', 'Confident (5 to 7)')], 'steady')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Why a month works</h2><p>Handwriting improves with a little practice every day, not a big pile of sheets once a week. Each page takes about ten minutes. Keep the plan on the fridge and colour a star together after each day.</p>""",
        'faq': [('How is this different from the free tracing sheets?', 'The free sheets give you one page. Handwriting Month is a planned 4 week workbook: 20 daily pages that build step by step, a warm-up every day, a picture for every letter, their name daily, progress stars, Friday badges and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'mathsday', 'cat': 'packs', 'slug': 'maths-a-day-workbook', 'tint': '#eef6ff', 'icon': '🔢', 'plus': True,
        'nav': 'Maths a Day',
        'title': 'Maths a Day Workbook for Kids | 4 Weeks of Daily Maths, Friday Checks, Answers | PrintPals Plus',
        'desc': 'The Plus edition of our free maths sheets: a personalised 4 week daily maths workbook. Ten minutes a day with a warm-up, sums that get a little harder, a story problem with the child\'s name, Friday checks, a score tracker and answers.',
        'h1': 'Maths a Day',
        'lead': 'Our free maths sheets, grown into a whole month. Ten minutes a day: a warm-up, eight sums that get a little harder each day, and a story problem starring your child. Every Friday there is a check with a score, and all the answers are included for grown-ups.',
        'card': '4 weeks of 10 minute daily maths, Friday checks and answers.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Level', seg('level', [('counting', 'Counting (3 to 5)'), ('adding', 'Adding to 20 (5 to 6)'), ('bigger', 'Bigger numbers (6 to 8)')], 'adding')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Little and often</h2><p>Ten minutes of maths every day builds confidence far better than long sessions. The sums grow slowly, so your child always feels they can do it. Use the Friday score to celebrate progress, not to test. Press Make a new set for a completely fresh month.</p>""",
        'faq': [('How is this different from the free maths sheets?', 'The free sheets give you one page of sums. Maths a Day is a planned 4 week workbook: a warm-up, sums that grow day by day, a story problem with their name, Friday checks, a score tracker, an answer key and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'readmonth', 'cat': 'packs', 'slug': 'reading-month-sight-words', 'tint': '#fff0f5', 'icon': '📚', 'plus': True,
        'nav': 'Reading Month',
        'title': 'Reading Month for Kids | 16 Sight Words in 4 Weeks, Friday Stories, Word Wall | PrintPals Plus',
        'desc': 'The Plus edition of our free sight word sheets and reading log: a personalised 4 week reading workbook. A new word each day to trace, write and find, a sentence to read, a story every Friday using the week\'s words, a word wall and a certificate.',
        'h1': 'Reading Month',
        'lead': 'Our free sight word sheets, grown into a whole month. A new word every day to trace, write, find and read in a sentence, then a story every Friday using that week\'s four words, starring your child. A word wall to build and a Reading Star certificate.',
        'card': '16 sight words in 4 weeks with a story every Friday.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">')
        + field('Words', seg('set', [('1', 'First words (4 to 5)'), ('2', 'Next words (5 to 6)')], '1')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>From words to stories</h2><p>Four new words a week is the perfect pace. By Friday your child can read a whole little story, and that "I did it!" feeling is what makes readers. Read the story to someone they love and write their name on the page.</p>""",
        'faq': [('How is this different from the free sight word sheets?', 'The free sheets give you single pages. Reading Month is a planned 4 week workbook: a new word every day, a sentence to read, a Friday story using the week\'s words, a word wall, progress stars and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'familymonth', 'cat': 'packs', 'slug': 'family-month-organiser', 'tint': '#fff6e0', 'icon': '🏡', 'plus': True,
        'nav': 'Family Month Organiser',
        'title': 'Family Month Organiser | Routine Charts, Chore Charts, Reward Charts and Calendar for Kids | PrintPals Plus',
        'desc': 'The Plus edition of our free routine, chore and reward charts: a whole month for up to three children in one design. Month calendar, morning and bedtime routines for each child, family chore charts, star charts with weekly treats and Sunday check-ins.',
        'h1': 'Family Month Organiser',
        'lead': 'Our free routine, chore and reward charts, grown into one beautiful family system. A month calendar, morning and bedtime routines for each child, family chore charts, star charts with weekly treats and a Sunday check-in, for up to three children, all matching.',
        'card': 'Routines, chores, rewards and a calendar for the whole family.',
        'form': field('Children\'s names (up to 3)', '<input type="text" name="names" maxlength="60" placeholder="Mia, Leo" autocomplete="off">')
        + field('Family name (optional)', '<input type="text" name="family" maxlength="20" placeholder="Taylor" autocomplete="off">')
        + field('Month', seg('month', [('this', 'This month'), ('next', 'Next month')], 'this'))
        + field('Chores', seg('chores', [('little', 'Little ones'), ('middle', 'Ages 5 to 7'), ('big', 'Ages 8 and up')], 'little')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>One calm system for the whole family</h2><p>Separate charts for everything get messy fast. The Family Month Organiser puts routines, chores and rewards in one matching set for every child. Print it at the start of each month and use the Sunday check-in to celebrate the week together.</p>""",
        'faq': [('How is this different from the free charts?', 'The free charts make one chart at a time for one child. The Family Month Organiser is a whole month for up to three children: a calendar, morning and bedtime routines for each child, family chore charts, star charts with weekly treats and Sunday check-ins, all matching, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'colourmonth', 'cat': 'packs', 'slug': 'colouring-month-book', 'tint': '#fff0f5', 'icon': '🎨', 'plus': True,
        'nav': 'Colouring Month',
        'title': 'Colouring Month Book for Kids | 40 Busy Scene Colouring Pages With Daily Challenges | PrintPals Plus',
        'desc': 'The Plus edition of our free colouring pages: 40 full scene colouring pages in 8 worlds (garden, under the sea, space, town, party, fairy tale, safari and snow), a fun challenge on every page, a 40 star plan, draw your own scene, a gallery and a certificate.',
        'h1': 'Colouring Month',
        'lead': 'Our free colouring pages, grown into a whole month of busy, beautiful scenes. Forty pictures packed with friends and things to colour, across eight worlds from under the sea to outer space, each with a fun challenge, plus a plan, a gallery and an Amazing Artist certificate.',
        'card': '40 busy scene colouring pages, each with a fun challenge.',
        'form': field('Artist\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Scenes, not single pictures</h2><p>Every page is a whole little world with lots to find and colour, so children stay busy, creative and proud for longer. Two pictures a day fills a month, and Make a new set gives you a fresh book with different scenes.</p>""",
        'faq': [('How is this different from the free version?', 'The free colouring pages give you one picture. Colouring Month gives you 40 full scenes packed with things to colour, a challenge on every page, a plan, a gallery and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'puzzlemonth', 'cat': 'packs', 'slug': 'puzzle-month-book', 'tint': '#eef2ff', 'icon': '🧩', 'plus': True,
        'nav': 'Puzzle Month',
        'title': 'Puzzle Month Book for Kids | 20 Daily Puzzles: Mazes, Dot to Dot, Sudoku, Word Search | PrintPals Plus',
        'desc': 'The Plus edition of our free puzzle makers: a personalised 4 week puzzle book with a new puzzle every day (mazes, dot to dot, spot the difference, sudoku, word search, codes and coding), a puzzle passport, answers for grown-ups and a Puzzle Master award.',
        'h1': 'Puzzle Month',
        'lead': 'Our free puzzle makers, grown into a whole month. A new puzzle every day for four weeks, mixing mazes, dot to dot, spot the difference, sudoku, word searches, secret codes and coding, with a puzzle passport to stamp, all the answers and a Puzzle Master award.',
        'card': 'A new puzzle every day for 4 weeks, with a passport and answers.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Level', seg('level', [('easy', 'Easy (4 to 5)'), ('medium', 'Medium (6 to 7)'), ('hard', 'Tricky (8 and up)')], 'medium')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>A little brain workout every day</h2><p>Puzzles build patience, focus and problem solving. Changing the type every day keeps it fresh and exciting. Make a new set any time for a completely new month of puzzles.</p>""",
        'faq': [('How is this different from the free version?', 'The free makers give one kind of puzzle at a time. Puzzle Month gives a planned mix of 20 daily puzzles, a passport, answers and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'writemonth', 'cat': 'packs', 'slug': 'writing-month-journal', 'tint': '#fff6e0', 'icon': '✍️', 'plus': True,
        'nav': 'Writing Month',
        'title': 'Writing Month Journal for Kids | 20 Story Prompts With Word Banks and Sentence Starters | PrintPals Plus',
        'desc': 'The Plus edition of our free story writing pages: a personalised 4 week writing journal with 16 fun story prompts, a word bank and sentence starter every day, a box to draw first, a best story page every Friday and an author certificate.',
        'h1': 'Writing Month',
        'lead': 'Our free story writing pages, grown into a whole month. Sixteen playful prompts, from a dragon at school to a trip to the Moon, each with a picture, a word bank and a sentence starter, then a best story page every Friday and a Brilliant Author certificate.',
        'card': '16 story prompts with word banks, and a best story every Friday.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Level', seg('level', [('starter', 'Starter (5 to 6)'), ('writer', 'Writer (7 to 9)')], 'starter')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Draw first, then write</h2><p>Children write more when they draw their idea first. Read the prompt together, talk about it, use the word bank for tricky spellings, and let the ideas flow. On Friday, they choose their favourite and write it out beautifully.</p>""",
        'faq': [('How is this different from the free version?', 'The free page gives one prompt. Writing Month gives 16 prompts with word banks and sentence starters, 4 best story pages, a plan and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'morningwork', 'cat': 'packs', 'slug': 'morning-work-month-for-teachers', 'tint': '#fff1f1', 'icon': '🍎', 'plus': True, 'teacher': True,
        'nav': 'Morning Work Month',
        'title': 'Morning Work Month for Teachers | 20 Daily Sheets, Class Tracker, Certificates | PrintPals Teacher',
        'desc': 'A month of morning work for Reception, Year 1 or Year 2 (pre-K to grade 1): 20 daily sheets with a word to write, maths, reading and drawing, a class tracker with every child\'s name, a maths answer key and a certificate for each child.',
        'h1': 'Morning Work Month',
        'lead': 'Calm, purposeful mornings for a whole month. Twenty sheets that are easy to photocopy, each with a word of the day, four sums, a read and circle and a drawing task, plus a class tracker with every child\'s name, an answer key and a named certificate for every child.',
        'card': '20 morning work sheets, a class tracker and certificates.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">')
        + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">')
        + field('Children\'s names (one per line)', '<textarea name="names" rows="6" placeholder="Mia\nLeo\nEmma\nSam"></textarea>')
        + field('Level', seg('level', [('r', 'Reception / Pre-K (4 to 5)'), ('y1', 'Year 1 / Kindergarten (5 to 6)'), ('y2', 'Year 2 / Grade 1 (6 to 7)')], 'y1')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>A settled start to every day</h2><p>Morning work gives children something calm and familiar to do as they arrive. Photocopy one sheet for each child each day, tick the tracker as they finish, and hand out the certificates at the end of the month.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'Morning Work Month is part of the teacher plan: $59 a year for a whole class. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'timesclub', 'cat': 'packs', 'slug': 'times-tables-club', 'tint': '#f5edff', 'icon': '✖️', 'plus': True,
        'nav': 'Times Tables Club',
        'title': 'Times Tables Club for Kids | 4 Week Times Tables Workbook, Speed Tests, Badges | PrintPals Plus',
        'desc': 'The Plus edition of our free times tables sheets: a personalised 4 week club with a membership card, one table a week (learn, fill the gaps, mixed practice, story sums, Friday speed test), badges to colour, answers and a Times Tables Champion certificate.',
        'h1': 'Times Tables Club',
        'lead': 'Our free times tables sheets, grown into a club children love belonging to. A membership card, one new table a week with a gentle five day routine, a Friday speed test to beat, a badge for every table and a Times Tables Champion certificate.',
        'card': 'A times tables club: a table a week, speed tests and badges.',
        'form': field('Member\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">')
        + field('Level', seg('level', [('start', '×2, ×10, ×5, ×3'), ('next', '×3, ×4, ×6, ×8'), ('master', '×6, ×7, ×8, ×9')], 'start')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Monday to Friday, table by table</h2><p>Monday they learn the table with a number line, Tuesday they fill the gaps, Wednesday they mix it up, Thursday they use it in real life, and Friday is the speed test. Time it with a phone and celebrate every second they beat.</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets give practice sums. The club gives a membership card, a planned week for each table, speed tests, badges, answers and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'timemonth', 'cat': 'packs', 'slug': 'telling-time-month', 'tint': '#eef6ff', 'icon': '🕒', 'plus': True,
        'nav': 'Time Month',
        'title': 'Telling the Time Month for Kids | 4 Weeks of Clocks, Draw the Hands, My Day | PrintPals Plus',
        'desc': 'The Plus edition of our free clock worksheets: a personalised 4 week telling the time workbook. Read the clocks, draw the hands, my day in times, Friday time checks, a paper clock to make, answers and a certificate.',
        'h1': 'Time Month',
        'lead': 'Our free clock sheets, grown into a whole month. Week by week from o\'clock to half past, quarter past and five minutes: read the clocks, draw the hands, put times on their own day, a Friday check, a paper clock to make and a Time Teller certificate.',
        'card': '4 weeks of telling the time, from o\'clock to five minutes.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Level', seg('level', [('easy', 'O\'clock and half past (5 to 6)'), ('harder', 'Quarters and 5 minutes (6 to 8)')], 'easy')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Keep a real clock nearby</h2><p>Telling the time makes sense when it connects to real life. Look at a real clock at breakfast and bedtime, and use the My day pages to link times to their own routine. Make the paper clock in the first week and use it every day.</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets give one page of clocks. Time Month is a planned 4 week workbook that builds week by week, with My day pages, Friday checks, a paper clock, answers and a certificate.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'phonicsmonth', 'cat': 'packs', 'slug': 'phonics-month-workbook', 'tint': '#fff0f0', 'icon': '🔤', 'plus': True,
        'nav': 'Phonics Month',
        'title': 'Phonics Month for Kids | 16 Letter Sounds in 4 Weeks, Blending and First Words | PrintPals Plus',
        'desc': 'The Plus edition of our free letter sounds sheets: a personalised 4 week phonics workbook. A new sound each day (s a t p, i n m d, g o c k, e u r h) with pictures, tracing and first sound puzzles, then blending real words every Friday.',
        'h1': 'Phonics Month',
        'lead': 'Our free letter sounds sheets, grown into a whole month. A new sound every day with pictures, tracing and a find the sound hunt, then every Friday your child blends the sounds into real words and reads their very first sentence.',
        'card': '16 letter sounds in 4 weeks, with blending every Friday.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>The same order schools use</h2><p>The sounds come in the order most schools teach them: s, a, t, p first, because they make lots of words quickly. By the end of week one your child can read sat, pat and tap. Say the pure sounds, sss not suh, and blend them together slowly.</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets cover single sounds. Phonics Month is a planned 4 week workbook: a new sound daily, picture hunts, tracing, blending real words every Friday and a certificate.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'tinyhands', 'cat': 'packs', 'slug': 'toddler-activity-month', 'tint': '#fff6e0', 'icon': '🧸', 'plus': True,
        'nav': 'Tiny Hands Month',
        'title': 'Toddler Activity Month | Printables for 2 and 3 Year Olds: Tracing, Dot Stickers, Cutting, Colouring | PrintPals Plus',
        'desc': 'A month of printable activities for 2 and 3 year olds: follow the path tracing, dot sticker and dabbing pages, first snipping strips, find the same and busy scene colouring, with a plan, weekly badges and a Little Superstar certificate.',
        'h1': 'Tiny Hands Month',
        'lead': 'Big fun for little hands, ages 2 and 3. Twenty short playful days: follow the path, dot and dab with stickers or paint, first snipping, find the same and busy pictures to colour, all building the finger strength they need for writing later.',
        'card': 'A month of tracing, dot stickers, snipping and colouring for ages 2 to 3.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Little and playful</h2><p>At two and three, five minutes is plenty. Use chunky crayons, dot stickers, a cotton bud dipped in paint, or just a finger. Snipping can be tearing at first. Stop while it is still fun, and praise the trying.</p>""",
        'faq': [('How is this different from the free version?', 'The free pre-writing and cutting sheets give one page. Tiny Hands Month is a planned month of five different activities for ages 2 to 3, with busy colouring scenes, badges and a certificate.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'sciencemonth', 'cat': 'packs', 'slug': 'science-experiments-month', 'tint': '#e8f8f4', 'icon': '🧪', 'plus': True,
        'nav': 'Science Month',
        'title': 'Science Experiments for Kids Month | 16 Easy Kitchen Experiments With Predict and Observe Pages | PrintPals Plus',
        'desc': 'The Plus edition of our free science sheets: a personalised 4 week lab book with 16 easy experiments using things from home, what you need, what to do, I think and I saw boxes, drawing space, the simple science why, Friday science reports and a Young Scientist award.',
        'h1': 'Science Month',
        'lead': 'Our free science sheets, grown into a whole month of real experiments. Sixteen easy experiments with things you already have, from a fizzy volcano to walking water, each with a guess, a drawing, what happened and the simple science behind it.',
        'card': '16 easy kitchen experiments with predict, observe and report pages.',
        'form': field('Scientist\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Real science at the kitchen table</h2><p>Every experiment uses everyday things like water, vinegar, a balloon or a magnet. Always do them together. The magic is in the guess first, then the watching, then the why. Friday is report day, just like real scientists.</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets give one page. Science Month gives 16 planned experiments with full lab pages, Friday reports and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'spellmonth', 'cat': 'packs', 'slug': 'spelling-month-workbook', 'tint': '#eef2ff', 'icon': '🔠', 'plus': True,
        'nav': 'Spelling Month',
        'title': 'Spelling Month Workbook | Weekly Spelling Lists, Look Say Cover Write Check, Friday Tests | PrintPals Plus',
        'desc': 'The Plus edition of our free spelling sheets: a personalised 4 week spelling workbook with 6 words a week (or your own school words), look say cover write check, a word hunt, missing letters, sentences, a Friday test and a Spelling Star award.',
        'h1': 'Spelling Month',
        'lead': 'Our free spelling sheets, grown into a whole month. Six words a week with a different activity every day: look, say, cover, write and check, a word hunt, build the word, use it in a sentence, and a Friday test. Use our lists or type your child\'s own school words.',
        'card': '4 weeks of spellings: a daily routine and a Friday test.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">')
        + field('Level', seg('level', [('1', 'Level 1 (5 to 6)'), ('2', 'Level 2 (6 to 7)'), ('3', 'Level 3 (7 to 9)')], '1'))
        + field('Or use school words (optional, 6 to 24)', '<textarea name="words" rows="4" placeholder="Type the words from school, one per line or with commas"></textarea>') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>A little every day beats a lot on Thursday night</h2><p>Spellings stick when children meet them in lots of small ways across the week. Type in the words sent home from school and the whole month is built around them, for home or for the classroom.</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets make one page of practice. Spelling Month plans a whole month: a different activity every day, a Friday test, your own school words if you like, and a certificate.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'calmmonth', 'cat': 'packs', 'slug': 'calm-and-happy-month', 'tint': '#fff0f5', 'icon': '🌈', 'plus': True,
        'nav': 'Calm and Happy Month',
        'title': 'Calm and Happy Month for Kids | Daily Feelings Check-in, Breathing Games, Gratitude Journal | PrintPals Plus',
        'desc': 'The Plus edition of our free feelings and calm sheets: a personalised 4 week wellbeing journal with a daily feelings check-in, a breathing game, a calm activity and a thank you, a Friday my week reflection and a Calm Champion award.',
        'h1': 'Calm and Happy Month',
        'lead': 'Our free feelings and calm sheets, grown into a gentle daily habit. Five minutes a day: how do I feel, a breathing game like bumblebee breath, a small calm activity and a thank you, then a Friday look back at the week together.',
        'card': 'A daily feelings check-in, breathing games and gratitude.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Small calm moments add up</h2><p>Children who practise calming down when they are already calm find it much easier when big feelings arrive. Keep the journal by the bed or use it after school. Do the breathing games together. Grown-ups need them too!</p>""",
        'faq': [('How is this different from the free version?', 'The free sheets cover single ideas. Calm and Happy Month is a daily journal with 16 check-ins, breathing games, calm activities, thank yous, 4 weekly reflections and a certificate.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'readadventure', 'cat': 'packs', 'slug': 'reading-adventure-month', 'tint': '#fff6e0', 'icon': '🗺️', 'plus': True,
        'nav': 'Reading Adventure Month',
        'title': 'Reading Adventure Month | Reading Map, Daily Book Tasks, Book Reviews and Bookmarks for Kids | PrintPals Plus',
        'desc': 'The Plus edition of our free reading log: a personalised 4 week reading journal with a reading map of 20 stops to the treasure, a mini book task every day, bookmarks to colour, a Friday book review and a Reading Explorer award. Works with any books.',
        'h1': 'Reading Adventure Month',
        'lead': 'Our free reading log, grown into a whole adventure. A treasure map with 20 stops to colour, a different mini task each day (draw the character, find new words, change the ending), bookmarks, a Friday book review and a Reading Explorer award. Works with any books.',
        'card': 'A reading treasure map, daily book tasks and book reviews.',
        'form': field('Reader\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Any book, every day</h2><p>Picture books, library books, comics and school readers all count. The daily task takes a few minutes and turns reading into talking and thinking about stories. Keep the map on the wall and colour a stop together each day.</p>""",
        'faq': [('How is this different from the free version?', 'The free reading log tracks books. Reading Adventure Month adds a treasure map, a new task every day, bookmarks, book reviews and a certificate, in four designs.'), ('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'classwelcome', 'cat': 'packs', 'slug': 'class-welcome-kit-for-teachers', 'tint': '#fff6e0', 'icon': '🏷️', 'plus': True, 'teacher': True,
        'nav': 'Class Welcome Kit',
        'title': 'Class Welcome Kit for Teachers | Desk Name Tags, Peg Labels, Class Jobs, Birthday Chart, All About Me | PrintPals Teacher',
        'desc': 'Back to school in one click: desk name tags with alphabet and number lines, peg and drawer labels with an animal for every child, a class birthday chart, a class jobs chart with name cards, and an All about me page for every child, all named from your class list.',
        'h1': 'Class Welcome Kit',
        'lead': 'Type your class list once and get everything for a brand new class: desk name tags with an alphabet and number line, peg and drawer labels with each child\'s own animal, a birthday chart, a class jobs chart with name cards and an All about me page for every child.',
        'card': 'Name tags, peg labels, class jobs and All about me pages for every child.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': """<h2>Hours of cutting and typing, done in a minute</h2><p>Setting up a classroom usually means typing every name into five different templates. Here you type the list once. Each child keeps the same animal on their tag, peg and job card, so even children who cannot read yet can find their own things.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classawards', 'cat': 'packs', 'slug': 'class-awards-for-every-child', 'tint': '#f5edff', 'icon': '🏆', 'plus': True, 'teacher': True,
        'nav': 'Class Awards Pack',
        'title': 'End of Year Class Awards | A Different Award for Every Child, Named | PrintPals Teacher',
        'desc': 'A personalised award for every child in your class, and no two the same: Kindest Friend, Super Reader, Maths Wizard, Brilliant Builder and 36 more. Includes an awards list for planning the ceremony and a Star of the Week certificate.',
        'h1': 'Class Awards Pack',
        'lead': 'Every child deserves to hear what makes them special. Type your class list and every child gets their own named award, all different: Kindest Friend, Super Reader, Brilliant Builder and many more, plus a list for planning your ceremony and a Star of the Week certificate.',
        'card': 'A different named award for every child in the class.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Choose, then shuffle</h2><p>The first page lists every child with their award. Press Make a new set to shuffle the awards until each one fits the child. Perfect for the end of term, the end of the year or a class celebration.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'homeworkmonth', 'cat': 'packs', 'slug': 'homework-month-for-teachers', 'tint': '#eef6ff', 'icon': '📝', 'plus': True, 'teacher': True,
        'nav': 'Homework Month',
        'title': 'Homework Sheets for Teachers | 4 Weekly Homework Sheets, Parent Note, Class Tracker | PrintPals Teacher',
        'desc': 'A month of weekly homework for Year 1 to Year 3 (kindergarten to grade 2): maths, spellings, a reading log and a fun family task on each sheet, a grown-up comment box, a note for families, a class homework tracker and an answer key.',
        'h1': 'Homework Month',
        'lead': 'A whole month of homework in one click. Each weekly sheet has a little maths, spellings, a reading log and a fun family task, with a comment box for grown-ups. Plus a friendly note for families, a class tracker with every name and an answer key.',
        'card': '4 weekly homework sheets, a family note and a class tracker.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.').replace("'Class list'", "'Class list (optional, for the tracker)'") + field('Level', seg('level', [('y1', 'Year 1 / Kindergarten'), ('y2', 'Year 2 / Grade 1'), ('y3', 'Year 3 / Grade 2')], 'y1')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Twenty happy minutes a week</h2><p>Good homework is short, varied and something families can enjoy together. The family task gets children talking about their learning at home, and the comment box keeps you connected with every family.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'coverkit', 'cat': 'packs', 'slug': 'cover-teacher-kit', 'tint': '#e8f8f4', 'icon': '🧑‍🏫', 'plus': True, 'teacher': True,
        'nav': 'Cover Teacher Kit',
        'title': 'Cover Teacher Kit | Supply and Substitute Teacher Plans and Activities, Ready in Minutes | PrintPals Teacher',
        'desc': 'Everything a cover or substitute teacher needs for a whole day: class notes, a plan for the day, a seating plan with your class names, maths, writing, a puzzle, a calm colouring scene, games with no equipment, fast finisher challenges and a How did it go? note.',
        'h1': 'Cover Teacher Kit',
        'lead': 'Off sick or on a course? Print one folder and your class is in safe hands. Class notes to fill in, a plan for the day, a seating plan with your children\'s names, ready activities for every session, games with no equipment and a How did it go? note to come back to.',
        'card': 'A whole cover day: notes, seating plan, activities and games.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.').replace("'Class list'", "'Class list (optional, for the seating plan)'") + field('Age', seg('level', [('younger', 'Ages 5 to 7'), ('older', 'Ages 7 to 9')], 'younger')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': """<h2>Keep one ready in your drawer</h2><p>Print a cover folder at the start of each term and fill in the class notes. When you are unexpectedly away, everything is ready. Press Make a new set for fresh activities each time.</p>""",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'readingrecords', 'cat': 'packs', 'slug': 'class-reading-records', 'tint': '#eef6ff', 'icon': '📖', 'plus': True, 'teacher': True,
        'nav': 'Class Reading Records',
        'title': 'Class Reading Records | A Named Reading Record Book for Every Child, Class Tracker, Reading Awards | PrintPals Teacher',
        'desc': 'A reading record book for every child in your class: a named cover with their own animal, 8 weeks of reading logs, a class home reading tracker, 25, 50 and 100 nights of reading awards and a note for families.',
        'h1': 'Class Reading Records',
        'lead': 'Type your class list and every child gets their own reading record book with their name and animal on the cover and 8 weeks of reading logs. Plus a class home reading tracker, milestone awards for 25, 50 and 100 nights, and a friendly note for families.',
        'card': 'A named reading record book for every child, plus a class tracker.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Reading at home, celebrated</h2><p>Children read more when it is noticed. Check the records on Fridays, tick the class tracker and hand out the milestone awards in assembly. Families love the personal covers.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'phonicscheck', 'cat': 'packs', 'slug': 'phonics-assessment-kit', 'tint': '#fff0f0', 'icon': '🔤', 'plus': True, 'teacher': True,
        'nav': 'Phonics Check Kit',
        'title': 'Phonics Assessment Kit for Teachers | Sound Check Sheets for Every Child, Class Results Grid | PrintPals Teacher',
        'desc': 'A phonics assessment kit for Phase 2 or Phase 3: a sound card and tricky word card for the child, a named record sheet for every child with termly tick boxes, a class results grid and a Sounds Superstar award for every child.',
        'h1': 'Phonics Check Kit',
        'lead': "Assess every child's sounds three times a year in minutes. A big sound card and tricky word card for the child to read from, a named record sheet per child with autumn, spring and summer tick boxes, a class results grid and a Sounds Superstar award for everyone.",
        'card': 'Sound checks for every child, a class grid and awards.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Sounds', seg('level', [('p2', 'Phase 2'), ('p3', 'Phase 3')], 'p2')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': "<h2>One sheet, all year</h2><p>Use a different coloured pen each term on the same record sheet, so progress is easy to see at a glance and to share at parents' evening.</p>",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'parentsevening', 'cat': 'packs', 'slug': 'parents-evening-kit', 'tint': '#fff6e0', 'icon': '🗓️', 'plus': True, 'teacher': True,
        'nav': "Parents' Evening Kit",
        'title': "Parents' Evening Kit for Teachers | Invitations, Booking Slots, Meeting Notes for Every Child | PrintPals Teacher",
        'desc': "Everything for a calm, organised parents' evening: an invitation letter, booking slots, a questions from home form, a meeting notes sheet for every child, next steps slips to take home and a welcome sign for your door.",
        'h1': "Parents' Evening Kit",
        'lead': "Walk into parents' evening calm and ready. An invitation to send home, booking slots, a questions from home form, a named meeting sheet for every child covering reading, maths, writing and wellbeing, next steps slips and a welcome door sign.",
        'card': 'Invitations, booking slots and a meeting sheet for every child.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Every family feels heard</h2><p>The questions from home form means you know what families want to talk about before they sit down. Start with a strength, share one next step and send them home with a slip.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'reporthelper', 'cat': 'packs', 'slug': 'report-writing-helper', 'tint': '#f5edff', 'icon': '📋', 'plus': True, 'teacher': True,
        'nav': 'Report Writing Helper',
        'title': 'School Report Writing Helper | Comment Bank, Report Notes for Every Child, Pupil Voice | PrintPals Teacher',
        'desc': 'Write warm, personal school reports faster: a positive comment bank for attitude, reading, writing, maths, friendships and next steps, a report notes page for every child with suggested openings, a pupil voice page and a class progress overview.',
        'h1': 'Report Writing Helper',
        'lead': 'Report season, made kinder. A warm comment bank for every subject, a notes page for every child with suggested openings already written in their name, a pupil voice page where children share their pride, and a class progress overview.',
        'card': 'A comment bank and a report page for every child.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': "<h2>Personal, never robotic</h2><p>Each child gets different suggested openings, so reports never sound copied. Pair them with the child's own pupil voice page to add a lovely personal touch.</p>",
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'xmascards', 'cat': 'packs', 'slug': 'class-christmas-cards', 'tint': '#fff0f0', 'icon': '💌', 'plus': True, 'teacher': True,
        'nav': 'Class Christmas Cards',
        'title': 'Christmas Cards for Every Child in Your Class | Named Cards From the Teacher, Cards to Make, Gift Tags | PrintPals Teacher',
        'desc': 'A named Christmas card from you for every child in your class, with a colour-in front and a warm message inside, plus a card each child makes for their family and named gift tags.',
        'h1': 'Class Christmas Cards',
        'lead': 'Type your class list once. Every child gets a Christmas card from you with their name on the front and a warm personal message inside, plus a card to make for their own family and gift tags with their name, ready for the class gifts.',
        'card': 'A named Christmas card for every child, plus cards they make.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('red', '🎄 Classic red'), ('green', '🌲 Evergreen'), ('frosty', '❄️ Frosty blue')], 'red')) + PAPER,
        'article': '<h2>No more writing 30 cards by hand</h2><p>Print the cards on card, let the children colour the fronts and fold them. Each has a warm message already inside with their name. Print the inside page on the back of the front page, then fold.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classcalendar', 'cat': 'packs', 'slug': 'class-calendar-gift', 'tint': '#f1f8e6', 'icon': '📅', 'plus': True, 'teacher': True,
        'nav': 'Class Calendar Gift',
        'title': 'Class Calendar Christmas Gift | A Named Calendar Children Draw for Their Family | PrintPals Teacher',
        'desc': 'The classic Christmas gift for families: every child gets a named calendar for the new year with a cover and twelve month pages, each with a box for their own drawing, plus a monthly drawing plan for teachers.',
        'h1': 'Class Calendar Gift',
        'lead': 'The Christmas gift families treasure. Every child gets their own calendar for next year, with a named cover and twelve month pages, each with a space for their own picture. Draw one a day through December, staple, punch and wrap.',
        'card': 'A named calendar gift each child draws for their family.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('red', '🎄 Classic red'), ('green', '🌲 Evergreen'), ('frosty', '❄️ Frosty blue')], 'red')) + PAPER,
        'article': '<h2>The gift that stays on the wall all year</h2><p>Families keep these calendars for years. Give children one month a day in December with the drawing ideas on the planning page, then staple at the top and punch a hole to hang.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'xmasshow', 'cat': 'packs', 'slug': 'christmas-show-kit', 'tint': '#fff6e0', 'icon': '🎭', 'plus': True, 'teacher': True,
        'nav': 'Christmas Show Kit',
        'title': 'Christmas Show and Nativity Kit for Teachers | Cast List, Role Cards, Tickets, Programme, Certificates | PrintPals Teacher',
        'desc': 'Everything for the class Christmas show or nativity: roles shared round your class list, a cast list, a named role card for every child, tickets, a programme with the whole cast, a poster, a rehearsal tracker and a Star Performer certificate for every child.',
        'h1': 'Christmas Show Kit',
        'lead': 'The Christmas show, organised in one click. Choose a nativity or a winter show and the roles are shared round your class list, with a named role card for every child, tickets, a programme listing the whole cast, a poster, a rehearsal tracker and a certificate for everyone.',
        'card': 'Cast list, role cards, tickets, programme and certificates.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Show', seg('kind', [('nativity', 'Nativity'), ('winter', 'Winter show')], 'nativity')) + field('Show title (optional)', '<input type="text" name="show" maxlength="30" placeholder="The Busy Stable" autocomplete="off">') + field('Design', seg('look', [('red', '🎄 Classic red'), ('green', '🌲 Evergreen'), ('frosty', '❄️ Frosty blue')], 'red')) + PAPER,
        'article': '<h2>Every child a star</h2><p>Roles are spread round the class list so everyone has a part. Change the order of names to change the roles. The programme lists every child, which families love to keep.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classadvent', 'cat': 'packs', 'slug': 'class-advent-countdown', 'tint': '#eef6ff', 'icon': '🎁', 'plus': True, 'teacher': True,
        'nav': 'Class Advent Countdown',
        'title': 'Class Advent Calendar for Teachers | 24 Classroom Christmas Activities, Daily Helper, Certificates | PrintPals Teacher',
        'desc': 'A classroom advent countdown: 24 quick Christmas activity cards, a big countdown chart with a helper of the day from your class list, helper badges and a Christmas Star certificate for every child.',
        'h1': 'Class Advent Countdown',
        'lead': 'Twenty-four days of classroom Christmas joy, five minutes a day. A big countdown chart where each day has a helper from your class list, 24 activity cards from jumper day to a kindness note, helper badges and a Christmas Star certificate for every child.',
        'card': '24 classroom Christmas activities with a daily helper.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('red', '🎄 Classic red'), ('green', '🌲 Evergreen'), ('frosty', '❄️ Frosty blue')], 'red')) + PAPER + SHUFFLE,
        'article': '<h2>A little magic every morning</h2><p>Peg the cards on a string or tuck them in envelopes. The helper of the day opens the card and reads it out. Press Make a new set to shuffle who helps on which day.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classbirthday', 'cat': 'packs', 'slug': 'class-birthday-kit', 'tint': '#fff0f5', 'icon': '🎂', 'plus': True, 'teacher': True,
        'nav': 'Class Birthday Kit',
        'title': 'Class Birthday Kit for Teachers | Named Birthday Crowns, Cards and Certificates for Every Child | PrintPals Teacher',
        'desc': 'Celebrate every birthday in your class all year: a named birthday crown, a card from the class and a birthday certificate for every child, a birthday balloon display and birthday star badges.',
        'h1': 'Class Birthday Kit',
        'lead': 'Every birthday, ready before it arrives. Type your class list and every child gets a birthday crown with their name, a card from the whole class to sign and a birthday certificate, plus a balloon birthday display and star badges for the big day.',
        'card': 'A named birthday crown, card and certificate for every child.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Print once, celebrate all year</h2><p>Print the whole set in September and keep it in a folder. When a birthday comes, the crown, card and certificate are ready. No child is ever forgotten.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classrewards', 'cat': 'packs', 'slug': 'class-reward-system', 'tint': '#fff6e0', 'icon': '⭐', 'plus': True, 'teacher': True,
        'nav': 'Class Reward System',
        'title': 'Classroom Reward System | Named Sticker Charts, Team Points, Reward Coupons, Star of the Week | PrintPals Teacher',
        'desc': 'A complete positive behaviour system for your class: a named sticker chart for every child, four class teams with a points chart, reward coupons, a golden time tracker and a Star of the Week display.',
        'h1': 'Class Reward System',
        'lead': 'A whole positive behaviour system in one click. A named star chart for every child, four class teams with a points chart, ten reward coupons children love, a golden time tracker and a Star of the Week display for the wall.',
        'card': 'Named sticker charts, team points, coupons and Star of the Week.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Chart goal (optional)', '<input type="text" name="goal" maxlength="40" placeholder="Fill 20 stars to earn a prize!" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Catch them being brilliant</h2><p>Positive systems work best when they are simple and visible. Children see their own chart, their team and the Star of the Week, so there is always something to aim for.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'movingup', 'cat': 'packs', 'slug': 'moving-up-transition-kit', 'tint': '#e8f8f4', 'icon': '🎒', 'plus': True, 'teacher': True,
        'nav': 'Moving Up Kit',
        'title': 'Moving Up Day Transition Kit for Teachers | All About Me for My New Teacher, Handover Notes | PrintPals Teacher',
        'desc': 'Everything for moving up to a new class: an All about me for my new teacher page for every child, handover notes per child, a class summary for next year, worries and wishes, a welcome letter and a Ready to Move Up certificate for every child.',
        'h1': 'Moving Up Kit',
        'lead': 'Make moving up calm and caring. Every child fills in an All about me page for their new teacher, you write a handover note for each child, and the class summary gives the next teacher the whole picture. Plus worries and wishes, a welcome letter and a certificate for everyone.',
        'card': 'All about me pages, handover notes and certificates.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Next class (optional)', '<input type="text" name="next" maxlength="24" placeholder="Year 2" autocomplete="off">') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Every child known from day one</h2><p>The handover notes are for teachers only. The All about me pages come from the children, so the new teacher hears their voice as well as yours.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'classspecial', 'cat': 'packs', 'slug': 'class-mothers-day-fathers-day-cards', 'tint': '#fff0f0', 'icon': '💐', 'plus': True, 'teacher': True,
        'nav': 'Class Special Person Cards',
        'title': "Mother's Day and Father's Day Class Kit | A Card and Mini Book for Every Child | PrintPals Teacher",
        'desc': "Mother's Day, Father's Day or Grandparents' Day for the whole class: a named card each child makes with their name inside, a mini gift book about their special person and a class checklist so every family gets their gift.",
        'h1': 'Class Special Person Cards',
        'lead': "Mother's Day, Father's Day and Grandparents' Day, ready for the whole class. Type Mum, Dad, Grandma or any name and every child gets a card with their name inside, a four page mini book about their special person and a checklist so no one is missed.",
        'card': 'A named card and mini book for every child to give.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Who is it for?', '<input type="text" name="who" maxlength="20" placeholder="Mum" autocomplete="off">', 'Type Mum, Dad, Grandma or leave as Mum. If this day is hard for some families, try Special Person.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Thoughtful for every family</h2><p>Families look different, so you can type any word: Mum, Dad, Grandma, Nana, Auntie or Special Person. Print a few different versions so every child makes a card for someone they love.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'autumnkit', 'cat': 'packs', 'slug': 'autumn-activity-pack-for-kids', 'tint': '#fff4e6', 'icon': '🍂', 'plus': True,
        'nav': 'Autumn Explorer kit',
        'title': 'Autumn Activities for Kids | Nature Hunt, Busy Autumn Colouring Scenes, Pumpkin Maths | PrintPals Plus',
        'desc': 'A personalised autumn pack for October and November: an autumn nature hunt, busy autumn colouring scenes, a leaf lab, pumpkin maths, conker counting, autumn words, an autumn diary and an Autumn Explorer award.',
        'h1': 'Autumn Explorer kit',
        'lead': 'Crunchy leaves and cosy days. An autumn nature hunt for your walks, busy colouring scenes full of falling leaves and friends, a leaf lab for leaf rubbing, pumpkin maths, conker counting, an autumn diary and an Autumn Explorer award.',
        'card': 'Nature hunt, busy autumn scenes, pumpkin maths and more.',
        'form': field('Explorer\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + PAPER + SHUFFLE,
        'article': "<h2>This season's drop</h2><p>Every season brings a new Plus pack. Take the nature hunt on your next walk, collect leaves for the leaf lab and save the colouring scenes for rainy afternoons.</p>",
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'shopkit', 'cat': 'packs', 'slug': 'pretend-play-shop-printables', 'tint': '#f1f8e6', 'icon': '🛒', 'plus': True,
        'nav': 'Little Shop kit',
        'title': 'Pretend Play Shop Printables for Kids | Price Tags, Play Money, Shopping Lists, Receipts | PrintPals Plus',
        'desc': "A personalised pretend shop kit: a shop sign with your child's shop name, 16 price tags, play coins and notes in your currency, shopping lists, receipts, money sums and shopkeeper badges.",
        'h1': 'Little Shop kit',
        'lead': 'Open your own little shop at home. A big shop sign with their shop name, sixteen price tags, play money in your own currency, shopping lists, receipts, shop sums and badges. Real maths through pretend play.',
        'card': 'A pretend shop: price tags, play money, lists and receipts.',
        'form': field('Shopkeeper\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">') + field('Shop name (optional)', '<input type="text" name="shop" maxlength="22" placeholder="Corner Shop" autocomplete="off">') + field('Money', seg('currency', [('GBP', '£ Pounds'), ('USD', '$ Dollars'), ('EUR', '€ Euros'), ('NGN', '₦ Naira'), ('CAD', 'C$ Canada'), ('AUD', 'A$ Australia')], 'GBP')) + field('Prices', seg('level', [('easy', 'Easy prices'), ('harder', 'Harder prices')], 'easy')) + PAPER + SHUFFLE,
        'article': '<h2>Maths they will ask to play</h2><p>Children learn money fastest when they handle it. Stick the price tags on toys or real snacks, fill the till with play money and take turns as shopkeeper and customer.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'vetkit', 'cat': 'packs', 'slug': 'pet-vet-pretend-play-kit', 'tint': '#eef6ff', 'icon': '🩺', 'plus': True,
        'nav': 'Pet Vet Clinic',
        'title': 'Pet Vet Pretend Play Printables | Vet ID Badge, Patient Cards, Check-up Forms, Prescription Pad | PrintPals Plus',
        'desc': "A personalised pet vet pretend play kit: a vet ID badge with your child's name, patient cards, check-up forms, a prescription pad, pet care checklist, a busy colouring scene and a Super Vet certificate.",
        'h1': 'Pet Vet Clinic',
        'lead': "Dr Mia will see you now! A vet ID badge with your child's name, patient cards for soft toys, check-up forms to tick, a prescription pad, a pet care checklist and a Super Vet certificate. Hours of kind, caring pretend play.",
        'card': 'Vet ID, patient cards, check-up forms and a prescription pad.',
        'form': field('Vet\'s name', '<input type="text" name="name" maxlength="20" placeholder="Mia" autocomplete="off">') + PAPER,
        'article': '<h2>Kindness through play</h2><p>Line up the soft toys in the waiting room. Children practise caring, talking about feelings and even a little writing and science, all while playing vets.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'roadtrip', 'cat': 'packs', 'slug': 'road-trip-activity-book-for-kids', 'tint': '#fff3ea', 'icon': '🚗', 'plus': True,
        'nav': 'Road Trip Adventure Book',
        'title': 'Road Trip Activity Book for Kids | Car Bingo, Journey Map, Travel Games, Travel Diary | PrintPals Plus',
        'desc': 'A personalised road trip book: two car bingo cards, a journey map, are we there yet? games, a number plate hunt, a maze, a travel diary, a busy colouring scene and a Super Traveller award.',
        'h1': 'Road Trip Adventure Book',
        'lead': 'Happy car journeys, even long ones. Two car bingo cards, a journey map to draw, games that need no paper, a number plate hunt, a maze, a travel diary and a Super Traveller award. Clip it to a board and set off!',
        'card': 'Car bingo, a journey map, games and a travel diary.',
        'form': field('Traveller\'s name', '<input type="text" name="name" maxlength="20" placeholder="Sam" autocomplete="off">') + field('Going to (optional)', '<input type="text" name="dest" maxlength="22" placeholder="the seaside" autocomplete="off">') + PAPER + SHUFFLE,
        'article': '<h2>The premium version of our travel sheets</h2><p>Print it the night before, clip it to a clipboard with a pencil on a string, and hand it over when the questions start. Press Make a new set for different bingo cards.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'halloweenclass', 'cat': 'packs', 'slug': 'class-halloween-party-kit', 'tint': '#fff6ec', 'icon': '🎃', 'new': True, 'plus': True, 'teacher': True,
        'nav': 'Class Halloween Party Kit',
        'title': 'Class Halloween Party Kit for Teachers | Pumpkin Name Tags, Bingo, Treat Bag Toppers, Costume Awards | PrintPals Teacher',
        'desc': 'A friendly Halloween party for your whole class: named pumpkin name tags, a party letter for families, four Halloween bingo cards, named treat bag toppers, a colouring page and a costume award for every child.',
        'h1': 'Class Halloween Party Kit',
        'lead': 'A friendly, not frightening Halloween party in one click. Named pumpkin name tags, a letter home, four bingo cards, named treat bag toppers and a costume parade award for every child, from Most Creative Costume to Friendliest Monster.',
        'card': 'Pumpkin name tags, bingo, treat bag toppers and costume awards.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + PAPER + SHUFFLE,
        'article': '<h2>Party ready in minutes</h2><p>Send the letter home a week before. On the day, stick on the name tags, play bingo with sweets as counters, and hand out a costume award to every child in the parade.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'bookweek', 'cat': 'packs', 'slug': 'class-book-week-kit', 'tint': '#eef2ff', 'icon': '📚', 'new': True, 'plus': True, 'teacher': True,
        'nav': 'Class Book Week Kit',
        'title': 'World Book Day and Book Week Kit for Teachers | Named Bookmarks, Favourite Book Pages, Awards | PrintPals Teacher',
        'desc': 'Everything for Book Week or World Book Day: a letter home, a My favourite book page and a named bookmark for every child, a class reading challenge, a class book quiz and a Book Week Star award for every child.',
        'h1': 'Class Book Week Kit',
        'lead': 'Celebrate stories as a whole class. A letter home about costume day, a favourite book page and a named bookmark for every child, a class reading challenge chart, a guess the story quiz and a Book Week Star award for everyone.',
        'card': 'Named bookmarks, favourite book pages, a quiz and awards.',
        'form': field('Class name', '<input type="text" name="cls" maxlength="24" placeholder="Class 1" autocomplete="off">') + field('Your name (optional)', '<input type="text" name="teacher" maxlength="30" placeholder="Miss Taylor" autocomplete="off">') + field('Class list', '<textarea name="names" rows="6" spellcheck="false" placeholder="Mia&#10;Leo&#10;Emma&#10;Sam&#10;Chris"></textarea>', 'One name per line, up to 40 children.') + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Simple costumes, big smiles</h2><p>The letter home encourages simple costumes, so no family feels pressure to buy. The bookmarks and favourite book pages make a lovely class display.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'This is part of the teacher plan: $59 a year for your whole class, with every class pack included. Try it free for 7 days, no card needed.')],
    },
    {
        'id': 'pocketmoney', 'cat': 'packs', 'slug': 'pocket-money-chart-for-kids', 'tint': '#fff6e0', 'icon': '💰', 'new': True, 'plus': True,
        'nav': 'Pocket Money Month',
        'title': 'Pocket Money Chart for Kids | Jobs That Pay, Spend, Save and Share Jars, Savings Goal Tracker | PrintPals Plus',
        'desc': 'A personalised pocket money month: four weekly job charts with pay per job in your currency, spend, save and share jars, a savings goal thermometer, money worksheets, talking points about money and a Money Wizard award.',
        'h1': 'Pocket Money Month',
        'lead': 'Teach children the value of money, gently. Four weeks of job charts that show what each job earns, spend, save and share jars to colour, a savings thermometer for the thing they really want, money practice and a Money Wizard award.',
        'card': 'Job charts that pay, spend, save and share jars, and a savings goal.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Leo" autocomplete="off">') + field('Saving up for (optional)', '<input type="text" name="goal" maxlength="30" placeholder="a new football" autocomplete="off">') + field('Money', seg('currency', [('GBP', '£ Pounds'), ('USD', '$ Dollars'), ('EUR', '€ Euros'), ('NGN', '₦ Naira'), ('CAD', 'C$ Canada'), ('AUD', 'A$ Australia')], 'GBP')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER + SHUFFLE,
        'article': '<h2>Money habits for life</h2><p>Children who earn, save and share early grow up confident with money. Agree the pay together, pay out every Sunday and let them colour the jars. Change the prices with Make a new set.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
    {
        'id': 'petdiary', 'cat': 'packs', 'slug': 'my-pet-diary-for-kids', 'tint': '#f1f8e6', 'icon': '🐶', 'new': True, 'plus': True,
        'nav': 'My Pet Diary',
        'title': 'My Pet Diary for Kids | Pet Profile, Pet Care Chart, Vet Log, Pet Owner Promise | PrintPals Plus',
        'desc': 'A personalised pet diary for children with a real pet: a pet profile with a photo frame, four weeks of pet care charts, a vet and health log, a day in the life page, if my pet could talk, a pet owner promise and a Best Pet Carer award.',
        'h1': 'My Pet Diary',
        'lead': "For children who love their pet. Type your pet's name and choose the animal: a pet profile with a photo frame, care charts for feeding, water, walks and cuddles, a vet log, if my pet could talk and a Best Pet Carer award.",
        'card': 'A pet profile, care charts, vet log and a Best Pet Carer award.',
        'form': field('Child\'s name', '<input type="text" name="name" maxlength="20" placeholder="Emma" autocomplete="off">') + field('Pet\'s name', '<input type="text" name="pet" maxlength="18" placeholder="Biscuit" autocomplete="off">') + field('Pet', seg('kind', [('dog', '🐶 Dog'), ('cat', '🐱 Cat'), ('rabbit', '🐰 Rabbit'), ('hamster', '🐹 Hamster'), ('fish', '🐟 Fish'), ('bird', '🦜 Bird'), ('other', '🐾 Other')], 'dog')) + field('Design', seg('look', [('meadow', '🌼 Meadow'), ('ocean', '🐳 Ocean'), ('candy', '🍭 Candy'), ('space', '🚀 Space')], 'meadow')) + PAPER,
        'article': '<h2>Responsibility they are proud of</h2><p>Caring for a pet teaches routine, kindness and responsibility. Keep the care chart by the food bowl and fill in the vet log together after each visit.</p>',
        'faq': [('Is this part of PrintPals Plus?', 'Yes. Try it free for 7 days, no card needed. After that, Plus is $4.99 a month or $39 a year.')],
    },
]

# The homepage sections, in learning order (easiest first). Every tool appears in exactly one section.
ARRANGE = [
    ('packs', 'Ready-made packs', 'Packs', 'Stop searching. A week, a month or the whole holiday planned for your child, storybooks and activity books, starting school, quick packs, family far away, a learning passport and class packs.',
     ['pack', 'tinyhands', 'handmonth', 'phonicsmonth', 'mathsday', 'timesclub', 'timemonth', 'readmonth', 'readadventure', 'spellmonth', 'sciencemonth', 'calmmonth', 'colourmonth', 'puzzlemonth', 'writemonth', 'familymonth', 'christmas', 'halloween', 'namebook', 'timecapsule', 'diwali', 'thankful', 'journal', 'easter', 'levels', 'poppy', 'handwritingbook', 'phonicsbook', 'readers', 'mathsbook', 'autumnkit', 'winter', 'lunar', 'kindness', 'grownupbook', 'dinokit', 'spacekit', 'oceankit', 'safari', 'farm', 'shopkit', 'pocketmoney', 'vetkit', 'petdiary', 'roadtrip', 'detective', 'garden', 'superhero', 'feelingsbook', 'flying', 'adventure', 'familynight', 'cookbook', 'toothfairy', 'bigsibling', 'treasure', 'busters', 'monthplan', 'holidayplan', 'activitybook', 'storybook', 'schoolready', 'quickpack', 'faraway', 'passport', 'classpack', 'halloweenclass', 'bookweek', 'classrewards', 'classbirthday', 'xmascards', 'classadvent', 'xmasshow', 'classcalendar', 'classwelcome', 'readingrecords', 'phonicscheck', 'parentsevening', 'reporthelper', 'movingup', 'classspecial', 'morningwork', 'homeworkmonth', 'classawards', 'coverkit', 'classseason', 'yearbook', 'displays']),
    ('handwriting', 'Handwriting', 'Handwriting', 'From first pencil lines to joined writing, with real letter shapes and stroke order.',
     ['prewriting', 'scissors', 'names', 'letters', 'mixups', 'joined', 'writingpaper', 'alphabets']),
    ('reading', 'Reading & phonics', 'Reading', 'Letter sounds, CVC words, syllables, sight words, sentences, spelling and stories where your child is the hero.',
     ['abcorder', 'cvc', 'sounds', 'families', 'rhyming', 'syllables', 'sight', 'colourwords', 'spelling', 'flashcards', 'homelang', 'opposites', 'position', 'sentences', 'sequencing', 'comprehension', 'story', 'storywriting', 'storydice', 'letterkit', 'diary']),
    ('maths', 'Maths', 'Maths', 'Counting, patterns, number bonds, doubles, dominoes, sums, money, times tables, time, fractions and shapes, with answer keys.',
     ['numbers', 'tenframes', 'patterns', 'numberday', 'hundred', 'compare', 'bonds', 'doubles', 'dominoes', 'maths', 'mathsminute', 'numberlines', 'wordproblems', 'placevalue', 'money', 'savings', 'times', 'clocks', 'clockcraft', 'fractions', 'shapes', 'measuring', 'graphs']),
    ('puzzles', 'Puzzles & games', 'Puzzles', 'Mazes, dot to dot, odd one out, spot the difference, word searches, crosswords, secret codes, sudoku, bingo and board games.',
     ['mazes', 'dots', 'matching', 'oddone', 'spotdiff', 'wordsearch', 'crossword', 'secretcode', 'coding', 'sudoku', 'bingo', 'snakes', 'papergames', 'travel']),
    ('crafts', 'Colouring, crafts & parties', 'Colouring & crafts', 'Colouring pages, photo colouring, grid drawing, how to draw, puppets, crowns, bookmarks, door hangers, cards, keepsakes and party packs.',
     ['colouring', 'photo', 'colournum', 'gridcopy', 'howtodraw', 'rolldraw', 'cutpaste', 'crafts', 'puppets', 'bookmarks', 'doorhangers', 'cards', 'coupons', 'handprints', 'party', 'invites']),
    ('charts', 'Charts & planners', 'Charts', 'Routines, chores, reward charts, 30 day challenges, certificates, reading logs, planners, calendars, height charts and labels.',
     ['routine', 'chores', 'reward', 'potty', 'teeth', 'sleep', 'screentime', 'challenge', 'packing', 'mealplan', 'petcare', 'gratitude', 'certificate', 'signs', 'readinglog', 'homework', 'calendar', 'countdown', 'heightchart', 'labels', 'sitter']),
    ('world', 'Me & my world', 'My world', 'Family, siblings, big feelings, new experiences, food, conversations, my body, days and months, weather, life cycles and scavenger hunts.',
     ['family', 'familyrules', 'siblings', 'lunchnotes', 'talkcards', 'mybody', 'habits', 'calmkit', 'socialstory', 'foods', 'feelings', 'daysmonths', 'weather', 'lifecycle', 'science', 'factfile', 'hunt']),
]
# Ages each tool suits (first year, last year).
AGES = {
    'halloweenclass': (3, 11), 'bookweek': (3, 11), 'pocketmoney': (4, 11), 'petdiary': (4, 11),
    'autumnkit': (3, 9), 'shopkit': (3, 8), 'vetkit': (3, 8), 'roadtrip': (4, 10),
    'classbirthday': (3, 11), 'classrewards': (3, 11), 'movingup': (3, 11), 'classspecial': (3, 11),
    'xmascards': (3, 11), 'classcalendar': (3, 11), 'xmasshow': (3, 9), 'classadvent': (3, 11),
    'readingrecords': (4, 9), 'phonicscheck': (4, 7), 'parentsevening': (3, 11), 'reporthelper': (3, 11),
    'classwelcome': (4, 9), 'classawards': (4, 11), 'homeworkmonth': (5, 8), 'coverkit': (5, 9),
    'sciencemonth': (4, 10), 'spellmonth': (5, 9), 'calmmonth': (3, 10), 'readadventure': (4, 10),
    'timesclub': (6, 10), 'timemonth': (5, 8), 'phonicsmonth': (3, 6), 'tinyhands': (2, 3),
    'colourmonth': (3, 10), 'puzzlemonth': (4, 10), 'writemonth': (5, 9), 'morningwork': (4, 7),
    'handmonth': (3, 7), 'mathsday': (3, 8), 'readmonth': (4, 6), 'familymonth': (2, 10),
    'safari': (3, 9), 'detective': (5, 11), 'grownupbook': (3, 10), 'farm': (2, 6),
    'oceankit': (3, 9), 'garden': (3, 9), 'kindness': (3, 10), 'lunar': (3, 10),
    'readers': (4, 6), 'dinokit': (3, 9), 'spacekit': (4, 10), 'winter': (3, 9),
    'handwritingbook': (3, 7), 'superhero': (3, 9), 'flying': (3, 10), 'feelingsbook': (3, 9),
    'mathsbook': (3, 8), 'adventure': (3, 10), 'familynight': (3, 12), 'cookbook': (3, 10),
    'toothfairy': (4, 10), 'bigsibling': (2, 8), 'treasure': (3, 10), 'phonicsbook': (3, 6), 'busters': (3, 10),
    'levels': (3, 8), 'poppy': (3, 9), 'classseason': (3, 9), 'yearbook': (4, 11), 'displays': (3, 11),
    'easter': (3, 9), 'journal': (4, 10),
    'timecapsule': (1, 12), 'diwali': (3, 9), 'thankful': (3, 9),
    'halloween': (3, 9), 'christmas': (3, 9), 'namebook': (3, 7),
    'papergames': (4, 12), 'scissors': (2, 6), 'tenframes': (4, 7), 'sequencing': (3, 7), 'coding': (4, 10), 'factfile': (5, 11), 'petcare': (3, 12), 'diary': (4, 11),
    'comprehension': (5, 9), 'mathsminute': (5, 10), 'savings': (4, 12), 'coupons': (3, 12), 'packing': (3, 10), 'mealplan': (3, 12), 'habits': (2, 7),
    'invites': (3, 12), 'countdown': (3, 10), 'teeth': (2, 8), 'familyrules': (3, 12), 'sitter': (1, 10), 'science': (4, 10), 'letterkit': (5, 11),
    'pack': (3, 8), 'quickpack': (3, 8), 'faraway': (3, 10), 'monthplan': (3, 8), 'activitybook': (3, 9), 'passport': (3, 8), 'classpack': (3, 8),
    'homelang': (2, 8), 'schoolready': (3, 6), 'holidayplan': (3, 8), 'signs': (3, 11), 'storydice': (4, 9), 'siblings': (3, 10), 'screentime': (4, 12), 'lunchnotes': (3, 10),
    'calmkit': (3, 10), 'sleep': (2, 7), 'foods': (2, 8), 'socialstory': (2, 8), 'storybook': (2, 8), 'talkcards': (3, 12), 'gratitude': (4, 12), 'potty': (1, 4),
    'prewriting': (2, 4), 'names': (3, 6), 'letters': (3, 6), 'mixups': (5, 7), 'joined': (6, 9), 'writingpaper': (4, 9), 'alphabets': (4, 9),
    'abcorder': (4, 6), 'cvc': (4, 6), 'sounds': (5, 7), 'families': (5, 7), 'rhyming': (4, 6), 'syllables': (4, 7), 'sight': (4, 7), 'colourwords': (3, 5),
    'spelling': (5, 9), 'flashcards': (2, 7), 'opposites': (3, 6), 'position': (3, 6), 'sentences': (5, 8), 'story': (4, 8), 'storywriting': (5, 9),
    'numbers': (3, 5), 'patterns': (3, 6), 'numberday': (5, 8), 'hundred': (5, 8), 'compare': (4, 7), 'bonds': (4, 7), 'doubles': (4, 7), 'dominoes': (4, 7),
    'maths': (4, 8), 'numberlines': (5, 8), 'wordproblems': (5, 9), 'placevalue': (6, 9), 'money': (5, 9), 'times': (6, 10), 'clocks': (5, 8), 'clockcraft': (4, 8),
    'fractions': (5, 8), 'shapes': (3, 6), 'measuring': (5, 8), 'graphs': (5, 8),
    'mazes': (3, 9), 'dots': (3, 8), 'matching': (2, 5), 'oddone': (3, 7), 'spotdiff': (3, 8), 'wordsearch': (5, 10), 'crossword': (6, 10), 'secretcode': (4, 9),
    'sudoku': (4, 9), 'bingo': (3, 8), 'snakes': (4, 10), 'travel': (4, 10),
    'colouring': (2, 8), 'photo': (2, 10), 'colournum': (4, 8), 'gridcopy': (4, 9), 'howtodraw': (3, 9), 'rolldraw': (4, 9), 'cutpaste': (3, 6), 'crafts': (3, 8),
    'puppets': (3, 8), 'bookmarks': (4, 10), 'doorhangers': (3, 10), 'cards': (3, 10), 'handprints': (1, 6), 'party': (3, 10),
    'routine': (2, 8), 'chores': (3, 10), 'reward': (2, 8), 'challenge': (4, 10), 'certificate': (3, 11), 'readinglog': (4, 10), 'homework': (6, 11),
    'calendar': (4, 10), 'heightchart': (1, 10), 'labels': (3, 10),
    'family': (4, 8), 'mybody': (3, 6), 'feelings': (2, 8), 'daysmonths': (4, 7), 'weather': (3, 7), 'lifecycle': (4, 8), 'hunt': (3, 8),
}
# The option that sets how hard a sheet is, ordered easiest first (drives the Easier and Harder buttons).
LEVELS = {
    'shopkit': 'level',
    'spellmonth': 'level',
    'timesclub': 'level', 'timemonth': 'level',
    'puzzlemonth': 'level', 'writemonth': 'level', 'morningwork': 'level',
    'handmonth': 'level', 'mathsday': 'level', 'readmonth': 'set',
    'readers': 'book',
    'handwritingbook': 'book',
    'mathsbook': 'book',
    'phonicsbook': 'book',
    'levels': 'level',
    'scissors': 'level', 'tenframes': 'kind', 'coding': 'level',
    'comprehension': 'level', 'mathsminute': 'kind',
    'patterns': 'level', 'hundred': 'level', 'bonds': 'to', 'maths': 'within', 'numberlines': 'range', 'wordproblems': 'within', 'placevalue': 'range',
    'money': 'level', 'clocks': 'level', 'fractions': 'level', 'mazes': 'level', 'dots': 'dots', 'matching': 'pairs', 'oddone': 'level', 'spotdiff': 'level',
    'wordsearch': 'level', 'sudoku': 'level', 'doubles': 'max', 'colournum': 'mode', 'compare': 'kind', 'secretcode': 'code', 'sentences': 'kind',
    'abcorder': 'kind', 'pack': 'age', 'quickpack': 'age', 'monthplan': 'age', 'activitybook': 'age', 'holidayplan': 'age',
}


def ages_text(i):
    a, b = AGES[i]
    return f'Ages {a} to {b}' if a > 1 else f'Up to age {b}'


_by_id = {t['id']: t for t in TOOLS}
_listed = [i for a in ARRANGE for i in a[4]]
assert sorted(_by_id) == sorted(_listed) and len(_listed) == len(set(_listed)), 'every tool must be in exactly one section'
TOOLS = [_by_id[i] for i in _listed]
for a in ARRANGE:
    for i in a[4]:
        _by_id[i]['cat'] = a[0]
CATS = [(a[0], a[1]) for a in ARRANGE]
assert all(t['id'] in AGES for t in TOOLS), [t['id'] for t in TOOLS if t['id'] not in AGES]
CAT_TEXT = {a[0]: a[3] for a in ARRANGE}
NAV_LABEL = {a[0]: a[2] for a in ARRANGE}


JS_FILES = ['glyphs', 'sheet', 'tools', 'tools2', 'tools3', 'tools4', 'cursive', 'tools5', 'colouring', 'tools6', 'tools7', 'tools8', 'tools9', 'tools10', 'tools11', 'pack', 'tools12', 'tools13', 'tools14', 'tools15', 'tools16', 'tools17', 'tools18', 'tools19', 'tools20', 'tools21', 'tools22', 'tools23', 'tools24', 'tools25', 'tools26', 'tools27', 'tools28', 'tools29', 'tools30', 'tools31', 'tools32', 'tools33', 'tools34', 'tools35', 'tools36', 'tools37', 'plus', 'app']
CONTACT = 'graceandloannesofficial@gmail.com'
# Stripe customer portal: parents manage, switch or cancel their Plus subscription here.
# The owner's Pinterest Tag ID (Pinterest Ads > Conversions > Pinterest Tag). Empty = no tag, no cookie banner.
PINTEREST_TAG = ''
STRIPE_PORTAL = 'https://billing.stripe.com/p/login/14A00igGPbu309ygcW1kA00'


# Pinterest: paste the code from Pinterest's "claim your website" step here to verify the site.
PINTEREST_VERIFY = '4b35c96ffec994d3679c8024245b5217'


def pin_btn(t):
    if not os.path.exists(os.path.join(OUT, 'pins', t['id'] + '.jpg')):
        return ''
    q = urllib.parse.urlencode({'url': f"{SITE}/{t['slug']}", 'media': f"{SITE}/pins/{t['id']}.jpg", 'description': t['h1'] + ': ' + t['card']})
    return f'<a class="tag pin" href="https://www.pinterest.com/pin/create/button/?{html.escape(q)}" target="_blank" rel="noopener">📌 Save to Pinterest</a>'


def head(title, desc, path, extra='', image='/img/og.png'):
    url = SITE + path
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">{f'<meta name="p:domain_verify" content="{PINTEREST_VERIFY}">' if PINTEREST_VERIFY else ''}
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en-GB" href="{url}">
<link rel="alternate" hreflang="en-US" href="{SITE}/us{'' if path == '/' else path}">
<link rel="alternate" hreflang="x-default" href="{url}">
<script>(function(){{try{{var L=localStorage.getItem('pp-lang'),p=location.pathname,us=p==='/us'||p.indexOf('/us/')===0,t=location.search+location.hash;if(L==='us'&&!us)location.replace('/us'+(p==='/'?'':p)+t);else if(L==='uk'&&us)location.replace((p.slice(3)||'/')+t)}}catch(e){{}}}})()</script>
<meta property="og:type" content="website">
<meta property="og:site_name" content="PrintPals">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}{image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ff6b6b">
<link rel="icon" href="/img/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/icon-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/fonts/baloo2.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v={VERSION}">
{extra}
</head>'''


def top(active=''):
    act = next((t['cat'] for t in TOOLS if t['id'] == active), '')
    cur = ' aria-current="page"'
    nav = ''.join(f'<a href="/#{k}"{cur if k == act else ""}>{NAV_LABEL[k]}</a>' for k, v in CATS)
    return f'''<a class="skip" href="#main">Skip to content</a><header class="top"><div class="wrap"><a class="brand" href="/">{LOGO}<span>Print<b>Pals</b></span></a><nav class="nav" aria-label="Sections">{nav}</nav></div></header>'''


FOOT = '''<footer><div class="wrap"><div class="foot-brand"><div class="brand" style="font-size:24px;color:#fff;gap:0">Print<b style="color:#ff8a8a">Pals</b></div>
<p style="max-width:420px;margin-top:8px">Free printable worksheets and ready-made packs for children, made in seconds. Everything is made inside your own browser: nothing you type is sent to us or stored.</p>
<p class="foot-links"><a href="/plus">PrintPals Plus</a><a href="/my-shelf">My shelf</a><a href="/help">Help</a><a href="/refunds">Refunds and delivery</a><a href="/about">About us</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>''' + ('<a href="#" data-action="cookies">Cookie choices</a>' if PINTEREST_TAG else '') + '''<a href="mailto:''' + CONTACT + '''">Contact</a></p>
<p style="margin-top:14px">© PrintPals, by Grace and Loannes Ltd. For home and classroom use.</p></div>
<div class="foot-cols">''' + ''.join(f'<div><h4>{v}</h4>' + ''.join(f'<a href="/{t["slug"]}">{t["nav"]}</a>' for t in [x for x in TOOLS if x['cat'] == k][:6]) + f'<a class="foot-all" href="/#{k}">See all {sum(1 for x in TOOLS if x["cat"] == k)} →</a></div>' for k, v in CATS) + '''</div></div></footer>'''

SCRIPTS = f'<script src="/js/pp.js?v={VERSION}"></script>'


def og_for(t):
    return f'/img/og/{t["id"]}.jpg' if os.path.exists(os.path.join(OUT, 'img', 'og', t['id'] + '.jpg')) else '/img/og.png'


# Free tools and the Plus edition that grows each one into a whole month.
EDITIONS = {
    'handmonth': (['names', 'letters', 'writingpaper', 'alphabets'], 'Handwriting Month', '20 daily pages with a warm-up, a letter a day, their name every day, Friday badges and a certificate.'),
    'mathsday': (['maths', 'numbers', 'bonds', 'doubles', 'tenframes', 'numberlines', 'wordproblems', 'mathsminute'], 'Maths a Day', '4 weeks of ten-minute maths that grows day by day, story problems with their name, Friday checks and answers.'),
    'readmonth': (['sight', 'cvc', 'flashcards', 'sentences'], 'Reading Month', 'a new sight word every day, a story starring your child every Friday, a word wall and a certificate.'),
    'colourmonth': (['colouring', 'photo', 'colournum', 'howtodraw', 'rolldraw'], 'Colouring Month', '40 busy scene colouring pages in 8 worlds, with a fun challenge on every page and a certificate.'),
    'puzzlemonth': (['mazes', 'dots', 'wordsearch', 'sudoku', 'spotdiff', 'oddone', 'crossword', 'secretcode', 'coding', 'matching'], 'Puzzle Month', 'a new puzzle every day for 4 weeks, a puzzle passport, answers and a Puzzle Master award.'),
    'writemonth': (['storywriting', 'story', 'storydice', 'diary'], 'Writing Month', '16 story prompts with word banks and sentence starters, a best story every Friday and an author certificate.'),
    'timesclub': (['times'], 'Times Tables Club', 'a membership card, a new table each week, Friday speed tests, badges and a champion certificate.'),
    'timemonth': (['clocks', 'clockcraft'], 'Time Month', '4 weeks from o\'clock to five minutes: read the clocks, draw the hands, my day, Friday checks and answers.'),
    'petdiary': (['petcare'], 'My Pet Diary', 'a pet profile, four weeks of care charts, a vet log and a Best Pet Carer award.'),
    'pocketmoney': (['savings', 'chores'], 'Pocket Money Month', 'job charts that pay, spend, save and share jars, and a savings goal tracker in your currency.'),
    'shopkit': (['money'], 'Little Shop kit', 'a pretend shop with price tags, play money in your currency, shopping lists, receipts and shop sums.'),
    'roadtrip': (['travel'], 'Road Trip Adventure Book', 'two car bingo cards, a journey map, car games, a travel diary and a Super Traveller award.'),
    'phonicsmonth': (['sounds', 'abcorder'], 'Phonics Month', '16 letter sounds in 4 weeks with picture hunts, tracing and blending real words every Friday.'),
    'tinyhands': (['prewriting', 'scissors', 'matching'], 'Tiny Hands Month', 'a month of tracing paths, dot stickers, first snipping, find the same and busy colouring for ages 2 to 3.'),
    'sciencemonth': (['science', 'lifecycle', 'weather'], 'Science Month', '16 easy kitchen experiments with predict and observe pages, Friday reports and a Young Scientist award.'),
    'spellmonth': (['spelling'], 'Spelling Month', '4 weeks of spellings (or your school words) with a different activity every day and a Friday test.'),
    'calmmonth': (['feelings', 'calmkit', 'gratitude'], 'Calm and Happy Month', 'a daily feelings check-in, breathing games, calm activities and a thank you, with Friday reflections.'),
    'readadventure': (['readinglog', 'comprehension'], 'Reading Adventure Month', 'a reading treasure map, a mini book task every day, bookmarks and Friday book reviews.'),
    'familymonth': (['routine', 'reward', 'sleep', 'screentime', 'calendar'], 'Family Month Organiser', 'routines, chores, star charts and a calendar for up to three children, all matching, for the whole month.'),
}
EDITION_OF = {f: e for e, (fs, _, _) in EDITIONS.items() for f in fs}


def plus_price(t):
    """What a paid pack costs (one plan unlocks every pack), or None for free tools."""
    if not t.get('plus'):
        return None
    return '59.00' if (t.get('teacher') or t['id'] == 'classpack') else '4.99'


def tool_page(t):
    price = plus_price(t)
    faq_html = ''.join(f'<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in t['faq'])
    cat_name = dict(CATS)[t['cat']]
    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'WebApplication', 'name': t['h1'] + ' | PrintPals', 'url': f'{SITE}/{t["slug"]}', 'applicationCategory': 'EducationalApplication',
             'operatingSystem': 'Any', 'offers': {'@type': 'Offer', 'price': price or '0', 'priceCurrency': 'USD'}, 'description': t['desc'],
             'audience': {'@type': 'EducationalAudience', 'educationalRole': 'parent'}, 'typicalAgeRange': '{}-{}'.format(*AGES[t['id']])},
            {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'PrintPals', 'item': SITE + '/'},
                {'@type': 'ListItem', 'position': 2, 'name': cat_name, 'item': f'{SITE}/#{t["cat"]}'},
                {'@type': 'ListItem', 'position': 3, 'name': t['h1'], 'item': f'{SITE}/{t["slug"]}'}]},
            *([{'@type': 'Product', 'name': t['h1'], 'sku': t['id'], 'image': f"{SITE}/pins/{t['id']}.jpg", 'description': t['desc'], 'brand': {'@type': 'Brand', 'name': 'PrintPals'},
                'offers': {'@type': 'Offer', 'price': price, 'priceCurrency': 'USD', 'availability': 'https://schema.org/InStock', 'url': f'{SITE}/{t["slug"]}'}}] if price else []),
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in t['faq']]},
        ],
    }
    others = ''.join(f'<a href="/{o["slug"]}">{o["icon"]} {o["h1"]}</a>' for o in TOOLS if o['cat'] == t['cat'] and o is not t)
    level = LEVELS.get(t['id'])
    level_attr = f' data-level="{level}"' if level else ''
    level_btns = ('<div class="levels-wrap"><span class="label">Not quite right?</span><div class="levels"><button type="button" class="btn alt small" data-action="easier">🐢 Easier</button>'
                  '<button type="button" class="btn alt small" data-action="harder">🚀 Harder</button></div></div>') if level else ''
    ed = EDITION_OF.get(t['id'])
    edition = ''
    if ed:
        et = next(x for x in TOOLS if x['id'] == ed)
        edition = f'<a class="plus-edition" href="/{et["slug"]}"><span class="pe-ico">{et["icon"]}</span><span><b>Want a whole month of this?</b> {html.escape(EDITIONS[ed][1])}, the Plus edition: {html.escape(EDITIONS[ed][2])}</span><em>Try 7 days free →</em></a>'
    nudge = '' if t['cat'] == 'packs' else '<a class="pack-nudge" href="/weekly-learning-pack"><span>🎒</span><span><b>Not sure what to print?</b> Get a whole week planned for your child, free, with their name on every page.</span></a>'
    product_meta = (f'<meta property="product:price:amount" content="{price}">\n<meta property="product:price:currency" content="USD">\n<meta property="og:price:amount" content="{price}">\n<meta property="og:price:currency" content="USD">\n<meta property="product:availability" content="in stock">\n<meta property="product:brand" content="PrintPals">\n' if price else '')
    page_head = head(t['title'], t['desc'], '/' + t['slug'], product_meta + f'<style id="pageStyle">@page {{ size: A4 portrait; margin: 0; }}</style>\n<script type="application/ld+json">{json.dumps(ld)}</script>', og_for(t))
    if price:
        page_head = page_head.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="product">')
    return page_head + f'''
<body class="tool-page">
{top(t['id'])}
<main id="main">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">PrintPals</a> › <a href="/#{t['cat']}">{html.escape(cat_name)}</a> › {html.escape(t['h1'])}</nav>
<div class="tool-head"><h1>{html.escape(t['h1'])}</h1><p>{html.escape(t['lead'])}</p><div class="tags">{(f'<a class="tag plus" href="/plus">🍎 Teacher plan: $59 a year, 7 days free</a>' if price == '59.00' else '<a class="tag plus" href="/plus">✨ PrintPals Plus: $4.99 a month or $39 a year, 7 days free</a>') if price else ''}<span class="tag">👧 {ages_text(t['id'])}</span><span class="tag">{'✓ 7 days free, no card' if t.get('plus') else '✓ Free, no sign up'}</span><span class="tag">✓ A4 and US Letter</span>{pin_btn(t)}</div><a class="jump" href="#preview">See your worksheet ↓</a></div>
<div class="maker">
<form class="panel" id="maker" data-tool="{t['id']}"{level_attr}{(' data-plus="teacher"' if t['id'] == 'classpack' or t.get('teacher') else ' data-plus="plus"') if t.get('plus') else ''} autocomplete="off">
{level_btns}
{t['form']}
{check('inksaver', '🖨️ Ink saver: less colour, great for black and white printers', False)}
{check('easyread', '🔤 Easy-read letters: the a and g children learn to write', False)}
<button type="button" class="btn" data-action="print">{PRINT_ICON} Print or save as PDF</button>
<p class="hint">Free. No sign up. Nothing you type leaves your device.</p>
<p class="hint" id="remember" hidden>💛 We remember your child's name on this device only. <button type="button" class="linkish" data-action="forget">Forget it</button></p>
</form>
<section aria-label="Worksheet preview">{edition}<div id="plusbox" class="plusbox" hidden></div><div class="preview-head"><span>Preview</span><span id="pageCount"></span></div><div id="preview"></div></section>
</div>
<article class="article">
{nudge}
{t['article']}
<h2>Questions parents and teachers ask</h2>
{faq_html}
<h2>More in {html.escape(cat_name)}</h2>
<div class="more">{others}</div>
<p><a class="all-link" href="/#{t['cat']}">See all {len(TOOLS)} free worksheet makers →</a></p>
</article>
</div>
</main>
<div class="mobile-print no-print"><button type="button" class="btn" data-action="print">{PRINT_ICON} Print or save as PDF</button></div>
{FOOT}
{SCRIPTS}
</body>
</html>
'''


ONLY = [
    ('🎒', 'A whole week, planned for you', "Tell us your child's name, age and favourite theme. Get a balanced week of reading, maths and fun, a star chart, a certificate and a guide for you.", '/weekly-learning-pack', "Plan my child's week"),
    ('👧👦', 'Siblings, together', 'Two or three children of different ages? Same theme, each at their own level, so they can sit and learn side by side.', '/weekly-learning-pack', 'Make a sibling pack'),
    ('💌', 'Family far away', 'Postcards to send, video call bingo and a countdown to the next visit, for grandparents and loved ones in other places.', '/family-far-away-activities', 'Make a family pack'),
    ('⚡', 'Twenty quiet minutes, now', "Ready packs for restaurants, rainy days, sick days and calm before bed. Screen-free, at your child's level.", '/quick-activity-packs', 'Get a quick pack'),
    ('🖨️', 'Kind to your ink', 'Only have a black and white printer, or printing at a shop? Tick Ink saver on any sheet for white backgrounds and grey pictures.', '/colouring-pages', 'Try it on any sheet'),
    ('🐢', 'Easier or harder, in one tap', "Not quite right? Sheets have Easier and Harder buttons, and remember your child's name on your device only.", '/addition-subtraction-worksheets', 'See how it works'),
]


SHOW_FAMILY = ['handmonth', 'mathsday', 'readmonth', 'colourmonth', 'autumnkit', 'shopkit', 'timesclub', 'vetkit']
SHOW_TEACHER = ['halloweenclass', 'xmascards', 'xmasshow', 'classawards', 'readingrecords', 'classrewards', 'parentsevening', 'reporthelper']


def home():
    def card(t, i=0):
        a, b = AGES[t['id']]
        extra = ' more' if i >= 6 else ' m-more' if i >= 4 else ''
        keys = html.escape(re.sub(r'<[^>]+>|&[a-z#0-9]+;', ' ', t['title'] + ' ' + t['desc'] + ' ' + t['form']).lower())
        return f'''<a class="tool{extra}" href="/{t['slug']}" style="--tint:{t['tint']}" data-min="{a}" data-max="{b}" data-keys="{keys}"><div class="thumb"><img src="/img/thumb-{t['id']}.webp" alt="{html.escape(t['h1'])} example" loading="lazy" width="400" height="566"></div>
<h3>{t['icon']} {html.escape(t['h1'])}{'<span class="new plus">Plus</span>' if t.get('plus') else '<span class="new">New</span>' if t.get('new') else ''}</h3><p>{html.escape(t['card'])}</p><span class="age-mini">{ages_text(t['id'])}</span><span class="go">{'Try 7 days free →' if t.get('plus') else 'Make one free →'}</span></a>'''
    def section(k, v):
        ts = [t for t in TOOLS if t['cat'] == k]
        more = f'<div class="more-row"><button type="button" class="more-btn" data-more="{len(ts)}">Show all <b>{len(ts)}</b> in {html.escape(NAV_LABEL[k])} ▾</button></div>' if len(ts) > 4 else ''
        return f'''<section class="cat{' cat-packs' if k == 'packs' else ''}" id="{k}"><h2>{v} <span class="count">{len(ts)}</span></h2><p class="cat-lead">{CAT_TEXT[k]}</p><div class="tools">{''.join(card(t, i) for i, t in enumerate(ts))}</div>{more}</section>'''
    sections = ''.join(section(k, v) for k, v in CATS)
    ld = {'@context': 'https://schema.org', '@graph': [
          {'@type': 'WebSite', 'name': 'PrintPals', 'url': SITE + '/',
           'description': 'Free printable worksheets and ready-made learning packs for children aged 2 to 10: a personalised week in one click, tracing, reading, maths, puzzles, crafts and charts.'},
          {'@type': 'Organization', 'name': 'PrintPals', 'legalName': 'Grace and Loannes Ltd', 'url': SITE + '/', 'logo': SITE + '/img/icon-512.png', 'email': CONTACT,
           'contactPoint': {'@type': 'ContactPoint', 'contactType': 'customer support', 'email': CONTACT}}]}
    shapes = ''.join(f'<span style="width:{s}px;height:{s}px;left:{x}%;top:{y}%;background:{c};animation-delay:{d}s"></span>'
                     for s, x, y, c, d in [(90, 6, 18, '#ffe08a', 0), (60, 88, 12, '#bfe8ff', 1.5), (46, 80, 70, '#ffc6d9', 3), (70, 12, 72, '#c9f2e6', 4.5)])
    only = ''.join(f'<a class="only-card" href="{u}"><span class="only-ico">{i}</span><b>{html.escape(h)}</b><span>{html.escape(d)}</span><em>{html.escape(c)} →</em></a>' for i, h, d, u, c in ONLY)
    pressed = ' aria-pressed="true"'
    ages = ''.join(f'<button type="button" data-age="{a}"{pressed if a == "all" else ""}>{lab}</button>' for a, lab in [('all', 'All ages'), ('3', 'Age 3'), ('4', 'Age 4'), ('5', 'Age 5'), ('6', 'Age 6'), ('7', 'Age 7'), ('8', 'Age 8+')])
    tmap = {t['id']: t for t in TOOLS}
    def show_card(t):
        return f'''<a class="show-card" href="/{t['slug']}" style="--tint:{t['tint']}"><div class="show-thumb"><img src="/img/thumb-{t['id']}.webp" alt="{html.escape(t['h1'])} example" loading="lazy" width="400" height="566"></div><div class="show-body"><h3>{t['icon']} {html.escape(t['h1'])}</h3><p>{html.escape(t['card'])}</p><span class="go">Try 7 days free →</span></div></a>'''
    fam = [tmap[i] for i in SHOW_FAMILY if i in tmap]
    tea = [tmap[i] for i in SHOW_TEACHER if i in tmap]
    n_plus = sum(1 for t in TOOLS if t.get('plus') and not t.get('teacher'))
    n_teach = sum(1 for t in TOOLS if t.get('teacher'))
    showcase = f'''<section class="plus-show" id="plus-show"><div class="wrap">
<div class="ps-head"><span class="ps-badge">✨ PrintPals Plus</span><h2>Premium learning, planned for you</h2><p>Whole months of learning, series to collect and class packs with every child's name. {n_plus} family packs and {n_teach} teacher packs, with new ones every month.</p></div>
<div class="ps-tabs" role="tablist"><button type="button" class="on" data-ps="fam">👨‍👩‍👧 For families <b>$4.99/month</b></button><button type="button" data-ps="tea">🍎 For teachers <b>$59/year</b></button></div>
<div class="ps-row" data-ps-row="fam">{''.join(show_card(t) for t in fam)}</div>
<div class="ps-row" data-ps-row="tea" hidden>{''.join(show_card(t) for t in tea)}</div>
<div class="ps-cta"><a class="btn big" href="/plus">Try Plus free for 7 days</a><span>No card needed. Cancel any time.</span></div>
</div></section>
<script>document.querySelectorAll('.ps-tabs button').forEach(function (b) {{ b.addEventListener('click', function () {{ document.querySelectorAll('.ps-tabs button').forEach(function (x) {{ x.classList.toggle('on', x === b); }}); document.querySelectorAll('.ps-row').forEach(function (r) {{ r.hidden = r.dataset.psRow !== b.dataset.ps; }}); }}); }});</script>'''
    jumps = ''.join(f'<a href="#{k}">{NAV_LABEL[k]} <b>{sum(1 for t in TOOLS if t["cat"] == k)}</b></a>' for k, v in CATS)
    return head('PrintPals | Free Printable Worksheets and Ready-Made Learning Packs for Kids',
                'Free printable worksheets for kids, and a whole personalised learning week in one click. Tracing, reading, maths, puzzles, crafts, charts, quick packs for busy moments and activities for family far away. No sign up.',
                '/', f'<script type="application/ld+json">{json.dumps(ld)}</script>', '/img/og/home.jpg') + f'''
<body>
{top()}
<main id="main">
<section class="hero"><div class="shapes" aria-hidden="true">{shapes}</div><div class="wrap" style="position:relative">
<h1>Stop searching.<br><span class="hl">Start learning.</span></h1>
<p class="lead">A whole week of learning planned for your child in one click, with their name on every page. Plus {sum(1 for t in TOOLS if t['cat'] != 'packs')} free worksheet makers for ages 2 to 10. No sign up, ever.</p>
<div class="cta"><a class="btn big" href="/weekly-learning-pack">🎒 Plan my child's week, free</a><a class="btn plusbtn big" href="#plus-show">✨ Explore PrintPals Plus</a></div>
<div class="chips"><span class="chip">✓ 120 free makers</span><span class="chip">✓ No sign up</span><span class="chip">✓ Private on your device</span><span class="chip">✓ A4 and US Letter</span><span class="chip">✓ UK or US English</span><span class="chip">✓ Ink saver</span></div>
</div></section>
{showcase}
<section class="only"><div class="wrap"><h2>What only PrintPals does</h2><p class="cat-lead">Other sites give you ten thousand worksheets and leave you to work it out. We built PrintPals around the real problems parents tell us about.</p><div class="only-grid">{only}</div></div></section>
<div class="wrap">
<div class="finder">
<div class="find"><input type="search" id="find" placeholder="Find a worksheet: try name, money or dinosaur" aria-label="Find a worksheet" autocomplete="off"></div>
<div class="ages" role="group" aria-label="Filter by age">{ages}</div>
<p class="age-note" id="ageNote" aria-live="polite"></p>
<div class="jumps">{jumps}</div>
</div>
{sections}<p class="none" id="none">Nothing found. Try another word, like letters, maths or colouring.</p></div>
<script>
(function () {{
  var box = document.getElementById('find'), age = 'all', wrap = box.closest('.wrap');
  function openCat(id) {{ var sec = document.getElementById(id); if (sec && sec.classList.contains('cat')) {{ sec.classList.add('open'); var b = sec.querySelector('.more-btn'); if (b) b.innerHTML = 'Show fewer ▴'; }} }}
  var ageName = function (a) {{ return a === '8' ? 'ages 8 and up' : 'age ' + a; }};
  // Remember each section's own order and "show more" layout, so All ages puts everything back.
  document.querySelectorAll('.cat').forEach(function (sec) {{
    sec.querySelectorAll('a.tool').forEach(function (a, i) {{ a.dataset.i = i; a.dataset.cls = a.className; }});
    var b = sec.querySelector('.more-btn'); if (b) b.dataset.label = b.innerHTML;
  }});
  function moreLabel(sec) {{
    var b = sec.querySelector('.more-btn'); if (!b) return;
    if (sec.classList.contains('open')) {{ b.innerHTML = 'Show fewer ▴'; return; }}
    if (age === 'all') {{ b.innerHTML = b.dataset.label; return; }}
    var n = sec.querySelectorAll('a.tool:not(.age-out)').length;
    b.innerHTML = 'Show all <b>' + n + '</b> for ' + ageName(age) + ' ▾';
  }}
  document.querySelectorAll('.more-btn').forEach(function (b) {{
    b.addEventListener('click', function () {{
      var sec = b.closest('.cat'), open = sec.classList.toggle('open');
      moreLabel(sec);
      if (!open) sec.scrollIntoView({{ block: 'start' }});
    }});
  }});
  document.querySelectorAll('.jumps a, .cta a[href^="#"]').forEach(function (a) {{ a.addEventListener('click', function () {{ openCat(a.getAttribute('href').slice(1)); }}); }});
  if (location.hash) openCat(location.hash.slice(1));
  window.addEventListener('hashchange', function () {{ openCat(location.hash.slice(1)); }});
  function apply() {{
    var q = box.value.trim().toLowerCase(), any = false, total = 0;
    wrap.classList.toggle('finder-on', !!q);
    document.querySelectorAll('.cat').forEach(function (sec) {{
      var grid = sec.querySelector('.tools'), cards = [].slice.call(sec.querySelectorAll('a.tool')), fit = function (a) {{ return age === 'all' || (+a.dataset.min <= +age && +a.dataset.max >= +age); }};
      // For an age, the closest matches come first: sheets made for that age before ones that suit everyone.
      cards.sort(function (a, b) {{
        if (age === 'all') return a.dataset.i - b.dataset.i;
        var fa = fit(a), fb = fit(b);
        if (fa !== fb) return fa ? -1 : 1;
        return ((a.dataset.max - a.dataset.min) - (b.dataset.max - b.dataset.min)) || (a.dataset.i - b.dataset.i);
      }});
      var shown = 0, k = 0;
      cards.forEach(function (a) {{
        grid.appendChild(a);
        var okAge = fit(a), ok = okAge && (!q || a.textContent.toLowerCase().indexOf(q) >= 0 || (a.dataset.keys || '').indexOf(q) >= 0);
        a.style.display = ok ? '' : 'none'; a.classList.toggle('age-out', !okAge);
        if (age === 'all') a.className = a.dataset.cls;
        else if (okAge) {{ a.classList.remove('more', 'm-more'); if (k >= 6) a.classList.add('more'); else if (k >= 4) a.classList.add('m-more'); k++; }}
        if (ok) shown++;
      }});
      var row = sec.querySelector('.more-row'); if (row) row.style.display = age !== 'all' && k <= 4 ? 'none' : '';
      moreLabel(sec);
      sec.style.display = shown ? '' : 'none'; if (shown) any = true; total += shown;
      var jump = document.querySelector('.jumps a[href="#' + sec.id + '"]'); if (jump) {{ jump.querySelector('b').textContent = shown; jump.style.display = shown ? '' : 'none'; }}
    }});
    document.getElementById('none').style.display = any ? 'none' : 'block';
    var note = document.getElementById('ageNote');
    note.innerHTML = age === 'all' ? '' : '✨ Showing <b>' + total + '</b> printables for ' + ageName(age) + ', best matches first. <button type="button" id="allAges">Show all ages</button>';
    note.style.display = age === 'all' ? 'none' : 'block';
    var back = document.getElementById('allAges'); if (back) back.addEventListener('click', function () {{ document.querySelector('.ages button[data-age="all"]').click(); }});
  }}
  box.addEventListener('input', apply);
  document.querySelectorAll('.ages button').forEach(function (b) {{
    b.addEventListener('click', function () {{
      age = b.dataset.age;
      document.querySelectorAll('.ages button').forEach(function (x) {{ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }});
      apply();
    }});
  }});
}})();
</script>
<section class="plus-band"><div class="wrap"><div><span class="new plus">New in Plus this month</span><h2 id="dropTitle">Fresh packs for the season</h2><p id="dropText">A Christmas Advent book with 24 days of family moments, a friendly Halloween pack, Diwali and Thanksgiving packs, a birthday time capsule, My Name Book and the My Journal series. All personalised, all in beautiful designs. Try any Plus pack free for 7 days, no card needed.</p><p class="drop-links" id="dropLinks"></p></div><a class="btn big" href="/plus">See everything in Plus</a></div></section>
<script>
(function () {{
  // Each month, the band shows the packs families need next.
  var D = {{ halloween: ['🎃 Halloween fun pack', '/halloween-activity-pack-for-kids'], christmas: ['🎄 Christmas Advent book', '/christmas-advent-activity-book-for-kids'], diwali: ['🪔 Diwali pack', '/diwali-activity-pack-for-kids'], thankful: ['🦃 Thankful pack', '/thanksgiving-activity-pack-for-kids'], easter: ['🐣 Easter and spring pack', '/easter-activity-pack-for-kids'], journal: ['📓 My Journal series', '/kids-journal-printable'], capsule: ['🎂 Birthday time capsule', '/birthday-time-capsule-for-kids'], name: ['🔤 My Name Book', '/personalised-name-book-for-kids'], month: ['🗓️ Monthly learning plan', '/monthly-learning-plan'], holiday: ['🏖️ Holiday learning plan', '/holiday-learning-plan'], story: ['📕 Personalised storybooks', '/personalised-storybook'], book: ['📚 Activity book', '/personalised-activity-book'] }};
  var M = [['A fresh start for the new year', ['journal', 'month', 'capsule']], ['Cosy winter learning', ['journal', 'story', 'name']], ['Spring is coming', ['easter', 'journal', 'month']], ['Hop into spring', ['easter', 'story', 'capsule']], ['Growing and exploring', ['journal', 'easter', 'book']], ['Ready for summer', ['holiday', 'journal', 'book']], ['Summer adventures', ['holiday', 'book', 'story']], ['Back to school', ['name', 'month', 'journal']], ['Autumn is here', ['halloween', 'diwali', 'capsule']], ['Halloween, Diwali and more', ['halloween', 'diwali', 'thankful']], ['Getting ready for the holidays', ['christmas', 'thankful', 'diwali']], ['Christmas is coming', ['christmas', 'name', 'story']]];
  var m = M[new Date().getMonth()];
  document.getElementById('dropTitle').textContent = m[0];
  document.getElementById('dropLinks').innerHTML = m[1].map(function (k) {{ return '<a href="' + D[k][1] + '">' + D[k][0] + ' →</a>'; }}).join('');
}})();
</script>
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
<p>PrintPals makes printable worksheets and ready-made learning packs for early learners in nursery, preschool, kindergarten, reception and the first years of primary school. Plan a whole week for your child in one click, make a name tracing sheet for a child just learning to write their name, print the whole alphabet with pictures and stroke order, or make a fresh page of sums with an answer key. Teachers can turn the weekly spelling list into a handwriting sheet and a word search in under a minute.</p>
<p>Every worksheet is free for home and classroom use. Print as many as you like.</p>
</div>
</main>
{FOOT}
</body>
</html>
'''


def shelf_body():
    names = {t['id']: t for t in TOOLS}
    groups = [
        ('📓', 'My Journal series', 'journal', [(str(i), f'Volume {i}: {n}') for i, n in [(1, 'All about my world'), (2, 'Nature explorer'), (3, 'Big dreams'), (4, 'Kind and brave')]]),
        ('📕', 'Storybooks', 'storybook', [('star', 'The Lost Star'), ('party', 'Big Animal Party'), ('sea', 'Under the Sea'), ('dino', 'Sleepy Dinosaur'), ('garden', 'Magic Garden'), ('snow', 'Snowy Surprise'), ('jungle', 'Jungle Band'), ('kind', 'Kind Heart Day')]),
        ('🏅', 'Little Learner Levels', 'levels', [(str(i + 1), f'Level {i + 1}') for i in range(10)]),
        ('💌', 'Letters from Poppy', 'poppy', [(str(i), m) for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])]),
        ('🎉', 'Seasons and celebrations', None, [(k, names[k]['h1']) for k in ['halloween', 'diwali', 'thankful', 'christmas', 'winter', 'lunar', 'kindness', 'easter']]),
        ('✏️', 'My Handwriting Books', 'handwritingbook', [(str(i), f'Book {i}') for i in range(1, 5)]),
        ('📖', 'My Sight Word Readers', 'readers', [(str(i), f'Reader {i}') for i in range(1, 5)]),
        ('🔤', 'My Phonics Books', 'phonicsbook', [(str(i), f'Book {i}') for i in range(1, 5)]),
        ('🔢', 'My Maths Books', 'mathsbook', [(str(i), f'Book {i}') for i in range(1, 5)]),
        ('🎂', 'Keepsakes and kits', None, [(k, names[k]['h1']) for k in ['namebook', 'timecapsule', 'toothfairy', 'bigsibling', 'treasure', 'busters', 'adventure', 'familynight', 'cookbook', 'superhero', 'flying', 'feelingsbook', 'dinokit', 'spacekit', 'oceankit', 'safari', 'farm', 'garden', 'detective', 'grownupbook', 'activitybook', 'monthplan', 'holidayplan']]),
    ]
    data = [{'icon': ic, 'title': ti, 'tool': tool, 'items': [{'v': v, 'name': n, 'url': '/' + names[tool or v]['slug']} for v, n in items]} for ic, ti, tool, items in groups]
    return f"""<h1>My PrintPals shelf</h1>
<p class="lead-p">Everything your family has made with PrintPals Plus, and what is waiting to be collected next. Your shelf lives on this device only.</p>
<div id="shelf"></div>
<p class="manage">Not a Plus member yet? <a href="/plus">Try Plus free for 7 days, no card needed →</a></p>
<script>
(function () {{
  var G = {json.dumps(data)}, made = [];
  try {{ made = JSON.parse(localStorage.getItem('pp-made') || '[]'); }} catch (e) {{}}
  var has = function (tool, v) {{ return made.some(function (m) {{ return tool ? (m.id === tool && String(m.v) === String(v)) : m.id === v; }}); }};
  var total = 0, got = 0, html = '';
  G.forEach(function (g) {{
    var n = 0, cards = g.items.map(function (it) {{ var ok = has(g.tool, it.v); if (ok) n++; return '<a class="shelf-item' + (ok ? ' got' : '') + '" href="' + it.url + '"><span class="shelf-tick">' + (ok ? '✓' : '+') + '</span><b>' + it.name + '</b><em>' + (ok ? 'Collected' : 'Make it →') + '</em></a>'; }}).join('');
    total += g.items.length; got += n;
    html += '<section class="shelf-group"><h2>' + g.icon + ' ' + g.title + ' <span class="count">' + n + ' of ' + g.items.length + '</span></h2><div class="shelf-bar"><i style="width:' + Math.round(100 * n / g.items.length) + '%"></i></div><div class="shelf-grid">' + cards + '</div></section>';
  }});
  document.getElementById('shelf').innerHTML = '<div class="shelf-top"><b>' + got + '</b> of ' + total + ' collected' + (got ? '. Wonderful!' : '. Your shelf is waiting to be filled!') + '</div>' + html;
}})();
</script>"""


def simple_page(title, desc, path, body):
    return head(title, desc, path) + f'''
<body>
{top()}
<main id="main"><div class="wrap article page">
{body}
</div></main>
{FOOT}
</body>
</html>
'''


ABOUT = f'''<h1>About PrintPals</h1>
<p class="lead-p">Every child deserves beautiful learning at home, whatever the budget, the printer or the distance from the people who love them.</p>
<h2>Why we made it</h2>
<p>There are thousands of worksheet websites. Many ask for your email before you can print anything, fill the screen with adverts, and then leave you to work out which of ten thousand sheets is right for your child. We kept hearing the same things from parents: <b>I do not know what to print. I am not a teacher. My printer is black and white. Grandma lives in another country.</b></p>
<p>So we built PrintPals around those problems. Plan a whole week in one click. Get a simple guide that tells you what to say. Make packs for brothers and sisters of different ages. Save ink. Send a postcard to someone far away.</p>
<h2>Our promises</h2>
<ul>
<li><b>Free forever.</b> Every worksheet maker, the weekly pack, quick packs, the family pack and the passport. No sign up and no email needed. PrintPals Plus adds bigger extras for families who want more, and helps keep everything else free.</li>
<li><b>Private.</b> Worksheets are made inside your own browser. Names you type stay on your device.</li>
<li><b>For every family.</b> British or American English (choose at the top of any page, and every worksheet changes too), A4 and US Letter paper, money in many currencies, alphabets in 15 languages, and an ink saver for black and white printers.</li>
<li><b>Made with care.</b> Real letter shapes with stroke order, answer keys, and pictures children love.</li>
</ul>
<h2>Who we are</h2>
<p>PrintPals is made by Grace and Loannes Ltd, a small family company that builds warm, playful learning for young children. We are also making Brainlings, a learning app where a little creature grows as your child learns, and where family can send voice letters from anywhere in the world.</p>
<h2>Say hello</h2>
<p>We read every message, and ideas for new worksheets are very welcome: <a href="mailto:{CONTACT}">{CONTACT}</a></p>'''

PIN_PRIVACY = ('''<h2>The Pinterest tag (only if you say yes)</h2>
<p>When you first visit, we ask whether you are happy for us to use the Pinterest tag. If you say yes, Pinterest sets a cookie that tells us which of our pins bring families to PrintPals and when someone starts a free week or a plan. It never includes anything you type into a worksheet. If you say no, nothing is loaded. You can change your mind at any time with the "Cookie choices" link at the bottom of every page. Please see Pinterest's privacy policy for how they use this information.</p>''' if PINTEREST_TAG else '<p>There are no advertising trackers.</p>')
PRIVACY = f'''<h1>Privacy</h1>
<p class="lead-p">Short version: we do not collect what you type. Worksheets are made on your own device. If you buy PrintPals Plus, we keep only what we need to give you your subscription.</p>
<h2>What we collect</h2>
<p>Nothing that you type. Names, word lists, messages and photos you use in a worksheet are processed inside your web browser and are never sent to us. There are no accounts and no sign up forms.</p>{PIN_PRIVACY}
<h2>What stays on your device</h2>
<p>To make PrintPals easier to use, your browser remembers a few settings in its own local storage: your paper size, whether Ink saver is on, and your child's first name if you typed one, so the next sheet is ready for you. This never leaves your device. Press "Forget it" under the print button, or clear your browser data, to remove it.</p>
<h2>If you buy PrintPals Plus</h2>
<p>When you subscribe, you pay through our payment partner Stripe. Stripe collects your payment details and billing information and handles them under its own privacy policy. We never see your card number. We receive your name, email address, country and subscription details from Stripe, so we can give you Plus, send receipts and help if something goes wrong. We keep this only while you are a customer and for as long as the law requires for tax records, and we never sell it or use it for advertising.</p>
<h2>Services we use</h2>
<p>The website is hosted on Google Firebase Hosting, which keeps standard server logs (such as IP addresses and the pages requested) to run and protect the service. Please see Google's privacy policy for how they handle this information. Our fonts are hosted on PrintPals itself, so no other services are contacted.</p>
<h2>Children</h2>
<p>PrintPals is made for parents and teachers to use with children. We do not knowingly collect any personal information from children.</p>
<h2>Questions</h2>
<p>PrintPals is made by Grace and Loannes Ltd. Email us any time at <a href="mailto:{CONTACT}">{CONTACT}</a>.</p>'''

PLUS = f'''<h1>PrintPals Plus</h1>
<p class="lead-p">Everything you love on PrintPals stays free, forever. Plus is for families and teachers who want even more, and it helps us keep PrintPals free for everyone.</p>
<div id="plusstatus" class="launch">🎁 <b>Try Plus free for 7 days.</b> Just open any Plus pack. No card, no sign up.</div>
<div class="plans">
<div class="plan"><h3>Free</h3><div class="price">$0<span> forever</span></div><ul>
<li>{sum(1 for t in TOOLS if t['cat'] != 'packs')} worksheet makers</li><li>Weekly learning pack</li><li>Siblings packs</li><li>Quick packs and family far away pack</li><li>Learning passport</li><li>Ink saver, easy-read letters, Easier and Harder</li><li>No sign up, ever</li></ul>
<a class="btn alt" href="/">Start printing</a></div>
<div class="plan best"><span class="ribbon">Most loved</span><h3>Plus for families</h3><div class="price">$4.99<span> a month</span></div><p class="or">or $39 a year (save 35%)</p><ul>
<li>Everything in Free</li><li><b>Monthly learning plans</b> that grow with your child</li><li><b>Holiday learning plans</b> for 2, 4 or 6 weeks</li><li><b>Personalised storybooks</b> starring your child</li><li><b>Personalised activity books</b> up to 40 pages</li><li><b>Christmas Advent book</b>: 24 days of family moments</li><li><b>Halloween fun pack</b>, friendly not scary</li><li><b>My Name Book</b> with a special word for every letter</li><li><b>Birthday time capsule</b> for every year</li><li><b>Diwali, Thanksgiving and Easter packs</b></li><li><b>My Journal series</b>: four volumes to collect</li><li><b>Little Learner Levels</b> with badges</li><li><b>A letter from Poppy</b> every month</li><li><b>My Phonics Books</b> and <b>My Maths Books</b>: four books each</li><li><b>Outdoor Adventure Passport</b> and <b>Little Chef Cookbook</b></li><li><b>Family Fun Night kit</b></li><li><b>Tooth Fairy, Big Sibling and Treasure Hunt kits</b></li><li><b>Boredom Buster jar</b> with 48 activities</li><li>Every pack in several beautiful designs</li><li>New Plus packs every month</li><li>7 free days first, cancel any time</li></ul>
<a class="btn" href="https://buy.stripe.com/7sYcN43U39lV6xW1i21kA01" rel="noopener">Get Plus yearly, $39</a><a class="btn alt" href="https://buy.stripe.com/14A00igGPbu309ygcW1kA00" rel="noopener" style="margin-top:12px">Get Plus monthly, $4.99</a><a class="try" href="/monthly-learning-plan">or try it free for 7 days →</a></div>
<div class="plan"><h3>Teachers</h3><div class="price">$59<span> a year</span></div><ul>
<li>Everything in Plus</li><li><b>Class packs</b> for up to 40 children</li><li><b>Class seasonal books</b>: a named book for every child</li><li><b>End of year memory books</b></li><li><b>Classroom displays</b> with every name</li><li>Name tracing, labels, bookmarks, reward charts, stories and certificates for every child</li><li>Use it in every class you teach</li></ul>
<a class="btn" href="https://buy.stripe.com/aFa28qaircy7bSgbWG1kA02" rel="noopener">Get the teacher plan, $59</a><a class="try" href="/class-pack-for-teachers">or try class packs free for 7 days →</a></div>
</div>
<p class="manage">Already a Plus member? <a href="/my-shelf">See your shelf</a> · <a href="{STRIPE_PORTAL}" rel="noopener">Manage or cancel my subscription →</a></p>
<h2>Everything in Plus</h2><p class="cat-lead">{sum(1 for t in TOOLS if t.get('plus'))} premium packs, each personalised with your child's name, most in several designs, and new ones added through the year.</p>
<div class="tools">{''.join(f'<a class="tool" href="/{t["slug"]}" style="--tint:{t["tint"]}"><div class="thumb"><img src="/img/thumb-{t["id"]}.webp" alt="{html.escape(t["h1"])} example" loading="lazy" width="400" height="566"></div><h3>{t["icon"]} {html.escape(t["h1"])}</h3><p>{html.escape(t["card"])}</p><span class="go">Try 7 days free →</span></a>' for t in TOOLS if t.get('plus'))}</div>
<h2>Questions</h2>
<details><summary>Will the free worksheets stay free?</summary><p>Yes, always. Every worksheet maker, the weekly pack, quick packs, the family pack and the passport are free forever.</p></details>
<details><summary>How does the free week work?</summary><p>Open any Plus pack and your 7 free days start on that phone or computer. No card, no sign up. When the week ends, you can choose a plan, or keep using everything that is free.</p></details>
<details><summary>I paid on my phone. How do I use Plus on my computer?</summary><p>Plus opens on the device you paid on. On another device, open any Plus pack and choose "Already paid on another phone or computer?", then type the receipt number from your payment email.</p></details>
<details><summary>How do I cancel?</summary><p>Any time, in two taps: <a href="{STRIPE_PORTAL}" rel="noopener">manage or cancel my subscription</a>. Plus stays open until the end of the time you have paid for.</p></details>
<details><summary>How does payment work?</summary><p>Prices are in US dollars, tax included. Payments are handled securely by Stripe, so we never see your card details. Your bank may show the amount in your own currency.</p></details>
<details><summary>Do you show adverts?</summary><p>No. PrintPals has no adverts, for free or Plus families.</p></details>
<script src="/js/plus.js?v={VERSION}"></script>
<script>
(function () {{
  var P = window.PPPlus, box = document.getElementById('plusstatus'); if (!P || !box) return;
  var names = {{ monthly: 'PrintPals Plus', yearly: 'PrintPals Plus', teacher: 'PrintPals Teacher' }};
  if (P.welcome) box.innerHTML = '🎉 <b>Welcome to ' + names[P.welcome] + '!</b> Thank you for supporting PrintPals. Plus is now open on this device. <a href="/monthly-learning-plan">Plan a learning month →</a>';
  else if (P.has(false)) box.innerHTML = '✨ <b>You have ' + names[P.paid().plan] + ' on this device.</b> Thank you! <a href="' + P.PORTAL + '" rel="noopener">Manage my subscription</a>';
}})();
</script>'''

TERMS = f'''<h1>Terms of use</h1>
<p class="lead-p">The friendly version: use PrintPals to help children learn, at home or in class. Be kind, and do not resell our pages.</p>
<h2>Who we are</h2>
<p>PrintPals (printpals.web.app) is run by Grace and Loannes Ltd, a company registered in Scotland (company number SC899696). You can reach us at <a href="mailto:{CONTACT}">{CONTACT}</a>.</p>
<h2>Using PrintPals</h2>
<p>You may make, print and share PrintPals worksheets for your own family and for the children you teach, including whole classes and schools. Please do not sell our worksheets, packs or pictures, or upload them to other websites as your own. Worksheets are made inside your own browser, and you are responsible for what you type into them.</p>
<h2>Free and Plus</h2>
<p>Every worksheet maker, the weekly learning pack, quick packs, the family far away pack and the learning passport are free. PrintPals Plus is an optional subscription that adds monthly learning plans, personalised activity books and, on the teacher plan, class packs.</p>
<h2>Plus subscriptions</h2>
<ul>
<li><b>Prices.</b> Plus costs US$4.99 a month or US$39 a year. The teacher plan costs US$59 a year. Prices include any sales tax or VAT. Your bank may show the amount in your own currency.</li>
<li><b>Free week.</b> New families can try Plus free for 7 days on our website, with no card needed.</li>
<li><b>Your devices.</b> Plus opens on the phone or computer you subscribe on. To open it on another device, use your receipt number from your payment email, as explained on our Plus page.</li>
<li><b>Renewal.</b> Subscriptions renew automatically at the end of each month or year until you cancel.</li>
<li><b>Cancelling.</b> You can cancel any time using the <a href="{STRIPE_PORTAL}" rel="noopener">manage my subscription</a> link, which is also on our <a href="/plus">Plus page</a>. Plus stays open until the end of the period you have paid for, and you will not be charged again.</li>
<li><b>Refunds.</b> If you are not happy, email us within 14 days of a payment and we will refund it in full. After 14 days, payments are not refunded, but you can cancel so you are not charged again.</li>
<li><b>Payments.</b> Payments are handled securely by our payment partner, Stripe. We never see or store your card details.</li>
</ul>
<h2>Changes</h2>
<p>We keep improving PrintPals, so pages and features may change. If we ever change Plus prices, we will tell subscribers by email before the change affects them, and you can cancel before then.</p>
<h2>Our responsibility</h2>
<p>We work hard to make every page correct and safe for children, but PrintPals is provided as it is. Please check each worksheet before you give it to a child, and supervise children when they use scissors and glue. Nothing in these terms limits your rights under the consumer laws of your country.</p>
<h2>Law</h2>
<p>These terms are governed by the laws of Scotland. If you have a problem, please email us first: we are a small family company and we will always try to put things right.</p>
<p><i>Last updated: {datetime.date.today().strftime('%d %B %Y')}</i></p>'''

HELP = f'''<h1>Help and support</h1>
<p class="lead-p">We are a small family company and we read every message. Here are the answers parents ask for most.</p>
<div class="launch">💌 Still stuck? Email us at <a href="mailto:{CONTACT}">{CONTACT}</a> and we will reply within 2 working days.</div>
<h2>PrintPals Plus and payments</h2>
<details><summary>How do I cancel my subscription?</summary><p>Open <a href="{STRIPE_PORTAL}" rel="noopener">manage or cancel my subscription</a>, type the email you paid with, and press Cancel. Plus stays open until the end of the time you have paid for, and you will not be charged again.</p></details>
<details><summary>Can I get a refund?</summary><p>Yes. If you are not happy, email us within 14 days of a payment and we will refund it in full. Please tell us the email you paid with.</p></details>
<details><summary>I see a charge from PRINTPALS.WEB.APP. What is it?</summary><p>That is your PrintPals Plus subscription ($4.99 a month, $39 a year, or $59 a year for teachers). If you do not recognise it, email us and we will look into it straight away.</p></details>
<details><summary>Where is my receipt?</summary><p>Stripe emails a receipt after every payment. Check your spam folder, or open <a href="{STRIPE_PORTAL}" rel="noopener">manage my subscription</a> to see and download every invoice.</p></details>
<details><summary>How do I change from monthly to yearly?</summary><p>Open <a href="{STRIPE_PORTAL}" rel="noopener">manage my subscription</a> and choose Update plan. Yearly saves you 35%.</p></details>
<details><summary>I paid on my phone. How do I use Plus on my computer?</summary><p>Open any Plus pack on your computer and choose "Already paid on another phone or computer?", then type the receipt number from your payment email. It looks like 1234-5678.</p></details>
<details><summary>How does the free week work?</summary><p>Open any Plus pack and your 7 free days start on that phone or computer. No card and no sign up. After the week you can choose a plan, or keep using everything that is free.</p></details>
<details><summary>Can I have American or British English?</summary><p>Yes. Choose 🇬🇧 UK or 🇺🇸 US at the top of any page. The website and every worksheet switch to that spelling and those words, and your choice is remembered on this device.</p></details>
<h2>Printing</h2>
<details><summary>How do I print or save a worksheet?</summary><p>Press "Print or save as PDF". On a computer, choose your printer, or choose "Save as PDF" to keep it. On a phone, choose Print, then Save as PDF, and print it later at home or at any print shop.</p></details>
<details><summary>The page comes out too small or cut off.</summary><p>Pick your paper size on the worksheet page (A4 or US Letter), and in the print window choose "Actual size" or 100% scale, not "Fit to page".</p></details>
<details><summary>My printer is black and white.</summary><p>Tick "Ink saver" on any worksheet for white backgrounds and light grey pictures that use much less ink.</p></details>
<p>More about us on the <a href="/about">About page</a>. Read our <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a> pages.</p>'''

REFUNDS = f'''<h1>Refunds, delivery and contact</h1>
<p class="lead-p">The short version: everything is digital and ready straight away, and if you are not happy you get your money back.</p>
<h2>Refunds and returns</h2>
<p>PrintPals Plus and the teacher plan are digital subscriptions, so there is nothing to post back. If you are not happy for any reason, email us within 14 days of any payment and we will refund that payment in full. You do not need to give a reason.</p>
<ul><li><b>How:</b> email <a href="mailto:{CONTACT}">{CONTACT}</a> and tell us the email address you paid with.</li>
<li><b>How long:</b> we reply within 2 working days and send the refund the same day. Your bank usually shows it within 5 to 10 working days.</li>
<li><b>After 14 days:</b> payments are not refunded, but you can cancel at any time so you are not charged again.</li></ul>
<h2>Cancelling</h2>
<p>Cancel any time in two taps: <a href="{STRIPE_PORTAL}" rel="noopener">manage or cancel my subscription</a>. Plus stays open until the end of the time you have paid for.</p>
<h2>Delivery</h2>
<p>There is no shipping and no delivery charge. Every pack is made instantly inside your web browser, anywhere in the world. Print it at home or at school, or save it as a PDF. Paid packs open on the phone or computer you subscribe on, and you can open them on another device with the receipt number from your payment email.</p>
<h2>Prices</h2>
<p>PrintPals Plus for families is $4.99 a month or $39 a year and opens every Plus pack. The teacher plan is $59 a year and opens every Plus pack and every class pack. Every plan starts with 7 free days, and no card is needed for the free week. Prices are in US dollars and include any tax.</p>
<h2>Contact us</h2>
<p>Email <a href="mailto:{CONTACT}">{CONTACT}</a>. We are a small family company and we reply within 2 working days.</p>
<p>PrintPals is run by Grace and Loannes Ltd, a company registered in Scotland (company number SC899696).</p>'''

NOT_FOUND = '''<h1>Oops, this page got lost!</h1>
<p class="lead-p">It may have wandered off to play. Let us help you find something lovely instead.</p>
<p><a class="btn big" href="/weekly-learning-pack" style="max-width:420px">🎒 Plan my child's week</a></p>
<p><a href="/">See all the free worksheets →</a></p>'''


LANG_JS = """<script>(function(){var us=document.documentElement.lang==='en-US',L=null;try{L=localStorage.getItem('pp-lang')}catch(e){}
document.querySelectorAll('[data-lang]').forEach(function(a){a.addEventListener('click',function(){try{localStorage.setItem('pp-lang',a.dataset.lang)}catch(e){}})});
if(L||us===/^en-US/i.test(navigator.language))return;var o=document.querySelector('.langsw a:not(.on)');if(!o)return;
var b=document.createElement('div');b.className='lang-offer no-print';b.innerHTML=us?'🇬🇧 Hello! Would you prefer British English? Every worksheet changes too. <a class="btn" data-lang="uk" href="'+o.getAttribute('href')+'">Switch to UK English</a> <button type="button" class="linkish">Keep US English</button>':'🇺🇸 Hi there! PrintPals speaks American English too, and every worksheet changes with it. <a class="btn" data-lang="us" href="'+o.getAttribute('href')+'">Switch to US English</a> <button type="button" class="linkish">Keep UK English</button>';
var h=document.querySelector('header.top');h.parentNode.insertBefore(b,h.nextSibling);
b.querySelector('a').addEventListener('click',function(){try{localStorage.setItem('pp-lang',us?'uk':'us')}catch(e){}});
b.querySelector('button').addEventListener('click',function(){try{localStorage.setItem('pp-lang',us?'us':'uk')}catch(e){}b.remove()})})()</script>"""


def pin_tag_js():
    """Pinterest tag, loaded only after the visitor says yes. Tracks page visits and checkout clicks."""
    if not PINTEREST_TAG:
        return ''
    return ("""<script>(function(){var K='pp-consent',c=null;try{c=localStorage.getItem(K)}catch(e){}
function load(){!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load','""" + PINTEREST_TAG + """');pintrk('page');pintrk('track','pagevisit');
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="buy.stripe.com"]');if(a)pintrk('track','checkout',{value:/aFa28/.test(a.href)?59:(/7sYcN/.test(a.href)?39:4.99),currency:'USD'})},true);}
function ask(){var b=document.createElement('div');b.className='cookie-ask no-print';b.innerHTML='🍪 May we use one Pinterest cookie to see which of our pins bring families here? It never sees anything you type. <button type="button" class="btn">Yes, that is fine</button> <button type="button" class="linkish">No thanks</button>';document.body.appendChild(b);
var bs=b.querySelectorAll('button');bs[0].onclick=function(){try{localStorage.setItem(K,'yes')}catch(e){}b.remove();load()};bs[1].onclick=function(){try{localStorage.setItem(K,'no')}catch(e){}b.remove()}}
if(c==='yes')load();else if(c!=='no')ask();
document.querySelectorAll('[data-action="cookies"]').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();try{localStorage.removeItem(K)}catch(e){}location.reload()})});})()</script>""")


def lang_bits(page, path, us):
    """Add the UK/US switch, the note by the print button and the offer banner."""
    uk_href, us_href = path, '/us' + ('' if path == '/' else path)
    on = ' class="on" aria-current="true"'
    sw = (f'<div class="langsw" role="group" aria-label="English spelling"><a href="{uk_href}" data-lang="uk"{"" if us else on}>🇬🇧 UK</a>'
          f'<a href="{us_href}" data-lang="us"{on if us else ""}>🇺🇸 US</a></div>')
    page = page.replace('</nav></div></header>', '</nav>' + sw + '</div></header>', 1)
    note = (f'<p class="hint lang-hint">🇬🇧 Prefer British spelling (colour, maths, Mum)? <a data-lang="uk" href="{uk_href}">Switch to UK English</a></p>' if us
            else f'<p class="hint lang-hint">🇺🇸 Want American spelling (color, math, Mom)? <a data-lang="us" href="{us_href}">Switch to US English</a></p>')
    page = page.replace('<p class="hint" id="remember"', note + '\n<p class="hint" id="remember"', 1)
    return page.replace('</body>', LANG_JS + pin_tag_js() + '\n</body>', 1)


def write_pair(name, page, path):
    """Write the British page and its American twin at /us/..."""
    us = us_html(page, path)
    us_path = '/us' + ('' if path == '/' else path)
    us = us.replace(f'<link rel="canonical" href="{SITE}{path}">', f'<link rel="canonical" href="{SITE}{us_path}">')
    us = us.replace(f'<meta property="og:url" content="{SITE}{path}">', f'<meta property="og:url" content="{SITE}{us_path}">')
    us = us.replace('/js/pp.js?v=', '/js/pp-us.js?v=').replace('/js/plus.js?v=', '/js/plus-us.js?v=').replace('<option value="USD">', '<option value="USD" selected>')
    with open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8') as f:
        f.write(lang_bits(page, path, False))
    os.makedirs(os.path.join(OUT, 'us'), exist_ok=True)
    targets = [os.path.join(OUT, 'us.html'), os.path.join(OUT, 'us', 'index.html')] if name == 'index' else [os.path.join(OUT, 'us', name + '.html')]
    for fn in targets:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(lang_bits(us, path, True))


def write_catalog():
    """Pinterest product catalog: one row per Plus or teacher pack, in American English
    (USD prices, links to the /us/ pages). Pinterest reads it from the link every day."""
    import csv, io
    cols = ['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'price', 'availability', 'condition',
            'brand', 'product_type', 'custom_label_0', 'custom_label_1']
    buf = io.StringIO(); w = csv.writer(buf); w.writerow(cols)
    for t in TOOLS:
        if not t.get('plus'):
            continue
        teacher = bool(t.get('teacher') or t['id'] == 'classpack')
        parts = re.split(r'\s*\|\s*', re.split(r'\s*\|\s*PrintPals', t['title'])[0])
        title = us_text(parts[0] + (': ' + ', '.join(parts[1:]).replace(': ', ', ') if len(parts) > 1 else ''))[:150]
        plan = ('Part of the PrintPals teacher plan: try it free for 7 days, no card needed. Then $59 a year for every class pack.' if teacher
                else 'Part of PrintPals Plus: try it free for 7 days, no card needed. Then $4.99 a month or $39 a year for every Plus pack.')
        desc = us_text(t['desc'].rstrip('.')) + '. ' + plan + ' Personalized with a name, printed at home or school on US Letter or A4.'
        w.writerow([t['id'], title, desc, f"{SITE}/us/{t['slug']}", f"{SITE}/pins/{t['id']}.jpg", f"{SITE}/pins/b-{t['id']}.jpg",
                    '59.00 USD' if teacher else '4.99 USD', 'in stock', 'new', 'PrintPals',
                    'Teacher class packs' if teacher else 'Printable learning packs for kids', 'Teacher plan' if teacher else 'Plus', t['id']])
    with open(os.path.join(OUT, 'pinterest-catalog.csv'), 'w', encoding='utf-8', newline='') as f:
        f.write(buf.getvalue())


def main():
    write_pair('index', home(), '/')
    for t in TOOLS:
        write_pair(t['slug'], tool_page(t), '/' + t['slug'])
    pages = [('about', 'About PrintPals | Free Worksheets Made for Real Families', 'Why we made PrintPals: free, private worksheets and ready-made learning packs built around the real problems parents face.', ABOUT),
             ('privacy', 'Privacy | PrintPals', 'PrintPals does not collect what you type. Worksheets are made inside your own browser.', PRIVACY),
             ('help', 'Help and Support | PrintPals', 'Help with PrintPals: cancelling or changing your Plus subscription, refunds, receipts, the free week and printing tips.', HELP),
             ('refunds', 'Refunds, Delivery and Contact | PrintPals', 'Our refund policy (a full refund within 14 days), instant digital delivery with no shipping, prices and how to contact us.', REFUNDS),
             ('terms', 'Terms of Use | PrintPals', 'The terms for using PrintPals and PrintPals Plus subscriptions, including prices, cancelling and refunds.', TERMS),
             ('my-shelf', 'My PrintPals Shelf | Your Collection', 'Everything your family has made with PrintPals Plus, and what to collect next.', shelf_body()),
             ('plus', 'PrintPals Plus | Monthly Learning Plans, Activity Books and Class Packs', 'Everything on PrintPals stays free. Plus adds seasonal packs, storybooks, journals, monthly plans and more for families, and class sets for teachers. Try it free for 7 days.', PLUS)]
    for slug, title, desc, body in pages:
        write_pair(slug, simple_page(title, desc, '/' + slug, body), '/' + slug)
    with open(os.path.join(OUT, '404.html'), 'w', encoding='utf-8') as f:
        f.write(simple_page('Page not found | PrintPals', 'This page could not be found.', '/404', NOT_FOUND).replace('<head>', '<head>\n<meta name="robots" content="noindex">', 1))
    # One script file for every tool page: fewer downloads, faster pages.
    with open(os.path.join(OUT, 'js', 'pp.js'), 'w', encoding='utf-8') as f:
        f.write(pp_src := '\n;\n'.join(open(os.path.join(OUT, 'js', n + '.js'), encoding='utf-8').read() for n in JS_FILES))
    # The American worksheet code: every word converted, US Letter paper and dollars first.
    form_values = set(re.findall(r'value="([^"]*)"', ''.join(open(os.path.join(OUT, n), encoding='utf-8').read() for n in os.listdir(OUT) if n.endswith('.html'))))
    us_src = us_js(pp_src, form_values).replace("else if (/^en-(US|CA)|es-(US|MX)/.test(navigator.language)) sel.value = 'letter';", "else sel.value = 'letter';")
    fix = "preview.innerHTML = pages.map((svg) => `<div class=\"sheet-wrap\">${svg}</div>`).join('');"
    assert fix in us_src
    us_src = us_fix_js() + us_src.replace(fix, fix + ' window.usFix(preview);')
    # Pictures are linked as img/..., which on /us/ pages would look in /us/img/: point them at /img/.
    us_src = re.sub(r'(["\'`])img/', r'\1/img/', us_src)
    us_src = us_src.replace('CURRENCIES.GBP', 'CURRENCIES.USD').replace("o.currency || 'GBP'", "o.currency || 'USD'")
    with open(os.path.join(OUT, 'js', 'pp-us.js'), 'w', encoding='utf-8') as f:
        f.write(us_src)
    with open(os.path.join(OUT, 'js', 'plus-us.js'), 'w', encoding='utf-8') as f:
        f.write(us_js(open(os.path.join(OUT, 'js', 'plus.js'), encoding='utf-8').read()))
    write_catalog()
    today = datetime.date.today().isoformat()
    urls = ['/'] + ['/' + t['slug'] for t in TOOLS] + ['/plus', '/help', '/refunds', '/about', '/privacy', '/terms']
    urls += ['/us'] + ['/us' + u for u in urls[1:]]
    with open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')
    with open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
    with open(os.path.join(OUT, 'img', 'logo.svg'), 'w', encoding='utf-8') as f:
        f.write(LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))
    with open(os.path.join(OUT, 'manifest.webmanifest'), 'w', encoding='utf-8') as f:
        json.dump({'name': 'PrintPals', 'short_name': 'PrintPals', 'start_url': '/', 'display': 'standalone', 'background_color': '#fffaf3', 'theme_color': '#ff6b6b',
                   'icons': [{'src': '/img/icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': '/img/icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]}, f)
    print('built', len(urls), 'pages')


if __name__ == '__main__':
    main()
