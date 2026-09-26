#!/usr/bin/env python3
"""Builds the PrintPals pages (home + one page per worksheet maker) into public/.

Run: python3 printpals/build.py
"""
import datetime
import html
import re
import json
import os

SITE = 'https://printpals.web.app'
OUT = os.path.join(os.path.dirname(__file__), 'public')
VERSION = '27'

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
<li>Talk about each letter while tracing: "E starts at the top, down, then three lines across."</li></ul>''',
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
            ('Why did some words not fit?', 'A word must be shorter than the grid. If the grid is too crowded, try a bigger grid or fewer words.'),
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
        'desc': 'Make a free printable visual routine chart for your child: morning, bedtime or after school, with pictures for every step. Weekly tick chart or cut-out picture cards. Great for autism and ADHD.',
        'h1': 'Visual routine charts',
        'lead': 'Pictures make routines easy, even for children who cannot read yet. Choose a morning, bedtime or after school routine, change any step, and print a weekly tick chart or big picture cards to cut out.',
        'card': 'Morning, bedtime and after school routines with pictures. Perfect for little ones, autism and ADHD.',
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
        'article': """<h2>How to make them</h2><ul><li><b>Crown:</b> colour both strips, cut them out, and glue the short strip to the end of the long one so it fits around your child's head.</li><li><b>Mask:</b> colour it, then a grown-up cuts it out with the eye holes. Tie elastic or string through the little holes.</li></ul>""",
        'faq': [('Do the crowns fit children and adults?', 'The two strips together fit most children. Add a strip of paper for bigger heads.')],
    },
    {
        'id': 'weather', 'cat': 'charts', 'slug': 'weather-chart-for-kids', 'tint': '#e6f6fc', 'icon': '🌦️', 'new': False,
        'nav': 'Weather chart',
        'title': 'Free Printable Weather Chart for Kids | Weekly and Monthly | PrintPals',
        'desc': 'Free printable weather chart for kids: circle the weather each day of the week, then draw the weather for a whole month and count sunny, cloudy, rainy, windy, snowy and stormy days.',
        'h1': 'Weather chart',
        'lead': 'Look out of the window every morning. Circle the weather for the week, draw it for the whole month, then count up which weather you had most.',
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
        'card': 'Roll the dice, then draw a one of a kind monster or robot.',
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
        'id': 'pack', 'cat': 'packs', 'slug': 'weekly-learning-pack', 'tint': '#fff6e0', 'icon': '🎒', 'new': True,
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
        'id': 'quickpack', 'cat': 'packs', 'slug': 'quick-activity-packs', 'tint': '#e8f8f4', 'icon': '⚡', 'new': True,
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
        'id': 'faraway', 'cat': 'packs', 'slug': 'family-far-away-activities', 'tint': '#fff0f5', 'icon': '💌', 'new': True,
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
        'id': 'monthplan', 'cat': 'packs', 'slug': 'monthly-learning-plan', 'tint': '#eef2ff', 'icon': '🗓️', 'new': True, 'plus': True,
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
                ('Is this part of PrintPals Plus?', 'Yes. Plus is free while we launch, so you can use it now.')],
    },
    {
        'id': 'activitybook', 'cat': 'packs', 'slug': 'personalised-activity-book', 'tint': '#fff0f5', 'icon': '📚', 'new': True, 'plus': True,
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
                ('Is this part of PrintPals Plus?', 'Yes. Plus is free while we launch, so you can use it now.')],
    },
    {
        'id': 'passport', 'cat': 'packs', 'slug': 'learning-passport', 'tint': '#fff6e0', 'icon': '🛂', 'new': True,
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
        'id': 'classpack', 'cat': 'packs', 'slug': 'class-pack-for-teachers', 'tint': '#e8f8f4', 'icon': '🏫', 'new': True, 'plus': True,
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
                ('Is this part of PrintPals Plus?', 'Yes, it is part of the teacher plan. Plus is free while we launch, so you can use it now.')],
    },
]

# The homepage sections, in learning order (easiest first). Every tool appears in exactly one section.
ARRANGE = [
    ('packs', 'Ready-made packs', 'Packs', 'Stop searching. A week or a whole month planned for your child, activity books, quick packs for busy moments, family far away, a learning passport and class packs.',
     ['pack', 'monthplan', 'activitybook', 'quickpack', 'faraway', 'passport', 'classpack']),
    ('handwriting', 'Handwriting', 'Handwriting', 'From first pencil lines to joined writing, with real letter shapes and stroke order.',
     ['prewriting', 'names', 'letters', 'mixups', 'joined', 'writingpaper', 'alphabets']),
    ('reading', 'Reading & phonics', 'Reading', 'Letter sounds, CVC words, syllables, sight words, sentences, spelling and stories where your child is the hero.',
     ['abcorder', 'cvc', 'sounds', 'families', 'rhyming', 'syllables', 'sight', 'colourwords', 'spelling', 'flashcards', 'opposites', 'position', 'sentences', 'story', 'storywriting']),
    ('maths', 'Maths', 'Maths', 'Counting, patterns, number bonds, doubles, dominoes, sums, money, times tables, time, fractions and shapes, with answer keys.',
     ['numbers', 'patterns', 'numberday', 'hundred', 'compare', 'bonds', 'doubles', 'dominoes', 'maths', 'numberlines', 'wordproblems', 'placevalue', 'money', 'times', 'clocks', 'clockcraft', 'fractions', 'shapes', 'measuring', 'graphs']),
    ('puzzles', 'Puzzles & games', 'Puzzles', 'Mazes, dot to dot, odd one out, spot the difference, word searches, crosswords, secret codes, sudoku, bingo and board games.',
     ['mazes', 'dots', 'matching', 'oddone', 'spotdiff', 'wordsearch', 'crossword', 'secretcode', 'sudoku', 'bingo', 'snakes', 'travel']),
    ('crafts', 'Colouring, crafts & parties', 'Colouring & crafts', 'Colouring pages, photo colouring, grid drawing, how to draw, puppets, crowns, bookmarks, door hangers, cards, keepsakes and party packs.',
     ['colouring', 'photo', 'colournum', 'gridcopy', 'howtodraw', 'rolldraw', 'cutpaste', 'crafts', 'puppets', 'bookmarks', 'doorhangers', 'cards', 'handprints', 'party']),
    ('charts', 'Charts & planners', 'Charts', 'Routines, chores, reward charts, 30 day challenges, certificates, reading logs, planners, calendars, height charts and labels.',
     ['routine', 'chores', 'reward', 'challenge', 'certificate', 'readinglog', 'homework', 'calendar', 'heightchart', 'labels']),
    ('world', 'Me & my world', 'My world', 'Family, my body, feelings, days and months, weather, life cycles and scavenger hunts that get children exploring.',
     ['family', 'mybody', 'feelings', 'daysmonths', 'weather', 'lifecycle', 'hunt']),
]
# Ages each tool suits (first year, last year).
AGES = {
    'pack': (3, 8), 'quickpack': (3, 8), 'faraway': (3, 10), 'monthplan': (3, 8), 'activitybook': (3, 9), 'passport': (3, 8), 'classpack': (3, 8),
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
    'patterns': 'level', 'hundred': 'level', 'bonds': 'to', 'maths': 'within', 'numberlines': 'range', 'wordproblems': 'within', 'placevalue': 'range',
    'money': 'level', 'clocks': 'level', 'fractions': 'level', 'mazes': 'level', 'dots': 'dots', 'matching': 'pairs', 'oddone': 'level', 'spotdiff': 'level',
    'wordsearch': 'level', 'sudoku': 'level', 'doubles': 'max', 'colournum': 'mode', 'compare': 'kind', 'secretcode': 'code', 'sentences': 'kind',
    'abcorder': 'kind', 'pack': 'age', 'quickpack': 'age', 'monthplan': 'age', 'activitybook': 'age',
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


JS_FILES = ['glyphs', 'sheet', 'tools', 'tools2', 'tools3', 'tools4', 'cursive', 'tools5', 'colouring', 'tools6', 'tools7', 'tools8', 'tools9', 'tools10', 'tools11', 'pack', 'app']
CONTACT = 'graceandloannesofficial@gmail.com'


def head(title, desc, path, extra='', image='/img/og.png'):
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


FOOT = '''<footer><div class="wrap"><div class="foot-brand"><div class="brand" style="font-size:24px;color:#fff">Print<b style="color:#ff8a8a">Pals</b></div>
<p style="max-width:420px;margin-top:8px">Free printable worksheets and ready-made packs for children, made in seconds. Everything is made inside your own browser: nothing you type is sent to us or stored.</p>
<p class="foot-links"><a href="/plus">PrintPals Plus</a><a href="/about">About us</a><a href="/privacy">Privacy</a><a href="mailto:''' + CONTACT + '''">Contact</a></p>
<p style="margin-top:14px">© PrintPals. Free for home and classroom use.</p></div>
<div class="foot-cols">''' + ''.join(f'<div><h4>{v}</h4>' + ''.join(f'<a href="/{t["slug"]}">{t["nav"]}</a>' for t in TOOLS if t['cat'] == k) + '</div>' for k, v in CATS) + '''</div></div></footer>'''

SCRIPTS = f'<script src="/js/pp.js?v={VERSION}"></script>'


def og_for(t):
    return f'/img/og/{t["id"]}.jpg' if os.path.exists(os.path.join(OUT, 'img', 'og', t['id'] + '.jpg')) else '/img/og.png'


def tool_page(t):
    faq_html = ''.join(f'<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in t['faq'])
    cat_name = dict(CATS)[t['cat']]
    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'WebApplication', 'name': t['h1'] + ' | PrintPals', 'url': f'{SITE}/{t["slug"]}', 'applicationCategory': 'EducationalApplication',
             'operatingSystem': 'Any', 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'}, 'description': t['desc'],
             'audience': {'@type': 'EducationalAudience', 'educationalRole': 'parent'}, 'typicalAgeRange': '{}-{}'.format(*AGES[t['id']])},
            {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'PrintPals', 'item': SITE + '/'},
                {'@type': 'ListItem', 'position': 2, 'name': cat_name, 'item': f'{SITE}/#{t["cat"]}'},
                {'@type': 'ListItem', 'position': 3, 'name': t['h1'], 'item': f'{SITE}/{t["slug"]}'}]},
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in t['faq']]},
        ],
    }
    others = ''.join(f'<a href="/{o["slug"]}">{o["icon"]} {o["h1"]}</a>' for o in TOOLS if o['cat'] == t['cat'] and o is not t)
    level = LEVELS.get(t['id'])
    level_attr = f' data-level="{level}"' if level else ''
    level_btns = ('<div class="levels-wrap"><span class="label">Not quite right?</span><div class="levels"><button type="button" class="btn alt small" data-action="easier">🐢 Easier</button>'
                  '<button type="button" class="btn alt small" data-action="harder">🚀 Harder</button></div></div>') if level else ''
    nudge = '' if t['cat'] == 'packs' else '<a class="pack-nudge" href="/weekly-learning-pack"><span>🎒</span><span><b>Not sure what to print?</b> Get a whole week planned for your child, free, with their name on every page.</span></a>'
    return head(t['title'], t['desc'], '/' + t['slug'], f'<style id="pageStyle">@page {{ size: A4 portrait; margin: 0; }}</style>\n<script type="application/ld+json">{json.dumps(ld)}</script>', og_for(t)) + f'''
<body class="tool-page">
{top(t['id'])}
<main id="main">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">PrintPals</a> › <a href="/#{t['cat']}">{html.escape(cat_name)}</a> › {html.escape(t['h1'])}</nav>
<div class="tool-head"><h1>{html.escape(t['h1'])}</h1><p>{html.escape(t['lead'])}</p><div class="tags">{'<a class="tag plus" href="/plus">✨ PrintPals Plus, free while we launch</a>' if t.get('plus') else ''}<span class="tag">👧 {ages_text(t['id'])}</span><span class="tag">✓ Free, no sign up</span><span class="tag">✓ A4 and US Letter</span></div><a class="jump" href="#preview">See your worksheet ↓</a></div>
<div class="maker">
<form class="panel" id="maker" data-tool="{t['id']}"{level_attr} autocomplete="off">
{level_btns}
{t['form']}
{check('inksaver', '🖨️ Ink saver: less colour, great for black and white printers', False)}
{check('easyread', '🔤 Easy-read letters: the a and g children learn to write', False)}
<button type="button" class="btn" data-action="print">{PRINT_ICON} Print or save as PDF</button>
<p class="hint">Free. No sign up. Nothing you type leaves your device.</p>
<p class="hint" id="remember" hidden>💛 We remember your child's name on this device only. <button type="button" class="linkish" data-action="forget">Forget it</button></p>
</form>
<section aria-label="Worksheet preview"><div class="preview-head"><span>Preview</span><span id="pageCount"></span></div><div id="preview"></div></section>
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


def home():
    def card(t):
        a, b = AGES[t['id']]
        keys = html.escape(re.sub(r'<[^>]+>|&[a-z#0-9]+;', ' ', t['title'] + ' ' + t['desc'] + ' ' + t['form']).lower())
        return f'''<a class="tool" href="/{t['slug']}" style="--tint:{t['tint']}" data-min="{a}" data-max="{b}" data-keys="{keys}"><div class="thumb"><img src="/img/thumb-{t['id']}.webp" alt="{html.escape(t['h1'])} example" loading="lazy" width="400" height="566"></div>
<h3>{t['icon']} {html.escape(t['h1'])}{'<span class="new plus">Plus</span>' if t.get('plus') else '<span class="new">New</span>' if t.get('new') else ''}</h3><p>{html.escape(t['card'])}</p><span class="age-mini">{ages_text(t['id'])}</span><span class="go">Make one free →</span></a>'''
    sections = ''.join(f'''<section class="cat{' cat-packs' if k == 'packs' else ''}" id="{k}"><h2>{v}</h2><p class="cat-lead">{CAT_TEXT[k]}</p><div class="tools">{''.join(card(t) for t in TOOLS if t['cat'] == k)}</div></section>''' for k, v in CATS)
    ld = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'PrintPals', 'url': SITE + '/',
          'description': 'Free printable worksheets and ready-made learning packs for children aged 2 to 10: a personalised week in one click, tracing, reading, maths, puzzles, crafts and charts.'}
    shapes = ''.join(f'<span style="width:{s}px;height:{s}px;left:{x}%;top:{y}%;background:{c};animation-delay:{d}s"></span>'
                     for s, x, y, c, d in [(90, 6, 18, '#ffe08a', 0), (60, 88, 12, '#bfe8ff', 1.5), (46, 80, 70, '#ffc6d9', 3), (70, 12, 72, '#c9f2e6', 4.5)])
    only = ''.join(f'<a class="only-card" href="{u}"><span class="only-ico">{i}</span><b>{html.escape(h)}</b><span>{html.escape(d)}</span><em>{html.escape(c)} →</em></a>' for i, h, d, u, c in ONLY)
    pressed = ' aria-pressed="true"'
    ages = ''.join(f'<button type="button" data-age="{a}"{pressed if a == "all" else ""}>{lab}</button>' for a, lab in [('all', 'All ages'), ('3', 'Age 3'), ('4', 'Age 4'), ('5', 'Age 5'), ('6', 'Age 6'), ('7', 'Age 7'), ('8', 'Age 8+')])
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
<div class="cta"><a class="btn big" href="/weekly-learning-pack">🎒 Plan my child's week, free</a><a class="btn alt big" href="#packs">Browse everything</a></div>
<div class="chips"><span class="chip">✓ 100% free</span><span class="chip">✓ No sign up</span><span class="chip">✓ Private on your device</span><span class="chip">✓ A4 and US Letter</span><span class="chip">✓ Ink saver</span></div>
</div></section>
<section class="only"><div class="wrap"><h2>What only PrintPals does</h2><p class="cat-lead">Other sites give you ten thousand worksheets and leave you to work it out. We built PrintPals around the real problems parents tell us about.</p><div class="only-grid">{only}</div></div></section>
<div class="wrap">
<div class="finder">
<div class="find"><input type="search" id="find" placeholder="Find a worksheet: try name, money or dinosaur" aria-label="Find a worksheet" autocomplete="off"></div>
<div class="ages" role="group" aria-label="Filter by age">{ages}</div>
<div class="jumps">{jumps}</div>
</div>
{sections}<p class="none" id="none">Nothing found. Try another word, like letters, maths or colouring.</p></div>
<script>
(function () {{
  var box = document.getElementById('find'), age = 'all';
  function apply() {{
    var q = box.value.trim().toLowerCase(), any = false;
    document.querySelectorAll('.cat').forEach(function (sec) {{
      var shown = 0;
      sec.querySelectorAll('a.tool').forEach(function (a) {{
        var okAge = age === 'all' || (+a.dataset.min <= +age && +a.dataset.max >= +age);
        var ok = okAge && (!q || a.textContent.toLowerCase().indexOf(q) >= 0 || (a.dataset.keys || '').indexOf(q) >= 0);
        a.style.display = ok ? '' : 'none'; if (ok) shown++;
      }});
      sec.style.display = shown ? '' : 'none'; if (shown) any = true;
    }});
    document.getElementById('none').style.display = any ? 'none' : 'block';
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
<section class="plus-band"><div class="wrap"><div><span class="new plus">Plus</span><h2>Want a whole month planned?</h2><p>Monthly learning plans, personalised activity books and class packs for teachers. Free while we launch.</p></div><a class="btn big" href="/plus">See PrintPals Plus</a></div></section>
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
<p>There are thousands of worksheet websites. Many hide the good pages behind a subscription, ask for your email, fill the screen with adverts, and then leave you to work out which of ten thousand sheets is right for your child. We kept hearing the same things from parents: <b>I do not know what to print. I am not a teacher. My printer is black and white. Grandma lives in another country.</b></p>
<p>So we built PrintPals around those problems. Plan a whole week in one click. Get a simple guide that tells you what to say. Make packs for brothers and sisters of different ages. Save ink. Send a postcard to someone far away.</p>
<h2>Our promises</h2>
<ul>
<li><b>Free forever.</b> Every worksheet maker, the weekly pack, quick packs, the family pack and the passport. No sign up and no email needed. PrintPals Plus adds bigger extras for families who want more, and helps keep everything else free.</li>
<li><b>Private.</b> Worksheets are made inside your own browser. Names you type stay on your device.</li>
<li><b>For every family.</b> A4 and US Letter paper, money in many currencies, alphabets in 15 languages, and an ink saver for black and white printers.</li>
<li><b>Made with care.</b> Real letter shapes with stroke order, answer keys, and pictures children love.</li>
</ul>
<h2>Who we are</h2>
<p>PrintPals is made by Grace and Loannes Ltd, a small family company that builds warm, playful learning for young children. We are also making Brainlings, a learning app where a little creature grows as your child learns, and where family can send voice letters from anywhere in the world.</p>
<h2>Say hello</h2>
<p>We read every message, and ideas for new worksheets are very welcome: <a href="mailto:{CONTACT}">{CONTACT}</a></p>'''

PRIVACY = f'''<h1>Privacy</h1>
<p class="lead-p">Short version: we do not collect your information. Worksheets are made on your own device.</p>
<h2>What we collect</h2>
<p>Nothing that you type. Names, word lists, messages and photos you use in a worksheet are processed inside your web browser and are never sent to us. There are no accounts, no sign up forms and no advertising trackers.</p>
<h2>What stays on your device</h2>
<p>To make PrintPals easier to use, your browser remembers a few settings in its own local storage: your paper size, whether Ink saver is on, and your child's first name if you typed one, so the next sheet is ready for you. This never leaves your device. Press "Forget it" under the print button, or clear your browser data, to remove it.</p>
<h2>Services we use</h2>
<p>The website is hosted on Google Firebase Hosting, which keeps standard server logs (such as IP addresses and the pages requested) to run and protect the service. Please see Google's privacy policy for how they handle this information. Our fonts are hosted on PrintPals itself, so no other services are contacted.</p>
<h2>Children</h2>
<p>PrintPals is made for parents and teachers to use with children. We do not knowingly collect any personal information from children.</p>
<h2>Questions</h2>
<p>PrintPals is made by Grace and Loannes Ltd. Email us any time at <a href="mailto:{CONTACT}">{CONTACT}</a>.</p>'''

PLUS = f'''<h1>PrintPals Plus</h1>
<p class="lead-p">Everything you love on PrintPals stays free, forever. Plus is for families and teachers who want even more, and it helps us keep PrintPals free for everyone.</p>
<div class="launch">✨ <b>Plus is free while we launch.</b> Enjoy every Plus feature now. No card, no sign up.</div>
<div class="plans">
<div class="plan"><h3>Free</h3><div class="price">$0<span> forever</span></div><ul>
<li>{sum(1 for t in TOOLS if t['cat'] != 'packs')} worksheet makers</li><li>Weekly learning pack</li><li>Siblings packs</li><li>Quick packs and family far away pack</li><li>Learning passport</li><li>Ink saver, easy-read letters, Easier and Harder</li><li>No sign up, ever</li></ul>
<a class="btn alt" href="/">Start printing</a></div>
<div class="plan best"><span class="ribbon">Most loved</span><h3>Plus for families</h3><div class="price">$4.99<span> a month</span></div><p class="or">or $39 a year (save 35%)</p><ul>
<li>Everything in Free</li><li><b>Monthly learning plans</b> that grow with your child</li><li><b>Personalised activity books</b> up to 40 pages</li><li>New Plus packs every month</li><li>7 day free trial, cancel any time</li></ul>
<a class="btn" href="/monthly-learning-plan">Try Plus free now</a></div>
<div class="plan"><h3>Teachers</h3><div class="price">$59<span> a year</span></div><ul>
<li>Everything in Plus</li><li><b>Class packs</b> for up to 40 children</li><li>Name tracing, labels, bookmarks, reward charts, stories and certificates for every child</li><li>Use it in every class you teach</li></ul>
<a class="btn alt" href="/class-pack-for-teachers">Try class packs free</a></div>
</div>
<h2>Questions</h2>
<details><summary>Will the free worksheets stay free?</summary><p>Yes, always. Every worksheet maker, the weekly pack, quick packs, the family pack and the passport are free forever.</p></details>
<details><summary>What happens when the launch offer ends?</summary><p>We will tell you clearly on this page first. Everything you have already printed is yours to keep.</p></details>
<details><summary>How will payment work?</summary><p>Prices are in US dollars. Payments will be handled by a trusted payment partner, so we never see your card details, and you can cancel any time.</p></details>
<details><summary>Do you show adverts?</summary><p>No. PrintPals has no adverts, for free or Plus families.</p></details>'''

NOT_FOUND = '''<h1>Oops, this page got lost!</h1>
<p class="lead-p">It may have wandered off to play. Let us help you find something lovely instead.</p>
<p><a class="btn big" href="/weekly-learning-pack" style="max-width:420px">🎒 Plan my child's week</a></p>
<p><a href="/">See all the free worksheets →</a></p>'''


def main():
    with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(home())
    for t in TOOLS:
        with open(os.path.join(OUT, t['slug'] + '.html'), 'w', encoding='utf-8') as f:
            f.write(tool_page(t))
    pages = [('about', 'About PrintPals | Free Worksheets Made for Real Families', 'Why we made PrintPals: free, private worksheets and ready-made learning packs built around the real problems parents face.', ABOUT),
             ('privacy', 'Privacy | PrintPals', 'PrintPals does not collect what you type. Worksheets are made inside your own browser.', PRIVACY),
             ('plus', 'PrintPals Plus | Monthly Learning Plans, Activity Books and Class Packs', 'Everything on PrintPals stays free. Plus adds monthly learning plans, personalised activity books and class packs for teachers. Free while we launch.', PLUS)]
    for slug, title, desc, body in pages:
        with open(os.path.join(OUT, slug + '.html'), 'w', encoding='utf-8') as f:
            f.write(simple_page(title, desc, '/' + slug, body))
    with open(os.path.join(OUT, '404.html'), 'w', encoding='utf-8') as f:
        f.write(simple_page('Page not found | PrintPals', 'This page could not be found.', '/404', NOT_FOUND).replace('<head>', '<head>\n<meta name="robots" content="noindex">', 1))
    # One script file for every tool page: fewer downloads, faster pages.
    with open(os.path.join(OUT, 'js', 'pp.js'), 'w', encoding='utf-8') as f:
        f.write('\n;\n'.join(open(os.path.join(OUT, 'js', n + '.js'), encoding='utf-8').read() for n in JS_FILES))
    today = datetime.date.today().isoformat()
    urls = ['/'] + ['/' + t['slug'] for t in TOOLS] + ['/plus', '/about', '/privacy']
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
