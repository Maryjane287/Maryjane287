import 'package:brainlings/state.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('creature grows through stages as the child learns', () {
    final s = AppState();
    expect(s.stage, 0);
    expect(s.look, GrowthLook.baby);
    s.points[Skill.numbers] = 12;
    expect(s.stage, 1);
    expect(s.stageName, 'Sprout');
    s.points[Skill.letters] = 20;
    expect(s.stage, 2);
  });

  test('creature grows in the direction of what the child learns most', () {
    final s = AppState();
    s.points[Skill.numbers] = 15;
    expect(s.look, GrowthLook.starry);
    s.points[Skill.letters] = 25;
    expect(s.look, GrowthLook.bookish);
    s.points[Skill.numbers] = 24;
    expect(s.look, GrowthLook.balanced);
  });

  test('a letter is offered for one hug reminder only', () {
    final s = AppState();
    final l = Letter(
      id: '1',
      from: 'Mummy',
      sentAt: DateTime(2026),
      opened: true,
    );
    s.letters.add(l);
    expect(s.hugReminder, l);
    l.reminded = true;
    expect(s.hugReminder, isNull);
  });

  test('bedtime is due once the daily limit is used up', () {
    final s = AppState()..bedtimeMinutes = 20;
    s.playedSecondsToday = 19 * 60;
    expect(s.bedtimeDue, isFalse);
    s.playedSecondsToday = 20 * 60;
    expect(s.bedtimeDue, isTrue);
  });

  test('letters survive a save and load round trip', () {
    final l = Letter(
      id: 'a',
      from: 'Grandma',
      sentAt: DateTime(2026, 9, 25),
      text: 'Hello!',
      plays: 3,
      hugSent: true,
    );
    final back = Letter.fromJson(l.toJson());
    expect(back.from, 'Grandma');
    expect(back.plays, 3);
    expect(back.hugSent, isTrue);
  });
}
