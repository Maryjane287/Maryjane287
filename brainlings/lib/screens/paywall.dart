import 'package:flutter/material.dart';

import '../services/premium.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'gate.dart';

/// Opens the plans page for a grown-up (behind the grown-ups gate).
Future<void> openPlans(BuildContext context) async {
  if (!await grownUpGate(context)) return;
  if (!context.mounted) return;
  await Navigator.of(context).push(softRoute(const PaywallScreen()));
}

/// Checks before a game or a song. Returns true when the child may play.
/// After the free week, without a subscription, Bibi kindly asks for a
/// grown-up instead.
Future<bool> mayPlay(BuildContext context) async {
  final p = Premium.instance;
  if (!p.locked) return true;
  await Navigator.of(context).push(softRoute(const AskGrownUpScreen()));
  return !p.locked;
}

/// The plans page, for grown-ups: the price up front, what they get, and
/// how to cancel. Clear and honest.
class PaywallScreen extends StatelessWidget {
  const PaywallScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final p = Premium.instance;
    final kid = app.childName.isEmpty ? 'your child' : app.childName;
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: ListenableBuilder(
            listenable: p,
            builder: (context, _) => ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Row(children: [
                  RoundIcon(icon: Icons.arrow_back_rounded, label: 'Back', onTap: () => Navigator.of(context).pop()),
                  const SizedBox(width: 12),
                  Expanded(child: Text('Brainlings plans', style: T.d(28))),
                ]),
                const SizedBox(height: 12),
                const Center(child: Bibi(mood: Mood.cheer, size: 150)),
                GrownCard(children: [
                  Eyebrow(p.subscribed
                      ? 'Thank you'
                      : p.inTrial
                          ? 'Free week: ${p.daysLeft} ${p.daysLeft == 1 ? 'day' : 'days'} left'
                          : 'The free week has ended'),
                  Text(p.subscribed ? 'You are subscribed. Thank you for learning with us!' : 'Keep learning with ${app.creatureName}', style: T.d(24)),
                  const SizedBox(height: 8),
                  Text(p.learnedLine, style: T.b(15, color: C.inkSoft)),
                  const SizedBox(height: 14),
                  for (final line in [
                    'Every game and all 7 levels, plus super levels',
                    'All the songs and dance parties',
                    'New games, songs and surprises as we make them',
                    'No ads, ever. No chat with strangers.',
                    'Talking to ${app.creatureName} and letters from family always stay free',
                  ])
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        const Icon(Icons.check_circle_rounded, color: C.leafDeep, size: 22),
                        const SizedBox(width: 10),
                        Expanded(child: Text(line, style: T.b(15))),
                      ]),
                    ),
                ]),
                if (!p.subscribed) ...[
                  if (p.plans.isEmpty)
                    GrownCard(children: [
                      Text('Plans are not available right now', style: T.d(20)),
                      const SizedBox(height: 6),
                      Text('Brainlings stays free to play for $kid until they are. Please check again later.', style: T.b(15, color: C.inkSoft)),
                    ])
                  else
                    for (final plan in p.plans)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Chunky(
                          color: plan.yearly ? C.berry : C.leaf,
                          shadow: plan.yearly ? C.berryDeep : C.leafDeep,
                          radius: 24,
                          onTap: p.busy ? () {} : () => p.buy(plan),
                          child: Column(children: [
                            Text(plan.yearly ? 'Yearly: best value' : 'Monthly', style: T.d(22, color: Colors.white)),
                            Text('${plan.price} ${plan.per}', style: T.d(26, color: Colors.white)),
                          ]),
                        ),
                      ),
                ],
                if (p.busy) const Padding(padding: EdgeInsets.all(12), child: Center(child: CircularProgressIndicator())),
                if (p.message != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text(p.message!, textAlign: TextAlign.center, style: T.b(15, color: C.ink)),
                  ),
                if (p.storeReady)
                  TextButton(
                    onPressed: p.busy ? null : p.restore,
                    child: Text('Already subscribed? Restore it', style: T.b(15, color: C.lilacDeep)),
                  ),
                const SizedBox(height: 8),
                Text(
                  'Payment is taken by Google Play from your Google account. The subscription renews automatically '
                  'at the price shown until you cancel. You can cancel any time in the Google Play app: '
                  'tap your profile picture, then Payments and subscriptions, then Subscriptions. '
                  'The first ${Premium.trialDays} days of Brainlings are free and need no payment.',
                  style: T.b(13, color: C.inkSoft),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// What the child sees after the free week: no scary lock, just Bibi
/// asking for a grown-up's help.
class AskGrownUpScreen extends StatefulWidget {
  const AskGrownUpScreen({super.key});

  @override
  State<AskGrownUpScreen> createState() => _AskGrownUpScreenState();
}

class _AskGrownUpScreenState extends State<AskGrownUpScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => Voice.say('Our free week is over! Ask a grown-up to help us keep playing.'));
  }

  @override
  void dispose() {
    Voice.stop();
    super.dispose();
  }

  Future<void> _grownUp() async {
    await Voice.stop();
    if (!mounted) return;
    await openPlans(context);
    if (mounted && !Premium.instance.locked) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Column(children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(children: [
                RoundIcon(icon: Icons.home_rounded, label: 'Home', onTap: () => Navigator.of(context).pop()),
              ]),
            ),
            const Spacer(),
            Bibi(mood: Mood.hug, size: 230, onTap: () => Voice.say('Our free week is over! Ask a grown-up to help us keep playing.')),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Text('Ask a grown-up to help us keep playing!', textAlign: TextAlign.center, style: T.d(26)),
            ),
            const Spacer(),
            Chunky(
              onTap: _grownUp,
              child: const Row(mainAxisSize: MainAxisSize.min, children: [
                Icon(Icons.lock_open_rounded, color: Colors.white, size: 30),
                SizedBox(width: 8),
                Text('Grown-ups'),
              ]),
            ),
            const SizedBox(height: 40),
          ]),
        ),
      ),
    );
  }
}
