import 'package:flutter/material.dart';

import '../services/music.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'name_recorder.dart';
import 'setup.dart';

/// The grown-up area: progress, family letters, and settings.
class GrownUpsScreen extends StatefulWidget {
  const GrownUpsScreen({super.key});

  @override
  State<GrownUpsScreen> createState() => _GrownUpsScreenState();
}

class _GrownUpsScreenState extends State<GrownUpsScreen> {
  late final _name = TextEditingController(text: app.childName);
  late final _creature = TextEditingController(text: app.creatureName);

  String get kid => app.displayName;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: ListenableBuilder(
            listenable: app,
            builder: (context, _) => ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Row(
                  children: [
                    RoundIcon(
                      icon: Icons.arrow_back_rounded,
                      label: 'Back to play',
                      onTap: () => Navigator.of(context).pop(),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Text('Hello, grown-up', style: T.d(28))),
                  ],
                ),
                const SizedBox(height: 16),
                _progress(),
                _letters(),
                _settings(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _stat(String big, String small) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: const Color(0xFFF6F4FE),
      borderRadius: BorderRadius.circular(16),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(big, style: T.d(26)),
        Text(small, style: T.b(13, color: C.inkSoft)),
      ],
    ),
  );

  Widget _progress() {
    final p = app.points;
    final mins = app.playedSecondsToday ~/ 60;
    final growth = switch (app.look) {
      GrowthLook.baby =>
        '${app.creatureName} is still a baby. A little more learning and it will start to grow.',
      GrowthLook.starry =>
        '${app.creatureName} is growing sparkly stars, because $kid loves numbers.',
      GrowthLook.bookish =>
        '${app.creatureName} is wearing a book hat, because $kid loves letters.',
      GrowthLook.balanced =>
        '${app.creatureName} has stars and a book hat: $kid is learning a bit of everything.',
    };
    final recent = app.feelings.reversed.take(7).toList();
    return GrownCard(
      children: [
        const Eyebrow('Look how much they learned'),
        Text('$kid\'s progress', style: T.d(26)),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 2.1,
          children: [
            _stat('${p[Skill.numbers]}', 'counting answers'),
            _stat('${p[Skill.letters]}', 'letter sounds'),
            _stat('${p[Skill.shapes]}', 'shapes found'),
            _stat('${p[Skill.patterns]}', 'patterns solved'),
            _stat(
              '${p[Skill.teaching]! ~/ 2}',
              'times they taught ${app.creatureName}',
            ),
            _stat('$mins min', 'played today (of ${app.bedtimeMinutes})'),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF6D6),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text('${app.stageName} stage. $growth', style: T.b(15)),
        ),
        if (recent.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text('Feelings check-ins', style: T.d(18)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final f in recent)
                Chip(
                  label: Text(
                    '${_feelEmoji(f.split('|').last)} ${_day(f.split('|').first)}',
                    style: T.b(14),
                  ),
                  backgroundColor: const Color(0xFFF6F4FE),
                  side: BorderSide.none,
                ),
            ],
          ),
        ],
      ],
    );
  }

  String _feelEmoji(String f) =>
      const {
        'happy': '😊',
        'sad': '😢',
        'tired': '😴',
        'worried': '😟',
        'cross': '😠',
      }[f] ??
      '🙂';

  String _day(String key) {
    if (key == AppState.dayKey()) return 'Today';
    if (key ==
        AppState.dayKey(DateTime.now().subtract(const Duration(days: 1)))) {
      return 'Yesterday';
    }
    final parts = key.split('-');
    return '${parts[2]}/${parts[1]}';
  }

  Widget _letters() {
    final list = app.letters.reversed.toList();
    return GrownCard(
      children: [
        const Eyebrow('Letters from home'),
        Text('Voice letters', style: T.d(26)),
        const SizedBox(height: 6),
        Text(
          'Soon, everyone in your family circle will get their own link by WhatsApp or email to record letters from anywhere. '
          'For now, you can record one right here and ${app.creatureName} will deliver it.',
          style: T.b(15, color: C.inkSoft),
        ),
        const SizedBox(height: 12),
        FilledButton.icon(
          style: FilledButton.styleFrom(
            backgroundColor: C.berry,
            minimumSize: const Size.fromHeight(54),
            textStyle: T.d(18),
          ),
          onPressed: () =>
              Navigator.of(context).push(softRoute(const RecordLetterScreen())),
          icon: const Icon(Icons.mail_rounded),
          label: const Text('Send a letter'),
        ),
        if (list.isNotEmpty) const SizedBox(height: 12),
        for (final l in list)
          Container(
            margin: const EdgeInsets.only(top: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF6F4FE),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Text(
                  l.bedtime ? '🌙' : (l.audioPath != null ? '🎙️' : '✉️'),
                  style: const TextStyle(fontSize: 28),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'From ${l.from}${l.bedtime ? ' (bedtime)' : ''}',
                        style: T.d(17),
                      ),
                      Text(_status(l), style: T.b(14, color: C.inkSoft)),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  String _status(Letter l) {
    if (!l.opened) {
      return l.bedtime ? 'Waiting for bedtime' : 'Waiting in $kid\'s letterbox';
    }
    final times = l.plays == 1
        ? 'once'
        : (l.plays == 2 ? 'twice' : '${l.plays} times');
    final heard = '$kid listened to your message (played it $times)';
    return l.hugSent ? '$heard and sent you a hug back 🤗' : heard;
  }

  Widget _settings() {
    return GrownCard(
      children: [
        const Eyebrow('Settings'),
        Text('About $kid', style: T.d(26)),
        const SizedBox(height: 12),
        TextField(
          controller: _name,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(
            labelText: 'First name or nickname',
          ),
          onChanged: (v) {
            app.childName = v.trim();
            app.save();
          },
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _creature,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(labelText: 'Creature\'s name'),
          onChanged: (v) {
            if (v.trim().isEmpty) return;
            app.creatureName = v.trim();
            app.save();
          },
        ),
        const SizedBox(height: 12),
        Text('Age', style: T.d(18)),
        Wrap(
          spacing: 10,
          children: [
            for (final a in [4, 5, 6, 7])
              ChoiceChip(
                label: Text('$a', style: T.d(18)),
                selected: app.age == a,
                selectedColor: C.sun,
                onSelected: (_) {
                  app.age = a;
                  app.save();
                },
              ),
          ],
        ),
        const SizedBox(height: 16),
        Text('$kid\'s name in your voice', style: T.d(18)),
        const SizedBox(height: 6),
        VoiceRecorder(
          fileName: 'child-name',
                        onTrimmed: (a, b) {
                          app.nameClipStartMs = a;
                          app.nameClipEndMs = b;
                          app.save();
                        },
          existing: app.nameClipPath,
          maxSeconds: 5,
          onSaved: (p) {
            app.nameClipPath = p;
            app.save();
          },
        ),
        const SizedBox(height: 16),
        Text('Family circle', style: T.d(18)),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final p in {...circleSuggestions, ...app.circle})
              FilterChip(
                label: Text(p),
                selected: app.circle.contains(p),
                selectedColor: C.sun,
                onSelected: (on) {
                  on ? app.circle.add(p) : app.circle.remove(p);
                  app.save();
                },
              ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          'Sleepy time after ${app.bedtimeMinutes} minutes a day',
          style: T.d(18),
        ),
        Slider(
          value: app.bedtimeMinutes.toDouble(),
          min: 10,
          max: 60,
          divisions: 10,
          activeColor: C.lilacDeep,
          onChanged: (v) {
            app.bedtimeMinutes = v.round();
            app.save();
          },
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: Text('Background music', style: T.d(18)),
          subtitle: Text('Gentle tunes while your child plays', style: T.b(14, color: C.inkSoft)),
          value: app.musicOn,
          activeThumbColor: C.lilacDeep,
          onChanged: (on) {
            app.musicOn = on;
            app.save();
            if (!on) Music.stop();
          },
        ),
        if (app.asleepToday || app.bedtimeDue)
          OutlinedButton.icon(
            onPressed: () {
              app.wakeUp();
              Voice.say('I\'m awake! Let\'s play a little more.');
            },
            icon: const Icon(Icons.wb_sunny_rounded),
            label: Text('Wake ${app.creatureName} up for more play'),
          ),
        const SizedBox(height: 20),
        TextButton(
          onPressed: _confirmReset,
          child: Text(
            'Start again from the beginning',
            style: T.b(15, color: C.berryDeep, w: FontWeight.w800),
          ),
        ),
      ],
    );
  }

  Future<void> _confirmReset() async {
    final yes = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Start again?'),
        content: Text(
          'This clears $kid\'s creature, stars, stickers and letters on this phone. It cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(c, false),
            child: const Text('Keep everything'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(c, true),
            child: const Text('Start again'),
          ),
        ],
      ),
    );
    if (yes == true && mounted) {
      app.resetAll();
      Navigator.of(context)
          .pushAndRemoveUntil(softRoute(const SetupScreen()), (_) => false);
    }
  }
}

/// A grown-up records (or writes) a letter for the child.
class RecordLetterScreen extends StatefulWidget {
  const RecordLetterScreen({super.key});

  @override
  State<RecordLetterScreen> createState() => _RecordLetterScreenState();
}

class _RecordLetterScreenState extends State<RecordLetterScreen> {
  late String _from = app.circle.isNotEmpty ? app.circle.first : 'Mummy';
  final _text = TextEditingController();
  String? _audio;
  bool _bedtime = false;

  bool get _ready => _audio != null || _text.text.trim().isNotEmpty;

  void _send() {
    app.addLetter(
      Letter(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        from: _from,
        sentAt: DateTime.now(),
        text: _text.text.trim(),
        audioPath: _audio,
        bedtime: _bedtime,
      ),
    );
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _bedtime
              ? 'Saved for bedtime. ${app.creatureName} will play it as it falls asleep.'
              : '${app.creatureName} will bring it to ${app.displayName} next time they play.',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final kid = app.displayName;
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: RoundIcon(
                  icon: Icons.arrow_back_rounded,
                  label: 'Back',
                  onTap: () => Navigator.of(context).pop(),
                ),
              ),
              const SizedBox(height: 16),
              GrownCard(
                children: [
                  Eyebrow('A letter for $kid'),
                  Text('Who is it from?', style: T.d(24)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final p in app.circle)
                        ChoiceChip(
                          label: Text(p, style: T.b(16, w: FontWeight.w800)),
                          selected: _from == p,
                          selectedColor: C.sun,
                          onSelected: (_) => setState(() => _from = p),
                        ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text('Record your voice', style: T.d(22)),
                  const SizedBox(height: 4),
                  Text(
                    'A few warm words is plenty. Up to two minutes.',
                    style: T.b(14, color: C.inkSoft),
                  ),
                  const SizedBox(height: 10),
                  VoiceRecorder(
                    fileName: 'letter',
                    onSaved: (p) => setState(() => _audio = p),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Or write it, and ${app.creatureName} will read it aloud',
                    style: T.d(18),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _text,
                    minLines: 2,
                    maxLines: 4,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText:
                          'I\'m so proud of you, $kid. Love you to the moon!',
                    ),
                  ),
                  const SizedBox(height: 12),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    value: _bedtime,
                    activeThumbColor: C.lilacDeep,
                    onChanged: (v) => setState(() => _bedtime = v),
                    title: Text('Save it for bedtime', style: T.d(17)),
                    subtitle: Text(
                      'Played when ${app.creatureName} falls asleep',
                      style: T.b(13, color: C.inkSoft),
                    ),
                  ),
                  const SizedBox(height: 12),
                  FilledButton.icon(
                    style: FilledButton.styleFrom(
                      backgroundColor: C.leaf,
                      minimumSize: const Size.fromHeight(56),
                      textStyle: T.d(19),
                    ),
                    onPressed: _ready ? _send : null,
                    icon: const Icon(Icons.send_rounded),
                    label: Text('Send to $kid'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
