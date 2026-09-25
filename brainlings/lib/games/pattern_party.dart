import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/ui.dart';

/// Pattern Party: what comes next in the party line?
class PatternParty extends StatefulWidget {
  const PatternParty({super.key});

  @override
  State<PatternParty> createState() => _PatternPartyState();
}

class _PatternPartyState extends State<PatternParty> {
  static const rounds = 5;
  static const things = [
    ('🎈', 'balloon'),
    ('🍰', 'cake'),
    ('🎁', 'present'),
    ('⭐', 'star'),
    ('🍓', 'strawberry'),
    ('🧁', 'cupcake'),
    ('🎉', 'popper'),
    ('🍭', 'lolly'),
  ];
  // Pattern shapes, getting a little trickier each round.
  static const shapes = [
    [0, 1],
    [0, 1],
    [0, 0, 1],
    [0, 1, 2],
    [0, 1, 1],
  ];

  final _r = Random();
  int _round = 0;
  late List<(String, String)> _row;
  late (String, String) _answer;
  late List<(String, String)> _choices;
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  bool _solved = false;

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  void _newRound() {
    final pick = [...things]..shuffle(_r);
    final unit = shapes[_round].map((i) => pick[i]).toList();
    const shown = 5;
    final full = List.generate(shown + 1, (i) => unit[i % unit.length]);
    _row = full.sublist(0, shown);
    _answer = full.last;
    final wrong = pick.where((t) => t != _answer).take(2).toList();
    _choices = [_answer, ...wrong]..shuffle(_r);
    _solved = false;
    _mood = Mood.happy;
    final said = _row.map((t) => t.$2).join(', ');
    _line = _round == 0 ? 'Party time! $said. What comes next?' : '$said. What comes next?';
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _pick((String, String) t) async {
    if (_busy) return;
    _busy = true;
    if (t == _answer) {
      Sfx.correct();
      app.learned(Skill.patterns);
      setState(() {
        _solved = true;
        _mood = Mood.cheer;
        _bounce++;
        _round++;
        _line = '${yayLine(_r)} A ${t.$2}! Let\'s party!';
      });
      celebrate(context, count: 25);
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= rounds) {
        finishGame(context, Skill.patterns, 'Pattern Party');
      } else {
        _newRound();
      }
    } else {
      Sfx.tryAgain();
      setState(() {
        _mood = Mood.puzzled;
        _wobble++;
        _line = 'Hmm, a ${t.$2}? Let\'s sing the pattern together: ${_row.map((e) => e.$2).join(', ')}...';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: Column(
        children: [
          const Spacer(),
          // Bunting across the top
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < 9; i++)
                ClipPath(
                  clipper: _Flag(),
                  child: Container(width: 30, height: 28, color: [C.berry, C.sun, C.aqua, C.lilac, C.peach][i % 5]),
                ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .75),
              borderRadius: BorderRadius.circular(28),
              boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
            ),
            child: Wrap(
              alignment: WrapAlignment.center,
              spacing: 4,
              runSpacing: 8,
              children: [
                for (var i = 0; i < _row.length; i++) _Hop(delay: i * 120, key: ValueKey('$_round-$i'), child: Text(_row[i].$1, style: const TextStyle(fontSize: 44))),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: 60,
                  height: 60,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: _solved ? C.sun.withValues(alpha: .35) : C.lilac.withValues(alpha: .25),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: _solved ? C.sun : C.lilacDeep, width: 3),
                  ),
                  child: _solved ? Text(_answer.$1, style: const TextStyle(fontSize: 40)) : Text('?', style: T.d(40, color: C.lilacDeep)),
                ),
              ],
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              for (final t in _choices)
                Chunky(
                  color: C.paper,
                  shadow: C.shadow,
                  radius: 28,
                  padding: const EdgeInsets.all(16),
                  onTap: () => _pick(t),
                  child: Text(t.$1, style: const TextStyle(fontSize: 54)),
                ),
            ],
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class _Flag extends CustomClipper<Path> {
  @override
  Path getClip(Size s) => Path()
    ..lineTo(s.width, 0)
    ..lineTo(s.width / 2, s.height)
    ..close();

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}

/// Party items hop in one after another.
class _Hop extends StatelessWidget {
  const _Hop({super.key, required this.delay, required this.child});
  final int delay;
  final Widget child;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: Duration(milliseconds: 500 + delay),
        builder: (_, v, c) {
          final t = ((v * (500 + delay) - delay) / 500).clamp(0.0, 1.0);
          return Opacity(opacity: t, child: Transform.translate(offset: Offset(0, -sin(t * pi) * 18), child: c));
        },
        child: child,
      );
}
