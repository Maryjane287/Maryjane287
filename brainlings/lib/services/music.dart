import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:video_player/video_player.dart';

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

  static VideoPlayerController? _song;
  static final _songPos = StreamController<Duration>.broadcast();
  static Completer<void> _songStop = Completer();
  static bool _stopped = false;

  /// Plays one of Bibi's songs out loud [repeats] times in a row (the
  /// background music waits). The sound comes straight from the song's
  /// video. Completes when the song ends or is stopped.
  static Future<void> song(String id, {int repeats = 1}) async {
    await stopSong();
    await pause();
    _stopped = false;
    final v = VideoPlayerController.asset('assets/songs/$id.mp4');
    _song = v;
    var ignoreUntil = DateTime.now();
    void tick() {
      _songPos.add(v.value.position);
      if (DateTime.now().isBefore(ignoreUntil)) return;
      final d = v.value.duration;
      final atEnd = d > Duration.zero && v.value.position >= d - const Duration(milliseconds: 600) && !v.value.isPlaying;
      if ((v.value.isCompleted || atEnd) && !_songStop.isCompleted) _songStop.complete();
    }

    try {
      await v.initialize().timeout(const Duration(seconds: 8));
      await v.setVolume(1);
      v.addListener(tick);
      for (var round = 0; round < repeats && !_stopped; round++) {
        _songStop = Completer();
        ignoreUntil = DateTime.now().add(const Duration(milliseconds: 700));
        if (round > 0) await v.seekTo(Duration.zero);
        await v.play();
        await _songStop.future.timeout(v.value.duration + const Duration(seconds: 3), onTimeout: () {});
      }
    } catch (_) {}
    v.removeListener(tick);
    if (_song == v) _song = null;
    await v.dispose();
    await resume();
  }

  /// Where the song has got to, for the words on screen.
  static Stream<Duration> get songPosition => _songPos.stream;

  static Future<void> stopSong() async {
    _stopped = true;
    try {
      await _song?.pause();
    } catch (_) {}
    if (!_songStop.isCompleted) _songStop.complete();
  }

  static Future<void> stop() async {
    _current = null;
    try {
      await _p.stop();
    } catch (_) {}
  }
}
