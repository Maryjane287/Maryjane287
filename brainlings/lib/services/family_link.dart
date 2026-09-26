import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../state.dart';

/// Letters from far away.
///
/// A grown-up sends a family member (Grandma, Daddy, ...) a private link.
/// On the family web page they record a voice letter. It waits in the
/// Brainlings Firebase database until this phone collects it, then it is
/// deleted there straight away. When the child listens or sends a hug back,
/// a tiny reply (how many plays, hug yes or no) goes back so the sender sees it.
///
/// Nothing about the child is ever sent: no name, no age, no recordings.
/// The phone signs in anonymously, so there are no accounts or passwords.
/// This talks to Firebase over plain web requests (no Firebase SDK in the
/// app), which keeps the app small.
class FamilyLink {
  FamilyLink._();
  static final instance = FamilyLink._();

  static const _project = 'brainlings-6b9cf';
  static const _apiKey = 'AIzaSyDDxRhWQLp_Tr1J_Gdxfykt2Kk-61w8A_0';
  static const pageUrl = 'https://brainlings-6b9cf.web.app/';
  static const _docs = 'https://firestore.googleapis.com/v1/projects/$_project/databases/(default)/documents';

  static const _refreshKey = 'brainlings.fb.refresh';
  static const _familyKey = 'brainlings.fb.family';
  static const _invitesKey = 'brainlings.fb.invites';

  SharedPreferences? _prefs;
  String? _idToken;
  DateTime _expires = DateTime(2000);
  bool _syncing = false;

  Future<SharedPreferences> get _p async => _prefs ??= await SharedPreferences.getInstance();

  /// Who has a link: family name (as in the circle) to their secret token.
  Future<Map<String, String>> invites() async {
    try {
      final raw = (await _p).getString(_invitesKey);
      return raw == null ? {} : Map<String, String>.from(jsonDecode(raw) as Map);
    } catch (_) {
      return {};
    }
  }

  Future<void> _saveInvites(Map<String, String> m) async => (await _p).setString(_invitesKey, jsonEncode(m));

  static String _random(int n) {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final r = Random.secure();
    return List.generate(n, (_) => chars[r.nextInt(chars.length)]).join();
  }

  // ---------- signing in (anonymous) ----------

  Future<String?> _token() async {
    if (_idToken != null && DateTime.now().isBefore(_expires)) return _idToken;
    final p = await _p;
    final refresh = p.getString(_refreshKey);
    try {
      final http.Response r;
      if (refresh != null) {
        r = await http.post(
          Uri.parse('https://securetoken.googleapis.com/v1/token?key=$_apiKey'),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'grant_type=refresh_token&refresh_token=$refresh',
        ).timeout(const Duration(seconds: 15));
      } else {
        r = await http.post(
          Uri.parse('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$_apiKey'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'returnSecureToken': true}),
        ).timeout(const Duration(seconds: 15));
      }
      if (r.statusCode != 200) {
        // A refresh token that no longer works: start again with a new sign-in.
        if (refresh != null && r.statusCode == 400) await p.remove(_refreshKey);
        return null;
      }
      final j = jsonDecode(r.body) as Map<String, dynamic>;
      _idToken = (j['idToken'] ?? j['id_token']) as String?;
      final newRefresh = (j['refreshToken'] ?? j['refresh_token']) as String?;
      final secs = int.tryParse('${j['expiresIn'] ?? j['expires_in'] ?? 3600}') ?? 3600;
      _expires = DateTime.now().add(Duration(seconds: secs - 120));
      if (newRefresh != null) await p.setString(_refreshKey, newRefresh);
      return _idToken;
    } catch (_) {
      return null;
    }
  }

  String? _uidOf(String token) {
    try {
      final part = token.split('.')[1];
      final j = jsonDecode(utf8.decode(base64Url.decode(base64Url.normalize(part)))) as Map<String, dynamic>;
      return j['user_id'] as String?;
    } catch (_) {
      return null;
    }
  }

  Future<http.Response?> _call(String method, String url, {Map<String, dynamic>? body}) async {
    final t = await _token();
    if (t == null) return null;
    final req = http.Request(method, Uri.parse(url))
      ..headers['Authorization'] = 'Bearer $t'
      ..headers['Content-Type'] = 'application/json';
    if (body != null) req.body = jsonEncode(body);
    try {
      final s = await req.send().timeout(const Duration(seconds: 20));
      return await http.Response.fromStream(s);
    } catch (_) {
      return null;
    }
  }

  static Map<String, dynamic> _fields(Map<String, Object> m) => {
        'fields': {
          for (final e in m.entries)
            e.key: switch (e.value) {
              final bool b => {'booleanValue': b},
              final int i => {'integerValue': '$i'},
              final DateTime d => {'timestampValue': d.toUtc().toIso8601String()},
              _ => {'stringValue': '${e.value}'},
            },
        },
      };

  // ---------- the family ----------

  Future<String?> _family({bool create = false}) async {
    final p = await _p;
    final have = p.getString(_familyKey);
    if (have != null || !create) return have;
    final t = await _token();
    final uid = t == null ? null : _uidOf(t);
    if (uid == null) return null;
    final id = _random(20);
    final r = await _call('POST', '$_docs/families?documentId=$id', body: _fields({'owner': uid, 'created': DateTime.now()}));
    if (r == null || r.statusCode != 200) return null;
    await p.setString(_familyKey, id);
    return id;
  }

  /// A private link for [from] (for example "Grandma") to send voice letters.
  /// Returns null when the internet or Firebase cannot be reached.
  Future<String?> linkFor(String from) async {
    final fam = await _family(create: true);
    if (fam == null) return null;
    final all = await invites();
    var token = all[from];
    if (token == null) {
      token = _random(24);
      final r = await _call('POST', '$_docs/families/$fam/invites?documentId=$token', body: _fields({'from': from, 'created': DateTime.now()}));
      if (r == null || r.statusCode != 200) return null;
      all[from] = token;
      await _saveInvites(all);
    }
    final kid = app.childName.isEmpty ? '' : '&n=${Uri.encodeComponent(app.childName)}';
    final pet = '&c=${Uri.encodeComponent(app.creatureName)}';
    // Everything after # stays in the browser: it is never sent to a server.
    return '$pageUrl#f=$fam&t=$token&w=${Uri.encodeComponent(from)}$kid$pet';
  }

  /// Stops [from]'s link working.
  Future<bool> stop(String from) async {
    final fam = await _family();
    final all = await invites();
    final token = all[from];
    if (fam == null || token == null) return true;
    final r = await _call('DELETE', '$_docs/families/$fam/invites/$token');
    if (r == null || (r.statusCode != 200 && r.statusCode != 404)) return false;
    all.remove(from);
    await _saveInvites(all);
    return true;
  }

  // ---------- collecting letters ----------

  /// Collects any letters waiting for this phone. Returns how many arrived.
  Future<int> sync() async {
    if (_syncing) return 0;
    final fam = await _family();
    if (fam == null) return 0;
    _syncing = true;
    var n = 0;
    try {
      final r = await _call('GET', '$_docs/families/$fam/letters?pageSize=10');
      if (r == null || r.statusCode != 200) return 0;
      final docs = ((jsonDecode(r.body) as Map<String, dynamic>)['documents'] as List?) ?? [];
      final dir = await getApplicationDocumentsDirectory();
      for (final d in docs.cast<Map<String, dynamic>>()) {
        final id = (d['name'] as String).split('/').last;
        final f = (d['fields'] as Map<String, dynamic>?) ?? {};
        String s(String k) => (f[k]?['stringValue'] as String?) ?? '';
        if (app.letters.any((l) => l.id == id)) {
          await _call('DELETE', '$_docs/families/$fam/letters/$id');
          continue;
        }
        String? path;
        final bytes = f['audio']?['bytesValue'] as String?;
        if (bytes != null && bytes.isNotEmpty) {
          final mime = s('mime');
          final ext = mime.contains('mp4') || mime.contains('aac') ? 'm4a' : (mime.contains('ogg') ? 'ogg' : 'webm');
          final file = File('${dir.path}/letter-$id.$ext');
          await file.writeAsBytes(base64.decode(bytes));
          path = file.path;
        }
        final from = s('from').isEmpty ? 'Someone who loves you' : s('from');
        final sent = DateTime.tryParse((f['sent']?['timestampValue'] as String?) ?? '')?.toLocal() ?? DateTime.now();
        final text = s('text');
        if (path == null && text.isEmpty) continue;
        app.addLetter(Letter(id: id, from: from, sentAt: sent, text: text, audioPath: path, remote: true));
        n++;
        // Delivered: the letter is removed from Firebase straight away.
        await _call('DELETE', '$_docs/families/$fam/letters/$id');
      }
    } catch (_) {
    } finally {
      _syncing = false;
    }
    return n;
  }

  /// Tells the sender the child listened (and how many times) or sent a hug.
  Future<void> report(Letter l) async {
    if (!l.remote) return;
    final fam = await _family();
    if (fam == null) return;
    await _call(
      'PATCH',
      '$_docs/families/$fam/replies/${l.id}',
      body: _fields({'plays': l.plays, 'hug': l.hugSent, 'at': DateTime.now()}),
    );
  }

  /// "Start again": every link stops working and the family is removed.
  Future<void> forget() async {
    final fam = await _family();
    if (fam != null) {
      for (final from in (await invites()).keys.toList()) {
        await stop(from);
      }
      await _call('DELETE', '$_docs/families/$fam');
    }
    final p = await _p;
    await p.remove(_familyKey);
    await p.remove(_invitesKey);
  }
}
