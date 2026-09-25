import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart';

import '../services/music.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/juice.dart';
import '../widgets/ui.dart';

/// One thing to talk about: a picture, what Bibi asks, and the answers
/// Bibi is happy to hear.
class _Talk {
  const _Talk(this.art, this.ask, this.answers, this.say, {this.sentence, this.count = 1});
  final String art;
  final int count; // how many pictures to show (counting out loud)
  final String ask;
  final List<String> answers;
  final String say; // Bibi's answer, out loud
  final String? sentence; // an example sentence (level two)
}

String _itsA(String w) => w == 'sun' ? "It's the sun!" : "It's ${'aeiou'.contains(w[0]) ? 'an' : 'a'} $w!";

_Talk _naming(String w, {String? sentence, List<String> more = const []}) =>
    _Talk(w, "What's this? Say it out loud!", [w, '${w}s', ...more], _itsA(w), sentence: sentence);

final _names = [
  _naming('apple', sentence: 'I like to eat apples.'),
  _naming('banana', sentence: 'Monkeys love bananas.'),
  _naming('cat', sentence: 'The cat says meow.', more: ['kitty', 'kitten']),
  _naming('dog', sentence: 'My dog can run fast.', more: ['doggy', 'puppy']),
  _naming('fish', sentence: 'The fish can swim.'),
  _naming('sun', sentence: 'The sun is hot.', more: ['sunshine']),
  _naming('cake', sentence: 'I love birthday cake.'),
  _naming('balloon', sentence: 'My balloon is red.'),
  _naming('star', sentence: 'I see a star in the sky.'),
  _naming('bear', sentence: 'The bear is big and fluffy.', more: ['teddy']),
  _naming('egg', sentence: 'The chick came out of the egg.'),
  _naming('hat', sentence: 'I wear a hat on my head.'),
  _naming('lion'),
  _naming('monkey'),
  _naming('pig', more: ['piggy']),
  _naming('turtle', more: ['tortoise']),
  _naming('zebra'),
  _naming('rainbow'),
  _naming('octopus'),
  _naming('heart'),
  _naming('strawberry'),
  _naming('orange'),
  _naming('cookie', more: ['biscuit']),
  _naming('cupcake', more: ['cake']),
  _naming('chick', more: ['chicken', 'baby chick']),
  _naming('ladybird', more: ['ladybug', 'lady bird', 'lady bug']),
  _naming('mushroom'),
  _naming('present', more: ['gift', 'presents']),
];

const _questions = [
  _Talk('dog', 'What sound does a dog make?', ['woof', 'bark', 'wuf'], 'Woof woof!'),
  _Talk('cat', 'What sound does a cat make?', ['meow', 'miaow', 'mew'], 'Meow!'),
  _Talk('pig', 'What sound does a pig make?', ['oink'], 'Oink oink!'),
  _Talk('lion', 'What sound does a lion make?', ['roar', 'raw', 'rawr'], 'Roar!'),
  _Talk('monkey', 'What sound does a monkey make?', ['ooh', 'aah', 'eek', 'oo', 'ah'], 'Ooh ooh aah aah!'),
  _Talk('chick', 'What sound does a chick make?', ['cheep', 'tweet', 'peep', 'chirp'], 'Cheep cheep!'),
  _Talk('banana', 'What colour is a banana?', ['yellow'], 'Yellow!'),
  _Talk('strawberry', 'What colour is a strawberry?', ['red'], 'Red!'),
  _Talk('sun', 'What colour is the sun?', ['yellow', 'orange'], 'Yellow!'),
  _Talk('orange', 'What colour is an orange?', ['orange'], 'Orange!'),
];

const _opposites = [
  _Talk('bear', 'What is the opposite of big?', ['small', 'little', 'tiny'], 'Small!'),
  _Talk('sun', 'What is the opposite of hot?', ['cold', 'cool', 'freezing'], 'Cold!'),
  _Talk('balloon', 'What is the opposite of up?', ['down'], 'Down!'),
  _Talk('sun', 'What is the opposite of day?', ['night'], 'Night!'),
  _Talk('heart', 'What is the opposite of happy?', ['sad', 'unhappy'], 'Sad!'),
  _Talk('turtle', 'What is the opposite of fast?', ['slow'], 'Slow!'),
  _Talk('fish', 'What is the opposite of wet?', ['dry'], 'Dry!'),
  _Talk('present', 'What is the opposite of open?', ['closed', 'close', 'shut'], 'Closed!'),
  _Talk('zebra', 'What is the opposite of tall?', ['short', 'small', 'little'], 'Short!'),
  _Talk('lion', 'What is the opposite of loud?', ['quiet', 'soft', 'silent'], 'Quiet!'),
];

const _rhymes = [
  _Talk('cat', 'What rhymes with cat?', ['hat', 'bat', 'mat', 'rat', 'sat', 'pat', 'fat', 'that'], 'Cat and hat! They rhyme!'),
  _Talk('dog', 'What rhymes with dog?', ['log', 'frog', 'fog', 'jog', 'hog'], 'Dog and log! They rhyme!'),
  _Talk('sun', 'What rhymes with sun?', ['fun', 'run', 'bun', 'one', 'won', 'done'], 'Sun and fun! They rhyme!'),
  _Talk('pig', 'What rhymes with pig?', ['wig', 'big', 'dig', 'fig', 'jig'], 'Pig and wig! They rhyme!'),
  _Talk('hat', 'What rhymes with hat?', ['cat', 'bat', 'mat', 'rat', 'sat', 'pat', 'that'], 'Hat and cat! They rhyme!'),
  _Talk('star', 'What rhymes with star?', ['car', 'far', 'jar', 'bar', 'are'], 'Star and car! They rhyme!'),
  _Talk('bear', 'What rhymes with bear?', ['chair', 'hair', 'pear', 'air', 'care', 'where', 'there', 'wear'], 'Bear and chair! They rhyme!'),
  _Talk('fish', 'What rhymes with fish?', ['dish', 'wish', 'swish'], 'Fish and dish! They rhyme!'),
];

const _countWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const _countCaps = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

_Talk _counting(Random r) {
  final n = 2 + r.nextInt(7);
  const things = ['apple', 'star', 'fish', 'ladybird', 'balloon', 'cupcake', 'strawberry'];
  return _Talk(things[r.nextInt(things.length)], 'How many can you see? Say it out loud!', [_countWords[n], '$n', if (n == 2) 'too', if (n == 4) 'for', if (n == 8) 'ate'], '${_countCaps[n]}!', count: n);
}

const _silence = [
  'Hello? Are you there? Say something!',
  "Take your time. I'm listening!",
  'Say it slowly and loudly!',
  "Psst! I'm waiting for your lovely voice!",
];

const _jokes = [
  "Why did the banana go to the doctor? Because it wasn't peeling well! Hee hee!",
  'What do you call a sleeping dinosaur? A dino-snore!',
  'What do you call a bear with no teeth? A gummy bear! Hee hee!',
  'Why are fish so clever? Because they live in schools!',
  'What did one plate say to the other? Lunch is on me!',
];

const _letterNames = {
  'a': 'A!', 'b': 'B!', 'c': 'C!', 'd': 'D!', 'e': 'E!', 'f': 'F!', 'g': 'G!', 'h': 'H!', 'i': 'I!', 'j': 'J!', 'k': 'K!', 'l': 'L!', 'm': 'M!',
  'n': 'N!', 'o': 'O!', 'p': 'P!', 'q': 'Q!', 'r': 'R!', 's': 'S!', 't': 'T!', 'u': 'U!', 'v': 'V!', 'w': 'W!', 'x': 'X!', 'y': 'Y!', 'z': 'Z!',
};

enum _Stage { answer, sentence, spell }

/// Say It! A real conversation. Bibi asks, then really listens: it helps
/// when it hears something else, fills quiet moments with jokes, teaches
/// the word, asks for a whole sentence, and spells words together.
/// Level 1 naming and spelling, 2 sentences, 3 animal sounds and colours,
/// 4 opposites.
class SayIt extends StatefulWidget {
  const SayIt({super.key});

  @override
  State<SayIt> createState() => _SayItState();
}

class _SayItState extends State<SayIt> {
  static const rounds = 5;
  static const maxLevel = 7;

  final _stt = SpeechToText();
  final _r = Random();
  final _level = app.levelOf('sayit');
  bool _sttOk = false;
  bool _listening = false;
  double _level01 = 0;
  String _heard = '';

  int _round = 0;
  int _mode = 1;
  late _Talk _talk;
  _Stage _stage = _Stage.answer;
  final _used = <String>{};
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  int _cardPop = 0;
  int _silent = 0;
  bool _waitingTap = false; // no speech recognition: tap the mic after speaking

  // spelling
  List<String> _tiles = [];
  int _spelled = 0;
  int _spellMiss = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        _sttOk = await _stt.initialize(onError: (_) {}, onStatus: (_) {});
      } catch (_) {
        _sttOk = false;
      }
      await _hello();
      if (mounted) _newRound();
    });
  }

  @override
  void dispose() {
    _stt.cancel();
    Music.resume();
    super.dispose();
  }

  Future<void> _say(String s, {Mood? mood}) async {
    if (!mounted) return;
    setState(() {
      _line = s;
      if (mood != null) _mood = mood;
      _bounce++;
    });
    await Voice.say(s);
  }

  // ---------------- listening ----------------

  /// Listens until the child finishes speaking. Returns what was heard,
  /// or '' after a quiet spell.
  Future<String> _hear(List<String> expect, {int seconds = 10}) async {
    if (!_sttOk || !mounted) return '';
    await Voice.stop();
    await Music.pause();
    final done = Completer<String>();
    var best = '';
    setState(() {
      _listening = true;
      _heard = '';
      _mood = Mood.wow;
    });
    Timer? guard;
    void finish() {
      guard?.cancel();
      if (!done.isCompleted) done.complete(best);
    }

    guard = Timer(Duration(seconds: seconds + 3), finish);
    try {
      await _stt.listen(
        onResult: (r) {
          best = r.recognizedWords;
          if (mounted) setState(() => _heard = best);
          // Stop as soon as we hear the right thing: a sharp ear.
          if (_matches(best, expect) || r.finalResult) finish();
        },
        onSoundLevelChange: (l) {
          if (mounted) setState(() => _level01 = ((l + 2) / 12).clamp(0.0, 1.0));
        },
        listenOptions: SpeechListenOptions(
          partialResults: true,
          cancelOnError: false,
          listenMode: ListenMode.dictation,
          listenFor: Duration(seconds: seconds),
          pauseFor: const Duration(seconds: 3),
          contextualPhrases: [...expect, if (app.childName.isNotEmpty) app.childName],
        ),
      );
      _stt.statusListener = (s) {
        if (s == 'done' || s == 'notListening') Future.delayed(const Duration(milliseconds: 350), finish);
      };
    } catch (_) {
      finish();
    }
    final heard = await done.future;
    try {
      await _stt.stop();
    } catch (_) {}
    if (mounted) setState(() => _listening = false);
    return heard.trim();
  }

  bool _matches(String said, List<String> targets) {
    // In rhyme time, saying the word itself back does not count.
    final skip = _mode == 5 && _cardPop > 0 ? _talk.art : null;
    final words = said.toLowerCase().split(RegExp(r'[^a-z0-9]+')).where((w) => w.isNotEmpty && w != skip).toList();
    final s = words.join(' ');
    if (s.isEmpty) return false;
    for (final t in targets) {
      if (s.contains(t)) return true;
      for (final h in words) {
        if (h.length >= 3 && _close(h, t)) return true;
      }
    }
    return false;
  }

  bool _close(String a, String b) {
    if ((a.length - b.length).abs() > 2) return false;
    final d = List.generate(a.length + 1, (i) => List.filled(b.length + 1, 0));
    for (var i = 0; i <= a.length; i++) {
      d[i][0] = i;
    }
    for (var j = 0; j <= b.length; j++) {
      d[0][j] = j;
    }
    for (var i = 1; i <= a.length; i++) {
      for (var j = 1; j <= b.length; j++) {
        d[i][j] = [d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1)].reduce(min);
      }
    }
    return d[a.length][b.length] <= (b.length > 5 ? 2 : 1);
  }

  /// Asks, listens, and never lets a quiet moment get boring.
  /// Returns what was heard ('' if the child stayed quiet three times).
  Future<String> _ask(String question, List<String> expect) async {
    await _say(question, mood: Mood.happy);
    if (!_sttOk) {
      setState(() {
        _waitingTap = true;
        _line = '$question|Tap the microphone and say it!';
      });
      await Voice.say('Tap the microphone and say it!');
      return '';
    }
    for (var tries = 0; tries < 3 && mounted; tries++) {
      final heard = await _hear(expect);
      if (heard.isNotEmpty) {
        _silent = 0;
        return heard;
      }
      _silent++;
      // Quiet: say hello, tell a joke, then ask again.
      final nudge = _silent % 3 == 2 ? '${_jokes[_r.nextInt(_jokes.length)]}|$question' : '${_silence[_r.nextInt(_silence.length)]}|$question';
      Sfx.boing();
      setState(() => _wobble++);
      await _say(nudge, mood: _silent % 3 == 2 ? Mood.laugh : Mood.wave);
    }
    return '';
  }

  // ---------------- the conversation ----------------

  Future<void> _hello() async {
    await _say('${levelLine(_level)}|Hi! What\'s your name?', mood: Mood.wave);
    if (!_sttOk) return;
    final name = app.childName.toLowerCase();
    final heard = await _hear([if (name.isNotEmpty) name], seconds: 7);
    if (!mounted || heard.isEmpty) return;
    if (name.isNotEmpty && _matches(heard, [name])) {
      Sfx.tada();
      celebrate(context, count: 30, hearts: true);
      await _say('{name}!|I knew it! I remember you!', mood: Mood.cheer);
    } else {
      await _say('Nice to meet you!|What a lovely name!', mood: Mood.cheer);
    }
  }

  Future<void> _newRound() async {
    // 5: rhyme time, 6: counting out loud, 7: a mix of everything.
    _mode = switch (_level) {
      <= 4 => _level,
      5 => 5,
      6 => 6,
      _ => 1 + _r.nextInt(6),
    };
    _cardPop++;
    _heard = '';
    _waitingTap = false;
    final pool = switch (_mode) {
      2 => _names.where((t) => t.sentence != null).toList(),
      3 => _questions,
      4 => _opposites,
      5 => _rhymes,
      6 => [for (var i = 0; i < 3; i++) _counting(_r)],
      _ => _names,
    };
    final left = pool.where((t) => !_used.contains(t.ask + t.art)).toList()..shuffle(_r);
    _talk = (left.isEmpty ? pool : left).first;
    _used.add(_talk.ask + _talk.art);
    _stage = _Stage.answer;
    setState(() {});
    Sfx.zip();
    if (_round == 0) {
      final intro = switch (_mode) {
        2 => "Let's make sentences!",
        3 => 'Animal sounds and colours!',
        4 => 'Opposites! Big and small!',
        5 => 'Rhyme time!',
        6 => 'Count out loud with me!',
        _ => '',
      };
      if (intro.isNotEmpty) await _say(intro, mood: Mood.cheer);
    }
    await _answerStep();
  }

  Future<void> _answerStep() async {
    for (var attempt = 0; attempt < 3 && mounted; attempt++) {
      final heard = await _ask(attempt == 0 ? _talk.ask : 'Say it again, nice and loud!', _talk.answers);
      if (!mounted || _waitingTap) return;
      if (_matches(heard, _talk.answers)) {
        await _win(_mode == 5 ? 'Yes! They rhyme!|${_talk.say}' : 'I heard you! Brilliant!|${_talk.say}');
        return;
      }
      if (heard.isEmpty) break;
      // Heard something else: check, help, then teach.
      Juice.oops();
      setState(() => _wobble++);
      if (attempt == 0) {
        await _say('Hmm, I heard something different.|Did you say that?|Oh, maybe I got you wrong. Can you say it again?', mood: Mood.think);
      } else {
        await _say('This is how you say it!|${_talk.say}|Now you say it!', mood: Mood.read);
      }
    }
    if (!mounted) return;
    // Never leave a child stuck: say it together, then celebrate the try.
    await _say('Hee hee! Do I have to teach you everything?|Let\'s say it together!|${_talk.say}', mood: Mood.laugh);
    if (!mounted) return;
    Juice.correct(context);
    await _afterAnswer();
  }

  Future<void> _win(String line) async {
    Music.resume();
    app.learned(Skill.letters);
    final cheer = Juice.correct(context);
    setState(() {
      _mood = Mood.dance;
      _bounce++;
    });
    await _say('$cheer|$line', mood: Mood.dance);
    await _afterAnswer();
  }

  Future<void> _afterAnswer() async {
    if (!mounted) return;
    if (_mode == 2 && _talk.sentence != null) return _sentenceStep();
    if (_mode == 1 && _talk.art.length <= 5 && _round.isEven) return _spellStep();
    await _next();
  }

  Future<void> _sentenceStep() async {
    _stage = _Stage.sentence;
    setState(() {});
    final word = _talk.art;
    bool good(String h) => _matches(h, _talk.answers) && h.split(' ').length >= 3;
    var heard = await _ask('Now make a sentence with it!|Like this:|${_talk.sentence}', _talk.answers);
    if (!mounted) return;
    if (!good(heard) && heard.isNotEmpty) {
      await _say('Say a whole sentence with the word in it!', mood: Mood.think);
      heard = await _hear(_talk.answers);
    }
    if (!mounted) return;
    if (!good(heard)) {
      await _say('Say it with me!|${_talk.sentence}|Now you say it!', mood: Mood.read);
      heard = await _hear([word]);
    }
    if (!mounted) return;
    app.learned(Skill.letters, pts: 2);
    final cheer = Juice.correct(context);
    await _say('$cheer|Wow! What a great sentence!', mood: Mood.dance);
    await _next();
  }

  Future<void> _spellStep() async {
    final word = _talk.art;
    final extra = 'bdmrstw'.split('').where((c) => !word.contains(c)).toList()..shuffle(_r);
    setState(() {
      _stage = _Stage.spell;
      _tiles = [...word.split(''), extra.first]..shuffle(_r);
      _spelled = 0;
      _spellMiss = 0;
    });
    await _say('Can you spell it?|Tap the letters to spell it!', mood: Mood.read);
  }

  Future<void> _tapTile(int i, Offset at) async {
    if (_stage != _Stage.spell || _tiles[i].isEmpty) return;
    final word = _talk.art;
    if (_tiles[i] == word[_spelled]) {
      Sfx.pop();
      Juice.starBurst(context, at, count: 10);
      setState(() {
        _tiles[i] = '';
        _spelled++;
        _bounce++;
      });
      Voice.say(_letterNames[word[_spelled - 1]]!);
      if (_spelled == word.length) {
        _stage = _Stage.answer;
        app.learned(Skill.letters, pts: 2);
        await Future.delayed(const Duration(milliseconds: 600));
        if (!mounted) return;
        final cheer = Juice.correct(context, at: at);
        await _say('$cheer|You spelled it! Amazing!|${[for (final c in word.split('')) _letterNames[c]!].join('|')}|${_talk.say}', mood: Mood.dance);
        await _next();
      }
    } else {
      _spellMiss++;
      Sfx.boing();
      setState(() => _wobble++);
      if (_spellMiss < 2) {
        await _say('${Juice.oops()}|Listen carefully!|${_letterNames[word[_spelled]]!}');
      } else {
        // Spell it together, letter by letter.
        _stage = _Stage.answer;
        setState(() => _spelled = word.length);
        await _say("Let's spell it together!|${[for (final c in word.split('')) _letterNames[c]!].join('|')}|${_talk.say}", mood: Mood.read);
        if (!mounted) return;
        Juice.correct(context);
        await _next();
      }
    }
  }

  Future<void> _next() async {
    _round++;
    if (!mounted) return;
    if (_round >= rounds) {
      finishGame(context, Skill.letters, 'Say It', game: 'sayit', maxLevel: maxLevel);
      return;
    }
    if (_round == 3) await danceBreak(context);
    if (mounted) _newRound();
  }

  void _micTap() {
    // Only used when the phone cannot listen: a tap after speaking counts.
    // Otherwise Bibi is already listening or talking, so a tap does nothing.
    if (_waitingTap) {
      _waitingTap = false;
      _win('You sound amazing!|${_talk.say}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final showMic = _stage != _Stage.spell;
    return GameFrame(
      host: 'gogo',
      level: _level,
      scene: 'classroom',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      quiet: true,
      body: Column(
        children: [
          const Spacer(),
          TweenAnimationBuilder<double>(
            key: ValueKey(_cardPop),
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 900),
            curve: Curves.elasticOut,
            builder: (_, v, c) => Transform.scale(scale: v, child: c),
            child: GestureDetector(
              onTap: () => Voice.say(_talk.ask),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(36),
                  border: Border.all(color: C.sun, width: 6),
                  boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 8))],
                ),
                child: _cardPop == 0
                    ? const SizedBox(width: 150, height: 150)
                    : _talk.count > 1
                    ? SizedBox(width: 240, child: Wrap(alignment: WrapAlignment.center, spacing: 4, runSpacing: 4, children: [for (var i = 0; i < _talk.count; i++) Art(_talk.art, size: 56)]))
                    : Art(_talk.art, size: _stage == _Stage.spell ? 110 : 150),
              ),
            ),
          ),
          if (_stage == _Stage.spell && _cardPop > 0) ...[
            const SizedBox(height: 10),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              for (var k = 0; k < _talk.art.length; k++)
                Container(
                  width: 46,
                  height: 56,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(color: k < _spelled ? C.sun : Colors.white.withValues(alpha: .75), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white, width: 3)),
                  child: Text(k < _spelled ? _talk.art[k] : '', style: T.l(36, color: C.ink)),
                ),
            ]),
          ],
          const SizedBox(height: 10),
          SizedBox(
            height: 30,
            child: Text(_heard.isEmpty ? '' : '"$_heard"', style: T.d(20, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
          ),
          const Spacer(),
          if (_stage == _Stage.spell)
            Wrap(
              alignment: WrapAlignment.center,
              spacing: 10,
              runSpacing: 10,
              children: [
                for (var i = 0; i < _tiles.length; i++)
                  _tiles[i].isEmpty
                      ? const SizedBox(width: 74, height: 74)
                      : GestureDetector(
                          onTapDown: (d) => _tapTile(i, d.globalPosition),
                          child: Container(
                            width: 74,
                            height: 74,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const [C.berry, C.aqua, C.lilac, C.peach, C.leaf][i % 5],
                              border: Border.all(color: Colors.white, width: 5),
                              boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
                            ),
                            child: Text(_tiles[i], style: T.l(42, color: Colors.white)),
                          ),
                        ),
              ],
            ),
          if (showMic) ...[
            GestureDetector(
              onTap: _micTap,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 100),
                width: 110 + (_listening ? _level01 * 40 : 0),
                height: 110 + (_listening ? _level01 * 40 : 0),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _listening ? C.berry : C.leaf,
                  border: Border.all(color: Colors.white, width: 6),
                  boxShadow: [BoxShadow(color: (_listening ? C.berry : C.leafDeep).withValues(alpha: .6), blurRadius: 20, spreadRadius: _listening ? 4 + _level01 * 14 : 2)],
                ),
                child: Icon(_listening ? Icons.hearing_rounded : Icons.mic_rounded, color: Colors.white, size: 56),
              ),
            ),
            const SizedBox(height: 6),
            Icon(_listening ? Icons.graphic_eq_rounded : Icons.touch_app_rounded, color: Colors.white, size: 30),
          ],
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
