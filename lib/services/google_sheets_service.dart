import 'dart:convert';
import 'package:googleapis/sheets/v4.dart' as sheets;
import 'package:googleapis_auth/auth_io.dart';
import 'package:flutter/foundation.dart';
import '../models/invoice_row.dart';

class GoogleSheetsConfig {
  final String clientEmail;
  final String privateKey;
  final String sheetId;
  final String range;

  const GoogleSheetsConfig({
    required this.clientEmail,
    required this.privateKey,
    required this.sheetId,
    this.range = 'Sheet1',
  });
}

class GoogleSheetsService {
  final GoogleSheetsConfig _config;

  GoogleSheetsService(this._config);

  static GoogleSheetsConfig? configFromEnv({
    required String? clientEmail,
    required String? privateKey,
    required String? sheetId,
    String range = 'Sheet1',
  }) {
    if (clientEmail == null || privateKey == null || sheetId == null) {
      return null;
    }
    return GoogleSheetsConfig(
      clientEmail: clientEmail,
      privateKey: privateKey.replaceAll(r'\n', '\n'),
      sheetId: sheetId,
      range: range,
    );
  }

  Future<SheetDataResult> fetchInvoiceData() async {
    try {
      final client = await _getAuthenticatedClient();
      final api = sheets.SheetsApi(client);
      final range = _config.range;

      final response = await api.spreadsheets.values.get(
        _config.sheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE',
      );

      final values = response.values;
      if (values == null || values.length < 2) {
        return SheetDataResult(
          rows: [],
          totals: _emptyTotals(),
          error: 'No data found in sheet',
        );
      }

      final headers = values.first.map((h) => h.toString()).toList();
      final rows = values
          .skip(1)
          .map((row) => InvoiceRow.fromHeaders(headers, row))
          .toList();

      final totals = computeTotals(rows);
      return SheetDataResult(rows: rows, totals: totals);
    } catch (e) {
      debugPrint('GoogleSheetsService error: $e');
      return SheetDataResult(
        rows: [],
        totals: _emptyTotals(),
        error: e.toString(),
      );
    }
  }

  Future<AutoRefreshingAuthClient> _getAuthenticatedClient() async {
    final credentials = ServiceAccountCredentials.fromJson({
      'private_key': _config.privateKey,
      'client_email': _config.clientEmail,
      'token_uri': 'https://oauth2.googleapis.com/token',
    });

    final scopes = [sheets.SheetsApi.spreadsheetsReadonlyScope];
    return clientViaServiceAccount(credentials, scopes);
  }

  SheetTotals _emptyTotals() => SheetTotals(
    invoiceTotal: 0, totalTax: 0,
    cgstAmount: 0, sgstAmount: 0,
    igstAmount: 0, invoiceCount: 0,
  );
}
