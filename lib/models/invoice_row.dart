class InvoiceRow {
  final String documentType;
  final String invoiceNumber;
  final String invoiceDate;
  final String irn;
  final String ackNumber;
  final String ackDate;
  final String eWayBillNumber;
  final String placeOfSupply;
  final String stateCode;
  final String state;
  final String sellerName;
  final String sellerGstin;
  final String sellerPan;
  final String sellerAddress;
  final String sellerState;
  final String sellerEmail;
  final String sellerWebsite;
  final String buyerName;
  final String buyerGstin;
  final String buyerPan;
  final String buyerAddress;
  final String buyerState;
  final String consigneeName;
  final String consigneeGstin;
  final String consigneeAddress;
  final String consigneeState;
  final int itemIndex;
  final String itemDescription;
  final String itemHsnCode;
  final double itemQuantity;
  final String itemUnit;
  final double itemRate;
  final double itemAmount;
  final double taxableValue;
  final double cgstRate;
  final double cgstAmount;
  final double sgstRate;
  final double sgstAmount;
  final double igstRate;
  final double igstAmount;
  final double totalTax;
  final double invoiceTotal;
  final String amountInWords;
  final String taxInWords;
  final String bankName;
  final String accountHolder;
  final String accountNumber;
  final String ifscCode;
  final String bankBranch;
  final String vehicleNumber;
  final String transportMode;
  final double approxDistanceKm;
  final String validUpto;

  InvoiceRow({
    required this.documentType,
    required this.invoiceNumber,
    required this.invoiceDate,
    required this.irn,
    required this.ackNumber,
    required this.ackDate,
    required this.eWayBillNumber,
    required this.placeOfSupply,
    required this.stateCode,
    required this.state,
    required this.sellerName,
    required this.sellerGstin,
    required this.sellerPan,
    required this.sellerAddress,
    required this.sellerState,
    required this.sellerEmail,
    required this.sellerWebsite,
    required this.buyerName,
    required this.buyerGstin,
    required this.buyerPan,
    required this.buyerAddress,
    required this.buyerState,
    required this.consigneeName,
    required this.consigneeGstin,
    required this.consigneeAddress,
    required this.consigneeState,
    required this.itemIndex,
    required this.itemDescription,
    required this.itemHsnCode,
    required this.itemQuantity,
    required this.itemUnit,
    required this.itemRate,
    required this.itemAmount,
    required this.taxableValue,
    required this.cgstRate,
    required this.cgstAmount,
    required this.sgstRate,
    required this.sgstAmount,
    required this.igstRate,
    required this.igstAmount,
    required this.totalTax,
    required this.invoiceTotal,
    required this.amountInWords,
    required this.taxInWords,
    required this.bankName,
    required this.accountHolder,
    required this.accountNumber,
    required this.ifscCode,
    required this.bankBranch,
    required this.vehicleNumber,
    required this.transportMode,
    required this.approxDistanceKm,
    required this.validUpto,
  });

  factory InvoiceRow.fromHeaders(List<String> headers, List<dynamic> row) {
    String get(String key) {
      final idx = headers.indexOf(key);
      return idx >= 0 ? (row[idx] ?? '').toString() : '';
    }

    double getNum(String key) => double.tryParse(get(key)) ?? 0.0;

    return InvoiceRow(
      documentType: get('document_type'),
      invoiceNumber: get('invoice_number'),
      invoiceDate: get('invoice_date'),
      irn: get('irn'),
      ackNumber: get('ack_number'),
      ackDate: get('ack_date'),
      eWayBillNumber: get('e_way_bill_number'),
      placeOfSupply: get('place_of_supply'),
      stateCode: get('state_code'),
      state: get('state'),
      sellerName: get('seller_name'),
      sellerGstin: get('seller_gstin'),
      sellerPan: get('seller_pan'),
      sellerAddress: get('seller_address'),
      sellerState: get('seller_state'),
      sellerEmail: get('seller_email'),
      sellerWebsite: get('seller_website'),
      buyerName: get('buyer_name'),
      buyerGstin: get('buyer_gstin'),
      buyerPan: get('buyer_pan'),
      buyerAddress: get('buyer_address'),
      buyerState: get('buyer_state'),
      consigneeName: get('consignee_name'),
      consigneeGstin: get('consignee_gstin'),
      consigneeAddress: get('consignee_address'),
      consigneeState: get('consignee_state'),
      itemIndex: getNum('item_index').toInt(),
      itemDescription: get('item_description'),
      itemHsnCode: get('item_hsn_code'),
      itemQuantity: getNum('item_quantity'),
      itemUnit: get('item_unit'),
      itemRate: getNum('item_rate'),
      itemAmount: getNum('item_amount'),
      taxableValue: getNum('taxable_value'),
      cgstRate: getNum('cgst_rate'),
      cgstAmount: getNum('cgst_amount'),
      sgstRate: getNum('sgst_rate'),
      sgstAmount: getNum('sgst_amount'),
      igstRate: getNum('igst_rate'),
      igstAmount: getNum('igst_amount'),
      totalTax: getNum('total_tax'),
      invoiceTotal: getNum('invoice_total'),
      amountInWords: get('amount_in_words'),
      taxInWords: get('tax_in_words'),
      bankName: get('bank_name'),
      accountHolder: get('account_holder'),
      accountNumber: get('account_number'),
      ifscCode: get('ifsc_code'),
      bankBranch: get('bank_branch'),
      vehicleNumber: get('vehicle_number'),
      transportMode: get('transport_mode'),
      approxDistanceKm: getNum('approx_distance_km'),
      validUpto: get('valid_upto'),
    );
  }
}

class SheetTotals {
  final double invoiceTotal;
  final double totalTax;
  final double cgstAmount;
  final double sgstAmount;
  final double igstAmount;
  final int invoiceCount;

  SheetTotals({
    required this.invoiceTotal,
    required this.totalTax,
    required this.cgstAmount,
    required this.sgstAmount,
    required this.igstAmount,
    required this.invoiceCount,
  });
}

class MonthlyRevenue {
  final String month;
  final double revenue;
  final int count;

  MonthlyRevenue({
    required this.month,
    required this.revenue,
    required this.count,
  });
}

class SheetDataResult {
  final List<InvoiceRow> rows;
  final SheetTotals totals;
  final String? error;

  SheetDataResult({
    required this.rows,
    required this.totals,
    this.error,
  });
}

SheetTotals computeTotals(List<InvoiceRow> rows) {
  return rows.fold(
    SheetTotals(
      invoiceTotal: 0, totalTax: 0,
      cgstAmount: 0, sgstAmount: 0,
      igstAmount: 0, invoiceCount: 0,
    ),
    (acc, row) => SheetTotals(
      invoiceTotal: acc.invoiceTotal + row.invoiceTotal,
      totalTax: acc.totalTax + row.totalTax,
      cgstAmount: acc.cgstAmount + row.cgstAmount,
      sgstAmount: acc.sgstAmount + row.sgstAmount,
      igstAmount: acc.igstAmount + row.igstAmount,
      invoiceCount: acc.invoiceCount + 1,
    ),
  );
}

List<MonthlyRevenue> aggregateMonthly(List<InvoiceRow> rows) {
  final monthMap = <String, double>{};
  final countMap = <String, int>{};

  for (final row in rows) {
    if (row.invoiceDate.isEmpty) continue;
    final d = DateTime.tryParse(row.invoiceDate);
    if (d == null) continue;
    final key = '${d.year}-${d.month.toString().padLeft(2, '0')}';
    monthMap[key] = (monthMap[key] ?? 0) + row.invoiceTotal;
    countMap[key] = (countMap[key] ?? 0) + 1;
  }

  final sorted = monthMap.keys.toList()..sort();
  final months = <int>['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return sorted.map((key) {
    final parts = key.split('-');
    final year = int.parse(parts[0]);
    final month = int.parse(parts[1]);
    final shortYear = year.toString().substring(2);
    return MonthlyRevenue(
      month: '${months[month - 1]} $shortYear',
      revenue: monthMap[key]!,
      count: countMap[key]!,
    );
  }).toList();
}
