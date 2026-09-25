import 'dart:async';
import 'dart:math';

import 'package:flutter/widgets.dart';
import 'package:video_player/video_player.dart';

/// Keeps a song video going round and round with no gaps until the dance
/// has lasted [endMs], then fades it out and calls [onEnd]. It never waits
/// in silence: if the player stops on its own, it is started again.
class SongLoop {
  SongLoop(this.v, {required this.plan, required this.onEnd, this.onPosition, this.breathAtMs, this.onBreath});

  final VideoPlayerController v;

  /// How many times round the video, and where to stop the last time round.
  final (int, int) plan;
  final VoidCallback onEnd;

  /// Called with the position in the video, for the words on screen.
  final void Function(Duration)? onPosition;

  /// Where the singing ends in the video (a little pause follows), and what
  /// to do right then, every time round except the last.
  final int? breathAtMs;
  final VoidCallback? onBreath;
  Timer? _breath;
  int _breathPass = -1;

  int _loops = 0;
  int _last = 0;
  bool _done = false;
  Timer? _stopper;
  Timer? _watchdog;
  final _clock = Stopwatch();

  int get _length => max(1000, v.value.duration.inMilliseconds);

  /// When to stop, measured with the real length of the video file.
  int get endMs => (plan.$1 - 1) * _length + min(plan.$2, _length);

  /// How far into the whole dance we are.
  int get elapsedMs => _done ? endMs : min(endMs, _loops * _length + _last);
  double get progress => elapsedMs / endMs;
  bool get done => _done;

  Future<void> start() async {
    _loops = 0;
    _last = 0;
    _done = false;
    _stopper?.cancel();
    _stopper = null;
    _breath?.cancel();
    _breathPass = -1;
    await v.setVolume(1);
    await v.setLooping(true);
    await v.seekTo(Duration.zero);
    await v.play();
    _clock
      ..reset()
      ..start();
    v.removeListener(_tick);
    v.addListener(_tick);
    _watchdog?.cancel();
    _watchdog = Timer.periodic(const Duration(seconds: 1), (_) => _check());
  }

  void _tick() {
    if (_done) return;
    final p = v.value.position.inMilliseconds;
    // The video went back to the start: one more time round.
    if (p + _length ~/ 2 < _last) _loops++;
    _last = p;
    onPosition?.call(v.value.position);
    final left = endMs - (_loops * _length + p);
    final at = breathAtMs;
    if (onBreath != null && at != null && _breathPass != _loops && left > _length - p) {
      final d = at - p;
      if (d >= 0 && d < 1500) {
        _breathPass = _loops;
        _breath = Timer(Duration(milliseconds: d), () {
          if (!_done) onBreath!();
        });
      }
    }
    if (_stopper == null && left < 1600) {
      _stopper = Timer(Duration(milliseconds: max(0, left - 120)), finish);
    }
  }

  void _check() {
    if (_done) return;
    // The clock is a backstop in case the video stops reporting.
    if (_clock.elapsedMilliseconds > endMs + 8000) {
      finish();
      return;
    }
    // Only while the app is open: never start music in the background.
    final open = WidgetsBinding.instance.lifecycleState == AppLifecycleState.resumed;
    if (open && v.value.isInitialized && !v.value.isPlaying && !v.value.isBuffering) v.play();
  }

  /// Stops now with a quick fade.
  Future<void> finish() async {
    if (_done) return;
    _done = true;
    _stopper?.cancel();
    _breath?.cancel();
    _watchdog?.cancel();
    v.removeListener(_tick);
    try {
      for (final vol in [.6, .3, .1]) {
        await v.setVolume(vol);
        await Future.delayed(const Duration(milliseconds: 70));
      }
      await v.pause();
      await v.setVolume(1);
    } catch (_) {}
    onEnd();
  }

  /// Stops without calling [onEnd] (the screen is closing).
  void cancel() {
    _done = true;
    _stopper?.cancel();
    _breath?.cancel();
    _watchdog?.cancel();
    v.removeListener(_tick);
  }
}
