import 'package:audioplayers/audioplayers.dart';

import '../state.dart';

/// Cheerful background music. It softens whenever Bibi talks.
class Music {
  static final _p = AudioPlayer()..setReleaseMode(ReleaseMode.loop);
  static String? _current;
  static bool _ducked = false;
  static bool _paused = false;

  static double get _volume => _ducked ? .07 : .22;

  /// 'play' at home, 'games' in games, 'lullaby' at bedtime.
  static Future<void> play(String name) async {
    if (!app.musicOn) return stop();
    if (_current == name && !_paused) return;
    _current = name;
    _paused = false;
    try {
      await _p.stop();
      await _p.setVolume(_volume);
      await _p.play(AssetSource('music/$name.mp3'), volume: _volume);
    } catch (_) {}
  }

  static void duck(bool on) {
    if (_ducked == on) return;
    _ducked = on;
    try {
      _p.setVolume(_volume);
    } catch (_) {}
  }

  static Future<void> pause() async {
    _paused = true;
    try {
      await _p.pause();
    } catch (_) {}
  }

  static Future<void> resume() async {
    if (_current == null || !app.musicOn) return;
    _paused = false;
    try {
      await _p.resume();
    } catch (_) {}
  }

  static Future<void> stop() async {
    _current = null;
    try {
      await _p.stop();
    } catch (_) {}
  }
}
