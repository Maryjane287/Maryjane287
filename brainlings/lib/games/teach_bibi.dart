import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/ui.dart';
import 'letter_garden.dart';

enum _Step { judge, teach }

/// Teach Your Creature: the creature tries its best but gets muddled.
/// The child checks its answers and teaches it the right one.
class TeachBibi extends StatefulWidget {
  const TeachBibi({super.key});

  @override
  State<TeachBibi> createState() => _TeachBibiState();
}

class _TeachBibiState extends State<TeachBibi> {
  static const rounds = 5;
  static const things = [
    'ladybird',
    'donut',
    'chick',
    'star',
    'mushroom',
    'fish',
  ];
  static const sillies = [
    'Hmm, I think I was counting my toes.',
    'Oopsie! My brain did a wobble.',
    'Silly me! My leaf was in my eyes.',
    'Oh no, I was thinking about cake again.',
  ];
  final _r = Random();
  int _round = 0;
  _Step _step = _Step.judge;
  bool _isCount = true;
  bool _bibiRight = false;
  // counting
  int _real = 0, _claim = 0;
  String _thing = 'ladybird';
  // letters
  late Phonic _pic;
  late String _claimLetter;
  late List<String> _options;
  String _line = '';
  Mood _mood = Mood.puzzled;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;

  String get _name => app.creatureName;

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  void _newRound() {
    _isCount = _round.isEven;
    _bibiRight = _r.nextDouble() < .3;
    _step = _Step.judge;
    _mood = _isCount ? Mood.think : Mood.read;
    if (_isCount) {
      final top = app.age <= 4 ? 5 : 8;
      _real = 2 + _r.nextInt(top - 1);
      _thing = things[_r.nextInt(things.length)];
      _claim = _bibiRight ? _real : (_r.nextBool() ? _real + 1 : _real - 1);
      final opts = {_real, _real + 1, _real - 1}.toList()..shuffle(_r);
      _options = opts.map((e) => '$e').toList();
      _line =
          '${_round == 0 ? 'I\'m learning to count! Let me try.' : 'Let me count these.'}|I think there ${_claim == 1 ? 'is' : 'are'} ${numberWords[_claim]}! Am I right?';
    } else {
      _pic = phonics[_r.nextInt(phonics.length)];
      final others = phonics.where((p) => p.letter != _pic.letter).toList()
        ..shuffle(_r);
      _claimLetter = _bibiRight ? _pic.letter : others.first.letter;
      _options = [_pic.letter, others[0].letter, others[1].letter]..shuffle(_r);
      _line =
          '${thatsA(_pic.word)}|I think it starts with ${_claimLetter.toUpperCase()}. Am I right?';
    }
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _judge(bool childSaysRight) async {
    if (_busy) return;
    _busy = true;
    if (childSaysRight == _bibiRight) {
      if (_bibiRight) {
        Sfx.correct();
        app.learned(_isCount ? Skill.numbers : Skill.letters);
        setState(() {
          _mood = Mood.cheer;
          _bounce++;
          _line = 'Yippee! I got one right! Thank you for checking, teacher!';
        });
        await Voice.say(_line);
        _next();
      } else {
        Sfx.pop();
        setState(() {
          _step = _Step.teach;
          _wobble++;
          _line =
              '${sillies[_r.nextInt(sillies.length)]}|Can you teach me? ${_isCount ? 'How many are there really?' : 'Which letter does it start with?'}';
        });
        await Voice.say(_line);
      }
    } else {
      Sfx.tryAgain();
      setState(() {
        _wobble++;
        _line = _isCount
            ? 'Hmm, let\'s count together.|${List.generate(_real, (i) => '${numberWordsCap[i + 1]}!').join('|')}|There are ${numberWords[_real]}!'
            : '${_pic.chant}|It starts with ${_pic.letter.toUpperCase()}!';
      });
      await Voice.say(_line);
      _next();
    }
    _busy = false;
  }

  Future<void> _teach(String answer) async {
    if (_busy) return;
    _busy = true;
    final right = _isCount ? answer == '$_real' : answer == _pic.letter;
    if (right) {
      Sfx.correct();
      app.learned(Skill.teaching, pts: 2);
      setState(() {
        _mood = Mood.cheer;
        _bounce++;
        _line = _isCount
            ? '${numberWordsCap[_real]}!|Ohhh! Now I know! You are the best teacher!'
            : '${_pic.chant}|Ohhh! Now I know! You are the best teacher!';
      });
      await Voice.say(_line);
      _next();
    } else {
      Sfx.tryAgain();
      setState(() {
        _wobble++;
        _line = _isCount
            ? 'Hmm, shall we count them together? Tap each one.'
            : 'Listen carefully and try again!|${_pic.chant}';
      });
      await Voice.say(_line);
    }
    _busy = false;
  }

  void _next() {
    _round++;
    if (!mounted) return;
    if (_round >= rounds) {
      finishGame(context, Skill.teaching, 'Teach $_name');
    } else {
      _newRound();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      scene: 'classroom',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: Column(
        children: [
          const Spacer(),
          // The thing Bibi is looking at
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF6D6),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white, width: 5),
              boxShadow: const [
                BoxShadow(color: C.shadow, offset: Offset(0, 6)),
              ],
            ),
            child: _isCount
                ? _CountBoard(
                    key: ValueKey(_round),
                    count: _real,
                    emoji: _thing,
                  )
                : Column(
                    children: [
                      Art(_pic.art, size: 120),
                      Text(_pic.word, style: T.l(34, color: C.ink)),
                    ],
                  ),
          ),
          const Spacer(),
          if (_step == _Step.judge)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Chunky(
                  color: C.leaf,
                  shadow: C.leafDeep,
                  onTap: () => _judge(true),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('👍', style: TextStyle(fontSize: 34)),
                      SizedBox(width: 8),
                      Text('Yes!'),
                    ],
                  ),
                ),
                Chunky(
                  color: C.berry,
                  shadow: C.berryDeep,
                  onTap: () => _judge(false),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('🙈', style: TextStyle(fontSize: 34)),
                      SizedBox(width: 8),
                      Text('Oops, no!'),
                    ],
                  ),
                ),
              ],
            )
          else if (_step == _Step.teach)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                for (final o in _options)
                  Chunky(
                    color: C.paper,
                    shadow: C.shadow,
                    radius: 28,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 26,
                      vertical: 12,
                    ),
                    onTap: () => _teach(o),
                    child: Text(
                      _isCount ? o : '${o.toUpperCase()}$o',
                      style: T.l(48),
                    ),
                  ),
              ],
            ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

/// Things to count. Tapping one lights it up and says its number,
/// so the child can count along.
class _CountBoard extends StatefulWidget {
  const _CountBoard({super.key, required this.count, required this.emoji});
  final int count;
  final String emoji;

  @override
  State<_CountBoard> createState() => _CountBoardState();
}

class _CountBoardState extends State<_CountBoard> {
  final _lit = <int>[];

  @override
  Widget build(BuildContext context) => Wrap(
    alignment: WrapAlignment.center,
    spacing: 8,
    runSpacing: 8,
    children: [
      for (var i = 0; i < widget.count; i++)
        GestureDetector(
          onTap: () {
            if (_lit.contains(i)) return;
            setState(() => _lit.add(i));
            Sfx.pop();
            Voice.say('${numberWordsCap[_lit.length.clamp(0, 10)]}!');
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: _lit.contains(i)
                  ? C.sun.withValues(alpha: .5)
                  : Colors.transparent,
              shape: BoxShape.circle,
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Art(widget.emoji, size: 54),
                if (_lit.contains(i))
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 2,
                      ),
                      decoration: const BoxDecoration(
                        color: C.berry,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '${_lit.indexOf(i) + 1}',
                        style: T.d(16, color: Colors.white),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
    ],
  );
}
