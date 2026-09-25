import 'dart:math';

import 'package:flutter/material.dart';

import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/juice.dart';
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
    ('balloon', 'Balloon'),
    ('cake', 'Cake'),
    ('present', 'Present'),
    ('star', 'Star'),
    ('strawberry', 'Strawberry'),
    ('cupcake', 'Cupcake'),
    ('popper', 'Popper'),
    ('lolly', 'Lolly'),
  ];
  // Pattern shapes, getting a little trickier each round.
  static const shapes = [
    [0, 1],
    [0, 1],
    [0, 0, 1],
    [0, 1, 2],
    [0, 1, 1],
  ];

  static const maxLevel = 4;
  final _r = Random();
  final _level = app.levelOf('patterns');
  int _mode = 1; // 1 simple, 2 tricky, 3 what's missing, 4 counting patterns
  int _gap = 5; // where the question mark sits
  int _startCount = 1; // counting patterns
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
    _mode = levelMode(_level, maxLevel, _r);
    final intro = _round == 0 ? '${levelLine(_level)}|' : '';
    _solved = false;
    _mood = Mood.happy;
    if (_mode == 4) {
      _startCount = 1 + _r.nextInt(app.age <= 4 ? 2 : 4);
      _row = [];
      _numChoices = {_startCount + 3, _startCount + 2, _startCount + 4}.toList()..shuffle(_r);
      _line = '$intro${_round == 0 ? 'Counting patterns!|' : ''}Count the stars! What comes next?';
      setState(() {});
      Voice.say(_line);
      return;
    }
    final pick = [...things]..shuffle(_r);
    final unit = (_mode == 1 ? shapes[_r.nextInt(2)] : shapes[2 + _r.nextInt(3)]).map((i) => pick[i]).toList();
    const shown = 6;
    final full = List.generate(shown, (i) => unit[i % unit.length]);
    _gap = _mode == 3 ? 1 + _r.nextInt(shown - 2) : shown - 1;
    _row = full;
    _answer = full[_gap];
    final wrong = pick.where((t) => t != _answer).take(2).toList();
    _choices = [_answer, ...wrong]..shuffle(_r);
    final said = [for (var i = 0; i < shown; i++) i == _gap ? (_mode == 3 ? 'Hmm?' : '') : '${_row[i].$2}.'].where((x) => x.isNotEmpty && x != 'Hmm?').join('|');
    _line = switch (_mode) {
      3 => '$intro${_round == 0 ? 'Oh no! Something is missing!|' : ''}$said|What\'s missing?',
      2 => '$intro${_round == 0 ? 'Trickier patterns!|' : ''}$said|What comes next?',
      _ => '$intro${_round == 0 ? 'Party time!|' : ''}$said|What comes next?',
    };
    setState(() {});
    Voice.say(_line);
  }

  List<int> _numChoices = [];

  Future<void> _pickNumber(int n) async {
    if (_busy) return;
    _busy = true;
    final want = _startCount + 3;
    if (n == want) {
      app.learned(Skill.patterns);
      app.learned(Skill.numbers);
      final cheer = Juice.correct(context);
      setState(() {
        _solved = true;
        _mood = Mood.dance;
        _bounce++;
        _round++;
        _line = '$cheer|${numberWordsCap[want]}!|Let\'s party!';
      });
      celebrate(context, count: 40);
      await Voice.say(_line);
      if (!mounted) return;
      await _after();
    } else {
      Juice.oops();
      setState(() {
        _mood = Mood.laugh;
        _wobble++;
        _line = 'Hmm, let\'s sing the pattern together!|${[for (var g = 0; g < 3; g++) '${numberWordsCap[_startCount + g]}!'].join('|')}|What comes next?';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  Future<void> _after() async {
    if (_round >= rounds) {
      finishGame(context, Skill.patterns, 'Pattern Party', game: 'patterns', maxLevel: maxLevel);
    } else {
      if (_round == 3) await danceBreak(context);
      if (mounted) _newRound();
    }
  }

  Widget _countingBody() => Column(
        children: [
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: .8), borderRadius: BorderRadius.circular(28), boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))]),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                for (var g = 0; g < 4; g++)
                  Container(
                    width: 74,
                    constraints: const BoxConstraints(minHeight: 90),
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: g == 3 ? (_solved ? C.sun.withValues(alpha: .35) : C.lilac.withValues(alpha: .25)) : Colors.transparent,
                      borderRadius: BorderRadius.circular(18),
                      border: g == 3 ? Border.all(color: _solved ? C.sun : C.lilacDeep, width: 3) : null,
                    ),
                    child: g == 3 && !_solved
                        ? Center(child: Text('?', style: T.d(44, color: C.lilacDeep)))
                        : Wrap(alignment: WrapAlignment.center, children: [
                            for (var k = 0; k < _startCount + g; k++) _Hop(delay: g * 200 + k * 60, key: ValueKey('s$_round$g$k'), child: const Art('star', size: 22)),
                          ]),
                  ),
              ],
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              for (final n in _numChoices)
                Chunky(color: C.paper, shadow: C.shadow, radius: 28, padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 10), onTap: () => _pickNumber(n), child: Text('$n', style: T.l(52))),
            ],
          ),
          const SizedBox(height: 20),
        ],
      );

  Future<void> _pick((String, String) t) async {
    if (_busy) return;
    _busy = true;
    if (t == _answer) {
      app.learned(Skill.patterns);
      final cheer = Juice.correct(context);
      setState(() {
        _solved = true;
        _mood = Mood.dance;
        _bounce++;
        _round++;
        _line = '$cheer|Let\'s party!';
      });
      celebrate(context, count: 40);
      await Voice.say(_line);
      if (!mounted) return;
      await _after();
    } else {
      Juice.oops();
      setState(() {
        _mood = Mood.laugh;
        _wobble++;
        _line =
            'Hmm, let\'s sing the pattern together!|${[for (var i = 0; i < _row.length; i++) if (i != _gap) '${_row[i].$2}.'].join('|')}|${_mode == 3 ? 'What\'s missing?' : 'What comes next?'}';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'lulu',
      scene: 'party',
      level: _level,
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: _mode == 4 ? _countingBody() : Column(
        children: [
          const Spacer(),
          // Bunting across the top
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < 9; i++)
                ClipPath(
                  clipper: _Flag(),
                  child: Container(
                    width: 30,
                    height: 28,
                    color: [C.berry, C.sun, C.aqua, C.lilac, C.peach][i % 5],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .75),
              borderRadius: BorderRadius.circular(28),
              boxShadow: const [
                BoxShadow(color: C.shadow, offset: Offset(0, 6)),
              ],
            ),
            child: Wrap(
              alignment: WrapAlignment.center,
              spacing: 4,
              runSpacing: 8,
              children: [
                for (var i = 0; i < _row.length; i++)
                  if (i != _gap)
                    _Hop(
                      delay: i * 120,
                      key: ValueKey('$_round-$i'),
                      child: Art(_row[i].$1, size: 52),
                    )
                  else
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: 60,
                  height: 60,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: _solved
                        ? C.sun.withValues(alpha: .35)
                        : C.lilac.withValues(alpha: .25),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: _solved ? C.sun : C.lilacDeep,
                      width: 3,
                    ),
                  ),
                  child: _solved
                      ? Art(_answer.$1, size: 48)
                      : Text('?', style: T.d(40, color: C.lilacDeep)),
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
                  child: Art(t.$1, size: 64),
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
      return Opacity(
        opacity: t,
        child: Transform.translate(
          offset: Offset(0, -sin(t * pi) * 18),
          child: c,
        ),
      );
    },
    child: child,
  );
}
