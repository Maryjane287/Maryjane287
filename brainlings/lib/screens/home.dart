import 'dart:math';

import 'package:flutter/material.dart';

import '../games/feeding_time.dart';
import '../games/letter_garden.dart';
import '../games/pattern_party.dart';
import '../games/shape_builder.dart';
import '../games/teach_bibi.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'bedtime.dart';
import 'gate.dart';
import 'grownups.dart';
import 'letter.dart';
import 'stickers.dart';

class _Game {
  const _Game(this.emoji, this.name, this.color, this.shadow, this.build);
  final String emoji;
  final String name;
  final Color color;
  final Color shadow;
  final Widget Function() build;
}

final _games = [
  _Game('🍎', 'Feeding Time', const Color(0xFFFFE9EE), const Color(0xFFF3B3C3), () => const FeedingTime()),
  _Game('🌷', 'Letter Garden', const Color(0xFFEDE6FF), const Color(0xFFC9B8F5), () => const LetterGarden()),
  _Game('🔺', 'Shape Builder', const Color(0xFFFFF1D6), const Color(0xFFF1CF8C), () => const ShapeBuilder()),
  _Game('🎈', 'Pattern Party', const Color(0xFFDDF7F3), const Color(0xFF9FDDD4), () => const PatternParty()),
  _Game('🎓', 'Teach {creature}', const Color(0xFFE3F4DA), const Color(0xFFABD69A), () => const TeachBibi()),
];

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static final _offered = <String>{}; // letters already offered this session
  static bool _greeted = false;
  final _r = Random();
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0;
  bool _askFeeling = false;
  Letter? _hugAsk;
  bool _away = false; // another screen is on top

  String get _cname => app.creatureName;

  @override
  void initState() {
    super.initState();
    app.addListener(_onApp);
    WidgetsBinding.instance.addPostFrameCallback((_) => _arrive());
  }

  @override
  void dispose() {
    app.removeListener(_onApp);
    super.dispose();
  }

  void _onApp() {
    if (!mounted || _away) return;
    if (app.bedtimeDue || app.asleepToday) _goBed();
  }

  bool _bedGoing = false;
  void _goBed() {
    if (_bedGoing) return;
    _bedGoing = true;
    Voice.stop();
    Navigator.of(context).pushReplacement(softRoute(const BedtimeScreen()));
  }

  Future<void> _say(String s, {Mood mood = Mood.happy}) async {
    if (!mounted) return;
    setState(() {
      _line = s;
      _mood = mood;
    });
    await Voice.say(s);
  }

  /// First arrival on the home screen.
  Future<void> _arrive() async {
    if (app.bedtimeDue || app.asleepToday) return _goBed();
    if (!_greeted) {
      _greeted = true;
      final h = DateTime.now().hour;
      final hello = h < 12 ? 'Good morning' : (h < 17 ? 'Hello' : 'Good evening');
      setState(() => _bounce++);
      Sfx.giggle();
      await _say('$hello, {name}! I missed you!', mood: Mood.cheer);
      if (h < 12 && app.totalPoints > 0 && mounted) {
        await _say('I had a dream about you! ${_dreams[_r.nextInt(_dreams.length)]}');
      }
    } else {
      _say('What shall we do next, {name}?');
    }
    if (!mounted) return;
    if (!app.feelingDoneToday) {
      setState(() => _askFeeling = true);
      await _say('How are you feeling today?');
      return; // continues after the child picks
    }
    await _afterFeeling();
  }

  Future<void> _afterFeeling() async {
    final waiting = app.unopened.where((l) => !_offered.contains(l.id)).toList();
    if (waiting.isNotEmpty && mounted) {
      final l = waiting.last;
      _offered.add(l.id);
      setState(() => _mood = Mood.letter);
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) await _open(LetterScreen(letter: l));
    }
  }

  Future<void> _pickFeeling(String f) async {
    app.logFeeling(f);
    setState(() => _askFeeling = false);
    final reply = switch (f) {
      'happy' => ('Yay! Happy is my favourite! Let\'s have fun!', Mood.cheer),
      'sad' => ('Aww. Here\'s a big squishy hug. I\'m right here with you.', Mood.happy),
      'tired' => ('Me too, a little bit. Let\'s take it nice and slow.', Mood.sleepy),
      _ => ('That\'s okay. Let\'s take a big dragon breath together. In... and out. Better?', Mood.happy),
    };
    if (f == 'happy') setState(() => _bounce++);
    await _say(reply.$1, mood: reply.$2);
    await _afterFeeling();
  }

  /// Opens a screen on top, then checks what should happen on return.
  Future<void> _open(Widget page, {bool isGame = false}) async {
    Voice.stop();
    _away = true;
    await Navigator.of(context).push(softRoute(page));
    _away = false;
    if (!mounted) return;
    setState(() => _mood = Mood.happy);
    if (app.bedtimeDue || app.asleepToday) return _goBed();
    // One gentle hug reminder, at the end of a game.
    final remind = app.hugReminder;
    if (isGame && remind != null) {
      remind.reminded = true;
      app.save();
      setState(() => _hugAsk = remind);
      await _say('Psst, {name}... ${remind.from} would love a hug back. Shall we send one?');
      return;
    }
    await _afterFeeling();
  }

  Future<void> _answerHug(bool yes) async {
    final l = _hugAsk!;
    setState(() => _hugAsk = null);
    if (yes) {
      l.hugSent = true;
      app.save();
      Sfx.hug();
      celebrate(context, count: 22, hearts: true);
      setState(() => _bounce++);
      await _say('Whoosh! Your hug is flying to ${l.from}!', mood: Mood.cheer);
    } else {
      await _say('Okay! Maybe another time.');
    }
  }

  void _tapBibi() {
    Sfx.giggle();
    setState(() => _bounce++);
    // Little surprise moments, now and then.
    if (_r.nextInt(12) == 0) {
      app.addStars(1);
      celebrate(context, count: 30);
      Sfx.star();
      _say('Surprise! I found a shiny star in my leaf. It\'s for you!', mood: Mood.cheer);
      return;
    }
    final lines = [
      'Hee hee! That tickles!',
      'Boop! You booped me!',
      'I love playing with you, {name}!',
      'Did you know? I grow when you learn!',
      'My leaf is doing a happy dance!',
      'Let\'s learn something amazing!',
      if (app.look == GrowthLook.starry) 'Look at my stars! That\'s from all our counting!',
      if (app.look == GrowthLook.bookish) 'I love my book hat! Letters make me so clever!',
    ];
    _say(lines[_r.nextInt(lines.length)]);
  }

  Future<void> _grownUps() async {
    Voice.stop();
    if (!await grownUpGate(context)) return;
    if (mounted) await _open(const GrownUpsScreen());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: ListenableBuilder(
            listenable: app,
            builder: (context, _) => Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      const SizedBox(height: 8),
                      _topBar(),
                      const SizedBox(height: 8),
                      Bubble(_line),
                      Expanded(
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            LayoutBuilder(
                              builder: (_, box) => Bibi(
                                mood: _mood,
                                size: min(box.maxHeight * .82, 280),
                                bounce: _bounce,
                                onTap: _tapBibi,
                              ),
                            ),
                            Positioned(left: 0, bottom: 12, child: _letterbox()),
                          ],
                        ),
                      ),
                      if (_hugAsk != null) _hugButtons() else _gameGrid(),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
                if (_askFeeling) _feelings(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _topBar() {
    final night = skyNow() == SkyTime.night;
    final ink = night ? Colors.white : C.ink;
    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_cname, style: T.d(26, color: ink)),
            Text(app.stageName, style: T.b(13, color: night ? Colors.white70 : C.inkSoft, w: FontWeight.w800)),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            height: 18,
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: .7), borderRadius: BorderRadius.circular(99)),
            child: Align(
              alignment: Alignment.centerLeft,
              child: AnimatedFractionallySizedBox(
                duration: const Duration(milliseconds: 700),
                curve: Curves.easeOutBack,
                widthFactor: max(.06, app.stageProgress),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [C.leaf, Color(0xFF9BE36A)]),
                    borderRadius: BorderRadius.circular(99),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(color: C.paper, borderRadius: BorderRadius.circular(99), boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 3))]),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.star_rounded, color: C.sun, size: 24),
            const SizedBox(width: 2),
            Text('${app.stars}', style: T.d(20)),
          ]),
        ),
        const SizedBox(width: 8),
        GestureDetector(
          onTap: _grownUps,
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: .6), shape: BoxShape.circle),
            child: const Icon(Icons.lock_rounded, size: 20, color: C.inkSoft),
          ),
        ),
      ],
    );
  }

  Widget _letterbox() {
    final waiting = app.unopened.isNotEmpty;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Chunky(
          color: waiting ? const Color(0xFFFFE9EE) : C.paper,
          shadow: waiting ? const Color(0xFFF3B3C3) : C.shadow,
          radius: 22,
          padding: const EdgeInsets.all(10),
          onTap: () {
            Voice.say(waiting ? 'Your letterbox! Something is waiting inside!' : 'Your letterbox!');
            _open(const LetterboxScreen());
          },
          child: const Text('📮', style: TextStyle(fontSize: 38)),
        ),
        if (waiting) const Positioned(right: -4, top: -4, child: GlowDot()),
      ],
    );
  }

  Widget _gameGrid() {
    final tiles = <Widget>[
      for (final g in _games)
        _tile(g.emoji, g.name.replaceAll('{creature}', _cname), g.color, g.shadow, () {
          Voice.say(g.name.replaceAll('{creature}', _cname));
          _open(g.build(), isGame: true);
        }),
      _tile('📒', 'Stickers', const Color(0xFFFFF6D6), const Color(0xFFF1DE9A), () {
        Voice.say('Your sticker album!');
        _open(const StickerAlbum());
      }),
    ];
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 4,
      crossAxisSpacing: 10,
      childAspectRatio: .98,
      children: tiles,
    );
  }

  Widget _tile(String emoji, String name, Color color, Color shadow, VoidCallback onTap) => Chunky(
        color: color,
        shadow: shadow,
        radius: 24,
        depth: 5,
        padding: const EdgeInsets.all(6),
        silent: true,
        onTap: () {
          Sfx.pop();
          onTap();
        },
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Text(emoji, style: const TextStyle(fontSize: 38)),
          Text(name, textAlign: TextAlign.center, maxLines: 2, style: T.d(14)),
        ]),
      );

  Widget _hugButtons() => Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: Wrap(
          alignment: WrapAlignment.center,
          spacing: 14,
          runSpacing: 14,
          children: [
            Chunky(
              color: C.berry,
              shadow: C.berryDeep,
              onTap: () => _answerHug(true),
              child: const Row(mainAxisSize: MainAxisSize.min, children: [
                Text('🤗', style: TextStyle(fontSize: 30)),
                SizedBox(width: 8),
                Text('Send a hug'),
              ]),
            ),
            Chunky(color: C.paper, shadow: C.shadow, onTap: () => _answerHug(false), child: const Text('Not now')),
          ],
        ),
      );

  Widget _feelings() {
    const faces = [('😊', 'Happy', 'happy'), ('😢', 'Sad', 'sad'), ('😴', 'Tired', 'tired'), ('😠', 'Cross', 'cross')];
    return Positioned.fill(
      child: Container(
        color: const Color(0x552A2152),
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(16),
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: 1),
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeOutBack,
          builder: (_, v, c) => Transform.translate(offset: Offset(0, (1 - v) * 200), child: c),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: C.paper, borderRadius: BorderRadius.circular(30), boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 8))]),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Text('How are you feeling?', style: T.d(24)),
              const SizedBox(height: 12),
              Row(
                children: [
                  for (final f in faces)
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Chunky(
                          color: const Color(0xFFF6F4FE),
                          shadow: const Color(0xFFDCD5F3),
                          radius: 22,
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          onTap: () => _pickFeeling(f.$3),
                          child: Column(mainAxisSize: MainAxisSize.min, children: [
                            Text(f.$1, style: const TextStyle(fontSize: 42)),
                            Text(f.$2, style: T.d(15)),
                          ]),
                        ),
                      ),
                    ),
                ],
              ),
            ]),
          ),
        ),
      ),
    );
  }
}

const _dreams = [
  'We were flying on a giant banana!',
  'We had a picnic on the moon, and the cheese was yummy!',
  'You and me were swimming with a friendly whale!',
  'We built a castle out of jelly, and it wobbled!',
  'We found a rainbow slide and went whoosh!',
];
