import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import 'art.dart';
import 'bibi.dart';
import 'sky.dart';
import 'ui.dart';

/// The shared layout for every game: back button, round dots,
/// Bibi with a speech bubble, then the game itself.
class GameFrame extends StatelessWidget {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        scene: scene,
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
                    const Spacer(),
                    RoundDots(total: total, done: round),
                  ],
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Bibi(
                      mood: mood,
                      size: bibiSize,
                      bounce: bounce,
                      wobble: wobble,
                      onTap: () => Voice.say(line),
                    ),
                    Expanded(child: Bubble(line, size: 20)),
                  ],
                ),
                Expanded(child: body),
              ],
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
  });

  final Skill skill;
  final String gameName;
  final int stars;

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
    return _sticker == null
        ? '{name}!|$c'
        : '{name}!|$c|And look, a new sticker for your album!';
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

/// Replace the current game with its reward screen.
void finishGame(BuildContext context, Skill skill, String name) {
  Navigator.of(context)
      .pushReplacement(softRoute(RewardScreen(skill: skill, gameName: name)));
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
