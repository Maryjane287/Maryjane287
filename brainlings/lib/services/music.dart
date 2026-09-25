import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:video_player/video_player.dart';

import '../songs.dart';
import '../state.dart';
import 'song_loop.dart';

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
  static SongLoop? _loop;
  static final _songPos = StreamController<Duration>.broadcast();
  static Completer<void> _songStop = Completer();

  /// Plays one of Bibi's songs out loud (the background music waits),
  /// going round with no gaps for about [length], always ending at the end
  /// of a sung part. The sound comes straight from the song's video.
  /// Completes when the song ends or is stopped.
  static Future<void> song(String id, {Duration length = const Duration(seconds: 25)}) async {
    await stopSong();
    await pause();
    final s = songs.firstWhere((s) => s.id == id, orElse: () => songs.first);
    final v = VideoPlayerController.asset('assets/songs/${s.id}.mp4');
    final done = Completer<void>();
    _songStop = done;
    _song = v;
    try {
      await v.initialize().timeout(const Duration(seconds: 8));
      if (!done.isCompleted) {
        final loop = SongLoop(v, plan: s.plan(length), onEnd: () => done.isCompleted ? null : done.complete(), onPosition: _songPos.add);
        _loop = loop;
        await loop.start();
        await done.future;
        loop.cancel();
      }
    } catch (_) {}
    if (_song == v) {
      _song = null;
      _loop = null;
    }
    await v.dispose();
    await resume();
  }

  /// Where the song has got to, for the words on screen.
  static Stream<Duration> get songPosition => _songPos.stream;

  static Future<void> stopSong() async {
    _loop?.cancel();
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
