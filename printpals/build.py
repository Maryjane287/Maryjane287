#!/usr/bin/env python3
"""Builds the PrintPals pages (home + one page per worksheet maker) into public/.

Run: python3 printpals/build.py
"""
import html
import json
import os

SITE = 'https://printpals.web.app'
OUT = os.path.join(os.path.dirname(__file__), 'public')
VERSION = '3'

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
        'id': 'photo', 'cat': 'fun', 'slug': 'photo-to-colouring-page', 'tint': '#fff0f7', 'icon': '📸', 'new': True,
        'nav': 'Photo to colouring page',
        'title': 'Turn a Photo into a Colouring Page Free | Private, No Upload | PrintPals',
        'desc': 'Turn any photo into a printable colouring page for free: your child, your pet, a family day out. Made inside your browser, so your photo never leaves your device.',
        'h1': 'Photo to colouring page',
        'lead': 'Choose a photo of your child, your pet or a special day, and it becomes a colouring page in seconds. Your photo stays on your own device. It is never uploaded.',
        'card': 'Your child, your pet, your family day out, turned into a colouring page. Private: photos never leave your device.',
        'form': field('Photo', '<input type="file" name="photo" accept="image/*">', 'Clear photos with one or two people or animals work best.')
        + field("Child's name (optional)", '<input type="text" name="name" value="" maxlength="30" placeholder="Mia">')
        + field('Title (optional)', '<input type="text" name="title" value="" maxlength="40" placeholder="My Colouring Page">')
        + field('Lines', seg('detail', [('simple', 'Bold and simple'), ('medium', 'Medium'), ('detailed', 'Lots of detail')], 'medium'), 'Bold and simple is best for little hands.')
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
        'id': 'story', 'cat': 'writing', 'slug': 'personalised-story-worksheets', 'tint': '#eef2ff', 'icon': '📖', 'new': True,
        'nav': 'Story sheets',
        'title': 'Free Personalised Reading Comprehension Worksheets | Your Child in the Story | PrintPals',
        'desc': 'Free printable reading comprehension for early readers where your child is the hero of the story. Short stories, words to know, questions with pictures and a drawing box.',
        'h1': 'Story sheets starring your child',
        'lead': "Short stories where your child is the hero, with their best friend beside them. Children read more happily when the story is about them. Each sheet has words to know, three questions and a space to draw.",
        'card': 'Short reading stories where your child is the hero, with questions and a space to draw.',
        'form': field("Child's name", '<input type="text" name="name" value="Mia" maxlength="24">')
        + field("Friend's name", '<input type="text" name="friend" value="Leo" maxlength="24">', 'A friend, brother, sister or cousin.')
        + field('Story', '<select name="story"><option value="balloon">The Big Red Balloon</option><option value="kitten">Finds a Kitten</option><option value="picnic">Picnic in the Park</option><option value="rocket">Goes to the Moon</option><option value="rain">The Rainy Day</option><option value="turtle">The Turtle Race</option><option value="all">All six stories</option></select>')
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
            ('Can I print all the stories at once?', 'Yes. Choose "All six stories" to get a little reading book of six sheets.'),
        ],
    },
    {
        'id': 'bingo', 'cat': 'puzzles', 'slug': 'picture-bingo-maker', 'tint': '#fff6e0', 'icon': '🎱', 'new': True,
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
        'id': 'party', 'cat': 'fun', 'slug': 'birthday-party-printables', 'tint': '#fff0f0', 'icon': '🎂', 'new': True,
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
        'id': 'certificate', 'cat': 'charts', 'slug': 'certificate-maker', 'tint': '#fff6e0', 'icon': '🏅', 'new': True,
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
        'id': 'dots', 'cat': 'puzzles', 'slug': 'dot-to-dot-maker', 'tint': '#e6f6fc', 'icon': '✨', 'new': True,
        'nav': 'Dot to dot',
        'title': 'Free Dot to Dot Printables for Kids | Count by 1s, 2s, 5s, 10s or ABC | PrintPals',
        'desc': 'Free printable dot to dot puzzles for kids: stars, animals, rockets and more. Choose 10 to 50 dots and count in ones, twos, fives, tens or join the alphabet. Answer key included.',
        'h1': 'Dot to dot puzzles',
        'lead': 'Join the dots and watch a picture appear. Choose how many dots and how to count: in ones, twos, fives, tens, or from A to Z. A gentle way to practise counting and pencil control.',
        'card': 'Count in ones, twos, fives, tens or join the alphabet, from 10 to 50 dots.',
        'form': field('Picture', '<select name="shape"><option value="">Surprise me</option>' + ''.join(f'<option value="{k}">{v}</option>' for k, v in [('star', 'Star'), ('heart', 'Heart'), ('house', 'House'), ('fish', 'Fish'), ('rocket', 'Rocket'), ('apple', 'Apple'), ('cat', 'Cat'), ('umbrella', 'Umbrella'), ('balloon', 'Balloon'), ('crown', 'Crown'), ('moon', 'Moon'), ('butterfly', 'Butterfly')]) + '</select>')
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
        'id': 'sudoku', 'cat': 'puzzles', 'slug': 'sudoku-for-kids', 'tint': '#effaf6', 'icon': '🔢', 'new': True,
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
        'id': 'mixups', 'cat': 'writing', 'slug': 'b-d-reversal-worksheets', 'tint': '#fdf6e3', 'icon': '🔁', 'new': True,
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


CATS = [('writing', 'Writing & reading'), ('maths', 'Maths'), ('puzzles', 'Puzzles & games'), ('fun', 'Colouring & parties'), ('charts', 'Charts & awards')]
CAT_TEXT = {
    'writing': 'Tracing, handwriting and spelling, with real letter shapes and stroke order.',
    'maths': 'Counting, sums, money, times tables and telling the time, with answer keys.',
    'puzzles': 'Word searches, mazes, crosswords, dot to dot, sudoku and bingo you can make yourself.',
    'fun': 'Turn your own photos into colouring pages and throw a birthday party in minutes.',
    'charts': 'Routines, reward charts and certificates that make everyday life easier.',
}


def top(active=''):
    act = next((t['cat'] for t in TOOLS if t['id'] == active), '')
    cur = ' aria-current="page"'
    nav = ''.join(f'<a href="/#{k}"{cur if k == act else ""}>{v}</a>' for k, v in CATS)
    return f'''<header class="top"><div class="wrap"><a class="brand" href="/">{LOGO}<span>Print<b>Pals</b></span></a><nav class="nav">{nav}</nav></div></header>'''


FOOT = '''<footer><div class="wrap"><div><div class="brand" style="font-size:24px;color:#fff">Print<b style="color:#ff8a8a">Pals</b></div>
<p style="max-width:420px;margin-top:8px">Free printable worksheets for children, made in seconds. Everything is made inside your own browser: nothing you type is sent to us or stored.</p></div>
<div style="max-width:560px"><p><b style="color:#fff">Worksheets</b></p><p style="line-height:2">''' + ''.join(f'<a href="/{t["slug"]}">{t["nav"]}</a>' for t in TOOLS) + '''</p>
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
<script src="/js/tools2.js?v={VERSION}"></script>
<script src="/js/tools3.js?v={VERSION}"></script>
<script src="/js/app.js?v={VERSION}"></script>
</body>
</html>
'''


def home():
    def card(t):
        return f'''<a class="tool" href="/{t['slug']}" style="--tint:{t['tint']}"><div class="thumb"><img src="/img/thumb-{t['id']}.webp" alt="{html.escape(t['h1'])} example" loading="lazy" width="400" height="566"></div>
<h3>{t['icon']} {html.escape(t['h1'])}{'<span class="new">New</span>' if t.get('new') else ''}</h3><p>{html.escape(t['card'])}</p><span class="go">Make one free →</span></a>'''
    sections = ''.join(f'''<section class="cat" id="{k}"><h2>{v}</h2><p class="cat-lead">{CAT_TEXT[k]}</p><div class="tools">{''.join(card(t) for t in TOOLS if t['cat'] == k)}</div></section>''' for k, v in CATS)
    ld = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'PrintPals', 'url': SITE + '/',
          'description': 'Free printable worksheets for children: name tracing, alphabet, numbers, maths, word searches and spelling.'}
    shapes = ''.join(f'<span style="width:{s}px;height:{s}px;left:{x}%;top:{y}%;background:{c};animation-delay:{d}s"></span>'
                     for s, x, y, c, d in [(90, 6, 18, '#ffe08a', 0), (60, 88, 12, '#bfe8ff', 1.5), (46, 80, 70, '#ffc6d9', 3), (70, 12, 72, '#c9f2e6', 4.5)])
    return head('PrintPals | Free Printable Worksheets for Kids, Made in Seconds',
                'Free printable worksheets for kids: tracing, story sheets starring your child, maths, money in your currency, times tables, puzzles, bingo, photo colouring pages, birthday party packs, certificates, routine and reward charts.',
                '/', f'<script type="application/ld+json">{json.dumps(ld)}</script>') + f'''
<body>
{top()}
<main>
<section class="hero"><div class="shapes" aria-hidden="true">{shapes}</div><div class="wrap" style="position:relative">
<h1>Free printable worksheets,<br><span class="hl">made in seconds</span></h1>
<p class="lead">Personalised tracing, reading, maths, puzzles, colouring pages from your own photos, party packs and certificates for children aged 3 to 8. Type, tap print, done.</p>
<div class="chips"><span class="chip">✓ 100% free</span><span class="chip">✓ No sign up</span><span class="chip">✓ A4 and US Letter</span><span class="chip">✓ Save as PDF</span></div>
</div></section>
<div class="wrap">{sections}</div>
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
