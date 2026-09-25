import 'dart:math';

import 'package:brainlings/games/letter_garden.dart';
import 'package:brainlings/services/voice.dart';
import 'package:brainlings/widgets/game_frame.dart';
import 'package:flutter_test/flutter_test.dart';

/// Every line the games build must have Bibi's recorded voice.
void main() {
  void expectRecorded(String line) {
    for (final piece in line.split('|')) {
      expect(Voice.hasClip(piece), isTrue, reason: 'No recording for "$piece"');
    }
  }

  test('Feeding Time lines are recorded', () {
    const fruits = [
      ('apple', 'apples'),
      ('strawberry', 'strawberries'),
      ('banana', 'bananas'),
      ('blueberry', 'blueberries'),
      ('cookie', 'cookies'),
      ('orange', 'oranges'),
    ];
    for (var n = 1; n <= 10; n++) {
      for (final f in fruits) {
        expectRecorded(
          'Can you give me ${numberWords[n]} ${n == 1 ? f.$1 : f.$2}, please?',
        );
      }
      expectRecorded('${numberWordsCap[n]}!');
    }
    expectRecorded('My tummy is rumbling!|Nom nom nom!');
    for (var i = 0; i < 20; i++) {
      expectRecorded(yayLine(_FixedRandom(i)));
    }
  });

  test('Letter Garden and Teach lines are recorded', () {
    for (final p in phonics) {
      expectRecorded('${p.intro}|${p.question}|${p.chant}|${thatsA(p.word)}');
      expectRecorded(
        'I think it starts with ${p.letter.toUpperCase()}. Am I right?',
      );
      expectRecorded('It starts with ${p.letter.toUpperCase()}!');
    }
    for (var n = 1; n <= 10; n++) {
      expectRecorded(
        'I think there ${n == 1 ? 'is' : 'are'} ${numberWords[n]}! Am I right?',
      );
    }
  });

  test('Shape and party lines are recorded', () {
    for (final s in [
      'square',
      'triangle',
      'rectangle',
      'circle',
      'star',
      'heart',
      'diamond',
      'oval',
    ]) {
      expectRecorded(
        '${s == 'oval' ? 'An' : 'A'} $s!|${thatsA(s)}|Can you find the $s?',
      );
    }
    for (final p in [
      'Balloon',
      'Cake',
      'Present',
      'Star',
      'Strawberry',
      'Cupcake',
      'Popper',
      'Lolly',
    ]) {
      expectRecorded('$p.');
    }
  });

  test('Family letter lines are recorded for the usual names', () {
    for (final who in [
      'Mummy',
      'Daddy',
      'Grandma',
      'Grandad',
      'Nana',
      'Auntie',
      'Uncle',
    ]) {
      expectRecorded(
        'You got a message from $who! Would you like to hear what $who has to say?',
      );
      expectRecorded(
        'Here is $who!|Would you like to send $who a big hug back?|Whoosh! Your hug is flying to $who!',
      );
      expectRecorded(
        '$who would love a hug back. Shall we send one?|$who left you a special bedtime message.',
      );
    }
    expect(
      Voice.pick('Here is Auntie Mia!', 'You got a message!'),
      'You got a message!',
    );
  });
}

class _FixedRandom implements Random {
  _FixedRandom(this.v);
  final int v;
  @override
  int nextInt(int max) => v % max;
  @override
  bool nextBool() => v.isEven;
  @override
  double nextDouble() => 0;
}
