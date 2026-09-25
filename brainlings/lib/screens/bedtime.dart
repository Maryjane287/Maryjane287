import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'gate.dart';
import 'home.dart';

/// The daily play time is up. The creature yawns, hears any bedtime
/// message from the family, and drifts off. "See you tomorrow!"
class BedtimeScreen extends StatefulWidget {
  const BedtimeScreen({super.key});

  @override
  State<BedtimeScreen> createState() => _BedtimeScreenState();
}

class _BedtimeScreenState extends State<BedtimeScreen> with SingleTickerProviderStateMixin {
  late final _zz = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat();
  String _line = '';
  Letter? _hugAsk;
  bool _asleep = false;
  int _bounce = 0;

  @override
  void initState() {
    super.initState();
    final alreadyAsleep = app.asleepToday;
    app.goToSleep();
    WidgetsBinding.instance.addPostFrameCallback((_) => alreadyAsleep ? _sleep(quiet: true) : _run());
  }

  @override
  void dispose() {
    _zz.dispose();
    super.dispose();
  }

  Future<void> _say(String s) async {
    if (!mounted) return;
    setState(() => _line = s);
    await Voice.say(s);
  }

  Future<void> _run() async {
    Sfx.yawn();
    await _say('Yaaawn... I\'m getting sooo sleepy, {name}.');
    // One gentle reminder, only once per letter.
    final remind = app.hugReminder;
    if (remind != null && mounted) {
      remind.reminded = true;
      app.save();
      setState(() => _hugAsk = remind);
      await _say('Before I sleep... ${remind.from} would love a hug back. Shall we send one?');
      return; // continues from the buttons
    }
    await _afterHug();
  }

  Future<void> _answerHug(bool yes) async {
    final l = _hugAsk!;
    setState(() => _hugAsk = null);
    if (yes) {
      l.hugSent = true;
      app.save();
      Sfx.hug();
      celebrate(context, count: 22, hearts: true);
      setState(() => _bounce++);
      await _say('Whoosh! Your hug is on its way to ${l.from}.');
    }
    await _afterHug();
  }

  Future<void> _afterHug() async {
    final bed = app.bedtimeLetter;
    if (bed != null && mounted) {
      await _say('Ooh! ${bed.from} left you a special bedtime message.');
      bed.opened = true;
      bed.plays++;
      app.save();
      final audio = bed.audioPath;
      if (audio != null && File(audio).existsSync()) {
        await Voice.playFile(audio);
      } else if (bed.text.isNotEmpty) {
        await Voice.say(bed.text);
      }
    }
    await _say('Night night, {name}. Thank you for playing with me. See you tomorrow!');
    _sleep();
  }

  void _sleep({bool quiet = false}) {
    if (!mounted) return;
    setState(() {
      _asleep = true;
      if (quiet) _line = 'Shhh... I\'m sleeping. See you tomorrow, {name}!';
    });
  }

  Future<void> _wake() async {
    if (!await grownUpGate(context)) return;
    app.wakeUp();
    if (mounted) Navigator.of(context).pushReplacement(softRoute(const HomeScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        forceTime: SkyTime.night,
        child: SafeArea(
          child: Stack(
            children: [
              Positioned(
                top: 8,
                right: 16,
                child: Opacity(
                  opacity: .7,
                  child: RoundIcon(icon: Icons.lock_rounded, label: 'Grown-ups', onTap: _wake),
                ),
              ),
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Bubble(_line),
                      const SizedBox(height: 16),
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Bibi(
                            mood: _hugAsk != null ? Mood.happy : Mood.sleepy,
                            size: 250,
                            bounce: _bounce,
                            onTap: () => _asleep ? Voice.say('Shhh... I\'m dreaming about you, {name}.') : null,
                          ),
                          if (_asleep)
                            for (var i = 0; i < 3; i++)
                              AnimatedBuilder(
                                animation: _zz,
                                builder: (_, _) {
                                  final t = (_zz.value + i / 3) % 1;
                                  return Positioned(
                                    right: 10 - t * 20 + sin(t * pi * 2) * 10,
                                    top: 40 - t * 90,
                                    child: Opacity(
                                      opacity: sin(t * pi),
                                      child: Text('z', style: T.d(26 + i * 8.0, color: Colors.white)),
                                    ),
                                  );
                                },
                              ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (_hugAsk != null)
                        Wrap(
                          alignment: WrapAlignment.center,
                          spacing: 14,
                          runSpacing: 14,
                          children: [
                            Chunky(
                              color: C.berry,
                              shadow: C.berryDeep,
                              onTap: () => _answerHug(true),
                              child: const Row(mainAxisSize: MainAxisSize.min, children: [
                                Text('🤗', style: TextStyle(fontSize: 30)),
                                SizedBox(width: 8),
                                Text('Send a hug'),
                              ]),
                            ),
                            Chunky(color: C.paper, shadow: C.shadow, onTap: () => _answerHug(false), child: const Text('Not tonight')),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
