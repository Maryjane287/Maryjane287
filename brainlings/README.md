# Brainlings

Learn, grow, and hear from the people who love you.

A learning app for children aged 4 to 7, made by Grace and Loannes Ltd. Each child hatches their own
creature (Bibi by default). It grows only when they learn, and it brings them voice letters from family.

## Run it

```
flutter pub get
flutter run            # on a phone or emulator
flutter build apk      # Android install file, in build/app/outputs/flutter-apk/
flutter test
```

## Where things live

- `lib/screens/`: setup, hatch, home, letters, bedtime, stickers, grown-ups area
- `lib/games/`: Feeding Time, Letter Garden, Shape Builder, Pattern Party, Teach Bibi
- `lib/widgets/`: the meadow sky, Bibi, chunky buttons, confetti
- `lib/state.dart`: everything the app remembers (stored only on the device)
- `assets/bibi/`: Bibi's poses and the egg; `assets/sfx/`: sound effects
