import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

import '../friends.dart';
import '../games/feeding_time.dart';
import '../songs.dart';
import '../games/letter_garden.dart';
import '../games/pattern_party.dart';
import '../games/shape_builder.dart';
import '../games/say_it.dart';
import '../games/teach_bibi.dart';
import '../services/lines.dart';
import '../services/music.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/living.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'bedtime.dart';
import 'gate.dart';
import 'grownups.dart';
import 'letter.dart';
import 'grow.dart';
import 'songs.dart';
import 'stickers.dart';
import 'talk.dart';

class _Game {
  const _Game(this.id, this.art, this.name, this.color, this.shadow, this.build);
  final String id;
  final String art;
  final String name;
  final Color color;
  final Color shadow;
  final Widget Function() build;
}

final _games = [
  _Game(
    'feeding',
    'apple',
    'Feeding Time',
    const Color(0xFFFFE9EE),
    const Color(0xFFF3B3C3),
    () => const FeedingTime(),
  ),
  _Game(
    'letters',
    'tulip',
    'Letter Garden',
    const Color(0xFFEDE6FF),
    const Color(0xFFC9B8F5),
    () => const LetterGarden(),
  ),
  _Game(
    'shapes',
    'blocks',
    'Shape Builder',
    const Color(0xFFFFF1D6),
    const Color(0xFFF1CF8C),
    () => const ShapeBuilder(),
  ),
  _Game(
    'patterns',
    'balloon',
    'Pattern Party',
    const Color(0xFFDDF7F3),
    const Color(0xFF9FDDD4),
    () => const PatternParty(),
  ),
  _Game(
    'teach',
    'chalkboard',
    'Teach {creature}',
    const Color(0xFFE3F4DA),
    const Color(0xFFABD69A),
    () => const TeachBibi(),
  ),
  _Game(
    'sayit',
    'lion',
    'Say It!',
    const Color(0xFFFFE3D1),
    const Color(0xFFF2B48E),
    () => const SayIt(),
  ),
];

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  static final _offered = <String>{}; // letters already offered this session
  static bool _greeted = false;
  static int _stageSeen = 0;
  final _r = Random();
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0;
  bool _askFeeling = false;
  Letter? _hugAsk;
  bool _away = false; // another screen is on top

  // The living meadow: things happen on their own, nobody has to tap.
  Timer? _director;
  DateTime _quietSince = DateTime.now();
  bool _speaking = false;
  bool _showing = false;
  bool _hidden = false; // peekaboo
  int _wiggle = 0; // makes the game tiles wiggle
  int _floatId = 0;
  final _floaters = <int, Widget>{};
  List<Friend> _onStage = [];
  final _pose = <String, String>{};
  final _react = <String, int>{};
  Friend? _arriving;

  String get _cname => app.creatureName;

  @override
  void initState() {
    super.initState();
    app.addListener(_onApp);
    _pickStage();
    _director = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Music.play('play');
      _arrive();
    });
  }

  @override
  void dispose() {
    app.removeListener(_onApp);
    _director?.cancel();
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
    _speaking = true;
    await Voice.say(s).timeout(const Duration(seconds: 12), onTimeout: () {});
    _speaking = false;
    _quietSince = DateTime.now();
  }

  /// First arrival on the home screen.
  Future<void> _arrive() async {
    if (app.bedtimeDue || app.asleepToday) return _goBed();
    if (!_greeted) {
      _greeted = true;
      final h = DateTime.now().hour;
      final hello = h < 12
          ? 'Good morning'
          : (h < 17 ? 'Hello' : 'Good evening');
      _stageSeen = app.stage;
      setState(() => _bounce++);
      Sfx.giggle();
      await _say('{name}!|$hello!|I missed you!', mood: Mood.wave);
      if (h < 12 && app.totalPoints > 0 && mounted) {
        await _say(
          'I had a dream about you!|${Lines.pick('dream', _dreams)}',
          mood: Mood.laugh,
        );
      }
    } else {
      _say('What shall we do next?');
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
    final waiting = app.unopened
        .where((l) => !_offered.contains(l.id))
        .toList();
    if (waiting.isNotEmpty && mounted) {
      final l = waiting.last;
      _offered.add(l.id);
      setState(() => _mood = Mood.letter);
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) await _open(LetterScreen(letter: l));
      return;
    }
    final f = app.arrivingFriend;
    if (f != null && mounted) await _friendArrives(f);
  }

  Future<void> _pickFeeling(String f) async {
    app.logFeeling(f);
    setState(() => _askFeeling = false);
    final reply = switch (f) {
      'happy' => ('Yay! Happy is my favourite! Let\'s have fun!', Mood.cheer),
      'sad' => (
        'Aww. Here\'s a big squishy hug. I\'m right here with you.',
        Mood.hug,
      ),
      'tired' => (
        'Me too, a little bit. Let\'s take it nice and slow.',
        Mood.sleepy,
      ),
      _ => (
        'That\'s okay. Let\'s take a big dragon breath together. In... and out. Better?',
        Mood.hug,
      ),
    };
    if (f == 'happy') setState(() => _bounce++);
    await _say(reply.$1, mood: reply.$2);
    await _afterFeeling();
  }

  /// Opens a screen on top, then checks what should happen on return.
  Future<void> _open(Widget page, {bool isGame = false}) async {
    Voice.stop();
    Music.stopSong();
    _away = true;
    await Navigator.of(context).push(softRoute(page));
    _away = false;
    if (!mounted) return;
    Music.play('play');
    setState(() => _mood = Mood.happy);
    // Bibi just grew into a new stage: celebrate with the growing-up film.
    if (app.stage > _stageSeen) {
      _stageSeen = app.stage;
      _away = true;
      await Navigator.of(context).push(softRoute(const GrowScreen()));
      _away = false;
      if (!mounted) return;
      setState(() {});
    }
    if (app.bedtimeDue || app.asleepToday) return _goBed();
    // One gentle hug reminder, at the end of a game.
    final remind = app.hugReminder;
    if (isGame && remind != null) {
      remind.reminded = true;
      app.save();
      setState(() => _hugAsk = remind);
      await _say(
        'Psst!|${remind.from} would love a hug back. Shall we send one?',
        mood: Mood.letter,
      );
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
      await _say(Voice.pick('Whoosh! Your hug is flying to ${l.from}!', 'Whoosh! Your hug is on its way!'), mood: Mood.hug);
    } else {
      await _say('Maybe another time.');
    }
  }

  void _tapBibi() {
    _quietSince = DateTime.now();
    Sfx.giggle();
    setState(() => _bounce++);
    // Little surprise moments, now and then.
    if (_r.nextInt(12) == 0) {
      app.addStars(1);
      celebrate(context, count: 30);
      Sfx.star();
      _say(
        'Surprise! I found a shiny star in my leaf. It\'s for you!',
        mood: Mood.wow,
      );
      return;
    }
    final lines = <(String, Mood)>[
      ('Hee hee! That tickles!', Mood.laugh),
      ('Boop! You booped me!', Mood.wow),
      ('I love playing with you!', Mood.hug),
      ('Did you know? I grow when you learn!', Mood.read),
      ('My leaf is doing a happy dance!', Mood.dance),
      ('Let\'s learn something amazing!', Mood.cheer),
      if (app.stage >= 3)
        ('Look at my flower! I\'m a superstar now!', Mood.happy)
      else if (app.look == GrowthLook.starry)
        ('Look at my stars! That\'s from all our counting!', Mood.happy)
      else if (app.look == GrowthLook.bookish)
        ('I love my book hat! Letters make me so clever!', Mood.happy),
    ];
    final pickText = Lines.pick('bibi-tap', [for (final l in lines) l.$1]);
    final pick = lines.firstWhere((l) => l.$1 == pickText, orElse: () => lines.first);
    _say(pick.$1, mood: pick.$2).then((_) {
      if (mounted && _line == pick.$1) setState(() => _mood = Mood.happy);
    });
  }

  // ---------------- the living meadow ----------------

  void _pickStage() {
    final met = [...app.metFriends]..shuffle(_r);
    _onStage = met.take(2).toList();
  }

  bool get _free =>
      mounted && !_away && !_speaking && !Voice.speaking && !_showing && !_askFeeling && _hugAsk == null && _arriving == null && !_bedGoing;

  /// Every second: if the meadow has been quiet for a little while,
  /// something fun happens all by itself.
  void _tick() {
    if (!_free) return;
    final quiet = DateTime.now().difference(_quietSince).inMilliseconds;
    if (quiet < 5500 + _r.nextInt(3000)) return;
    _showTime();
  }

  Future<void> _showTime() async {
    _showing = true;
    final acts = <Future<void> Function()>[
      _balloons,
      _bubbles,
      _dance,
      _present,
      _peekaboo,
      _callChild,
      _critters,
      _joke,
      if (_onStage.isNotEmpty) _friendChat,
    ];
    try {
      await acts[_r.nextInt(acts.length)]();
    } finally {
      _showing = false;
      _quietSince = DateTime.now();
      if (mounted) setState(() => _mood = Mood.happy);
    }
  }

  void _float(String? art, {double size = 72, int seconds = 9, bool sideways = false, VoidCallback? onPop}) {
    final id = _floatId++;
    setState(() {
      _floaters[id] = Floater(
        key: ValueKey('f$id'),
        art: art,
        size: size,
        seconds: seconds,
        sideways: sideways,
        startX: _r.nextDouble(),
        onPop: () {
          _quietSince = DateTime.now();
          if (mounted) setState(() => _bounce++);
          onPop?.call();
        },
        onGone: () {
          if (mounted) setState(() => _floaters.remove(id));
        },
      );
    });
  }

  Future<void> _wait(int ms) => Future.delayed(Duration(milliseconds: ms));

  Future<void> _balloons() async {
    Sfx.whoosh();
    for (var i = 0; i < 4; i++) {
      _float('balloon', size: 64 + _r.nextDouble() * 24, seconds: 8 + _r.nextInt(3), onPop: () {
        if (mounted) setState(() => _mood = Mood.cheer);
      });
      if (i == 0) {
        await _say('Look! A balloon! Pop it!', mood: Mood.wow);
      } else {
        await _wait(700);
      }
    }
  }

  Future<void> _bubbles() async {
    for (var i = 0; i < 8; i++) {
      _float(null, size: 34 + _r.nextDouble() * 40, seconds: 7 + _r.nextInt(4), onPop: () {
        if (mounted) setState(() => _mood = Mood.laugh);
      });
      if (i == 1) {
        await _say('Wheee! Bubbles! Pop pop pop!', mood: Mood.laugh);
      } else {
        await _wait(350);
      }
    }
  }

  Future<void> _critters() async {
    Sfx.zip();
    _float(_r.nextBool() ? 'ladybird' : 'chick', size: 58, seconds: 7, sideways: true, onPop: () {
      Sfx.giggle();
      _say('Hee hee! That tickles!', mood: Mood.laugh);
    });
    setState(() => _mood = Mood.wow);
    await _say(_r.nextBool() ? 'Ooh, shiny!' : 'So cool!', mood: Mood.wow);
    await _wait(1500);
  }

  Future<void> _present() async {
    Sfx.sparkle();
    _float('present', size: 84, seconds: 10, sideways: true, onPop: () {
      app.addStars(1);
      Sfx.star();
      celebrate(context, count: 36);
      _say('Wow wow wow!', mood: Mood.wow);
    });
    await _say("Ooh, a present! What's inside?", mood: Mood.wow);
    await _wait(1200);
  }

  Future<void> _dance() async {
    Sfx.tada();
    await _say(_r.nextBool() ? 'Dance with me and my friends!' : 'Come on, friends! Let\'s dance!', mood: Mood.dance);
    if (!mounted || _away) return;
    // A real song: everybody dances and the words appear as they are sung.
    final pool = songs.where((x) => x.id != 'goodnight' && (x.more.isNotEmpty || Random().nextInt(3) == 0)).toList();
    final song = pool[_r.nextInt(pool.length)];
    var dancing = true;
    final sub = Music.songPosition.listen((p) {
      final ms = p.inMilliseconds;
      String? words;
      for (final l in song.timeline) {
        if (ms >= l.startMs - 150) words = l.text;
      }
      if (words != null && words != _line && mounted) setState(() => _line = words!);
    });
    final playing = Music.song(song.id, length: const Duration(seconds: 25)).whenComplete(() => dancing = false);
    const moves = [Mood.dance, Mood.cheer, Mood.laugh, Mood.wave, Mood.dance, Mood.wow];
    for (var i = 0; dancing && mounted && !_away; i++) {
      setState(() {
        _mood = moves[i % moves.length];
        _bounce++;
        for (final f in _onStage) {
          _pose[f.id] = i.isEven ? 'cheer' : 'laugh';
          _react[f.id] = (_react[f.id] ?? 0) + 1;
        }
      });
      if (i % 8 == 3) Sfx.clap();
      await _wait(400);
    }
    await Music.stopSong();
    await playing;
    await sub.cancel();
    if (!mounted) return;
    setState(() => _pose.clear());
    if (!_away) await _say('You are a super dancer!', mood: Mood.cheer);
  }


  static const _jokes = [
    "Why did the banana go to the doctor? Because it wasn't peeling well! Hee hee!",
    'What do you call a sleeping dinosaur? A dino-snore!',
    'What do you call a bear with no teeth? A gummy bear! Hee hee!',
    'Why are fish so clever? Because they live in schools!',
    'What did one plate say to the other? Lunch is on me!',
  ];

  Future<void> _joke() async {
    await _say(Lines.pick('home-joke', _jokes), mood: Mood.laugh);
    if (!mounted) return;
    Sfx.giggle();
    setState(() {
      _bounce++;
      for (final f in _onStage) {
        _pose[f.id] = 'laugh';
        _react[f.id] = (_react[f.id] ?? 0) + 1;
      }
    });
    await _wait(900);
    if (mounted) setState(() => _pose.clear());
  }

  Future<void> _peekaboo() async {
    Sfx.whoosh();
    setState(() => _hidden = true);
    await _say('Can you find me?', mood: Mood.laugh);
    await _wait(900);
    if (!mounted) return;
    Sfx.boing();
    setState(() {
      _hidden = false;
      _bounce++;
    });
    await _say('Peekaboo!', mood: Mood.laugh);
  }

  Future<void> _callChild() async {
    setState(() => _wiggle++);
    final lines = [
      'Hey! Come and play with me!',
      "Tap a game and let's play!",
      "I'm so happy you're here!",
      "Knock knock! It's me!",
      'Shake shake shake!',
    ];
    final l = Lines.pick('call-child', lines);
    setState(() => _bounce++);
    await _say(l, mood: l.startsWith('Shake') ? Mood.dance : Mood.wave);
  }

  Future<void> _friendChat() async {
    // Now and then a different friend comes over to say hello.
    final met = app.metFriends;
    if (met.length > _onStage.length && _r.nextInt(3) == 0) {
      final newcomer = met.where((f) => !_onStage.contains(f)).toList()..shuffle(_r);
      setState(() {
        _onStage = [..._onStage.skip(_onStage.length >= 2 ? 1 : 0), newcomer.first];
      });
      Sfx.whoosh();
      await _wait(600);
    }
    if (!mounted || _onStage.isEmpty) return;
    final f = _onStage[_r.nextInt(_onStage.length)];
    await _friendSays(f, f.nextLine(_r), pose: _r.nextBool() ? 'cheer' : 'laugh');
    if (!mounted) return;
    Sfx.giggle();
    setState(() {
      _mood = Mood.laugh;
      _bounce++;
    });
    await _wait(700);
  }

  Future<void> _friendSays(Friend f, String line, {String pose = 'cheer'}) async {
    if (!mounted) return;
    setState(() {
      _pose[f.id] = pose;
      _react[f.id] = (_react[f.id] ?? 0) + 1;
      _line = line;
    });
    _speaking = true;
    await Voice.say(line).timeout(const Duration(seconds: 12), onTimeout: () {});
    _speaking = false;
    _quietSince = DateTime.now();
    if (mounted) setState(() => _pose.remove(f.id));
  }

  void _tapFriend(Friend f) {
    if (_speaking || Voice.speaking) return;
    _quietSince = DateTime.now();
    _friendSays(f, f.nextLine(_r), pose: 'laugh');
  }

  /// A brand new friend moves into the meadow, with a party.
  Future<void> _friendArrives(Friend f) async {
    await _say('Guess what? A new friend is coming to visit!', mood: Mood.wow);
    if (!mounted) return;
    Sfx.tada();
    setState(() => _arriving = f);
    celebrate(context, count: 60);
    await _wait(700);
    if (!mounted) return;
    _speaking = true;
    await Voice.say(f.hello).timeout(const Duration(seconds: 12), onTimeout: () {});
    _speaking = false;
    if (!mounted) return;
    Sfx.applause();
    await _say('Say hello to my new friend!', mood: Mood.cheer);
    app.meet(f);
    if (!mounted) return;
    setState(() {
      _arriving = null;
      _onStage = [f, ..._onStage.where((o) => o != f)].take(2).toList();
    });
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
                              builder: (_, box) => AnimatedScale(
                                scale: _hidden ? 0 : 1,
                                duration: const Duration(milliseconds: 350),
                                curve: _hidden ? Curves.easeInBack : Curves.elasticOut,
                                child: Bibi(
                                  mood: _mood,
                                  size: min(box.maxHeight * .82, 280),
                                  bounce: _bounce,
                                  onTap: _tapBibi,
                                ),
                              ),
                            ),
                            for (var i = 0; i < _onStage.length; i++)
                              Positioned(
                                key: ValueKey('stage-${_onStage[i].id}'),
                                top: 4,
                                left: i == 0 ? 0 : null,
                                right: i == 1 ? 0 : null,
                                child: _EnterHop(
                                  fromLeft: i == 0,
                                  child: FriendSprite(
                                    friend: _onStage[i],
                                    size: 92,
                                    pose: _pose[_onStage[i].id] ?? 'happy',
                                    react: _react[_onStage[i].id] ?? 0,
                                    onTap: () => _tapFriend(_onStage[i]),
                                  ),
                                ),
                              ),
                            Positioned(
                              left: 0,
                              bottom: 12,
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [_stickerButton(), const SizedBox(height: 10), _letterbox()],
                              ),
                            ),
                            Positioned(
                              right: 0,
                              bottom: 128,
                              child: _SingButton(onTap: () {
                                Voice.say('Songs!');
                                _open(const SongsScreen());
                              }),
                            ),
                            Positioned(right: 0, bottom: 12, child: _TalkButton(onTap: () {
                              Voice.say("Talk to me! I'll copy you!");
                              _open(const TalkScreen());
                            })),
                          ],
                        ),
                      ),
                      if (_hugAsk != null) _hugButtons() else _gameGrid(),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
                for (final f in _floaters.values) Positioned.fill(child: f),
                if (_arriving != null) _arrival(_arriving!),
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
            Text(
              app.stageName,
              style: T.b(
                13,
                color: night ? Colors.white70 : C.inkSoft,
                w: FontWeight.w800,
              ),
            ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            height: 18,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .7),
              borderRadius: BorderRadius.circular(99),
            ),
            child: Align(
              alignment: Alignment.centerLeft,
              child: AnimatedFractionallySizedBox(
                duration: const Duration(milliseconds: 700),
                curve: Curves.easeOutBack,
                widthFactor: max(.06, app.stageProgress),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [C.leaf, Color(0xFF9BE36A)],
                    ),
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
          decoration: BoxDecoration(
            color: C.paper,
            borderRadius: BorderRadius.circular(99),
            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 3))],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.star_rounded, color: C.sun, size: 24),
              const SizedBox(width: 2),
              Text('${app.stars}', style: T.d(20)),
            ],
          ),
        ),
        const SizedBox(width: 8),
        GestureDetector(
          onTap: _grownUps,
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .6),
              shape: BoxShape.circle,
            ),
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
            Voice.say(
              waiting
                  ? 'Your letterbox! Something is waiting inside!'
                  : 'Your letterbox!',
            );
            _open(const LetterboxScreen());
          },
          child: const Art('letterbox', size: 50),
        ),
        if (waiting) const Positioned(right: -4, top: -4, child: GlowDot()),
      ],
    );
  }

  Widget _stickerButton() => Chunky(
        color: C.paper,
        shadow: C.shadow,
        radius: 22,
        padding: const EdgeInsets.all(8),
        onTap: () {
          Voice.say('Your sticker album!');
          _open(const StickerAlbum());
        },
        child: const Art('album', size: 42),
      );

  Widget _gameGrid() {
    final tiles = <Widget>[
      for (final g in _games)
        _tile(
          g.art,
          g.name.replaceAll('{creature}', _cname),
          g.color,
          g.shadow,
          app.levelOf(g.id),
          () {
            Voice.say(g.name.startsWith('Teach') ? 'Teach me!' : (g.name.endsWith('!') ? g.name : '${g.name}!'));
            _open(g.build(), isGame: true);
          },
        ),
    ];
    return TweenAnimationBuilder<double>(
      key: ValueKey('wiggle$_wiggle'),
      tween: Tween(begin: _wiggle == 0 ? 1 : 0, end: 1),
      duration: const Duration(milliseconds: 900),
      builder: (_, v, c) => Transform.rotate(angle: sin(v * pi * 6) * (1 - v) * .05, child: Transform.scale(scale: 1 + sin(v * pi) * .04, child: c)),
      child: _grid(tiles),
    );
  }

  Widget _grid(List<Widget> tiles) {
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

  Widget _tile(
    String art,
    String name,
    Color color,
    Color shadow,
    int level,
    VoidCallback onTap,
  ) => Stack(clipBehavior: Clip.none, children: [
    Positioned.fill(child: Chunky(
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
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Art(art, size: 50),
        Text(name, textAlign: TextAlign.center, maxLines: 2, style: T.d(14)),
      ],
    ),
  )),
    Positioned(
      right: -4,
      top: -6,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
        decoration: BoxDecoration(
          color: C.sun,
          borderRadius: BorderRadius.circular(99),
          border: Border.all(color: Colors.white, width: 2),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          const Icon(Icons.star_rounded, color: Colors.white, size: 14),
          Text(level > 7 ? '★' : '$level', style: T.d(13, color: Colors.white)),
        ]),
      ),
    ),
  ]);

  Widget _arrival(Friend f) => Positioned.fill(
        child: Container(
          color: const Color(0x552A2152),
          alignment: Alignment.center,
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 1100),
            curve: Curves.elasticOut,
            builder: (_, v, c) => Transform.scale(scale: v, child: c),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(colors: [Colors.white, f.color.withValues(alpha: .5), f.color.withValues(alpha: 0)]),
                ),
                child: FriendSprite(friend: f, size: 220, pose: 'cheer'),
              ),
              Text(f.name, style: T.d(54, color: Colors.white).copyWith(shadows: [Shadow(color: f.color, blurRadius: 18), const Shadow(color: C.shadow, blurRadius: 6)])),
            ]),
          ),
        ),
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
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('🤗', style: TextStyle(fontSize: 30)),
              SizedBox(width: 8),
              Text('Send a hug'),
            ],
          ),
        ),
        Chunky(
          color: C.paper,
          shadow: C.shadow,
          onTap: () => _answerHug(false),
          child: const Text('Not now'),
        ),
      ],
    ),
  );

  Widget _feelings() {
    const faces = [
      ('cheer', 'Happy', 'happy'),
      ('sad', 'Sad', 'sad'),
      ('sleepy', 'Tired', 'tired'),
      ('puzzled', 'Worried', 'worried'),
    ];
    return Positioned.fill(
      child: Container(
        color: const Color(0x552A2152),
        alignment: Alignment.bottomCenter,
        padding: const EdgeInsets.all(16),
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: 1),
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeOutBack,
          builder: (_, v, c) =>
              Transform.translate(offset: Offset(0, (1 - v) * 200), child: c),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: C.paper,
              borderRadius: BorderRadius.circular(30),
              boxShadow: const [
                BoxShadow(color: C.shadow, offset: Offset(0, 8)),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
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
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Image.asset(
                                  'assets/bibi/${f.$1}.webp',
                                  width: 62,
                                  height: 62,
                                ),
                                Text(f.$2, style: T.d(15)),
                              ],
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
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

/// A big, happy, pulsing microphone: "Talk to me!"
class _TalkButton extends StatefulWidget {
  const _TalkButton({required this.onTap});
  final VoidCallback onTap;

  @override
  State<_TalkButton> createState() => _TalkButtonState();
}

class _TalkButtonState extends State<_TalkButton> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: () {
          Sfx.pop();
          widget.onTap();
        },
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, c) => Transform.scale(scale: 1 + _c.value * .08, child: c),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(
              width: 76,
              height: 76,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [C.berry, C.peach]),
                border: Border.all(color: Colors.white, width: 5),
                boxShadow: [BoxShadow(color: C.berry.withValues(alpha: .5), blurRadius: 16, spreadRadius: 2)],
              ),
              child: const Icon(Icons.mic_rounded, color: Colors.white, size: 40),
            ),
            const SizedBox(height: 2),
            Text('Talk!', style: T.d(20, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
          ]),
        ),
      );
}

/// A friend hops into the meadow from the side.
class _EnterHop extends StatelessWidget {
  const _EnterHop({required this.fromLeft, required this.child});
  final bool fromLeft;
  final Widget child;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: const Duration(milliseconds: 900),
        curve: Curves.easeOutCubic,
        builder: (_, v, c) => Transform.translate(
          offset: Offset((1 - v) * (fromLeft ? -140 : 140), -sin(v * pi * 3) * (1 - v) * 40),
          child: c,
        ),
        child: child,
      );
}

/// A dancing music note: "Let's sing!"
class _SingButton extends StatefulWidget {
  const _SingButton({required this.onTap});
  final VoidCallback onTap;

  @override
  State<_SingButton> createState() => _SingButtonState();
}

class _SingButtonState extends State<_SingButton> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 700))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: () {
          Sfx.pop();
          widget.onTap();
        },
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, c) => Transform.rotate(angle: (_c.value - .5) * .3, child: c),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [C.lilac, C.aqua]),
                border: Border.all(color: Colors.white, width: 5),
                boxShadow: [BoxShadow(color: C.lilac.withValues(alpha: .5), blurRadius: 16, spreadRadius: 2)],
              ),
              child: const Icon(Icons.music_note_rounded, color: Colors.white, size: 40),
            ),
            Text('Sing!', style: T.d(18, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
          ]),
        ),
      );
}
