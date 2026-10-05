"""British English to American English for PrintPals.

us_text() converts visible text. us_js() converts only the string literals in the
worksheet code, so puzzles stay consistent and nothing a parent types is changed.
us_html() converts text and page metadata, and points links at the /us/ pages.
"""
import re

# Phrases that must never change.
PROTECT = ['UK Year 1', 'saw a mummy', 'Terms of Use', 'The terms for using', 'nursery rhyme', 'Biscuit', 'British English',
           'UK English', 'en-GB', 'Year 2 words', 'World Book Day']

# Whole phrases first (case is matched), longest and most specific first.
PHRASES = [
    ('Year 1 / Kindergarten', 'Kindergarten'), ('Year 2 / Grade 1', 'Grade 1'), ('Year 3 / Grade 2', 'Grade 2'),
    ('Reception / Pre-K', 'Pre-K'), ('Reception, ages 4 to 5', 'Pre-K, ages 4 to 5'), ('Year 1, ages 5 to 6', 'Kindergarten, ages 5 to 6'),
    ('Year 2, ages 6 to 7', 'Grade 1, ages 6 to 7'),
    ('Reception, Year 1 or Year 2 (pre-K to grade 1)', 'pre-K, kindergarten or grade 1'),
    ('Year 1 to Year 3 (kindergarten to grade 2)', 'kindergarten to grade 2'),
    ('Kindergarten and Year 1', 'Kindergarten and First Grade'), ('Year 1 and 2', 'kindergarten and grade 1'),
    ('usually Year 1 and Year 2', 'usually kindergarten and grade 1'),
    ('in nursery, preschool, reception and kindergarten', 'in preschool, pre-K and kindergarten'),
    ('for preschool and reception', 'for preschool and kindergarten'), ('starting school or nursery', 'starting school or preschool'),
    ("Santa or Father Christmas", 'Santa'), ('Father Christmas', 'Santa'),
    ('noughts and crosses', 'tic-tac-toe'), ('washing up liquid', 'dish soap'), ('the washing up', 'the dishes'),
    ('bicarbonate of soda', 'baking soda'), ('2 spoons of bicarbonate', '2 spoons of baking soda'), ('bicarbonate', 'baking soda'),
    ('kitchen roll', 'paper towel'), ('cotton buds', 'cotton swabs'), ('cotton bud', 'cotton swab'), ('cotton wool', 'cotton balls'),
    ('sticky-back plastic', 'contact paper'), ('number plates', 'license plates'), ('number plate', 'license plate'),
    ('full stops', 'periods'), ('full stop', 'period'), ('hundred squares', 'hundred charts'), ('hundred square', 'hundred chart'),
    ("You're invited to parents' evening", "You're invited to our parent-teacher conference"), ("at parents' evening", "at our parent-teacher conference"),
    ("a calm, organised parents' evening", 'calm, organized parent-teacher conferences'), ("Walk into parents' evening", 'Walk into parent-teacher conferences'),
    ("parents' evening", 'parent-teacher conference'), ("Parents' evening", 'Parent-teacher conference'), ("Parents' Evening", 'Parent-Teacher Conference'),
    ('Supply and Substitute Teacher', 'Substitute Teacher'), ('a cover or substitute teacher', 'a substitute teacher'),
    ('Green Fingers', 'Green Thumb'), ('green fingers', 'green thumb'), ('Pocket Money', 'Allowance'), ('pocket money', 'allowance'),
    ('working days', 'business days'), ('colour-in', 'color-in'), ('Colour-coded', 'Color-coded'), ('colour-coded', 'color-coded'), ('photo-to-colouring', 'photo-to-coloring'), ('Colour-in', 'Color-in'), ('Holiday Learning Plan', 'Vacation Learning Plan'), ('Holiday learning plan', 'Vacation learning plan'),
    ('Cover Teacher', 'Substitute Teacher'), ('cover teacher', 'substitute teacher'), ('Cover day', 'Sub day'), ('cover day', 'sub day'),
    ('a cover folder', 'a sub folder'), ('Off sick or on a course?', 'Out sick or at training?'),
    ('wet play', 'indoor recess'), ('Register, break, lunch and home times', 'Attendance, recess, lunch and home times'),
    ('Register and morning work', 'Attendance and morning work'), ('PE kits', 'gym clothes'),
    ('Pupil voice', 'Student voice'), ('pupil voice', 'student voice'),
    ('Pants and socks', 'Underwear and socks'), ('Pants on first', 'Underwear on first'),
    ('Pull down your pants', 'Pull down your underwear'), ('Pull up your pants', 'Pull up your underwear'),
    ('Trousers or skirt', 'Pants or skirt'), ('Trousers and shorts', 'Pants and shorts'),
    ('Wellies or boots', 'Rain boots'), ('Presses the lift button', 'Presses the elevator button'),
    ('restaurants, queues and', 'restaurants, lines and'),
    ('Put the tissue in the bin', 'Put the tissue in the trash'), ('put rubbish in the bin', 'put trash in the trash can'),
    ('Take out the bins', 'Take out the trash'), ('Hoover my room', 'Vacuum my room'),
    ('Help with the washing', 'Help with the laundry'), ('Help sort the washing', 'Help sort the laundry'),
    ('Sort the washing', 'Sort the laundry'), ('Help fold the washing', 'Help fold the laundry'), ('Put the washing in', 'Put the laundry in'),
    ('Where the washing blows', 'Where the laundry blows'),
    ('turn off the tap', 'turn off the faucet'), ('next to the till', 'next to the cash register'), ('fill the till', 'fill the cash register'),
    ('breakfast, lunch and tea', 'breakfast, lunch and dinner'), ('our breakfast and our tea', 'our breakfast and our dinner'),
    ('flies home for tea', 'flies home for dinner'), ('Dark by teatime', 'Dark by dinnertime'),
    ('or post it!', 'or mail it!'), ('Official post from Fairyland', 'Official mail from Fairyland'), ('real post', 'real mail'),
    ('Do I need to post anything?', 'Do I need to mail anything?'), ('make one and post it', 'make one and mail it'),
    ('Posting the postcards', 'Mailing the postcards'), (' post', ' mail'),
    ('A sweet for', 'A candy for'), ('A sweet to suck', 'A candy to suck'), ('favourite sweet?', 'favorite candy?'),
    ('with a sweet or a counter', 'with a candy or a counter'), ('sweets as counters', 'candies as counters'),
    ('sweets in each', 'candies in each'), ('How many sweets?', 'How many candies?'), ('sweets in the jar', 'candies in the jar'),
    ('the best bits', 'the best parts'), ('The best bit', 'The best part'), ('best bit', 'best part'),
    ('Maths Whizz', 'Math Whizz'), ('this term', 'this semester'), ('each term', 'each semester'), ('for each term', 'for each semester'),
    ('end of term', 'end of the semester'), ('a wonderful term', 'a wonderful semester'), ('start of each term', 'start of each semester'),
    ('termly tick boxes', 'checkboxes for each semester'),
    ('tick boxes', 'checkboxes'), ('tick box', 'checkbox'), ('a tick', 'a check mark'),
    ('Plough', 'Big Dipper'), ('single-storey', 'single-story'), ('in the Nursery', 'in preschool'),
    ('school holidays', 'school vacation'), ('the whole holiday', 'the whole vacation'), ('Light learning over the holidays', 'Light learning over school breaks'),
    ('Keep skills fresh over the holidays', 'Keep skills fresh over school breaks'),
    ('nature programmes', 'nature shows'), ('Nappy', 'Diaper'), ('petrol station', 'gas station'), ('sailing boat', 'sailboat'),
    ('rock pools', 'tide pools'), ('rock pool', 'tide pool'),
]

# Single words: British -> American (lowercase keys, case is copied from the original).
WORDS = {
    'colour': 'color', 'colours': 'colors', 'coloured': 'colored', 'colouring': 'coloring', 'colourful': 'colorful', 'colourings': 'colorings',
    'favourite': 'favorite', 'favourites': 'favorites', 'behaviour': 'behavior', 'behaviours': 'behaviors', 'neighbour': 'neighbor', 'neighbours': 'neighbors',
    'harbour': 'harbor', 'flavour': 'flavor', 'flavours': 'flavors', 'honour': 'honor', 'humour': 'humor',
    'centre': 'center', 'centres': 'centers', 'metre': 'meter', 'metres': 'meters', 'centimetre': 'centimeter', 'centimetres': 'centimeters',
    'kilometre': 'kilometer', 'kilometres': 'kilometers', 'litre': 'liter', 'litres': 'liters', 'theatre': 'theater',
    'grey': 'gray', 'cosy': 'cozy', 'cosier': 'cozier', 'practise': 'practice', 'practised': 'practiced', 'practising': 'practicing', 'practises': 'practices',
    'traveller': 'traveler', 'travellers': 'travelers', 'travelled': 'traveled', 'travelling': 'traveling', 'cancelled': 'canceled', 'cancelling': 'canceling',
    'labelled': 'labeled', 'labelling': 'labeling', 'marvellous': 'marvelous', 'jewellery': 'jewelry', 'modelling': 'modeling',
    'pyjamas': 'pajamas', 'pyjama': 'pajama', 'aeroplane': 'airplane', 'aeroplanes': 'airplanes', 'programme': 'program', 'programmes': 'programs',
    'yoghurt': 'yogurt', 'maths': 'math', 'mum': 'mom', 'mums': 'moms', 'mummy': 'mommy', 'mummies': 'mommies',
    'nappy': 'diaper', 'nappies': 'diapers', 'jumper': 'sweater', 'jumpers': 'sweaters', 'rubbish': 'trash', 'torch': 'flashlight',
    'torchlight': 'flashlight', 'torches': 'flashlights', 'wellies': 'rain boots', 'queue': 'line', 'queues': 'lines',
    'tick': 'check', 'ticks': 'checks', 'ticked': 'checked', 'ticking': 'checking', 'untick': 'uncheck',
    'timetable': 'schedule', 'spellings': 'spelling words', 'learnt': 'learned', 'spelt': 'spelled', 'whilst': 'while', 'amongst': 'among',
    'sums': 'problems', 'minibeast': 'bug', 'minibeasts': 'bugs', 'conker': 'buckeye', 'conkers': 'buckeyes', 'pupil': 'student', 'pupils': 'students',
    'organiser': 'organizer', 'organisers': 'organizers', 'analyse': 'analyze', 'catalogue': 'catalog', 'skilful': 'skillful', 'licence': 'license',
    'storey': 'story', 'lolly': 'lollipop', 'sledge': 'sled', 'fortnight': 'two weeks', 'biscuit': 'cookie', 'biscuits': 'cookies',
    'holiday': 'vacation', 'nursery': 'preschool', 'palaeontologist': 'paleontologist', 'palaeontologists': 'paleontologists', 'grandad': 'grandpa', 'savoury': 'savory', 'wellbeing': 'well-being', 'ladybird': 'ladybug', 'ladybirds': 'ladybugs', 'lorry': 'truck', 'lorries': 'trucks',
    'pudding': 'dessert', 'aubergine': 'eggplant', 'aubergines': 'eggplants', 'trolley': 'cart', 'motorbike': 'motorcycle', 'motorbikes': 'motorcycles',
}
# -ise / -isation verbs that Americans write with z.
IZE = r'\b(organ|personal|recogn|real|memor|categor|apolog|visual|summar|final|custom|priorit|critic|familiar|special|maxim|minim|optim|util|symbol|harmon|author|energ|standard)is(e|es|ed|ing|ation|ations|er|ers)\b'

LOWER_ONLY = {'biscuit', 'biscuits'}


def _case(src, rep):
    if src.isupper() and len(src) > 1:
        return rep.upper()
    if src[:1].isupper():
        return rep[:1].upper() + rep[1:]
    return rep


def us_text(s):
    if not s or not re.search('[A-Za-z]', s):
        return s
    keep = []
    def hold(m):
        keep.append(m.group(0)); return f'\x00{len(keep) - 1}\x00'
    for p in PROTECT:
        s = re.sub(re.escape(p), hold, s)
    for a, b in PHRASES:
        if a[0] == ' ':  # " post" as a verb/noun on its own
            s = re.sub(r'(?<=\w) post\b(?! office)', ' mail', s)
            continue
        s = re.sub(r'(?<![\w-])' + re.escape(a) + r'(?![\w-])', b.replace('\\', r'\\'), s)
        if a[:1].islower():
            A = a[0].upper() + a[1:]
            s = re.sub(r'(?<![\w-])' + re.escape(A) + r'(?![\w-])', (b[0].upper() + b[1:]).replace('\\', r'\\'), s)
        if a.lower() != a.upper():
            s = re.sub(r'(?<![\w-])' + re.escape(a.upper()) + r'(?![\w-])', b.upper().replace('\\', r'\\'), s)
    def word(m):
        w = m.group(0); lw = w.lower()
        if lw not in WORDS:
            return w
        if lw in LOWER_ONLY and w != lw:
            return w
        return _case(w, WORDS[lw])
    s = re.sub(r"(?<![\w'-])[A-Za-z]+(?![\w-])", word, s)
    s = re.sub(IZE, lambda m: m.group(0)[:-len(m.group(2)) - 2] + ('IZ' if m.group(0).isupper() else 'iz') + m.group(2), s, flags=re.I)
    s = re.sub(r'\b(Mr|Mrs|Ms|Dr) (?=[A-Z{$])', r'\1. ', s)
    return re.sub('\x00(\\d+)\x00', lambda m: keep[int(m.group(1))], s)


def _us_markup(s):
    """Convert the text between tags, leave tags and attributes alone."""
    return re.sub(r'(<[^>]*>)|([^<]+)', lambda m: m.group(1) or us_text(m.group(2)), s)


# ---------------------------------------------------------------- JavaScript
FORM_VALUES = set()


def _string_ok(body, before='', after=''):
    """Skip strings that are keys, ids, paths, CSS or fonts, not words people read."""
    if not re.search('[A-Za-z]{3}', body):
        return False
    if re.fullmatch(r'[a-z][a-z0-9_-]*', body):
        # A lone word is shown to children ('lorry', 'grey') unless it is an object key,
        # a value the code compares, or a form value like 'colour-in'.
        # They are often picture or option keys, so they are converted on screen instead (see US_FIX_JS).
        return False
    if re.search(r'^(img/|/|#|\.|https?:)|\.(webp|png|svg|jpg|js|css|html)\b|font-family|sans-serif|^@|querySelector', body):
        return False
    return True


def _convert_template(raw):
    # Hide ${...} expressions (they can nest) and convert the text around them.
    parts, i, depth, start, out = [], 0, 0, 0, []
    exprs = []
    while i < len(raw):
        if raw.startswith('${', i) and depth == 0:
            out.append(raw[start:i]); depth = 1; j = i + 2; st = []
            while j < len(raw) and depth:
                c = raw[j]
                if c in '\'"`' and not st:
                    q = c; j += 1
                    while j < len(raw) and raw[j] != q:
                        if raw[j] == '\\': j += 1
                        j += 1
                elif c == '{': depth += 1
                elif c == '}': depth -= 1
                j += 1
            exprs.append(raw[i:j]); out.append(f'\x01{len(exprs) - 1}\x01'); i = start = j; depth = 0
            continue
        i += 1
    out.append(raw[start:])
    text = ''.join(out)
    if _string_ok(re.sub('\x01\\d+\x01', 'X', text)):
        text = _us_markup(text)
    return re.sub('\x01(\\d+)\x01', lambda m: exprs[int(m.group(1))], text)


def us_js(src, form_values=()):
    FORM_VALUES.update(form_values)
    out, i, n = [], 0, len(src)
    prev = ''  # last significant character, to tell a regex from a division
    while i < n:
        c = src[i]
        if src.startswith('//', i):
            j = src.find('\n', i); j = n if j < 0 else j
            out.append(src[i:j]); i = j; continue
        if src.startswith('/*', i):
            j = src.find('*/', i + 2) + 2
            out.append(src[i:j]); i = j; continue
        if c == '/' and (prev in '(,=:[!&|?{};+-*%<>~^' or prev == '' or re.search(r'(return|typeof|case|in|of)\s*$', src[max(0, i - 8):i])):
            j = i + 1; cls = False
            while j < n and (src[j] != '/' or cls):
                if src[j] == '\\': j += 1
                elif src[j] == '[': cls = True
                elif src[j] == ']': cls = False
                elif src[j] == '\n': break
                j += 1
            j += 1
            while j < n and src[j].isalpha(): j += 1
            out.append(src[i:j]); i = j; prev = '/'; continue
        if c in '\'"':
            j = i + 1
            while j < n and src[j] != c:
                if src[j] == '\\': j += 1
                j += 1
            body = src[i + 1:j]
            ok = _string_ok(body, src[max(0, i - 14):i], src[j + 1:j + 4])
            out.append(c + (_us_markup(body) if ok else body) + c); i = j + 1; prev = 'a'; continue
        if c == '`':
            j = i + 1; depth = 0
            while j < n:
                if src[j] == '\\': j += 2; continue
                if src.startswith('${', j): depth += 1; j += 2; continue
                if src[j] == '}' and depth: depth -= 1
                elif src[j] == '`' and depth == 0: break
                elif src[j] == '`' and depth:  # nested template inside ${}
                    k = j + 1
                    while k < n and src[k] != '`':
                        if src[k] == '\\': k += 1
                        k += 1
                    j = k
                j += 1
            out.append('`' + _convert_template(src[i + 1:j]) + '`'); i = j + 1; prev = 'a'; continue
        out.append(c)
        if not c.isspace():
            prev = c if not (c.isalnum() or c in '_$)]') else 'a'
        i += 1
    js = ''.join(out)
    # Links inside the worksheet code point at the American pages.
    js = re.sub(r'''(href=\\?["'])/(?!us/|js/|css/|img/|fonts/|pins/|/)''', r'\1/us/', js)
    return js


# ---------------------------------------------------------------- HTML pages
def us_html(page, path):
    """Convert a finished British page into its American twin."""
    head, _, body = page.partition('</head>')
    def meta(m):
        return m.group(1) + us_text(m.group(2)) + m.group(3)
    head = re.sub(r'(<title>)(.*?)(</title>)', meta, head)
    head = re.sub(r'(<meta (?:name="description"|property="og:(?:title|description)") content=")([^"]*)(")', meta, head)
    head = head.replace('<html lang="en-GB">', '<html lang="en-US">')
    body = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', lambda m: m.group(1) + re.sub(r'(https://printpals\.web\.app)/(?!us\b|pins/|img/)', r'\1/us/', us_text(m.group(2))) + m.group(3), body, flags=re.S)
    head = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', lambda m: m.group(1) + re.sub(r'(https://printpals\.web\.app)/(?!us\b|pins/|img/)', r'\1/us/', us_text(m.group(2))) + m.group(3), head, flags=re.S)
    # Convert visible text (not scripts or styles) and a few visible attributes.
    def seg(m):
        if m.group(1):
            return m.group(1)
        return _us_markup(m.group(2))
    body = re.sub(r'(<script\b.*?</script>|<style\b.*?</style>)|((?:(?!<script\b|<style\b).)+)', seg, body, flags=re.S)
    body = re.sub(r'((?:placeholder|alt|aria-label|title)=")([^"]*)(")', meta, body)
    out = head + '</head>' + body
    out = re.sub(r'''((?:href|action)=")/(?!us/|us"|js/|css/|img/|fonts/|pins/|/|manifest)''', r'\1/us/', out)
    out = out.replace('href="/us/"', 'href="/us"').replace('href="/us/#', 'href="/us#')
    return out


def us_fix_js():
    """A tiny runtime pass for the American pages: after each worksheet is drawn, change the
    visible lone words that the code also uses as picture keys (ladybird, lolly...).
    UPPERCASE words are left alone so word search grids and their lists always match."""
    import json
    m = {k: v for k, v in WORDS.items() if ' ' not in v and k not in ('biscuit', 'biscuits', 'mummy', 'mummies', 'storey')}
    return ('window.usFix=function(root){var M=' + json.dumps(m) + ';'
            'var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n,list=[];while((n=w.nextNode()))if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest("svg"))list.push(n);'
            'list.forEach(function(t){var s=t.nodeValue,o=s.replace(/[A-Za-z]+/g,function(x){if(x.length>1&&x===x.toUpperCase())return x;var l=x.toLowerCase(),r=M[l];if(!r)return x;'
            'if(x[0]!==l[0])return r[0].toUpperCase()+r.slice(1);return x===l?r:x});if(o!==s)t.nodeValue=o})};\n')
