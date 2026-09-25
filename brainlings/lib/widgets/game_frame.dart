import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

import '../friends.dart';
import '../services/music.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import 'art.dart';
import 'bibi.dart';
import 'juice.dart';
import 'sky.dart';
import 'ui.dart';

/// The shared layout for every game: back button, round dots,
/// Bibi with a speech bubble, then the game itself. Plays the game music,
/// and if the child goes quiet for a while Bibi gives a friendly nudge.
class GameFrame extends StatefulWidget {
  const GameFrame({
    super.key,
    required this.round,
    required this.total,
    required this.line,
    required this.mood,
    required this.body,
    this.bounce = 0,
    this.wobble = 0,
    this.bibiSize = 150,
    this.scene,
    this.showBibi = true,
    this.onIdle,
    this.host,
    this.level,
    this.quiet = false,
  });

  final int round;
  final int total;
  final String line;
  final Mood mood;
  final Widget body;
  final int bounce;
  final int wobble;
  final double bibiSize;
  final String? scene;
  final bool showBibi;

  /// Called after a quiet spell. Defaults to a gentle "Your turn!".
  final VoidCallback? onIdle;

  /// The friend who hosts this game and cheers along.
  final String? host;

  /// Which level of this game is being played (shown as a star badge).
  final int? level;

  /// No nudges at all (Say It: Bibi is listening, nobody may talk).
  final bool quiet;

  @override
  State<GameFrame> createState() => _GameFrameState();
}

class _GameFrameState extends State<GameFrame> {
  static const _nudges = ['Psst! Over here!', 'Your turn! Tap one!', 'Come on, you can do it!'];
  DateTime _lastTouch = DateTime.now();
  Timer? _idle;
  int _nudge = 0;
  int _wiggle = 0;

  @override
  void initState() {
    super.initState();
    Music.play('games');
    Juice.resetStreak();
    GameHost.current = widget.host == null ? null : friendById(widget.host!);
    _idle = Timer.periodic(const Duration(seconds: 2), (_) {
      // Never talk over anyone: not while a voice is speaking, not during a
      // dance party on top of the game, and never while Bibi is listening.
      final onTop = mounted && (ModalRoute.of(context)?.isCurrent ?? true);
      if (widget.quiet || !onTop || Voice.speaking) {
        _lastTouch = DateTime.now();
        return;
      }
      if (DateTime.now().difference(_lastTouch).inSeconds < 9) return;
      _lastTouch = DateTime.now();
      if (GameHost.current != null && _nudge.isOdd) {
        _nudge++;
        Voice.say(GameHost.nudge());
      } else if (widget.onIdle != null) {
        _nudge++;
        widget.onIdle!();
      } else {
        setState(() => _wiggle++);
        Sfx.boing();
        Voice.say(_nudges[_nudge++ % _nudges.length]);
      }
    });
  }

  @override
  void dispose() {
    _idle?.cancel();
    GameHost.current = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerDown: (_) => _lastTouch = DateTime.now(),
      child: Scaffold(
        body: Meadow(
          scene: widget.scene,
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      RoundIcon(
                        icon: Icons.arrow_back_rounded,
                        label: 'Back home',
                        onTap: () {
                          Voice.stop();
                          Navigator.of(context).pop();
                        },
                      ),
                      if (widget.level != null) ...[
                        const SizedBox(width: 8),
                        _LevelBadge(level: widget.level!),
                      ],
                      const Spacer(),
                      if (GameHost.current != null)
                        ValueListenableBuilder<(int, String)>(
                          valueListenable: GameHost.react,
                          builder: (_, r, _) => FriendSprite(
                            friend: GameHost.current!,
                            size: 66,
                            pose: r.$2,
                            react: r.$1,
                            onTap: () {
                              if (Voice.speaking) return;
                              final h = GameHost.current!;
                              Voice.say(_nudge == 0 ? h.hello : h.nextLine(Random()));
                              _nudge++;
                            },
                          ),
                        ),
                      const SizedBox(width: 6),
                      RoundDots(total: widget.total, done: widget.round),
                    ],
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      if (widget.showBibi)
                        Bibi(
                          mood: widget.mood,
                          size: widget.bibiSize,
                          bounce: widget.bounce,
                          wobble: widget.wobble + _wiggle,
                          onTap: () => Voice.say(widget.line),
                        ),
                      Expanded(child: Padding(padding: EdgeInsets.only(top: widget.showBibi ? 0 : 8), child: Bubble(widget.line, size: 20))),
                    ],
                  ),
                  Expanded(child: widget.body),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Every sticker in the album is one of the painted pictures.
const stickerPool = [
  'lion',
  'octopus',
  'rainbow',
  'zebra',
  'monkey',
  'turtle',
  'cupcake',
  'lolly',
  'ladybird',
  'chick',
  'cat',
  'dog',
  'bear',
  'pig',
  'gorilla',
  'fish',
  'star',
  'sunflower',
  'present',
  'donut',
  'balloon',
  'strawberry',
  'mushroom',
  'sun',
];

/// Shown when a game is finished: stars, a sticker, and a very proud creature.
class RewardScreen extends StatefulWidget {
  const RewardScreen({
    super.key,
    required this.skill,
    required this.gameName,
    this.stars = 2,
    this.newLevel = false,
  });

  final Skill skill;
  final String gameName;
  final int stars;
  final bool newLevel;

  @override
  State<RewardScreen> createState() => _RewardScreenState();
}

class _RewardScreenState extends State<RewardScreen> {
  String? _sticker;
  int _bounce = 0;
  final int _cheer = Random().nextInt(4);

  @override
  void initState() {
    super.initState();
    app.addStars(widget.stars);
    final left = stickerPool.where((s) => !app.stickers.contains(s)).toList();
    if (left.isNotEmpty) {
      _sticker = left[Random().nextInt(left.length)];
      app.addSticker(_sticker!);
    }
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      celebrate(context, count: 90);
      Sfx.star();
      Sfx.applause();
      Juice.bigWord(context, 'AMAZING!');
      setState(() => _bounce++);
      await Voice.say(_line);
    });
  }

  String get _line {
    const cheers = [
      'You did it! You are a superstar!',
      'Wow! My brain feels so much bigger now!',
      'Hooray! You are the best teacher in the whole world!',
      'Amazing! I\'m growing because of you!',
    ];
    final c = cheers[_cheer];
    final level = widget.newLevel ? '|Hooray! You unlocked a new level!|Next time, something new is waiting!' : '';
    // The child's name only for the big moments, not after every game.
    final name = widget.newLevel ? '{name}!|' : '';
    return _sticker == null
        ? '$name$c$level'
        : '$name$c|And look, a new sticker for your album!$level';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Bubble(_line),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 300,
                    child: Scene(
                      'dance',
                      loop: true,
                      placeholder: Bibi(
                        mood: Mood.dance,
                        size: 200,
                        bounce: _bounce,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (var i = 0; i < widget.stars; i++)
                        TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: 1),
                          duration: Duration(milliseconds: 600 + i * 250),
                          curve: Curves.elasticOut,
                          builder: (_, v, c) =>
                              Transform.scale(scale: v, child: c),
                          child: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 4),
                            child: Icon(
                              Icons.star_rounded,
                              color: C.sun,
                              size: 64,
                              shadows: [
                                Shadow(color: C.sunDeep, offset: Offset(0, 3)),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                  if (_sticker != null)
                    TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: 1),
                      duration: const Duration(milliseconds: 1200),
                      curve: Curves.elasticOut,
                      builder: (_, v, c) => Transform.rotate(
                        angle: (1 - v) * 2,
                        child: Transform.scale(scale: v, child: c),
                      ),
                      child: Container(
                        margin: const EdgeInsets.only(top: 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: C.sun, width: 5),
                          boxShadow: const [
                            BoxShadow(color: C.shadow, offset: Offset(0, 5)),
                          ],
                        ),
                        child: Art(_sticker!, size: 70),
                      ),
                    ),
                  const SizedBox(height: 24),
                  Chunky(
                    color: C.leaf,
                    shadow: C.leafDeep,
                    onTap: () {
                      Voice.stop();
                      Navigator.of(context).pop();
                    },
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.home_rounded, color: Colors.white, size: 30),
                        SizedBox(width: 8),
                        Text('Back home'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Replace the current game with its reward screen. With a [game] id the
/// game moves on to its next level, so next time something new is waiting.
void finishGame(BuildContext context, Skill skill, String name, {String? game, int maxLevel = 7}) {
  final unlocked = game != null && app.levelUp(game, maxLevel);
  Navigator.of(context)
      .pushReplacement(softRoute(RewardScreen(skill: skill, gameName: name, newLevel: unlocked)));
}

/// "Level two!" and friends, spoken at the start of a game.
String levelLine(int level) => level > 7 ? 'Super level!' : const ['', 'Level one!', 'Level two!', 'Level three!', 'Level four!', 'Level five!', 'Level six!', 'Level seven!'][level];

/// Which kind of round to play: the level itself, or a surprise mix once
/// every level has been finished.
int levelMode(int level, int maxLevel, Random r) => level <= maxLevel ? level : 1 + r.nextInt(maxLevel);

class _LevelBadge extends StatelessWidget {
  const _LevelBadge({required this.level});
  final int level;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: () => Voice.say(levelLine(level)),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [C.sun, Color(0xFFFFB84D)]),
            borderRadius: BorderRadius.circular(99),
            border: Border.all(color: Colors.white, width: 3),
            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 3))],
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.star_rounded, color: Colors.white, size: 22),
            Text(level > 7 ? '★' : '$level', style: T.d(20, color: Colors.white)),
          ]),
        ),
      );
}

/// Friendly words for small numbers, so Bibi counts out loud nicely.
const numberWords = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
const numberWordsCap = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

String yayLine(Random r) => const [
  'Yes! Brilliant!',
  'You got it!',
  'Woohoo! Well done!',
  'Super clever!',
  'Yay! That\'s right!',
][r.nextInt(5)];
