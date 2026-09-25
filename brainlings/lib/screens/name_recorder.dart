import 'dart:io';

import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';

import '../services/voice.dart';
import '../theme.dart';

/// A simple record / stop / play control used for the child's name
/// and for voice letters. Calls [onSaved] with the file path.
class VoiceRecorder extends StatefulWidget {
  const VoiceRecorder({
    super.key,
    required this.fileName,
    required this.onSaved,
    this.existing,
    this.maxSeconds = 120,
  });

  final String fileName;
  final String? existing;
  final int maxSeconds;
  final ValueChanged<String?> onSaved;

  @override
  State<VoiceRecorder> createState() => _VoiceRecorderState();
}

class _VoiceRecorderState extends State<VoiceRecorder> {
  final _rec = AudioRecorder();
  bool _recording = false;
  String? _path;
  String? _error;
  DateTime? _started;

  @override
  void initState() {
    super.initState();
    _path = widget.existing;
  }

  @override
  void dispose() {
    _rec.dispose();
    super.dispose();
  }

  Future<void> _start() async {
    setState(() => _error = null);
    try {
      if (!await _rec.hasPermission()) {
        setState(
          () => _error = 'We need the microphone to record. You can allow it in your phone settings.',
        );
        return;
      }
      final dir = await getApplicationDocumentsDirectory();
      final path =
          '${dir.path}/${widget.fileName}-${DateTime.now().millisecondsSinceEpoch}.m4a';
      await Voice.stop();
      await _rec.start(
        const RecordConfig(encoder: AudioEncoder.aacLc, numChannels: 1),
        path: path,
      );
      setState(() {
        _recording = true;
        _started = DateTime.now();
      });
      Future.delayed(Duration(seconds: widget.maxSeconds), () {
        if (mounted && _recording) _stop();
      });
    } catch (e) {
      setState(() => _error = 'Recording is not available on this device.');
    }
  }

  Future<void> _stop() async {
    final p = await _rec.stop();
    setState(() {
      _recording = false;
      if (p != null && File(p).existsSync()) _path = p;
    });
    widget.onSaved(_path);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: _recording ? C.berryDeep : C.berry,
                  minimumSize: const Size.fromHeight(54),
                  textStyle: T.d(18),
                ),
                onPressed: _recording ? _stop : _start,
                icon: Icon(_recording ? Icons.stop_rounded : Icons.mic_rounded),
                label: Text(
                  _recording
                      ? 'Stop'
                      : (_path == null ? 'Record' : 'Record again'),
                ),
              ),
            ),
            if (_path != null && !_recording) ...[
              const SizedBox(width: 10),
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: C.leaf,
                  minimumSize: const Size(0, 54),
                  textStyle: T.d(18),
                ),
                onPressed: () => Voice.playFile(_path!),
                icon: const Icon(Icons.play_arrow_rounded),
                label: const Text('Play'),
              ),
            ],
          ],
        ),
        if (_recording)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: StreamBuilder(
              stream: Stream.periodic(const Duration(milliseconds: 500)),
              builder: (_, _) => Text(
                'Recording… ${DateTime.now().difference(_started!).inSeconds}s',
                style: T.b(14, color: C.berryDeep, w: FontWeight.w800),
              ),
            ),
          ),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(_error!, style: T.b(14, color: C.berryDeep)),
          ),
      ],
    );
  }
}
