import 'dart:async';
import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../state.dart';

/// Everything is spoken aloud, because most players cannot read yet.
///
/// Write `{name}` in a line to use the child's name. If a grown-up recorded
/// the name in their own voice, that clip is played in its place.
class Voice {
  static final _tts = FlutterTts();
  static final _clip = AudioPlayer();
  static bool _ready = false;
  static int _generation = 0;

  static Future<void> init() async {
    if (_ready) return;
    try {
      await _tts.awaitSpeakCompletion(true);
      final langs = (await _tts.getLanguages as List?)?.map((e) => '$e').toList() ?? [];
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

  /// Speaks a line. A new line interrupts the previous one.
  static Future<void> say(String text) async {
    await init();
    final gen = ++_generation;
    await stop(bumpGeneration: false);
    final clip = app.nameClipPath;
    final hasClip = clip != null && File(clip).existsSync();
    final parts = text.split('{name}');
    for (var i = 0; i < parts.length; i++) {
      if (gen != _generation) return;
      final chunk = parts[i].trim();
      if (chunk.isNotEmpty && chunk != ',' && chunk != '!') {
        try {
          await _tts.speak(chunk);
        } catch (_) {}
      }
      if (i < parts.length - 1) {
        if (gen != _generation) return;
        if (hasClip) {
          await playFile(clip);
        } else {
          try {
            await _tts.speak(app.displayName);
          } catch (_) {}
        }
      }
    }
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

  /// Replaces `{name}` with the written name, for speech bubbles.
  static String show(String text) => text.replaceAll('{name}', app.displayName);
}
