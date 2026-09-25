import 'dart:async';
import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../state.dart';
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
  static Future<void> say(String text) async {
    await init();
    final gen = ++_generation;
    await stop(bumpGeneration: false);
    final nameClip = app.nameClipPath;
    final hasNameClip = nameClip != null && File(nameClip).existsSync();
    final pieces = <String>[];
    final byName = text.split('{name}');
    for (var i = 0; i < byName.length; i++) {
      pieces.addAll(byName[i].split('|'));
      if (i < byName.length - 1) pieces.add('{name}');
    }
    for (final raw in pieces) {
      if (gen != _generation) return;
      if (raw == '{name}') {
        if (hasNameClip) {
          await playFile(nameClip);
        } else {
          await _speak(app.displayName);
        }
        continue;
      }
      final chunk = raw.trim();
      if (_key(chunk).isEmpty) continue;
      final clip = voiceClips[_key(chunk)];
      if (clip != null) {
        await _playAsset('voice/$clip.mp3');
      } else {
        await _speak(chunk);
      }
    }
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

  static Future<void> _playAsset(String path) async {
    try {
      final done = _clip.onPlayerComplete.first;
      await _clip.play(AssetSource(path));
      await done.timeout(const Duration(seconds: 20));
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
    if (bumpGeneration) _generation++;
    try {
      await _tts.stop();
      await _clip.stop();
    } catch (_) {}
  }

  /// The words to show in a speech bubble.
  static String show(String text) => text
      .replaceAll('{name}', app.displayName)
      .replaceAll('|', ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
}
