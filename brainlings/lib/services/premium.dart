import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:in_app_purchase_android/in_app_purchase_android.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../state.dart';

/// One way to pay: a base plan of the Google Play subscription.
class Plan {
  const Plan(this.details, this.price, this.period);
  final ProductDetails details;
  final String price; // already in the parent's own currency
  final String period; // 'P1M', 'P1Y', ...

  String get per => switch (period) {
        'P1W' => 'a week',
        'P1M' => 'a month',
        'P3M' => 'every 3 months',
        'P6M' => 'every 6 months',
        'P1Y' => 'a year',
        _ => '',
      };

  bool get yearly => period == 'P1Y';
}

/// The free week and the Brainlings subscription.
///
/// Everything is free for the first [trialDays] days, with no card needed.
/// After that the games and songs need a subscription. Bibi, talking and
/// letters from family always stay free.
///
/// Safety first: nothing is ever locked unless Google Play is really there
/// and the subscription can be bought right now. If anything is missing or
/// fails, the app simply stays open.
class Premium extends ChangeNotifier {
  Premium._();
  static final instance = Premium._();

  /// The subscription's product id in Play Console.
  static const productId = 'brainlings_premium';
  static const trialDays = 7;

  // Kept apart from the child's data, so "Start again" does not restart
  // the free week.
  static const _trialKey = 'brainlings.trialStart';
  static const _seenKey = 'brainlings.premiumSeen';

  SharedPreferences? _prefs;
  StreamSubscription<List<PurchaseDetails>>? _sub;
  DateTime _trialStart = DateTime.now();
  bool _subscribed = false;
  bool _storeReady = false;
  List<Plan> plans = [];

  /// A purchase is on its way (the Google Play sheet is open).
  bool busy = false;

  /// A short, kind message for the grown-up, or null.
  String? message;

  bool get subscribed => _subscribed;
  bool get storeReady => _storeReady;

  /// Whole days of the free week left, counting today.
  int get daysLeft {
    final start = DateTime(_trialStart.year, _trialStart.month, _trialStart.day);
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return max(0, trialDays - today.difference(start).inDays);
  }

  bool get inTrial => daysLeft > 0;

  /// Games and songs ask for a grown-up.
  bool get locked => _storeReady && plans.isNotEmpty && !_subscribed && !inTrial;

  /// Show the grown-up a gentle reminder: the free week is nearly over.
  bool get endingSoon => _storeReady && plans.isNotEmpty && !_subscribed && inTrial && daysLeft <= 2;

  Future<void> init() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      final start = _prefs!.getString(_trialKey);
      if (start == null) {
        await _prefs!.setString(_trialKey, DateTime.now().toIso8601String());
      } else {
        _trialStart = DateTime.tryParse(start) ?? DateTime.now();
      }
      // Remember a paid subscription for a while, so a family with no
      // internet for a few days is never locked out.
      final seen = DateTime.tryParse(_prefs!.getString(_seenKey) ?? '');
      _subscribed = seen != null && DateTime.now().difference(seen).inDays < 10;
    } catch (_) {}
    notifyListeners();

    final iap = InAppPurchase.instance;
    try {
      if (!await iap.isAvailable().timeout(const Duration(seconds: 8))) return;
      _sub = iap.purchaseStream.listen(_onPurchases, onError: (_) {});
      await _loadPlans();
      await _check();
    } catch (_) {
      // No Google Play here: everything stays free.
    }
    notifyListeners();
  }

  Future<void> _loadPlans() async {
    final r = await InAppPurchase.instance.queryProductDetails({productId}).timeout(const Duration(seconds: 10));
    final out = <Plan>[];
    for (final p in r.productDetails) {
      if (p is GooglePlayProductDetails) {
        final i = p.subscriptionIndex;
        final offers = p.productDetails.subscriptionOfferDetails;
        if (i == null || offers == null || i >= offers.length) continue;
        final o = offers[i];
        // The free week lives in the app, so only plain base plans are shown
        // (never a second free trial from Play Console).
        if (o.offerId != null || o.pricingPhases.isEmpty) continue;
        final phase = o.pricingPhases.last;
        out.add(Plan(p, phase.formattedPrice, phase.billingPeriod));
      } else {
        out.add(Plan(p, p.price, ''));
      }
    }
    // Monthly first, then yearly.
    out.sort((a, b) => a.yearly == b.yearly ? 0 : (a.yearly ? 1 : -1));
    plans = out;
    _storeReady = true;
  }

  /// Asks Google Play which subscriptions this family has right now.
  Future<void> _check() async {
    final before = _subscribed;
    var found = false;
    final done = Completer<void>();
    late StreamSubscription<List<PurchaseDetails>> s;
    s = InAppPurchase.instance.purchaseStream.listen((list) {
      if (list.any((p) => p.productID == productId && (p.status == PurchaseStatus.purchased || p.status == PurchaseStatus.restored))) {
        found = true;
      }
      if (!done.isCompleted) done.complete();
    });
    await InAppPurchase.instance.restorePurchases();
    await done.future.timeout(const Duration(seconds: 6), onTimeout: () {});
    await s.cancel();
    // Only a clear answer from Google Play turns the subscription off.
    if (!found && before) {
      _subscribed = false;
      await _prefs?.remove(_seenKey);
    }
    notifyListeners();
  }

  Future<void> _onPurchases(List<PurchaseDetails> list) async {
    for (final p in list) {
      if (p.productID != productId) continue;
      switch (p.status) {
        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          _subscribed = true;
          message = null;
          await _prefs?.setString(_seenKey, DateTime.now().toIso8601String());
        case PurchaseStatus.pending:
          message = 'Waiting for Google Play to confirm the payment.';
        case PurchaseStatus.error:
          message = 'The payment did not go through. Nothing was charged. Please try again.';
        case PurchaseStatus.canceled:
          message = null;
      }
      if (p.pendingCompletePurchase) {
        try {
          await InAppPurchase.instance.completePurchase(p);
        } catch (_) {}
      }
      if (p.status != PurchaseStatus.pending) busy = false;
    }
    notifyListeners();
  }

  Future<void> buy(Plan plan) async {
    if (busy) return;
    busy = true;
    message = null;
    notifyListeners();
    try {
      final ok = await InAppPurchase.instance.buyNonConsumable(purchaseParam: PurchaseParam(productDetails: plan.details));
      if (!ok) {
        busy = false;
        message = 'Google Play could not open. Please try again.';
      }
    } catch (_) {
      busy = false;
      message = 'Google Play could not open. Please try again.';
    }
    notifyListeners();
  }

  /// For a family who already pays (new phone, reinstalled app).
  Future<void> restore() async {
    busy = true;
    message = null;
    notifyListeners();
    try {
      await _check();
      message = _subscribed ? 'Welcome back! Your subscription is active.' : 'We could not find a subscription on this Google account.';
    } catch (_) {
      message = 'Google Play is not reachable right now. Please try again later.';
    }
    busy = false;
    notifyListeners();
  }

  /// A small summary for the grown-up: what the child did in the free week.
  String get learnedLine {
    final kid = app.childName.isEmpty ? 'Your child' : app.childName;
    return '$kid has earned ${app.stars} stars and ${app.stickers.length} stickers, and ${app.creatureName} is growing because of it.';
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }
}
