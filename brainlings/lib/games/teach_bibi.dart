import 'dart:math';

import 'package:flutter/material.dart';

import '../services/lines.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/star_catch.dart';
import '../widgets/juice.dart';
import '../widgets/ui.dart';
import 'letter_garden.dart';
import 'shape_builder.dart';

enum _Step { judge, teach }

/// Teach Your Creature: the creature tries its best but gets muddled.
/// The child checks its answers and teaches it the right one.
class TeachBibi extends StatefulWidget {
  const TeachBibi({super.key});

  @override
  State<TeachBibi> createState() => _TeachBibiState();
}

class _TeachBibiState extends State<TeachBibi> {
  static const rounds = 8;
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
  static const maxLevel = 7;
  final _r = Random();
  final _level = app.levelOf('teach');
  int _round = 0;
  _Step _step = _Step.judge;
  bool _isCount = true;
  bool _isShape = false;
  bool _isSum = false;
  int _sa = 1, _sb = 1; // the sum Bibi tries
  late Shape _shape, _claimShape;
  List<Shape> _shapeOptions = [];
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
    // 5: Bibi tries sums, 6: sums, shapes and big numbers, 7: everything.
    final mode = _level > 7 ? 7 : _level;
    _isSum = mode == 5 || (mode >= 6 && _r.nextInt(3) == 0);
    _isShape = !_isSum && (mode == 2 || ((mode == 4 || mode >= 6) && _r.nextInt(2) == 0));
    _isCount = !_isShape && !_isSum && (mode == 6 || _round.isEven);
    final intro = _round == 0 ? '${levelLine(_level)}|' : '';
    if (_isSum) {
      _bibiRight = _r.nextDouble() < .3;
      _step = _Step.judge;
      _mood = Mood.think;
      _thing = things[_r.nextInt(things.length)];
      _sa = 1 + _r.nextInt(5);
      _sb = 1 + _r.nextInt(4);
      _real = _sa + _sb;
      _claim = _bibiRight ? _real : (_r.nextBool() ? _real + 1 : _real - 1);
      _options = ({_real, _real + 1, _real - 1}.toList()..shuffle(_r)).map((e) => '$e').toList();
      _line = "$intro${_round == 0 ? "I'm learning sums! Let me try.|" : ''}I think|${numberWordsCap[_sa]}!|Plus!|${numberWordsCap[_sb]}!|Makes!|${numberWordsCap[_claim]}!|Am I right?";
      setState(() {});
      Voice.say(_line);
      return;
    }
    if (_isShape) {
      _bibiRight = _r.nextDouble() < .3;
      _step = _Step.judge;
      _mood = Mood.think;
      _shape = Shape.values[_r.nextInt(Shape.values.length)];
      final others = Shape.values.where((x) => x != _shape).toList()..shuffle(_r);
      _claimShape = _bibiRight ? _shape : others.first;
      _shapeOptions = [_shape, others[0], others[1]]..shuffle(_r);
      _line = '$intro${_round == 0 ? "I'm learning shapes! Let me try.|" : ''}I think this is ${_claimShape == Shape.oval ? 'an' : 'a'} ${_claimShape.name}. Am I right?';
      setState(() {});
      Voice.say(_line);
      return;
    }
    _bibiRight = _r.nextDouble() < .3;
    _step = _Step.judge;
    _mood = _isCount ? Mood.think : Mood.read;
    if (_isCount) {
      final top = mode >= 3 ? 9 : (app.age <= 4 ? 5 : 8);
      _real = 2 + _r.nextInt(top - 1);
      _thing = things[_r.nextInt(things.length)];
      _claim = _bibiRight ? _real : (_r.nextBool() ? _real + 1 : _real - 1);
      final opts = {_real, _real + 1, _real - 1}.toList()..shuffle(_r);
      _options = opts.map((e) => '$e').toList();
      _line =
          '$intro${_round == 0 ? (mode >= 3 ? 'Big numbers are tricky! Let me try.' : 'I\'m learning to count! Let me try.') : 'Let me count these.'}|I think there ${_claim == 1 ? 'is' : 'are'} ${numberWords[_claim]}! Am I right?';
    } else {
      _pic = phonics[_r.nextInt(phonics.length)];
      final others = phonics.where((p) => p.letter != _pic.letter).toList()
        ..shuffle(_r);
      _claimLetter = _bibiRight ? _pic.letter : others.first.letter;
      _options = [_pic.letter, others[0].letter, others[1].letter]..shuffle(_r);
      _line =
          '$intro${thatsA(_pic.word)}|I think it starts with ${_claimLetter.toUpperCase()}. Am I right?';
    }
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _judge(bool childSaysRight) async {
    if (_busy) return;
    _busy = true;
    if (childSaysRight == _bibiRight) {
      if (_bibiRight) {
        Juice.correct(context);
        app.learned(_isShape ? Skill.shapes : (_isCount || _isSum ? Skill.numbers : Skill.letters));
        setState(() {
          _mood = Mood.cheer;
          _bounce++;
          _line = 'Yippee! I got one right! Thank you for checking, teacher!';
        });
        await Voice.say(_line);
        await _next();
      } else {
        Sfx.boing();
        setState(() {
          _mood = Mood.laugh;
          _step = _Step.teach;
          _wobble++;
          _line =
              '${Lines.pick('teach-silly', sillies)}|${_isSum ? 'How many does it really make?' : _isShape ? 'Which shape is it really?' : 'Can you teach me? ${_isCount ? 'How many are there really?' : 'Which letter does it start with?'}'}';
        });
        await Voice.say(_line);
      }
    } else {
      Juice.oops();
      setState(() {
        _wobble++;
        _line = _isSum
            ? "Let's add them up!|${_sumWords()}"
            : _isShape
            ? '${_shapeName(_shape)}|Ohhh! Now I know!'
            : _isCount
            ? 'Hmm, let\'s count together.|${List.generate(_real, (i) => '${numberWordsCap[i + 1]}!').join('|')}|There are ${numberWords[_real]}!'
            : '${_pic.chant}|It starts with ${_pic.letter.toUpperCase()}!';
      });
      await Voice.say(_line);
      await _next();
    }
    _busy = false;
  }

  String _sumWords() => '${numberWordsCap[_sa]}!|Plus!|${numberWordsCap[_sb]}!|Makes!|${numberWordsCap[_real]}!';

  String _shapeName(Shape x) => '${x == Shape.oval ? 'An' : 'A'} ${x.name}!';

  Future<void> _teach(String answer) async {
    if (_busy) return;
    _busy = true;
    final right = _isShape ? answer == _shape.name : (_isCount || _isSum ? answer == '$_real' : answer == _pic.letter);
    if (right) {
      final cheer = Juice.correct(context);
      app.learned(Skill.teaching, pts: 2);
      setState(() {
        _mood = Mood.dance;
        _bounce++;
        _line = _isSum
            ? '$cheer|${_sumWords()}|Ohhh! Now I know! You are the best teacher!'
            : _isShape
            ? '$cheer|${_shapeName(_shape)}|Ohhh! Now I know! You are the best teacher!'
            : _isCount
            ? '$cheer|${numberWordsCap[_real]}!|Ohhh! Now I know! You are the best teacher!'
            : '$cheer|${_pic.chant}|Ohhh! Now I know! You are the best teacher!';
      });
      await Voice.say(_line);
      await _next();
    } else {
      Juice.oops();
      setState(() {
        _wobble++;
        _line = _isSum
            ? 'Count them all together!'
            : _isShape
            ? 'Listen carefully and try again!|Which shape is it really?'
            : _isCount
            ? 'Hmm, shall we count them together? Tap each one.'
            : 'Listen carefully and try again!|${_pic.chant}';
      });
      await Voice.say(_line);
    }
    _busy = false;
  }

  Future<void> _next() async {
    _round++;
    if (!mounted) return;
    if (_round >= rounds) {
      finishGame(context, Skill.teaching, 'Teach $_name', game: 'teach', maxLevel: maxLevel);
    } else {
      if (_round == 4) await danceBreak(context);
      if (_round == 6 && mounted) await starCatch(context);
      if (mounted) _newRound();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'pip',
      scene: 'classroom',
      level: _level,
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
            child: _isSum
                ? Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Flexible(child: _CountBoard(key: ValueKey('a$_round'), count: _sa, emoji: _thing)),
                    Text(' + ', style: T.l(44, color: C.ink)),
                    Flexible(child: _CountBoard(key: ValueKey('b$_round'), count: _sb, emoji: _thing)),
                  ])
                : _isShape
                ? SizedBox(height: 150, child: Center(child: SizedBox(width: 130, height: 130, child: CustomPaint(painter: ShapePainter(_shape, C.berry)))))
                : _isCount
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
          else if (_step == _Step.teach && _isShape)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                for (final o in _shapeOptions)
                  Chunky(
                    color: C.paper,
                    shadow: C.shadow,
                    radius: 28,
                    padding: const EdgeInsets.all(16),
                    onTap: () => _teach(o.name),
                    child: SizedBox(width: 60, height: 60, child: CustomPaint(painter: ShapePainter(o, C.aqua))),
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
                      _isCount || _isSum ? o : '${o.toUpperCase()}$o',
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
