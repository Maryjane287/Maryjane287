import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';

import '../services/music.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/juice.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

/// Talking Bibi. The child talks and Bibi copies them in a funny squeaky
/// voice. Poke Bibi's head, tickle its tummy, tap its feet, hold it for a
/// hug, or throw it a snack. Nothing is saved: each recording is thrown away
/// as soon as Bibi has repeated it.
class TalkScreen extends StatefulWidget {
  const TalkScreen({super.key});

  @override
  State<TalkScreen> createState() => _TalkScreenState();
}

enum _Ear { off, listening, hearing, talking }

class _TalkScreenState extends State<TalkScreen> {
  static const _snacks = ['cupcake', 'strawberry', 'cookie', 'lolly', 'donut', 'banana'];
  final _rec = AudioRecorder();
  final _player = AudioPlayer();
  final _r = Random();
  final _mouthKey = GlobalKey();
  final _snackKeys = List.generate(6, (_) => GlobalKey());

  _Ear _ear = _Ear.off;
  bool _micOk = false;
  bool _busy = false; // Bibi is reacting or speaking
  Mood _mood = Mood.wave;
  int _bounce = 0, _wobble = 0;
  String _line = 'Hello! Poke me, tickle me, talk to me!';
  double _level = 0; // 0..1 for the listening ring

  // Voice detection
  StreamSubscription<Amplitude>? _amp;
  DateTime? _recStart;
  double _noise = -50;
  int? _speechStart, _lastLoud;
  Timer? _talkAnim;
  bool _disposed = false;

  @override
  void initState() {
    super.initState();
    Music.pause();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Sfx.tada();
      setState(() => _bounce++);
      await Voice.say(_line);
      try {
        _micOk = await _rec.hasPermission();
      } catch (_) {
        _micOk = false;
      }
      if (!mounted) return;
      if (_micOk) {
        await _say("Talk to me! I'll copy you!", Mood.happy);
        _listen();
      } else {
        setState(() => _mood = Mood.happy);
      }
    });
  }

  @override
  void dispose() {
    _disposed = true;
    _talkAnim?.cancel();
    _amp?.cancel();
    _rec.dispose();
    _player.dispose();
    Music.resume();
    super.dispose();
  }

  // ---------------- listening ----------------

  Future<void> _listen() async {
    if (!_micOk || _disposed || _busy) return;
    try {
      final dir = await getTemporaryDirectory();
      final path = '${dir.path}/bibi-ears.m4a';
      await _rec.start(const RecordConfig(encoder: AudioEncoder.aacLc, numChannels: 1), path: path);
      _recStart = DateTime.now();
      _speechStart = null;
      _lastLoud = null;
      _noise = -50;
      if (!mounted) return;
      setState(() {
        _ear = _Ear.listening;
        _mood = Mood.happy;
      });
      await _amp?.cancel();
      _amp = _rec.onAmplitudeChanged(const Duration(milliseconds: 60)).listen(_onLevel);
    } catch (_) {
      _micOk = false;
    }
  }

  void _onLevel(Amplitude a) {
    if (_recStart == null || _ear == _Ear.off || _ear == _Ear.talking) return;
    final t = DateTime.now().difference(_recStart!).inMilliseconds;
    final db = a.current.isFinite ? a.current : -60.0;
    if (t < 400) {
      _noise = max(_noise, db); // learn how loud the room is
      return;
    }
    final threshold = max(_noise + 12, -42);
    final loud = db > threshold;
    if (mounted) setState(() => _level = ((db + 60) / 60).clamp(0.0, 1.0));
    if (loud) {
      _speechStart ??= t;
      _lastLoud = t;
      if (_ear != _Ear.hearing && mounted) {
        setState(() {
          _ear = _Ear.hearing;
          _mood = Mood.wow;
        });
      }
    }
    final heardSomething = _speechStart != null && _lastLoud != null && _lastLoud! - _speechStart! > 250;
    final quietAfter = _lastLoud != null && t - _lastLoud! > 700;
    if (heardSomething && (quietAfter || t - _speechStart! > 6000)) {
      _repeat(_speechStart!, _lastLoud! + 150);
    } else if (_speechStart == null && t > 9000) {
      // Nobody spoke for a while: start a fresh recording so it stays small.
      _restart();
    }
  }

  Future<void> _restart() async {
    await _stopRec();
    _listen();
  }

  Future<String?> _stopRec() async {
    await _amp?.cancel();
    _amp = null;
    try {
      return await _rec.stop();
    } catch (_) {
      return null;
    }
  }

  /// Bibi copies what it heard, in a squeaky cartoon voice.
  Future<void> _repeat(int startMs, int endMs) async {
    if (_ear == _Ear.talking) return;
    setState(() => _ear = _Ear.talking);
    final path = await _stopRec();
    if (path == null || _disposed) return _listen();
    try {
      await _player.setFilePath(path);
      await _player.setClip(start: Duration(milliseconds: max(0, startMs - 120)), end: Duration(milliseconds: endMs));
      await _player.setPitch(1.6);
      await _player.setSpeed(1.2);
      await _player.setVolume(1);
      _startTalkAnim();
      await _player.play();
      await _player.processingStateStream.firstWhere((s) => s == ProcessingState.completed).timeout(const Duration(seconds: 8));
      await _player.stop();
    } catch (_) {}
    _stopTalkAnim();
    if (_disposed) return;
    Sfx.giggle();
    setState(() {
      _mood = Mood.laugh;
      _bounce++;
    });
    await Future.delayed(const Duration(milliseconds: 500));
    _listen();
  }

  void _startTalkAnim() {
    var i = 0;
    _talkAnim?.cancel();
    _talkAnim = Timer.periodic(const Duration(milliseconds: 170), (_) {
      if (!mounted) return;
      setState(() {
        _mood = const [Mood.cheer, Mood.wow, Mood.laugh, Mood.wow][i++ % 4];
        if (i.isEven) _bounce++;
      });
    });
  }

  void _stopTalkAnim() {
    _talkAnim?.cancel();
    _talkAnim = null;
  }

  // ---------------- touching ----------------

  /// Stops listening while Bibi reacts, so it doesn't copy itself.
  Future<void> _react(Future<void> Function() action) async {
    if (_busy || _ear == _Ear.talking) return;
    _busy = true;
    if (_ear != _Ear.off) await _stopRec();
    setState(() => _ear = _Ear.off);
    await action();
    _busy = false;
    if (mounted) _listen();
  }

  Future<void> _say(String line, Mood mood) async {
    if (!mounted) return;
    setState(() {
      _line = line;
      _mood = mood;
      _bounce++;
    });
    await Voice.say(line);
  }

  void _tapBibi(TapDownDetails d, Size size) {
    final y = d.localPosition.dy / size.height;
    final x = (d.localPosition.dx / size.width - .5).abs();
    Juice.starBurst(context, d.globalPosition, count: 10);
    _react(() async {
      if (y < .38) {
        Sfx.boing();
        setState(() => _wobble++);
        await _say(_r.nextBool() ? 'Ouch! My head!' : "Don't poke my nose!", Mood.wow);
      } else if (y > .82) {
        Sfx.zip();
        await _say('Whee! Again! Again!', Mood.dance);
      } else if (x > .3) {
        Sfx.pop();
        await _say('La la la!', Mood.wave);
      } else {
        Sfx.giggle();
        await _say('Hee hee hee! That tickles!', Mood.laugh);
      }
    });
  }

  void _hug() {
    _react(() async {
      Sfx.hug();
      celebrate(context, count: 20, hearts: true);
      await _say('Ahh, I love hugs!', Mood.hug);
    });
  }

  void _tickle() {
    _react(() async {
      Sfx.giggle();
      setState(() => _wobble++);
      await _say('Hee hee hee! That tickles!', Mood.laugh);
    });
  }

  void _feed(int i) {
    _react(() async {
      final box = _snackKeys[i].currentContext?.findRenderObject() as RenderBox?;
      final mouth = _mouthKey.currentContext?.findRenderObject() as RenderBox?;
      setState(() => _mood = Mood.hungry);
      if (box != null && mouth != null) {
        Sfx.whoosh();
        await FlyingArt.go(context, _snacks[i], box.localToGlobal(Offset.zero) & box.size, mouth.localToGlobal(mouth.size.center(Offset.zero)));
      }
      Sfx.chomp();
      await _say('Yum yum!', Mood.munch);
    });
  }

  @override
  Widget build(BuildContext context) {
    final listening = _ear == _Ear.listening || _ear == _Ear.hearing;
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                child: Row(children: [
                  RoundIcon(icon: Icons.arrow_back_rounded, label: 'Back home', onTap: () => Navigator.of(context).pop()),
                  const SizedBox(width: 10),
                  Expanded(child: Bubble(_line, size: 19)),
                ]),
              ),
              Expanded(
                child: LayoutBuilder(builder: (context, box) {
                  final size = min(box.maxHeight * .8, 330.0);
                  return Center(
                    child: GestureDetector(
                      onTapDown: (d) => _tapBibi(d, Size(size * 1.15, size * 1.12)),
                      onLongPress: _hug,
                      onHorizontalDragEnd: (_) => _tickle(),
                      child: Stack(
                        alignment: Alignment.bottomCenter,
                        children: [
                          Bibi(mood: _mood, size: size, bounce: _bounce, wobble: _wobble),
                          Positioned(bottom: size * .34, child: SizedBox(key: _mouthKey, width: 40, height: 30)),
                        ],
                      ),
                    ),
                  );
                }),
              ),
              // Listening ring: grows with the child's voice
              SizedBox(
                height: 86,
                child: Center(
                  child: _micOk
                      ? AnimatedContainer(
                          duration: const Duration(milliseconds: 90),
                          width: 64 + (listening ? _level * 40 : 0),
                          height: 64 + (listening ? _level * 40 : 0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _ear == _Ear.hearing ? C.berry : (listening ? C.leaf : Colors.white.withValues(alpha: .7)),
                            border: Border.all(color: Colors.white, width: 5),
                            boxShadow: [BoxShadow(color: (listening ? C.leaf : C.shadow).withValues(alpha: .5), blurRadius: 16, spreadRadius: listening ? _level * 10 : 0)],
                          ),
                          child: Icon(listening ? Icons.hearing_rounded : Icons.mic_rounded, color: Colors.white, size: 32),
                        )
                      : Text('Poke me! Tickle me!', style: T.d(22, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
                ),
              ),
              // Snack tray
              Container(
                margin: const EdgeInsets.fromLTRB(16, 4, 16, 14),
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: .8),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Colors.white, width: 4),
                  boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    for (var i = 0; i < _snacks.length; i++)
                      GestureDetector(key: _snackKeys[i], onTap: () => _feed(i), child: Art(_snacks[i], size: 48)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
