import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A voice (or written) letter from someone in the family circle.
class Letter {
  Letter({
    required this.id,
    required this.from,
    required this.sentAt,
    this.text = '',
    this.audioPath,
    this.bedtime = false,
    this.opened = false,
    this.plays = 0,
    this.hugSent = false,
    this.reminded = false,
  });

  final String id;
  final String from;
  final DateTime sentAt;
  final String text;
  final String? audioPath;

  /// Bedtime letters are kept for when the creature falls asleep.
  final bool bedtime;
  bool opened;
  int plays;
  bool hugSent;
  bool reminded;

  Map<String, dynamic> toJson() => {
    'id': id,
    'from': from,
    'sentAt': sentAt.toIso8601String(),
    'text': text,
    'audioPath': audioPath,
    'bedtime': bedtime,
    'opened': opened,
    'plays': plays,
    'hugSent': hugSent,
    'reminded': reminded,
  };

  factory Letter.fromJson(Map<String, dynamic> j) => Letter(
    id: j['id'],
    from: j['from'],
    sentAt: DateTime.parse(j['sentAt']),
    text: j['text'] ?? '',
    audioPath: j['audioPath'],
    bedtime: j['bedtime'] ?? false,
    opened: j['opened'] ?? false,
    plays: j['plays'] ?? 0,
    hugSent: j['hugSent'] ?? false,
    reminded: j['reminded'] ?? false,
  );
}

enum Skill { numbers, letters, shapes, patterns, teaching }

enum GrowthLook { baby, starry, bookish, balanced }

/// Everything the app remembers. Stored only on this device.
class AppState extends ChangeNotifier {
  static const _key = 'brainlings.v1';
  SharedPreferences? _prefs;

  // Setup (behind the grown-ups gate). We keep as little as possible.
  bool setupDone = false;
  String childName = '';
  int age = 5;
  String? nameClipPath; // the grown-up saying the child's name
  List<String> circle = ['Mummy'];
  int bedtimeMinutes = 20;
  bool musicOn = true;

  /// Where the grown-up's voice starts and stops inside the name recording,
  /// so the name plays straight away with no silence around it.
  int? nameClipStartMs;
  int? nameClipEndMs;

  // Creature
  bool hatched = false;
  String creatureName = 'Bibi';

  // Progress
  int stars = 0;
  Map<Skill, int> points = {for (final s in Skill.values) s: 0};
  List<String> stickers = [];
  List<String> feelings = []; // "2026-09-25|happy"

  // Bibi's friends who have moved into the meadow
  List<String> friendsMet = [];
  String lastFriendDay = '';

  // Each game has levels. A finished level unlocks the next one.
  Map<String, int> levels = {};

  // Family
  List<Letter> letters = [];

  // Today
  String playDay = '';
  int playedSecondsToday = 0;
  String bedtimeDay = '';

  String get displayName =>
      childName.trim().isEmpty ? 'little friend' : childName.trim();

  int get totalPoints => points.values.fold(0, (a, b) => a + b);

  /// 0 = baby, 1 = sprout, 2 = bloom, 3 = super.
  int get stage {
    final t = totalPoints;
    if (t >= 60) return 3;
    if (t >= 30) return 2;
    if (t >= 10) return 1;
    return 0;
  }

  String get stageName => const ['Baby', 'Sprout', 'Bloom', 'Superstar'][stage];

  /// Progress (0..1) towards the next stage.
  double get stageProgress {
    const edges = [0, 10, 30, 60, 100];
    final t = totalPoints.clamp(0, 100);
    final lo = edges[stage], hi = edges[stage + 1];
    return ((t - lo) / (hi - lo)).clamp(0.0, 1.0);
  }

  /// The creature grows in the direction of what the child learns most.
  GrowthLook get look {
    if (stage == 0) return GrowthLook.baby;
    final n = points[Skill.numbers]! + points[Skill.shapes]! ~/ 2;
    final l = points[Skill.letters]!;
    if (n >= l + 4) return GrowthLook.starry;
    if (l >= n + 4) return GrowthLook.bookish;
    return GrowthLook.balanced;
  }

  static String dayKey([DateTime? d]) {
    final t = d ?? DateTime.now();
    return '${t.year}-${t.month.toString().padLeft(2, '0')}-${t.day.toString().padLeft(2, '0')}';
  }

  bool get feelingDoneToday =>
      feelings.any((f) => f.startsWith('${dayKey()}|'));

  bool get asleepToday => bedtimeDay == dayKey();

  bool get bedtimeDue =>
      bedtimeMinutes > 0 && playedSecondsToday >= bedtimeMinutes * 60;

  List<Letter> get unopened =>
      letters.where((l) => !l.opened && !l.bedtime).toList();

  Letter? get bedtimeLetter {
    final l = letters.where((l) => l.bedtime && !l.opened).toList();
    return l.isEmpty ? null : l.last;
  }

  /// A letter the child listened to but has not hugged back, and has not yet been reminded about.
  Letter? get hugReminder {
    for (final l in letters.reversed) {
      if (l.opened && !l.hugSent && !l.reminded) return l;
    }
    return null;
  }

  // ---------- persistence ----------

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    final raw = _prefs!.getString(_key);
    if (raw != null) {
      try {
        final j = jsonDecode(raw) as Map<String, dynamic>;
        setupDone = j['setupDone'] ?? false;
        childName = j['childName'] ?? '';
        age = j['age'] ?? 5;
        nameClipPath = j['nameClipPath'];
        circle = List<String>.from(j['circle'] ?? ['Mummy']);
        bedtimeMinutes = j['bedtimeMinutes'] ?? 20;
        musicOn = j['musicOn'] ?? true;
        nameClipStartMs = j['nameClipStartMs'];
        nameClipEndMs = j['nameClipEndMs'];
        hatched = j['hatched'] ?? false;
        creatureName = j['creatureName'] ?? 'Bibi';
        stars = j['stars'] ?? 0;
        final p = (j['points'] as Map?) ?? {};
        for (final s in Skill.values) {
          points[s] = (p[s.name] as int?) ?? 0;
        }
        stickers = List<String>.from(j['stickers'] ?? []);
        feelings = List<String>.from(j['feelings'] ?? []);
        friendsMet = List<String>.from(j['friendsMet'] ?? []);
        lastFriendDay = j['lastFriendDay'] ?? '';
        levels = Map<String, int>.from(j['levels'] ?? {});
        letters = ((j['letters'] as List?) ?? [])
            .map((e) => Letter.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        playDay = j['playDay'] ?? '';
        playedSecondsToday = j['playedSecondsToday'] ?? 0;
        bedtimeDay = j['bedtimeDay'] ?? '';
      } catch (_) {
        // A broken save should never stop a child from playing.
      }
    }
    _rollDay();
  }

  Future<void> save() async {
    notifyListeners();
    await _prefs?.setString(
      _key,
      jsonEncode({
        'setupDone': setupDone,
        'childName': childName,
        'age': age,
        'nameClipPath': nameClipPath,
        'circle': circle,
        'bedtimeMinutes': bedtimeMinutes,
        'musicOn': musicOn,
        'nameClipStartMs': nameClipStartMs,
        'nameClipEndMs': nameClipEndMs,
        'hatched': hatched,
        'creatureName': creatureName,
        'stars': stars,
        'points': {for (final e in points.entries) e.key.name: e.value},
        'stickers': stickers,
        'feelings': feelings,
        'friendsMet': friendsMet,
        'lastFriendDay': lastFriendDay,
        'levels': levels,
        'letters': letters.map((l) => l.toJson()).toList(),
        'playDay': playDay,
        'playedSecondsToday': playedSecondsToday,
        'bedtimeDay': bedtimeDay,
      }),
    );
  }

  void _rollDay() {
    final today = dayKey();
    if (playDay != today) {
      playDay = today;
      playedSecondsToday = 0;
    }
  }

  // ---------- actions ----------

  void learned(Skill s, {int pts = 1}) {
    points[s] = points[s]! + pts;
    save();
  }

  /// The level (1 up) this game will play next.
  int levelOf(String game) => levels[game] ?? 1;

  /// Moves the game on to its next level. Returns true if something new unlocked.
  bool levelUp(String game, int maxLevel) {
    final now = levelOf(game);
    levels[game] = now + 1;
    save();
    return now < maxLevel;
  }

  void addStars(int n) {
    stars += n;
    save();
  }

  void addSticker(String s) {
    if (!stickers.contains(s)) stickers.add(s);
    save();
  }

  void logFeeling(String feeling) {
    feelings.add('${dayKey()}|$feeling');
    save();
  }

  void tickPlay(int seconds) {
    _rollDay();
    if (asleepToday) return;
    playedSecondsToday += seconds;
    save();
  }

  void goToSleep() {
    bedtimeDay = dayKey();
    save();
  }

  void wakeUp() {
    bedtimeDay = '';
    playedSecondsToday = 0;
    save();
  }

  void addLetter(Letter l) {
    letters.add(l);
    save();
  }

  void resetAll() {
    setupDone = false;
    childName = '';
    age = 5;
    nameClipPath = null;
    circle = ['Mummy'];
    bedtimeMinutes = 20;
    hatched = false;
    creatureName = 'Bibi';
    stars = 0;
    points = {for (final s in Skill.values) s: 0};
    stickers = [];
    friendsMet = [];
    lastFriendDay = '';
    levels = {};
    feelings = [];
    letters = [];
    playedSecondsToday = 0;
    bedtimeDay = '';
    save();
  }
}

final app = AppState();
