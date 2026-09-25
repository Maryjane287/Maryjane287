import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'screens/hatch.dart';
import 'screens/home.dart';
import 'screens/setup.dart';
import 'services/voice.dart';
import 'state.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(statusBarColor: Colors.transparent),
  );
  await app.load();
  unawaited(Voice.init());
  runApp(const BrainlingsApp());
}

class BrainlingsApp extends StatefulWidget {
  const BrainlingsApp({super.key});

  @override
  State<BrainlingsApp> createState() => _BrainlingsAppState();
}

class _BrainlingsAppState extends State<BrainlingsApp>
    with WidgetsBindingObserver {
  static const _tick = 15;
  Timer? _clock;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _startClock();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _clock?.cancel();
    super.dispose();
  }

  /// Counts play time only while the app is open, for the bedtime limit.
  void _startClock() {
    _clock?.cancel();
    _clock = Timer.periodic(const Duration(seconds: _tick), (_) {
      if (app.setupDone && app.hatched) app.tickPlay(_tick);
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _startClock();
    } else {
      _clock?.cancel();
      Voice.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final Widget start = !app.setupDone
        ? const SetupScreen()
        : !app.hatched
        ? const HatchScreen()
        : const HomeScreen();
    return MaterialApp(
      title: 'Brainlings',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(),
      home: start,
    );
  }
}
