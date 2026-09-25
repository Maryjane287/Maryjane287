import 'dart:async';
import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../state.dart';
import 'music.dart';
import 'voice_clips.dart';

/// Everything is spoken aloud, because most players cannot read yet.
///
/// Bibi has a real recorded voice for every line in [voiceClips]. A line can
/// be built from several recorded pieces joined with `|`, for example
/// `'This is B. It says buh.|Which picture starts with buh?'`.
/// `{name}` is the child's name: the grown-up's own recording if they made
/// one, otherwise the phone's voice. Anything not recorded falls back to the
/// phone's voice too, so nothing is ever silent.
class Voice {
  static final _tts = FlutterTts();
  static final _clip = AudioPlayer();
  static bool _ready = false;
  static int _generation = 0;
  static int _active = 0;

  /// True while a line is being spoken, so friends can wait their turn.
  static bool get speaking => _active > 0;

  static Future<void> init() async {
    if (_ready) return;
    try {
      await _tts.awaitSpeakCompletion(true);
      final langs =
          (await _tts.getLanguages as List?)?.map((e) => '$e').toList() ?? [];
      for (final lang in ['en-GB', 'en-US', 'en-AU', 'en']) {
        if (langs.contains(lang)) {
          await _tts.setLanguage(lang);
          break;
        }
      }
      await _tts.setSpeechRate(.42);
      await _tts.setPitch(1.18);
      await _tts.setVolume(1);
    } catch (_) {}
    _ready = true;
  }

  static String _key(String s) => s
      .toLowerCase()
      .replaceAll('’', "'")
      .replaceAll(RegExp(r"[^a-z0-9' ]"), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();

  /// True when this exact line has a recording.
  static bool hasClip(String s) => voiceClips.containsKey(_key(s));

  /// Speaks a line. A new line interrupts the previous one.
  /// Recorded pieces are loaded ahead of time so they flow with no gaps.
  static Future<void> say(String text) async {
    await init();
    final gen = ++_generation;
    await stop(bumpGeneration: false);
    final nameClip = app.nameClipPath;
    final hasNameClip = nameClip != null && File(nameClip).existsSync();

    // Split into pieces: recorded clips, the name, or phone speech.
    final pieces = <_Piece>[];
    final byName = text.split('{name}');
    for (var i = 0; i < byName.length; i++) {
      for (final raw in byName[i].split('|')) {
        final chunk = raw.trim();
        if (_key(chunk).isEmpty) continue;
        final clip = voiceClips[_key(chunk)];
        pieces.add(clip != null ? _Piece.asset('voice/$clip.mp3') : _Piece.speak(chunk));
      }
      if (i < byName.length - 1) {
        pieces.add(hasNameClip
            ? _Piece.file(nameClip, app.nameClipStartMs, app.nameClipEndMs)
            : _Piece.speak(app.displayName));
      }
    }
    if (pieces.isEmpty) return;

    Music.duck(true);
    _active++;
    try {
      final ready = <int, Future<void>>{};
      Future<void> prepare(int i) => ready[i] ??= _prepare(pieces[i], _players[i % _players.length]);
      prepare(0);
      if (pieces.length > 1) prepare(1);
      for (var i = 0; i < pieces.length; i++) {
        if (gen != _generation) return;
        await prepare(i);
        if (i + 1 < pieces.length) prepare(i + 1);
        if (gen != _generation) return;
        await _playPiece(pieces[i], _players[i % _players.length]);
      }
    } finally {
      _active--;
      if (gen == _generation) Music.duck(false);
    }
  }

  static final _players = List.generate(3, (_) => AudioPlayer()..setReleaseMode(ReleaseMode.stop));

  static Future<void> _prepare(_Piece p, AudioPlayer player) async {
    if (p.speech != null) return;
    try {
      await player.setSource(p.asset != null ? AssetSource(p.asset!) : DeviceFileSource(p.file!));
      if (p.startMs != null && p.startMs! > 0) await player.seek(Duration(milliseconds: p.startMs!));
    } catch (_) {}
  }

  static Future<void> _playPiece(_Piece p, AudioPlayer player) async {
    if (p.speech != null) return _speak(p.speech!);
    try {
      final done = player.onPlayerComplete.first;
      await player.resume();
      if (p.startMs != null && p.endMs != null && p.endMs! > p.startMs!) {
        // Stop right where the grown-up's voice ends: no silence after the name.
        await Future.any([done, Future.delayed(Duration(milliseconds: p.endMs! - p.startMs!))]);
        await player.stop();
      } else {
        await done.timeout(const Duration(seconds: 20));
      }
    } catch (_) {}
  }

  /// Picks the line recorded for this family member, or a general recorded
  /// line when the name is one the grown-up typed in themselves.
  static String pick(String personal, String general) =>
      hasClip(personal) ? personal : general;

  /// Several lines one after another, as one speech.
  static Future<void> sayAll(List<String> lines) => say(lines.join('|'));

  static Future<void> _speak(String s) async {
    try {
      await _tts.speak(s);
    } catch (_) {}
  }

  /// Plays a recorded file and waits until it finishes.
  static Future<void> playFile(String path) async {
    try {
      final done = _clip.onPlayerComplete.first;
      await _clip.play(DeviceFileSource(path));
      await done.timeout(const Duration(minutes: 3));
    } catch (_) {}
  }

  static Future<void> stop({bool bumpGeneration = true}) async {
    if (bumpGeneration) {
      _generation++;
      Music.duck(false);
    }
    try {
      await _tts.stop();
      await _clip.stop();
      for (final p in _players) {
        await p.stop();
      }
    } catch (_) {}
  }

  /// The words to show in a speech bubble.
  static String show(String text) => text
      .replaceAll('{name}', app.displayName)
      .replaceAll('|', ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
}

class _Piece {
  _Piece.asset(this.asset) : file = null, speech = null, startMs = null, endMs = null;
  _Piece.file(this.file, this.startMs, this.endMs) : asset = null, speech = null;
  _Piece.speak(this.speech) : asset = null, file = null, startMs = null, endMs = null;

  final String? asset;
  final String? file;
  final String? speech;
  final int? startMs;
  final int? endMs;
}
