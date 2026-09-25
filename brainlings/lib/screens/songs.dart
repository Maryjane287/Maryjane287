import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../friends.dart';
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
    WidgetsBinding.instance.addPostFrameCallback((_) => Voice.say('Pick a song and let\'s dance!'));
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
    final list = songs.where((s) => s.id != 'goodnight' || skyNow() != SkyTime.day).toList();
    return Scaffold(
      body: Meadow(
        scene: 'party',
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                const SizedBox(height: 8),
                Row(children: [
                  RoundIcon(icon: Icons.arrow_back_rounded, label: 'Back home', onTap: () {
                    Voice.stop();
                    Navigator.of(context).pop();
                  }),
                  const SizedBox(width: 10),
                  const Expanded(child: Bubble("Pick a song and let's dance!", size: 20)),
                ]),
                const SizedBox(height: 10),
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.05,
                    children: [
                      for (var i = 0; i < list.length; i++)
                        _SongCard(song: list[i], index: i, onTap: () => _play(list[i])),
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
  const _SongCard({required this.song, required this.index, required this.onTap});
  final Song song;
  final int index;
  final VoidCallback onTap;

  @override
  State<_SongCard> createState() => _SongCardState();
}

class _SongCardState extends State<_SongCard> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: Duration(milliseconds: 900 + widget.index * 90))..repeat(reverse: true);

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
        builder: (_, c) => Transform.rotate(angle: (_c.value - .5) * .06, child: c),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Colors.white, color.withValues(alpha: .55)]),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: Colors.white, width: 5),
            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(clipBehavior: Clip.none, children: [
                Art(widget.song.art, size: 76),
                const Positioned(right: -14, top: -6, child: Icon(Icons.music_note_rounded, color: C.berry, size: 30)),
              ]),
              const SizedBox(height: 6),
              Text(widget.song.title, textAlign: TextAlign.center, style: T.d(18)),
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

  /// A short dance party in the middle of a game: no buttons, it closes itself.
  final bool party;

  @override
  State<SongPlayer> createState() => _SongPlayerState();
}

class _SongPlayerState extends State<SongPlayer> {
  late final VideoPlayerController _v = VideoPlayerController.asset('assets/songs/${widget.song.id}.mp4');
  bool _ready = false;
  bool _ended = false;
  int _line = -1;
  int _beat = 0;
  Timer? _dance;

  @override
  void initState() {
    super.initState();
    Music.pause();
    Voice.stop();
    _v.addListener(_tick);
    _v.initialize().then((_) {
      if (!mounted) return;
      _v.setVolume(1);
      setState(() => _ready = true);
      _v.play();
    }).catchError((_) {
      if (mounted) _finish();
    });
    _dance = Timer.periodic(const Duration(milliseconds: 480), (_) {
      if (mounted && !_ended) setState(() => _beat++);
    });
  }

  @override
  void dispose() {
    _dance?.cancel();
    _v.removeListener(_tick);
    _v.dispose();
    Music.resume();
    super.dispose();
  }

  void _tick() {
    if (!_ready || _ended) return;
    final ms = _v.value.position.inMilliseconds;
    var line = -1;
    for (var i = 0; i < widget.song.lines.length; i++) {
      if (ms >= widget.song.lines[i].startMs - 150) line = i;
    }
    if (line != _line && mounted) setState(() => _line = line);
    final d = _v.value.duration;
    if (d > Duration.zero && _v.value.position >= d - const Duration(milliseconds: 120)) _finish();
  }

  Future<void> _finish() async {
    if (_ended) return;
    _ended = true;
    if (!mounted) return;
    setState(() {});
    Sfx.applause();
    celebrate(context, count: 80);
    app.addStars(1);
    if (widget.party) {
      await Voice.say('You are a super dancer!');
      if (mounted) Navigator.of(context).pop();
    } else {
      await Voice.say('{name}!|What a lovely dancer you are!|That was so much fun! Again?');
    }
  }

  void _again() {
    Sfx.pop();
    setState(() {
      _ended = false;
      _line = -1;
    });
    _v.seekTo(Duration.zero);
    _v.play();
  }

  void _sparkle(TapDownDetails d) {
    Juice.starBurst(context, d.globalPosition, count: 10);
    Sfx.sparkle();
  }

  @override
  Widget build(BuildContext context) {
    final met = app.metFriends.isEmpty ? friends.take(3).toList() : app.metFriends;
    return Scaffold(
      backgroundColor: const Color(0xFF2A2152),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: _sparkle,
        child: SafeArea(
          child: Column(
            children: [
              if (!widget.party)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: Row(children: [
                    RoundIcon(icon: Icons.arrow_back_rounded, label: 'Back', onTap: () => Navigator.of(context).pop()),
                    const SizedBox(width: 12),
                    Expanded(child: Text(widget.song.title, style: T.d(26, color: Colors.white))),
                  ]),
                ),
              const SizedBox(height: 8),
              // The music video
              Expanded(
                flex: 6,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(28),
                    child: _ready
                        ? FittedBox(fit: BoxFit.cover, clipBehavior: Clip.hardEdge, child: SizedBox(width: _v.value.size.width, height: _v.value.size.height, child: VideoPlayer(_v)))
                        : Container(color: Colors.white12, alignment: Alignment.center, child: Bibi(mood: Mood.dance, size: 180, bounce: _beat)),
                  ),
                ),
              ),
              // Karaoke words
              SizedBox(
                height: 92,
                child: Center(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    transitionBuilder: (c, a) => ScaleTransition(scale: a, child: c),
                    child: Padding(
                      key: ValueKey(_line),
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: _line < 0
                          ? const Row(mainAxisSize: MainAxisSize.min, children: [
                              Icon(Icons.music_note_rounded, color: C.sun, size: 40),
                              Icon(Icons.music_note_rounded, color: Colors.white, size: 52),
                              Icon(Icons.music_note_rounded, color: C.sun, size: 40),
                            ])
                          : Text(
                        widget.song.lines[_line].text,
                        textAlign: TextAlign.center,
                        style: T.d(26, color: const [C.sun, Colors.white, Color(0xFFFFB3D1), Color(0xFFA8F0E6)][max(0, _line) % 4])
                            .copyWith(shadows: const [Shadow(color: Colors.black45, blurRadius: 8)]),
                      ),
                    ),
                  ),
                ),
              ),
              // The gang dancing along
              SizedBox(
                height: 120,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    for (var i = 0; i < met.length && i < 2; i++) _Dancer(beat: _beat + i, child: FriendSprite(friend: met[i], size: 66, pose: (_beat + i).isEven ? 'cheer' : 'laugh')),
                    _Dancer(beat: _beat + 1, big: true, child: Bibi(mood: const [Mood.dance, Mood.cheer, Mood.laugh, Mood.wave][_beat % 4], size: 96, bounce: _beat ~/ 2)),
                    for (var i = 2; i < met.length && i < 4; i++) _Dancer(beat: _beat + i, child: FriendSprite(friend: met[i], size: 66, pose: (_beat + i).isEven ? 'laugh' : 'cheer')),
                  ],
                ),
              ),
              if (_ended && !widget.party)
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
                    Chunky(color: C.leaf, shadow: C.leafDeep, onTap: _again, child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.replay_rounded, color: Colors.white, size: 32), SizedBox(width: 6), Text('Again!')])),
                    Chunky(color: C.berry, shadow: C.berryDeep, onTap: () => Navigator.of(context).pop(), child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.library_music_rounded, color: Colors.white, size: 30), SizedBox(width: 6), Text('More songs')])),
                  ]),
                )
              else
                const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
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
  await Navigator.of(context).push(softRoute(SongPlayer(song: song, party: true)));
}
