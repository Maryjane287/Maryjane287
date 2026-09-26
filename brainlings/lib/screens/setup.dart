import 'package:flutter/material.dart';

import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'hatch.dart';
import 'name_recorder.dart';

const circleSuggestions = [
  'Mummy',
  'Daddy',
  'Grandma',
  'Grandad',
  'Nana',
  'Auntie',
  'Uncle',
  'Big Sister',
  'Big Brother',
];

/// First run. A warm, short setup for the grown-up.
class SetupScreen extends StatefulWidget {
  const SetupScreen({super.key});

  @override
  State<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen> {
  final _pages = PageController();
  final _name = TextEditingController(text: app.childName);
  final _custom = TextEditingController();
  int _page = 0;

  void _go(int p) {
    FocusScope.of(context).unfocus();
    setState(() => _page = p);
    _pages.animateToPage(
      p,
      duration: const Duration(milliseconds: 450),
      curve: Curves.easeOutCubic,
    );
  }

  void _finish() {
    app.childName = _name.text.trim();
    app.setupDone = true;
    app.save();
    Navigator.of(context).pushReplacement(softRoute(const HatchScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final kid = _name.text.trim().isEmpty
        ? 'your little one'
        : _name.text.trim();
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 12),
              RoundDots(total: 5, done: _page),
              Expanded(
                child: PageView(
                  controller: _pages,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _card([
                      const Center(
                        child: SizedBox(
                          height: 260,
                          child: Scene(
                            'wave',
                            loop: true,
                            placeholder: Bibi(size: 170, showGrowth: false),
                          ),
                        ),
                      ),
                      const Eyebrow('Welcome to Brainlings'),
                      Text(
                        'Learn, grow, and hear from the people who love you.',
                        style: T.d(30),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Your child will hatch their very own creature. It only grows when they learn, '
                        'and it brings them voice letters from the family, even from far away.',
                        style: T.b(16, color: C.inkSoft),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'This takes about a minute. No ads, ever.',
                        style: T.b(16, color: C.inkSoft),
                      ),
                      const SizedBox(height: 20),
                      _next('Let\'s begin', () => _go(1)),
                    ]),
                    _card([
                      const Eyebrow('About your child'),
                      Text('What should we call them?', style: T.d(28)),
                      const SizedBox(height: 6),
                      Text(
                        'A first name or a nickname is perfect. That is all we need.',
                        style: T.b(15, color: C.inkSoft),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: _name,
                        textCapitalization: TextCapitalization.words,
                        style: T.d(22),
                        decoration: const InputDecoration(
                          hintText: 'e.g. Chris',
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                      const SizedBox(height: 18),
                      Text('How old?', style: T.d(20)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 10,
                        children: [
                          for (final a in [4, 5, 6, 7])
                            ChoiceChip(
                              label: Text('$a', style: T.d(20)),
                              selected: app.age == a,
                              selectedColor: C.sun,
                              onSelected: (_) => setState(() => app.age = a),
                            ),
                        ],
                      ),
                      const SizedBox(height: 22),
                      _next('Next', () => _go(2)),
                    ]),
                    _card([
                      const Eyebrow('Family circle'),
                      Text('Who will send $kid letters?', style: T.d(28)),
                      const SizedBox(height: 6),
                      Text(
                        'Record a voice letter from any of them in the grown-up area, and $kid\'s creature will deliver it. '
                        'Soon they will be able to send letters from their own phones too. Only the people you choose, never strangers.',
                        style: T.b(15, color: C.inkSoft),
                      ),
                      const SizedBox(height: 14),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final p in {...circleSuggestions, ...app.circle})
                            FilterChip(
                              label: Text(
                                p,
                                style: T.b(16, w: FontWeight.w800),
                              ),
                              selected: app.circle.contains(p),
                              selectedColor: C.sun,
                              onSelected: (on) => setState(
                                () => on
                                    ? app.circle.add(p)
                                    : app.circle.remove(p),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _custom,
                              textCapitalization: TextCapitalization.words,
                              decoration: const InputDecoration(
                                hintText: 'Someone else (e.g. Auntie Mia)',
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton.filled(
                            style: IconButton.styleFrom(
                              backgroundColor: C.leaf,
                            ),
                            onPressed: () {
                              final v = _custom.text.trim();
                              if (v.isNotEmpty && !app.circle.contains(v)) {
                                setState(() => app.circle.add(v));
                              }
                              _custom.clear();
                            },
                            icon: const Icon(Icons.add_rounded),
                          ),
                        ],
                      ),
                      const SizedBox(height: 22),
                      _next('Next', app.circle.isEmpty ? null : () => _go(3)),
                    ]),
                    _card([
                      const Eyebrow('Your voice (optional)'),
                      Text('Say $kid\'s name, just once', style: T.d(28)),
                      const SizedBox(height: 6),
                      Text(
                        'Children light up when they hear their name said the way you say it. '
                        'The creature will use your recording whenever it calls $kid by name, like '
                        '"$kid! You got a message!" It stays on this phone.',
                        style: T.b(15, color: C.inkSoft),
                      ),
                      const SizedBox(height: 14),
                      VoiceRecorder(
                        fileName: 'child-name',
                        onTrimmed: (a, b) {
                          app.nameClipStartMs = a;
                          app.nameClipEndMs = b;
                          app.save();
                        },
                        existing: app.nameClipPath,
                        maxSeconds: 5,
                        onSaved: (p) => setState(() => app.nameClipPath = p),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Skip it if you like. We will say the name ourselves.',
                        style: T.b(13, color: C.inkSoft),
                      ),
                      const SizedBox(height: 22),
                      _next(
                        app.nameClipPath == null ? 'Skip for now' : 'Next',
                        () => _go(4),
                      ),
                    ]),
                    _card([
                      const Eyebrow('Healthy play'),
                      Text(
                        'How long can they play each day?',
                        style: T.d(28),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'After this much play each day, the creature yawns, snuggles down and says "See you tomorrow!" '
                        'No battles, no tears. You can wake it from the grown-up area.',
                        style: T.b(15, color: C.inkSoft),
                      ),
                      const SizedBox(height: 14),
                      PlayTimePicker(
                        value: app.bedtimeMinutes,
                        onChanged: (m) => setState(() => app.bedtimeMinutes = m),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF6D6),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          'Privacy promise: we keep only a first name, an age and your family circle. '
                          'No ads. No chat with other children. Recordings stay on this phone.',
                          style: T.b(14),
                        ),
                      ),
                      const SizedBox(height: 22),
                      _next('Hand the phone to $kid', _finish, big: true),
                    ]),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _card(List<Widget> children) => Center(
    child: SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 460),
        child: Column(
          children: [
            GrownCard(children: children),
            if (_page > 0)
              TextButton(
                onPressed: () => _go(_page - 1),
                child: Text('Back', style: T.d(18, color: C.ink)),
              ),
          ],
        ),
      ),
    ),
  );

  Widget _next(String label, VoidCallback? onTap, {bool big = false}) => Chunky(
    color: big ? C.leaf : C.sun,
    shadow: big ? C.leafDeep : C.sunDeep,
    onTap: onTap,
    child: Text(
      label,
      style: T.d(big ? 22 : 20, color: big ? Colors.white : C.ink),
    ),
  );
}
