import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../friends.dart';
import '../games/shape_builder.dart';
import '../services/music.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../songs.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/juice.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

/// Sing and Dance: Bibi's own songs, sung by Bibi and the gang.
/// Pick a song, the words light up as they are sung, and everybody dances.
class SongsScreen extends StatefulWidget {
  const SongsScreen({super.key});

  @override
  State<SongsScreen> createState() => _SongsScreenState();
}

class _SongsScreenState extends State<SongsScreen> {
  @override
  void initState() {
    super.initState();
    Music.pause();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => Voice.say('Pick a song and let\'s dance!'),
    );
  }

  @override
  void dispose() {
    Music.resume();
    super.dispose();
  }

  Future<void> _play(Song s) async {
    Sfx.pop();
    await Voice.say('${s.title}!');
    if (!mounted) return;
    await Navigator.of(context).push(softRoute(SongPlayer(song: s)));
  }

  @override
  Widget build(BuildContext context) {
    final list = songs
        .where((s) => s.id != 'goodnight' || skyNow() != SkyTime.day)
        .toList();
    return Scaffold(
      body: Meadow(
        scene: 'party',
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
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Bubble("Pick a song and let's dance!", size: 20),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.05,
                    children: [
                      for (var i = 0; i < list.length; i++)
                        _SongCard(
                          song: list[i],
                          index: i,
                          onTap: () => _play(list[i]),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SongCard extends StatefulWidget {
  const _SongCard({
    required this.song,
    required this.index,
    required this.onTap,
  });
  final Song song;
  final int index;
  final VoidCallback onTap;

  @override
  State<_SongCard> createState() => _SongCardState();
}

class _SongCardState extends State<_SongCard>
    with SingleTickerProviderStateMixin {
  late final _c = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: 900 + widget.index * 90),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  static const _colors = [C.berry, C.sun, C.aqua, C.lilac, C.peach, C.leaf];

  @override
  Widget build(BuildContext context) {
    final color = _colors[widget.index % _colors.length];
    return GestureDetector(
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _c,
        builder: (_, c) =>
            Transform.rotate(angle: (_c.value - .5) * .06, child: c),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.white, color.withValues(alpha: .55)],
            ),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Colors.white, width: 5),
            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Art(widget.song.art, size: 76),
                  const Positioned(
                    right: -14,
                    top: -6,
                    child: Icon(
                      Icons.music_note_rounded,
                      color: C.berry,
                      size: 30,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                widget.song.title,
                textAlign: TextAlign.center,
                style: T.d(18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Plays one song: the music video, the words lighting up as they are
/// sung, and the whole gang dancing along at the bottom of the screen.
class SongPlayer extends StatefulWidget {
  const SongPlayer({super.key, required this.song, this.party = false});
  final Song song;

  /// A dance party in the middle of a game: it closes itself when the song ends.
  final bool party;

  @override
  State<SongPlayer> createState() => _SongPlayerState();
}

class _SongPlayerState extends State<SongPlayer> {
  late final VideoPlayerController _v = VideoPlayerController.asset(
    'assets/songs/${widget.song.id}.mp4',
  );
  bool _ready = false;
  bool _ended = false; // all the rounds are sung
  bool _restarting = false; // jumping back to the start for the next round
  int _plays = 0; // rounds finished
  int _line = -1;
  int _beat = 0;
  Timer? _dance;
  Timer? _safety;

  /// A song is sung several times in a row (about a minute), a little
  /// faster each time, so there is time to really dance.
  int get _rounds => widget.party ? 2 : 4;

  /// Between rounds Bibi calls the child by name and gets everyone going.
  static const _callouts = [
    'Faster! Faster!',
    'Jump up high!',
    'Spin around!',
    'Wave your arms!',
    'Clap along with me!',
    'Everybody dance!',
  ];
  int _callout = Random().nextInt(6);
  bool _calling = false;

  @override
  void initState() {
    super.initState();
    Music.pause();
    Voice.stop();
    _v.addListener(_tick);
    _v
        .initialize()
        .timeout(const Duration(seconds: 8))
        .then((_) {
          if (!mounted) return;
          _v.setVolume(1);
          setState(() => _ready = true);
          _startRound();
        })
        .catchError((_) {
          if (mounted) _finish();
        });
    _dance = Timer.periodic(const Duration(milliseconds: 480), (_) {
      if (mounted && !_ended) setState(() => _beat++);
    });
  }

  @override
  void dispose() {
    _dance?.cancel();
    _safety?.cancel();
    _v.removeListener(_tick);
    _v.dispose();
    Voice.stop();
    Music.resume();
    super.dispose();
  }

  /// Plays the song from the start. A safety timer makes sure a round
  /// always ends, even if the phone never reports the very last moment.
  Future<void> _startRound() async {
    _restarting = true;
    _safety?.cancel();
    await _v.seekTo(Duration.zero);
    // Each round a little quicker: the pitch stays the same, only faster.
    try {
      await _v.setPlaybackSpeed(1.08 + _plays * 0.07);
    } catch (_) {}
    await _v.play();
    if (!mounted) return;
    setState(() => _line = -1);
    // Only listen for the end once playback has really gone back to the start.
    Future.delayed(
      const Duration(milliseconds: 700),
      () => _restarting = false,
    );
    final d = _v.value.duration;
    _safety = Timer(d + const Duration(seconds: 3), _roundDone);
  }

  void _tick() {
    if (!_ready || _ended || _restarting) return;
    final v = _v.value;
    final ms = v.position.inMilliseconds;
    var line = -1;
    for (var i = 0; i < widget.song.lines.length; i++) {
      if (ms >= widget.song.lines[i].startMs - 150) line = i;
    }
    if (line != _line && mounted) setState(() => _line = line);
    final d = v.duration;
    final atEnd =
        d > Duration.zero &&
        v.position >= d - const Duration(milliseconds: 600);
    if (v.isCompleted || (atEnd && !v.isPlaying)) _roundDone();
  }

  void _roundDone() {
    if (_ended || _restarting || !mounted) return;
    _plays++;
    if (_plays < _rounds) {
      _nextRound();
    } else {
      _finish();
    }
  }

  /// A quick shout with the child's name, confetti, then the next round.
  Future<void> _nextRound() async {
    if (_calling) return;
    _calling = true;
    _restarting = true;
    _safety?.cancel();
    Sfx.sparkle();
    celebrate(context, count: 40);
    final shout = _callouts[_callout++ % _callouts.length];
    await Voice.say('{name}!|$shout')
        .timeout(const Duration(seconds: 6), onTimeout: () {});
    _calling = false;
    if (mounted && !_ended) _startRound();
  }

  Future<void> _finish() async {
    if (_ended) return;
    _ended = true;
    _safety?.cancel();
    if (!mounted) return;
    setState(() {});
    Sfx.applause();
    celebrate(context, count: 80);
    app.addStars(1);
    if (widget.party) {
      await Voice.say('You are a super dancer!');
      if (mounted) Navigator.of(context).pop();
    } else {
      await Voice.say(
        '{name}!|What a lovely dancer you are!|Shall we sing it again?',
      );
    }
  }

  Future<void> _again() async {
    Sfx.pop();
    await Voice.stop();
    await Voice.say("Let's sing it again!");
    if (!mounted) return;
    setState(() {
      _ended = false;
      _plays = 0;
    });
    _startRound();
  }

  Future<void> _another() async {
    Sfx.pop();
    await Voice.stop();
    await Voice.say("Okay! Let's pick another song!");
    if (mounted) Navigator.of(context).pop();
  }

  void _sparkle(TapDownDetails d) {
    Juice.starBurst(context, d.globalPosition, count: 10);
    Sfx.sparkle();
  }

  @override
  Widget build(BuildContext context) {
    final met = app.metFriends.isEmpty
        ? friends.take(3).toList()
        : app.metFriends;
    final pics = _line < 0 ? const <String>[] : widget.song.lines[_line].pics;
    // Disco lights: the room glows a new colour on every beat.
    const disco = [
      Color(0xFF3B1F7A),
      Color(0xFF7A1F5C),
      Color(0xFF1F4F7A),
      Color(0xFF1F7A5A),
      Color(0xFF7A4A1F),
    ];
    return Scaffold(
      backgroundColor: const Color(0xFF2A2152),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: _sparkle,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 420),
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(_beat.isEven ? -.6 : .6, -.4),
              radius: 1.3,
              colors: _ended
                  ? const [Color(0xFF2A2152), Color(0xFF2A2152)]
                  : [disco[_beat % disco.length], const Color(0xFF1A1236)],
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: Row(
                    children: [
                      RoundIcon(
                        icon: widget.party
                            ? Icons.close_rounded
                            : Icons.arrow_back_rounded,
                        label: 'Back',
                        onTap: () => Navigator.of(context).pop(),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          widget.song.title,
                          style: T.d(24, color: Colors.white),
                        ),
                      ),
                      // Which round we are on: one note per round
                      for (var i = 0; i < _rounds; i++)
                        Icon(
                          Icons.music_note_rounded,
                          size: 26,
                          color: i < _plays || (i == _plays && !_ended)
                              ? C.sun
                              : Colors.white24,
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                // The music video
                Expanded(
                  flex: 5,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(28),
                      child: _ready
                          ? FittedBox(
                              fit: BoxFit.cover,
                              clipBehavior: Clip.hardEdge,
                              child: SizedBox(
                                width: _v.value.size.width,
                                height: _v.value.size.height,
                                child: VideoPlayer(_v),
                              ),
                            )
                          : Container(
                              color: Colors.white12,
                              alignment: Alignment.center,
                              child: Bibi(
                                mood: Mood.dance,
                                size: 180,
                                bounce: _beat,
                              ),
                            ),
                    ),
                  ),
                ),
                // Pictures that show what the words mean
                SizedBox(
                  height: 84,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (c, a) => ScaleTransition(
                      scale: CurvedAnimation(
                        parent: a,
                        curve: Curves.elasticOut,
                      ),
                      child: c,
                    ),
                    child: Row(
                      key: ValueKey('p$_line$_plays'),
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        for (var i = 0; i < pics.length; i++)
                          _Dancer(
                            beat: _beat + i,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              child: SongPic(pics[i]),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
                // Karaoke words
                SizedBox(
                  height: 70,
                  child: Center(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      transitionBuilder: (c, a) =>
                          ScaleTransition(scale: a, child: c),
                      child: Padding(
                        key: ValueKey('w$_line$_plays'),
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: _line < 0
                            ? const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.music_note_rounded,
                                    color: C.sun,
                                    size: 40,
                                  ),
                                  Icon(
                                    Icons.music_note_rounded,
                                    color: Colors.white,
                                    size: 52,
                                  ),
                                  Icon(
                                    Icons.music_note_rounded,
                                    color: C.sun,
                                    size: 40,
                                  ),
                                ],
                              )
                            : Text(
                                widget.song.lines[_line].text,
                                textAlign: TextAlign.center,
                                style: T
                                    .d(
                                      24,
                                      color: const [
                                        C.sun,
                                        Colors.white,
                                        Color(0xFFFFB3D1),
                                        Color(0xFFA8F0E6),
                                      ][max(0, _line) % 4],
                                    )
                                    .copyWith(
                                      shadows: const [
                                        Shadow(
                                          color: Colors.black45,
                                          blurRadius: 8,
                                        ),
                                      ],
                                    ),
                              ),
                      ),
                    ),
                  ),
                ),
                // The gang dancing along
                SizedBox(
                  height: 110,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      for (var i = 0; i < met.length && i < 2; i++)
                        _Dancer(
                          beat: _beat + i,
                          child: FriendSprite(
                            friend: met[i],
                            size: 66,
                            pose: (_beat + i).isEven ? 'cheer' : 'laugh',
                          ),
                        ),
                      _Dancer(
                        beat: _beat + 1,
                        big: true,
                        child: Bibi(
                          mood: const [
                            Mood.dance,
                            Mood.cheer,
                            Mood.laugh,
                            Mood.wave,
                          ][_beat % 4],
                          size: 92,
                          bounce: _beat ~/ 2,
                        ),
                      ),
                      for (var i = 2; i < met.length && i < 4; i++)
                        _Dancer(
                          beat: _beat + i,
                          child: FriendSprite(
                            friend: met[i],
                            size: 66,
                            pose: (_beat + i).isEven ? 'laugh' : 'cheer',
                          ),
                        ),
                    ],
                  ),
                ),
                if (_ended && !widget.party)
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Chunky(
                          color: C.leaf,
                          shadow: C.leafDeep,
                          onTap: _again,
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.thumb_up_rounded,
                                color: Colors.white,
                                size: 30,
                              ),
                              SizedBox(width: 6),
                              Text('Yes!'),
                            ],
                          ),
                        ),
                        Chunky(
                          color: C.berry,
                          shadow: C.berryDeep,
                          onTap: _another,
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.library_music_rounded,
                                color: Colors.white,
                                size: 30,
                              ),
                              SizedBox(width: 6),
                              Text('New song'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// One picture for a song line (see [SongLine.pics]).
class SongPic extends StatelessWidget {
  const SongPic(this.pic, {super.key});
  final String pic;

  static const _moves = {
    'wave': Icons.waving_hand_rounded,
    'stomp': Icons.directions_walk_rounded,
    'clap': Icons.sign_language_rounded,
    'jump': Icons.accessibility_new_rounded,
    'spin': Icons.autorenew_rounded,
    'sit': Icons.event_seat_rounded,
    'knees': Icons.airline_seat_legroom_normal_rounded,
    'munch': Icons.restaurant_rounded,
    'dance': Icons.music_note_rounded,
    'wiggle': Icons.emoji_people_rounded,
    'nose': Icons.face_rounded,
    'left': Icons.arrow_back_rounded,
    'right': Icons.arrow_forward_rounded,
    'shake': Icons.vibration_rounded,
    'hooray': Icons.celebration_rounded,
    'moon': Icons.nightlight_round,
    'sleep': Icons.bedtime_rounded,
    'hug': Icons.favorite_rounded,
  };

  static const _colours = {
    'red': Color(0xFFFF4B4B),
    'yellow': Color(0xFFFFD233),
    'green': Color(0xFF5BC25B),
    'blue': Color(0xFF4DA3FF),
    'orange': Color(0xFFFF9E3D),
    'purple': Color(0xFFA06BFF),
    'pink': Color(0xFFFF8FC7),
  };

  @override
  Widget build(BuildContext context) {
    Widget bubble(Widget child, [Color color = Colors.white]) => Container(
      width: 72,
      height: 72,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 4),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8)],
      ),
      child: child,
    );
    final rest = pic.substring(1);
    switch (pic[0]) {
      case '#':
        final n = int.tryParse(rest);
        if (n != null) {
          return bubble(Text('$n', style: T.l(40, color: C.ink)), C.sun);
        }
        return bubble(
          Icon(_moves[rest] ?? Icons.star_rounded, size: 42, color: C.berry),
        );
      case '@':
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: C.sun, width: 4),
          ),
          child: Text(
            rest,
            style: T.l(rest.length <= 2 ? 40 : 26, color: C.ink),
          ),
        );
      case '%':
        return bubble(
          SizedBox(
            width: 44,
            height: 44,
            child: CustomPaint(
              painter: ShapePainter(Shape.values.byName(rest), C.berry),
            ),
          ),
        );
      case '*':
        return bubble(const SizedBox(), _colours[rest] ?? Colors.white);
      case '&':
        return Image.asset(
          'assets/friends/${rest}_happy.webp',
          width: 76,
          height: 76,
        );
      default:
        return bubble(Art(pic, size: 52));
    }
  }
}

/// Bounces, sways and hops on the beat.
class _Dancer extends StatelessWidget {
  const _Dancer({required this.beat, required this.child, this.big = false});
  final int beat;
  final Widget child;
  final bool big;

  @override
  Widget build(BuildContext context) {
    final up = beat.isEven;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 240),
      curve: Curves.easeOutBack,
      transform: Matrix4.identity()
        ..translateByDouble(0, up ? (big ? -18.0 : -12.0) : 0.0, 0, 1)
        ..rotateZ(up ? .12 : -.12),
      transformAlignment: Alignment.bottomCenter,
      child: child,
    );
  }
}

/// A dance party in the middle of a game: a real song, everybody dances.
Future<void> songParty(BuildContext context) async {
  final pool = songs.where((s) => s.id != 'goodnight').toList();
  final song = pool[Random().nextInt(pool.length)];
  await Voice.say('Everybody dance with us!');
  if (!context.mounted) return;
  await Navigator.of(context)
      .push(softRoute(SongPlayer(song: song, party: true)));
}
