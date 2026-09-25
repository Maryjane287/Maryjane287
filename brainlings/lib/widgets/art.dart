import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../theme.dart';

/// A painted picture from assets/art (fruit, animals, party things...).
class Art extends StatelessWidget {
  const Art(this.name, {super.key, this.size = 56, this.sticker = false});

  final String name;
  final double size;

  /// Adds a thick white die-cut edge, like a real sticker.
  final bool sticker;

  @override
  Widget build(BuildContext context) {
    final img = Image.asset(
      'assets/art/$name.webp',
      width: size,
      height: size,
      fit: BoxFit.contain,
      gaplessPlayback: true,
    );
    if (!sticker) return img;
    return Stack(
      alignment: Alignment.center,
      children: [
        for (final o in const [
          Offset(3, 0),
          Offset(-3, 0),
          Offset(0, 3),
          Offset(0, -3),
          Offset(2, 2),
          Offset(-2, -2),
          Offset(2, -2),
          Offset(-2, 2),
        ])
          Transform.translate(
            offset: o,
            child: ColorFiltered(
              colorFilter: const ColorFilter.mode(
                Colors.white,
                BlendMode.srcIn,
              ),
              child: img,
            ),
          ),
        img,
      ],
    );
  }
}

/// Plays one of Bibi's little animated scenes from assets/video.
/// Shows [placeholder] until the video is ready, so it never flashes black.
class Scene extends StatefulWidget {
  const Scene(
    this.name, {
    super.key,
    this.loop = false,
    this.onDone,
    this.placeholder,
    this.radius = 28,
  });

  final String name;
  final bool loop;
  final VoidCallback? onDone;
  final Widget? placeholder;
  final double radius;

  @override
  State<Scene> createState() => _SceneState();
}

class _SceneState extends State<Scene> {
  late final VideoPlayerController _v = VideoPlayerController.asset(
    'assets/video/${widget.name}.mp4',
  );
  bool _ready = false;
  bool _done = false;

  @override
  void initState() {
    super.initState();
    _v.setLooping(widget.loop);
    _v.setVolume(0);
    _v.addListener(_tick);
    _v
        .initialize()
        .then((_) {
          if (!mounted) return;
          setState(() => _ready = true);
          _v.play();
        })
        .catchError((_) {
          // No video on this device: carry on as if it played.
          _finish();
        });
  }

  void _tick() {
    final v = _v.value;
    if (!widget.loop &&
        v.isInitialized &&
        !v.isPlaying &&
        v.position >= v.duration - const Duration(milliseconds: 120)) {
      _finish();
    }
  }

  void _finish() {
    if (_done) return;
    _done = true;
    widget.onDone?.call();
  }

  @override
  void dispose() {
    _v.removeListener(_tick);
    _v.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final framed = widget.radius > 0;
    return Container(
      decoration: framed
          ? BoxDecoration(
              borderRadius: BorderRadius.circular(widget.radius + 5),
              border: Border.all(color: Colors.white, width: 5),
              boxShadow: const [
                BoxShadow(color: C.shadow, offset: Offset(0, 8), blurRadius: 4),
              ],
            )
          : null,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(widget.radius),
        child: AspectRatio(
          aspectRatio: 9 / 16,
          child: Container(
            color: Colors.white.withValues(alpha: .35),
            child: AnimatedCrossFade(
              duration: const Duration(milliseconds: 300),
              crossFadeState: _ready
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              firstChild: SizedBox.expand(
                child: widget.placeholder ?? const SizedBox(),
              ),
              secondChild: _ready
                  ? SizedBox.expand(
                      child: FittedBox(
                        fit: BoxFit.cover,
                        child: SizedBox(
                          width: _v.value.size.width,
                          height: _v.value.size.height,
                          child: VideoPlayer(_v),
                        ),
                      ),
                    )
                  : const SizedBox.expand(),
            ),
          ),
        ),
      ),
    );
  }
}

/// A full-screen cut scene. Tap to skip.
class CutScene extends StatelessWidget {
  const CutScene(this.name, {super.key, required this.onDone});

  final String name;
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onDone,
    child: Container(
      color: Colors.black,
      alignment: Alignment.center,
      child: Scene(name, onDone: onDone, radius: 0),
    ),
  );
}
