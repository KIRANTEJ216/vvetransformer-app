import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import '../models/invoice_row.dart';
import '../services/google_sheets_service.dart';
import '../services/google_sheets_config.dart';

final sheetsConfigProvider = FutureProvider<SheetsConfig?>((ref) async {
  // Try file-based config first (most practical for mobile)
  // On Android: context.getFilesDir()/sheets_config.json
  // On iOS: NSDocumentDirectory/sheets_config.json
  if (!kIsWeb) {
    try {
      final dir = await _getDocumentsDir();
      final config = await SheetsConfig.fromFile('$dir/sheets_config.json');
      if (config != null) return config;
    } catch (_) {}
  }
  // Fall back to --dart-define at build time
  return SheetsConfig.fromDartDefine();
});

Future<String> _getDocumentsDir() async {
  // Use path_provider package
  final dir = await _getAppDocDir();
  return dir;
}

Future<String> _getAppDocDir() async {
  // This requires the path_provider package
  // Import 'package:path_provider/path_provider.dart'
  // final dir = await getApplicationDocumentsDirectory();
  // return dir.path;
  throw UnimplementedError('Add path_provider package and implement');
}

final googleSheetsServiceProvider = FutureProvider<GoogleSheetsService?>((ref) async {
  final config = await ref.watch(sheetsConfigProvider.future);
  if (config == null) return null;
  return GoogleSheetsService(config);
});

final sheetDataProvider = FutureProvider.autoDispose<SheetDataResult>((ref) async {
  try {
    final service = await ref.watch(googleSheetsServiceProvider.future);
    if (service == null) {
      return SheetDataResult(
        rows: [],
        totals: SheetTotals(
          invoiceTotal: 0, totalTax: 0,
          cgstAmount: 0, sgstAmount: 0,
          igstAmount: 0, invoiceCount: 0,
        ),
        error: 'Google Sheets not configured.\n'
            'Place a sheets_config.json file in app documents:\n'
            '{\n'
            '  "client_email": "your-sa@project.iam.gserviceaccount.com",\n'
            '  "private_key": "-----BEGIN PRIVATE KEY-----\\n...",\n'
            '  "sheet_id": "your-google-sheet-id"\n'
            '}',
      );
    }
    return await service.fetchInvoiceData();
  } catch (e) {
    return SheetDataResult(
      rows: [],
      totals: SheetTotals(
        invoiceTotal: 0, totalTax: 0,
        cgstAmount: 0, sgstAmount: 0,
        igstAmount: 0, invoiceCount: 0,
      ),
      error: e.toString(),
    );
  }
});

final monthlyRevenueProvider = Provider.autoDispose<AsyncValue<List<MonthlyRevenue>>>((ref) {
  final data = ref.watch(sheetDataProvider);
  return data.whenData((result) => aggregateMonthly(result.rows));
});
