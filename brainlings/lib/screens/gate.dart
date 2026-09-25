import 'dart:math';

import 'package:flutter/material.dart';

import '../theme.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

/// Grown-ups only. An easy sum for a grown-up, too hard for little ones.
/// Returns true when passed.
Future<bool> grownUpGate(BuildContext context) async {
  final ok = await Navigator.of(context).push<bool>(softRoute(const _Gate()));
  return ok ?? false;
}

class _Gate extends StatefulWidget {
  const _Gate();

  @override
  State<_Gate> createState() => _GateState();
}

class _GateState extends State<_Gate> {
  final _r = Random();
  late int _a, _b;
  String _typed = '';
  bool _shake = false;

  @override
  void initState() {
    super.initState();
    _newSum();
  }

  void _newSum() {
    _a = 11 + _r.nextInt(9);
    _b = 3 + _r.nextInt(7);
    _typed = '';
  }

  void _key(String k) {
    setState(() {
      if (k == '⌫') {
        if (_typed.isNotEmpty) _typed = _typed.substring(0, _typed.length - 1);
      } else if (_typed.length < 3) {
        _typed += k;
      }
    });
    if (_typed.length >= '${_a + _b}'.length) {
      if (_typed == '${_a + _b}') {
        Navigator.of(context).pop(true);
      } else {
        setState(() => _shake = true);
        Future.delayed(const Duration(milliseconds: 500), () {
          if (!mounted) return;
          setState(() {
            _shake = false;
            _newSum();
          });
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: GrownCard(
                  children: [
                    Row(
                      children: [
                        const Expanded(child: Eyebrow('Grown-ups only')),
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(false),
                          icon: const Icon(Icons.close_rounded),
                        ),
                      ],
                    ),
                    Text('Quick sum to open the grown-up area', style: T.d(24)),
                    const SizedBox(height: 16),
                    AnimatedSlide(
                      duration: const Duration(milliseconds: 80),
                      offset: _shake ? const Offset(.03, 0) : Offset.zero,
                      child: Text(
                        '$_a + $_b = ${_typed.isEmpty ? '?' : _typed}',
                        textAlign: TextAlign.center,
                        style: T.d(40, color: _shake ? C.berryDeep : C.ink),
                      ),
                    ),
                    const SizedBox(height: 16),
                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      mainAxisSpacing: 10,
                      crossAxisSpacing: 10,
                      childAspectRatio: 1.6,
                      physics: const NeverScrollableScrollPhysics(),
                      children: [
                        for (final k in [
                          '1',
                          '2',
                          '3',
                          '4',
                          '5',
                          '6',
                          '7',
                          '8',
                          '9',
                          '',
                          '0',
                          '⌫',
                        ])
                          k.isEmpty
                              ? const SizedBox()
                              : Material(
                                  color: const Color(0xFFF6F4FE),
                                  borderRadius: BorderRadius.circular(16),
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(16),
                                    onTap: () => _key(k),
                                    child: Center(
                                      child: k == '⌫'
                                          ? const Icon(Icons.backspace_rounded, size: 28, color: C.ink)
                                          : Text(k, style: T.d(26)),
                                    ),
                                  ),
                                ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
