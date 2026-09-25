import 'dart:math';

import 'package:brainlings/friends.dart';
import 'package:brainlings/games/letter_garden.dart';
import 'package:brainlings/songs.dart';
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

  test('Friends and the living meadow are recorded', () => _friendsAndHome(expectRecorded));

  test('Levels, songs and new games are recorded', () {
    for (var l = 1; l <= 8; l++) {
      expectRecorded(levelLine(l));
    }
    for (final l in [
      "Shall we sing it again?|Let's sing it again!|Okay! Let's pick another song!",
      'Faster! Faster!|Jump up high!|Spin around!|Wave your arms!|Clap along with me!|Everybody dance!',
      "Let's build a castle!|Find the square for the castle wall!|Now find the rectangle for the tower!|Now find the triangle for the tower roof!|Now find the rectangle for the door!|Now find the heart for the flag!|Look! We built a castle! Fit for a king and queen!",
      "Let's build a train!|Find the rectangle for the train!|Now find the square for the cabin!|Now find the circle for the wheels!|Now find the diamond for the lamp!|Now find the star for the sky!|Look! We built a train! Choo choo!",
      "Let's build a flower!|Find the circle for the middle of the flower!|Now find the heart for the petals!|Now find the rectangle for the stem!|Now find the oval for the leaf!|Now find the circle for the sun!|Look! We built a beautiful flower!",
      'Counting in twos!|Count in twos! What comes next?',
      "I'm learning sums! Let me try.|I think|Am I right?|How many does it really make?",
      'Rhyme time!|Yes! They rhyme!|How many can you see? Say it out loud!',
      for (final w in ['cat', 'dog', 'sun', 'pig', 'hat', 'star', 'bear', 'fish']) 'What rhymes with $w?',
      'Cat and hat! They rhyme!|Dog and log! They rhyme!|Sun and fun! They rhyme!|Pig and wig! They rhyme!|Hat and cat! They rhyme!|Star and car! They rhyme!|Bear and chair! They rhyme!|Fish and dish! They rhyme!',
    ]) {
      expectRecorded(l);
    }
    for (final song in songs) {
      expectRecorded('${song.title}!');
    }
    for (final w in spellWords) {
      expectRecorded("Let's spell ${w.$1}!");
      for (final snd in w.$3) {
        expectRecorded('$snd!');
      }
      expectRecorded('${w.$3[0]}, ${w.$3[1].toLowerCase()}, ${w.$3[2].toLowerCase()}. ${w.$1[0].toUpperCase()}${w.$1.substring(1)}!');
    }
    for (final p in phonics) {
      expectRecorded('Pop the letter ${p.letter.toUpperCase()}!');
    }
    for (final c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
      expectRecorded('$c!');
    }
    for (final s in ['square', 'triangle', 'rectangle', 'circle', 'star', 'heart', 'diamond', 'oval']) {
      expectRecorded('I think this is ${s == 'oval' ? 'an' : 'a'} $s. Am I right?');
    }
    for (final l in [
      'Hooray! You unlocked a new level!|Next time, something new is waiting!',
      "Let's look at my plates!|Which plate has more?|Which plate has fewer?|Yes! That plate has more!|Yes! That plate has fewer!|Hmm, count them both. Try again!",
      'Sum time!|Plus!|Makes!|How many altogether?|Count them all together!|Take away!|How many are left?',
      "Snack time! Watch my plate!|Count the fruit on my plate!|Now I'll eat some! Munch munch!",
      "Letter hunt!|Big letters and little letters!|Find the little letter that matches!|Let's spell words!|Tap the letters in order!|Which sound comes next?|You spelled it!",
      "Let's build a rocket!|Let's build a boat!|Let's build a robot!|Look! We built a rocket! Three, two, one, blast off!|Look! We built a boat! Splish splash!|Look! We built a robot! Beep boop!",
      "Find the rectangle for the rocket!|Now find the triangle for the nose!|Now find the circle for the window!|Now find the diamond for the fire!",
      "Find the oval for the boat!|Now find the rectangle for the mast!|Now find the triangle for the sail!|Now find the heart for the flag!",
      "Find the square for the robot's head!|Now find the rectangle for the body!|Now find the circle for the eyes!|Now find the heart for the robot's heart!|Now find the star for the antenna!",
      "Trickier patterns!|Oh no! Something is missing!|What's missing?|Counting patterns!|Count the stars! What comes next?",
      "I'm learning shapes! Let me try.|Big numbers are tricky! Let me try.|Which shape is it really?",
      "Hi! What's your name?|I knew it! I remember you!|Nice to meet you!|What a lovely name!",
      'Hmm, I heard something different.|Did you say that?|Oh, maybe I got you wrong. Can you say it again?|This is how you say it!|Now you say it!',
      "Hee hee! Do I have to teach you everything?|Let's say it together!|Say it again, nice and loud!|Tap the microphone and say it!",
      "Now make a sentence with it!|Like this:|Say a whole sentence with the word in it!|Say it with me!|Wow! What a great sentence!",
      "Can you spell it?|Tap the letters to spell it!|You spelled it! Amazing!|Let's spell it together!|Listen carefully!",
      "Hello? Are you there? Say something!|Take your time. I'm listening!|Say it slowly and loudly!|Psst! I'm waiting for your lovely voice!",
      "I'm all ears! Say hello to me!|Talk to me! I love your voice!|Hee hee! You sound funny!|You sound amazing!|I heard you! Say something else!",
      "Pick a song and let's dance!|Everybody dance with us!|You are a super dancer!|What a lovely dancer you are!|That was so much fun! Again?|Dance with me and my friends!|Come on, friends! Let's dance!|Songs!",
      "Let's make sentences!|Animal sounds and colours!|Opposites! Big and small!",
    ]) {
      expectRecorded(l);
    }
  });
}

void _friendsAndHome(void Function(String) expectRecorded) {
  for (final f in friends) {
    for (final l in [f.hello, ...f.cheers, f.giggle, f.fun, f.oops]) {
      expectRecorded(l);
    }
  }
  for (final l in [
    'Hey! Come and play with me!',
    'Look! A balloon! Pop it!',
    "Ooh, a present! What's inside?",
    'Dance with me!',
    'Guess what? A new friend is coming to visit!',
    'Say hello to my new friend!',
    "Tap a game and let's play!",
    'Wheee! Bubbles! Pop pop pop!',
    'Can you find me?',
    'Peekaboo!',
    'Shake shake shake!',
    "Knock knock! It's me!",
    "I'm so happy you're here!",
    'Ooh, shiny!',
    'So cool!',
    'Wow wow wow!',
  ]) {
    expectRecorded(l);
  }
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
