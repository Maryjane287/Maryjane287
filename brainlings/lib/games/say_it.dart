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

/// Say It! Bibi shows a picture and the child says the word out loud.
/// Bibi really listens, and goes wild when it hears the right word.
/// One round is counting out loud. If the phone can't listen, a tap on the
/// microphone after speaking counts, so no child ever gets stuck.
class SayIt extends StatefulWidget {
  const SayIt({super.key});

  @override
  State<SayIt> createState() => _SayItState();
}

class _SayItState extends State<SayIt> {
  static const rounds = 5;
  static const words = [
    'apple', 'banana', 'cat', 'dog', 'fish', 'lion', 'monkey', 'pig', 'turtle', 'zebra', 'bear', 'star', 'sun', 'cake',
    'balloon', 'rainbow', 'octopus', 'egg', 'hat', 'heart', 'strawberry', 'orange', 'cookie', 'cupcake', 'chick',
    'ladybird', 'mushroom', 'present',
  ];
  static const _extra = {
    'ladybird': ['ladybug', 'lady bird', 'lady bug'],
    'present': ['gift', 'presents'],
    'chick': ['chicken', 'chicks', 'baby chick'],
    'cupcake': ['cup cake', 'cake'],
    'bear': ['teddy', 'teddy bear'],
    'sun': ['sunshine', 'son'],
    'egg': ['eggs'],
  };
  static const _nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

  final _stt = SpeechToText();
  final _r = Random();
  bool _sttOk = false;
  bool _listening = false;
  double _level = 0;
  String _heard = '';

  int _round = 0;
  late String _word;
  bool _countRound = false;
  int _count = 3;
  int _tries = 0;
  final _used = <String>{};
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  int _cardPop = 0;

  String get _answerLine => _word == 'sun' ? "It's the sun!" : "It's ${'aeiou'.contains(_word[0]) ? 'an' : 'a'} $_word!";

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        _sttOk = await _stt.initialize(onStatus: (s) {
          if ((s == 'done' || s == 'notListening') && mounted) setState(() => _listening = false);
        }, onError: (_) {
          if (mounted) setState(() => _listening = false);
        });
      } catch (_) {
        _sttOk = false;
      }
      _newRound();
    });
  }

  @override
  void dispose() {
    _stt.cancel();
    super.dispose();
  }

  Future<void> _newRound() async {
    _countRound = _round == 2;
    _tries = 0;
    _heard = '';
    _busy = false;
    _mood = Mood.happy;
    _cardPop++;
    if (_countRound) {
      _count = 2 + _r.nextInt(app.age <= 4 ? 3 : 5);
      _word = 'star';
      _line = 'Count out loud with me!';
    } else {
      final pool = words.where((w) => !_used.contains(w)).toList()..shuffle(_r);
      _word = pool.first;
      _used.add(_word);
      _line = "What's this? Say it out loud!";
    }
    setState(() {});
    Sfx.zip();
    await Voice.say(_line);
    if (mounted) _listen();
  }

  Future<void> _listen() async {
    if (_busy || !mounted) return;
    if (!_sttOk) {
      // No listening on this phone: show the mic, a tap after speaking counts.
      setState(() => _line = 'Tap the microphone and say it!');
      return;
    }
    await Voice.stop();
    await Music.pause();
    setState(() {
      _listening = true;
      _heard = '';
      _mood = Mood.wow;
    });
    try {
      await _stt.listen(
        onResult: (r) {
          if (!mounted) return;
          setState(() => _heard = r.recognizedWords);
          if (_matches(r.recognizedWords)) {
            _stt.stop();
            _win();
          } else if (r.finalResult) {
            _miss();
          }
        },
        onSoundLevelChange: (l) {
          if (mounted) setState(() => _level = ((l + 2) / 12).clamp(0.0, 1.0));
        },
        listenOptions: SpeechListenOptions(
          partialResults: true,
          cancelOnError: true,
          listenFor: const Duration(seconds: 7),
          pauseFor: const Duration(seconds: 3),
        ),
      );
    } catch (_) {
      setState(() => _listening = false);
    }
  }

  bool _matches(String said) {
    final s = said.toLowerCase();
    if (_countRound) {
      return s.contains(_nums[_count]) || s.contains('$_count');
    }
    final targets = [_word, '${_word}s', ...?_extra[_word]];
    final heardWords = s.split(RegExp(r'\s+'));
    for (final t in targets) {
      if (s.contains(t)) return true;
      // Little mouths: accept a very close try.
      for (final h in heardWords) {
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

  Future<void> _win() async {
    if (_busy) return;
    _busy = true;
    Music.resume();
    app.learned(_countRound ? Skill.numbers : Skill.letters);
    final cheer = Juice.correct(context);
    setState(() {
      _listening = false;
      _mood = Mood.dance;
      _bounce++;
      _line = _countRound ? '$cheer|I heard you! Brilliant!|${_numCap(_count)}!' : '$cheer|I heard you! Brilliant!|$_answerLine';
    });
    await Voice.say(_line);
    await _next();
  }

  Future<void> _miss() async {
    if (_busy) return;
    _tries++;
    setState(() => _listening = false);
    if (_tries < 2) {
      Sfx.boing();
      setState(() {
        _mood = Mood.think;
        _wobble++;
        _line = "Louder! I can't hear you!";
      });
      await Voice.say(_line);
      _listen();
    } else {
      // Never leave a child stuck: say it together, then celebrate the try.
      _busy = true;
      Music.resume();
      setState(() {
        _mood = Mood.happy;
        _line = _countRound
            ? "Let's say it together!|${List.generate(_count, (i) => '${_numCap(i + 1)}!').join('|')}"
            : "Let's say it together!|$_answerLine";
      });
      await Voice.say(_line);
      if (!mounted) return;
      Juice.correct(context);
      await _next();
    }
  }

  String _numCap(int n) => '${_nums[n][0].toUpperCase()}${_nums[n].substring(1)}';

  Future<void> _next() async {
    _round++;
    if (!mounted) return;
    if (_round >= rounds) {
      finishGame(context, Skill.letters, 'Say It');
      return;
    }
    if (_round == 3) await danceBreak(context);
    if (mounted) _newRound();
  }

  void _micTap() {
    if (_busy) return;
    if (!_sttOk) {
      _win();
    } else if (!_listening) {
      _listen();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'gogo',
      scene: 'classroom',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      onIdle: () {
        if (!_listening && !_busy) _listen();
      },
      body: Column(
        children: [
          const Spacer(),
          // The picture to name
          TweenAnimationBuilder<double>(
            key: ValueKey(_cardPop),
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 900),
            curve: Curves.elasticOut,
            builder: (_, v, c) => Transform.scale(scale: v, child: c),
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(36),
                border: Border.all(color: C.sun, width: 6),
                boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 8))],
              ),
              child: _countRound
                  ? Wrap(spacing: 4, children: [for (var i = 0; i < _count; i++) Art(_word, size: _count > 4 ? 56 : 72)])
                  : Art(_word, size: 170),
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            height: 30,
            child: Text(_heard.isEmpty ? '' : '"$_heard"', style: T.d(20, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
          ),
          const Spacer(),
          // The big microphone. It pulses and grows with the child's voice.
          GestureDetector(
            onTap: _micTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 100),
              width: 110 + (_listening ? _level * 40 : 0),
              height: 110 + (_listening ? _level * 40 : 0),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _listening ? C.berry : C.leaf,
                border: Border.all(color: Colors.white, width: 6),
                boxShadow: [BoxShadow(color: (_listening ? C.berry : C.leafDeep).withValues(alpha: .6), blurRadius: 20, spreadRadius: _listening ? 4 + _level * 14 : 2)],
              ),
              child: Icon(_listening ? Icons.hearing_rounded : Icons.mic_rounded, color: Colors.white, size: 56),
            ),
          ),
          const SizedBox(height: 10),
          Text(_listening ? '${app.creatureName} is listening...' : 'Tap and talk!', style: T.d(20, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 6)])),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
