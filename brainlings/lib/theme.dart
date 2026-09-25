import 'package:flutter/material.dart';

/// Brainlings palette: a sunny meadow world. Matches the early web prototype.
class C {
  static const ink = Color(0xFF2A2152);
  static const inkSoft = Color(0xFF5C5480);
  static const paper = Colors.white;
  static const sun = Color(0xFFFFC940);
  static const sunDeep = Color(0xFFD99A00);
  static const berry = Color(0xFFFF5C8A);
  static const berryDeep = Color(0xFFC7335E);
  static const leaf = Color(0xFF5DB35A);
  static const leafDeep = Color(0xFF3E8A3D);
  static const sky = Color(0xFF8FD3FF);
  static const lilac = Color(0xFFB69CFF);
  static const lilacDeep = Color(0xFF7D5FD6);
  static const peach = Color(0xFFFF9E7A);
  static const peachDeep = Color(0xFFD9694A);
  static const aqua = Color(0xFF4FD1C5);
  static const aquaDeep = Color(0xFF2A9C92);
  static const shadow = Color(0x292A2152);
}

class T {
  static const display = 'Baloo';
  static const letters = 'Andika';
  static const body = 'Nunito';

  static TextStyle d(
    double size, {
    Color color = C.ink,
    FontWeight w = FontWeight.w800,
  }) => TextStyle(
    fontFamily: display,
    fontSize: size,
    fontWeight: w,
    color: color,
    height: 1.15,
  );

  static TextStyle b(
    double size, {
    Color color = C.ink,
    FontWeight w = FontWeight.w600,
  }) => TextStyle(
    fontFamily: body,
    fontSize: size,
    fontWeight: w,
    color: color,
    height: 1.35,
  );

  static TextStyle l(double size, {Color color = C.berryDeep}) => TextStyle(
    fontFamily: letters,
    fontSize: size,
    fontWeight: FontWeight.w700,
    color: color,
    height: 1,
  );
}

ThemeData buildTheme() => ThemeData(
  useMaterial3: true,
  fontFamily: T.body,
  colorScheme: ColorScheme.fromSeed(
    seedColor: C.berry,
    primary: C.berryDeep,
    surface: C.paper,
  ),
  scaffoldBackgroundColor: C.sky,
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color(0xFFFBFAFF),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: const BorderSide(color: Color(0xFFE3DEF5), width: 2),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: const BorderSide(color: Color(0xFFE3DEF5), width: 2),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: const BorderSide(color: C.berry, width: 3),
    ),
  ),
);
