import 'dart:math';

import 'package:flutter/material.dart';

import 'state.dart';

/// The Brainlings gang: Bibi's friends. Each has a look, a voice and a
/// personality, hosts a game, and moves into the meadow as the child plays.
class Friend {
  const Friend({
    required this.id,
    required this.name,
    required this.color,
    required this.hello,
    required this.cheers,
    required this.giggle,
    required this.fun,
    required this.oops,
    required this.more,
  });

  final String id;
  final String name;
  final Color color;
  final String hello;
  final List<String> cheers;
  final String giggle;
  final String fun;
  final String oops;

  /// Extra chatter, so a friend never says the same thing again and again.
  final List<String> more;

  String image(String pose) => 'assets/friends/${id}_$pose.webp';

  List<String> get _all => [giggle, fun, ...more, ...cheers];

  /// The next thing to say. Goes through every line before any repeats.
  String nextLine(Random r) {
    final bag = _bags[id] ??= [];
    if (bag.isEmpty) bag.addAll(_all..shuffle(r));
    return bag.removeLast();
  }

  static final _bags = <String, List<String>>{};
}

const friends = [
  Friend(
    id: 'pip',
    name: 'Pip',
    color: Color(0xFF7CC0F5),
    hello: "Hi hi! I'm Pip! I count everything!",
    cheers: ['One, two, three, hooray!', 'Hop hop yay!'],
    giggle: 'My ears are tickly!',
    fun: 'Count with me!',
    oops: 'Hop and try again!',
    more: [
      "Boing! I'm a bouncy bunny!",
      "I counted all the carrots! Ten!",
      "Let's hop together!",
      "Wiggle your nose like me!",
      "Carrots make me super fast!",
      "Can you count to five? One, two, three, four, five!",
    ],
  ),
  Friend(
    id: 'momo',
    name: 'Momo',
    color: Color(0xFFB69CFF),
    hello: "Hoo hoo! I'm Momo. I love letters!",
    cheers: ['Hoo-ray! Wonderful!', "Twit twoo! You're so clever!"],
    giggle: 'Hee hee, my glasses are wobbly!',
    fun: "Let's read together!",
    oops: 'Hoo hoo, try again!',
    more: [
      "Books are my favourite thing!",
      "A is for amazing!",
      "Who who? You, you!",
      "I read a story about a dragon!",
      "Let's sing the alphabet!",
      "My feathers are so fluffy!",
    ],
  ),
  Friend(
    id: 'tiko',
    name: 'Tiko',
    color: Color(0xFFFF9E5A),
    hello: "Hi! I'm Tiko! I build things! Stomp stomp!",
    cheers: ['Roarrr-some!', 'Great building!'],
    giggle: 'Oops! I dropped my hammer again!',
    fun: 'Stomp stomp! Hee hee!',
    oops: 'Uh oh, wobbly! Try again!',
    more: [
      "I built a tower taller than me!",
      "Crash! Oops, my tower fell!",
      "Big feet, big stomps!",
      "Let's build a rocket!",
      "I love squares and triangles!",
      "Rawr! That's my happy roar!",
    ],
  ),
  Friend(
    id: 'lulu',
    name: 'Lulu',
    color: Color(0xFFFF8FB8),
    hello: "Hello! I'm Lulu! Let's party!",
    cheers: ['Sparkle sparkle! Yay!', 'Party party party!'],
    giggle: 'Hee hee, that tickles my fluff!',
    fun: 'Wheee! Rainbows!',
    oops: 'Oopsie daisy! Try again!',
    more: [
      "Twirl and spin with me!",
      "I love glitter and sparkles!",
      "Let's have a disco!",
      "Clap your hands! Clap clap!",
      "Rainbows are my favourite colour!",
      "Party hats for everyone!",
    ],
  ),
  Friend(
    id: 'gogo',
    name: 'Gogo',
    color: Color(0xFF8CCB4B),
    hello: "Ribbit! I'm Gogo! Let's make some noise!",
    cheers: ['Ribbit ribbit hooray!', 'Big frog high five!'],
    giggle: 'Blub blub! Bubble burp!',
    fun: 'Boing boing boing!',
    oops: 'Ribbit? Try again!',
    more: [
      "Jump like a frog! Boing!",
      "I can catch flies with my tongue!",
      "Splish splash! I love puddles!",
      "Say it loud! Ribbit!",
      "Croak croak! That means hello!",
      "Let's sing a silly song!",
    ],
  ),
];

Friend friendById(String id) => friends.firstWhere((f) => f.id == id);

/// A friend on screen: bobs gently, jumps into a new pose when poked.
/// Change [react] to make them cheer; set [pose] to 'cheer', 'laugh' or 'happy'.
class FriendSprite extends StatefulWidget {
  const FriendSprite({super.key, required this.friend, this.size = 110, this.pose = 'happy', this.react = 0, this.onTap});

  final Friend friend;
  final double size;
  final String pose;
  final int react;
  final VoidCallback? onTap;

  @override
  State<FriendSprite> createState() => _FriendSpriteState();
}

class _FriendSpriteState extends State<FriendSprite> with TickerProviderStateMixin {
  late final _idle = AnimationController(vsync: this, duration: Duration(milliseconds: 1500 + widget.friend.id.hashCode % 700))..repeat();
  late final _jump = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));

  @override
  void didUpdateWidget(FriendSprite old) {
    super.didUpdateWidget(old);
    if (old.react != widget.react) _jump.forward(from: 0);
  }

  @override
  void dispose() {
    _idle.dispose();
    _jump.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap == null
          ? null
          : () {
              _jump.forward(from: 0);
              widget.onTap!();
            },
      child: AnimatedBuilder(
        animation: Listenable.merge([_idle, _jump]),
        builder: (_, _) {
          final i = sin(_idle.value * 2 * pi);
          final j = _jump.isAnimating ? sin(_jump.value * pi) : 0.0;
          return Transform.translate(
            offset: Offset(0, -i * 4 - j * widget.size * .3),
            child: Transform.rotate(
              angle: i * .04 + (_jump.isAnimating ? sin(_jump.value * pi * 4) * .08 : 0),
              child: Transform.scale(
                scaleX: 1 + i * .02,
                scaleY: 1 - i * .02,
                alignment: Alignment.bottomCenter,
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 180),
                  child: Image.asset(widget.friend.image(widget.pose), key: ValueKey(widget.pose), width: widget.size, height: widget.size, gaplessPlayback: true),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

/// Which friends have moved into the meadow. The first arrives after the
/// first game; then a new friend comes on each new day of play.
extension FriendUnlocks on AppState {
  List<Friend> get metFriends => friends.where((f) => friendsMet.contains(f.id)).toList();

  /// The friend who should arrive now, if any.
  Friend? get arrivingFriend {
    if (friendsMet.length >= friends.length) return null;
    final today = AppState.dayKey();
    if (friendsMet.isEmpty) return totalPoints > 0 ? friends.first : null;
    if (lastFriendDay == today) return null;
    return friends[friendsMet.length];
  }

  void meet(Friend f) {
    if (!friendsMet.contains(f.id)) friendsMet.add(f.id);
    lastFriendDay = AppState.dayKey();
    save();
  }
}

/// The friend hosting the game on screen right now. Cheers and giggles
/// from the game go through here so the host joins in.
class GameHost {
  static Friend? current;
  static final _r = Random();

  /// Bumps each time the host should jump; the value is the pose.
  static final react = ValueNotifier<(int, String)>((0, 'happy'));

  static void _jump(String pose) => react.value = (react.value.$1 + 1, pose);

  /// Sometimes the host adds its own cheer after Bibi's.
  static int _since = 0;

  /// The host jumps for joy every time, but only speaks up now and then,
  /// so Bibi is never drowned out.
  static String cheer(String line) {
    final h = current;
    if (h == null) return line;
    _jump('cheer');
    _since++;
    if (_since < 3 || _r.nextInt(3) != 0) return line;
    _since = 0;
    return '$line|${h.cheers[_r.nextInt(h.cheers.length)]}';
  }

  static String oops(String line) {
    final h = current;
    if (h == null) return line;
    _jump('laugh');
    return _r.nextInt(5) == 0 ? h.oops : line;
  }

  static String nudge() {
    final h = current!;
    _jump('cheer');
    return h.nextLine(_r);
  }
}
