import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

/// Bibi reached a new stage. A little film of it growing, then a cheer.
class GrowScreen extends StatefulWidget {
  const GrowScreen({super.key});

  @override
  State<GrowScreen> createState() => _GrowScreenState();
}

class _GrowScreenState extends State<GrowScreen> {
  bool _filmDone = false;

  @override
  void initState() {
    super.initState();
    Sfx.hatch();
  }

  Future<void> _done() async {
    if (_filmDone) return;
    setState(() => _filmDone = true);
    celebrate(context, count: 120);
    Sfx.star();
    await Voice.say('Wow! I just grew bigger! Thank you for teaching me!');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const Spacer(),
                if (!_filmDone)
                  Expanded(
                    flex: 8,
                    child: Scene(
                      'grow',
                      onDone: _done,
                      placeholder: const Bibi(size: 220),
                    ),
                  )
                else ...[
                  const Bubble(
                    'Wow! I just grew bigger! Thank you for teaching me!',
                  ),
                  const SizedBox(height: 12),
                  Bibi(size: 260, bounce: 1, onTap: Sfx.giggle),
                  Text('${app.stageName}!', style: T.d(34, color: C.ink)),
                ],
                const Spacer(),
                if (_filmDone)
                  Chunky(
                    color: C.leaf,
                    shadow: C.leafDeep,
                    onTap: () => Navigator.of(context).pop(),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.home_rounded, color: Colors.white, size: 30),
                        SizedBox(width: 8),
                        Text('Yay!'),
                      ],
                    ),
                  ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
