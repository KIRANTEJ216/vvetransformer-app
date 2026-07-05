import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart' show rootBundle;

class SheetsConfig {
  final String clientEmail;
  final String privateKey;
  final String sheetId;
  final String range;

  const SheetsConfig({
    required this.clientEmail,
    required this.privateKey,
    required this.sheetId,
    this.range = 'Sheet1',
  });

  /// Load config from a JSON file in the app's documents directory.
  /// File format: {"client_email":"...","private_key":"...","sheet_id":"..."}
  static Future<SheetsConfig?> fromFile(String path) async {
    try {
      final file = File(path);
      if (!await file.exists()) return null;
      final json = jsonDecode(await file.readAsString()) as Map<String, dynamic>;
      return SheetsConfig(
        clientEmail: json['client_email'] as String,
        privateKey: (json['private_key'] as String).replaceAll(r'\n', '\n'),
        sheetId: json['sheet_id'] as String,
        range: (json['range'] as String?) ?? 'Sheet1',
      );
    } catch (_) {
      return null;
    }
  }

  /// Load config from a bundled asset (e.g. assets/sheets_config.json).
  static Future<SheetsConfig?> fromAsset(String assetPath) async {
    try {
      final jsonStr = await rootBundle.loadString(assetPath);
      final json = jsonDecode(jsonStr) as Map<String, dynamic>;
      return SheetsConfig(
        clientEmail: json['client_email'] as String,
        privateKey: (json['private_key'] as String).replaceAll(r'\n', '\n'),
        sheetId: json['sheet_id'] as String,
        range: (json['range'] as String?) ?? 'Sheet1',
      );
    } catch (_) {
      return null;
    }
  }

  /// Load config from --dart-define flags at build time.
  static SheetsConfig? fromDartDefine() {
    final ce = const String.fromEnvironment('GOOGLE_SHEETS_CLIENT_EMAIL');
    final pk = const String.fromEnvironment('GOOGLE_SHEETS_PRIVATE_KEY');
    final si = const String.fromEnvironment('GOOGLE_SHEET_ID');
    if (ce.isEmpty || pk.isEmpty || si.isEmpty) return null;
    return SheetsConfig(
      clientEmail: ce,
      privateKey: pk.replaceAll(r'\n', '\n'),
      sheetId: si,
    );
  }
}
