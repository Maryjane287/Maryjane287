import 'package:brainlings/screens/paywall.dart';
import 'package:brainlings/services/premium.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Plans page shows the free week and never breaks without Google Play', (t) async {
    await t.binding.setSurfaceSize(const Size(400, 860));
    await t.pumpWidget(const MaterialApp(home: PaywallScreen()));
    await t.pump(const Duration(milliseconds: 300));
    expect(find.textContaining('Keep learning with'), findsOneWidget);
    expect(find.textContaining('Plans are not available'), findsOneWidget);
    // Without Google Play nothing is ever locked.
    expect(Premium.instance.locked, isFalse);
    expect(t.takeException(), isNull);
  });
}
