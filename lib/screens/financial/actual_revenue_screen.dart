import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../models/invoice_row.dart';
import '../../providers/sheets_provider.dart';

class ActualRevenueScreen extends ConsumerWidget {
  const ActualRevenueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sheetAsync = ref.watch(sheetDataProvider);
    final monthlyAsync = ref.watch(monthlyRevenueProvider);

    return Padding(
      padding: const EdgeInsets.all(20),
      child: sheetAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (data) => _buildContent(context, data, monthlyAsync),
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    SheetDataResult data,
    AsyncValue<List<MonthlyRevenue>> monthlyAsync,
  ) {
    final theme = Theme.of(context);
    final dateStr = DateFormat('d MMMM yyyy', 'en_IN').format(DateTime.now());
    final avgPerInvoice = data.totals.invoiceCount > 0
        ? (data.totals.invoiceTotal / data.totals.invoiceCount).roundToDouble()
        : 0.0;

    return ListView(
      children: [
        _Header(dateStr: dateStr),
        if (data.error != null)
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.amber.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber.shade200),
            ),
            child: Text(
              '⚠ Google Sheets not connected. ${data.error}',
              style: TextStyle(fontSize: 13, color: Colors.amber.shade900),
            ),
          ),
        _MetricGrid(
          totals: data.totals,
          avgPerInvoice: avgPerInvoice,
        ),
        const SizedBox(height: 20),
        _MonthlyRevenueChart(monthlyAsync: monthlyAsync),
        const SizedBox(height: 20),
        _TaxBreakdown(totals: data.totals),
        const SizedBox(height: 20),
        _RecentInvoices(rows: data.rows),
        const SizedBox(height: 20),
        Center(
          child: Text(
            'VVE Transformers Pvt. Ltd. · Actual Revenue · Google Sheets Data',
            style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
          ),
        ),
      ],
    );
  }
}

class _Header extends StatelessWidget {
  final String dateStr;
  const _Header({required this.dateStr});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: const Text('A', style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16,
            )),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Actual Revenue',
                  style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.bold,
                    color: Colors.grey.shade900,
                  )),
                const SizedBox(height: 2),
                Text('Google Sheets · Real invoices from accounting',
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
              ],
            ),
          ),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 14, color: Colors.grey.shade500),
              const SizedBox(width: 6),
              Text(dateStr, style: TextStyle(
                fontSize: 12, color: Colors.grey.shade500)),
            ],
          ),
        ],
      ),
    );
  }
}

class _MetricGrid extends StatelessWidget {
  final SheetTotals totals;
  final double avgPerInvoice;
  const _MetricGrid({required this.totals, required this.avgPerInvoice});

  static const _rupee = '\u{20B9}';

  String _fmt(double v) {
    final nf = NumberFormat('#,##,##0', 'en_IN');
    if (v < 10000) {
      return '$_rupee${v.toStringAsFixed(2)}';
    }
    return '$_rupee${nf.format(v.round())}';
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 4 : 2;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.6,
          children: [
            _MetricCard(
              title: 'Total Revenue',
              value: _fmt(totals.invoiceTotal),
              badgeText: 'Actual revenue',
              icon: Icons.account_balance,
              gradientColors: const [Color(0xFF2563EB), Color(0xFF1D4ED8)],
              badgeColor: Colors.blue.shade50,
              badgeTextColor: const Color(0xFF1E3A5F),
            ),
            _MetricCard(
              title: 'Tax Collected',
              value: _fmt(totals.totalTax),
              badgeText: 'CGST + SGST + IGST',
              icon: Icons.receipt_long,
              gradientColors: const [Color(0xFF7C3AED), Color(0xFF6D28D9)],
              badgeColor: Colors.blue.shade50,
              badgeTextColor: const Color(0xFF1E3A5F),
            ),
            _MetricCard(
              title: 'Invoice Count',
              value: nf.format(totals.invoiceCount),
              badgeText: 'From accounting',
              icon: Icons.description,
              gradientColors: const [Color(0xFF059669), Color(0xFF047857)],
              badgeColor: Colors.green.shade50,
              badgeTextColor: Colors.green.shade800,
            ),
            _MetricCard(
              title: 'Avg per Invoice',
              value: _fmt(avgPerInvoice),
              badgeText: 'Average value',
              icon: Icons.trending_up,
              gradientColors: const [Color(0xFFD97706), Color(0xFFB45309)],
              badgeColor: Colors.amber.shade50,
              badgeTextColor: Colors.amber.shade900,
            ),
          ],
        );
      },
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final String badgeText;
  final IconData icon;
  final List<Color> gradientColors;
  final Color badgeColor;
  final Color badgeTextColor;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.badgeText,
    required this.icon,
    required this.gradientColors,
    required this.badgeColor,
    required this.badgeTextColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 4, offset: const Offset(0, 1),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(
                fontSize: 12, fontWeight: FontWeight.w500,
                color: Colors.grey.shade500,
              )),
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: gradientColors),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: Colors.white, size: 18),
              ),
            ],
          ),
          const Spacer(),
          Text(value, style: TextStyle(
            fontSize: 22, fontWeight: FontWeight.w700,
            color: Colors.grey.shade900,
            letterSpacing: -0.5,
          )),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: badgeColor,
              borderRadius: BorderRadius.circular(99),
            ),
            child: Text(badgeText, style: TextStyle(
              fontSize: 10, fontWeight: FontWeight.w600,
              color: badgeTextColor,
            )),
          ),
        ],
      ),
    );
  }
}

class _MonthlyRevenueChart extends StatelessWidget {
  final AsyncValue<List<MonthlyRevenue>> monthlyAsync;
  const _MonthlyRevenueChart({required this.monthlyAsync});

  static const _rupee = '\u{20B9}';

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          monthlyAsync.when(
            loading: () => const CircularProgressIndicator(),
            error: (e, _) => Text('Error: $e'),
            data: (monthlyData) {
              if (monthlyData.isEmpty) {
                return Column(
                  children: [
                    Icon(Icons.trending_up, size: 40,
                      color: Colors.grey.shade400),
                    const SizedBox(height: 8),
                    Text('No revenue data yet.',
                      style: TextStyle(color: Colors.grey.shade500)),
                    Text('Connect Google Sheets to see trends.',
                      style: TextStyle(fontSize: 12,
                        color: Colors.grey.shade400)),
                  ],
                );
              }

              final maxRev = monthlyData
                  .map((m) => m.revenue)
                  .reduce((a, b) => a > b ? a : b);

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Monthly Revenue Trend',
                        style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600,
                          color: Colors.grey.shade900,
                        )),
                      Text('${monthlyData.length} months',
                        style: TextStyle(
                          fontSize: 12, color: Colors.grey.shade500)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...monthlyData.map((m) {
                    final pct = (m.revenue / maxRev) * 100;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(m.month, style: TextStyle(
                                fontSize: 12, fontWeight: FontWeight.w500,
                                color: Colors.grey.shade500,
                              )),
                              Text('$_rupee${nf.format(m.revenue.round())}',
                                style: TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.w600,
                                  color: Colors.grey.shade900,
                                )),
                            ],
                          ),
                          const SizedBox(height: 4),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(99),
                            child: LinearProgressIndicator(
                              value: (pct / 100).clamp(0.02, 1.0),
                              minHeight: 10,
                              backgroundColor: Colors.grey.shade100,
                              valueColor: const AlwaysStoppedAnimation(
                                Color(0xFF2563EB)),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _TaxBreakdown extends StatelessWidget {
  final SheetTotals totals;
  const _TaxBreakdown({required this.totals});

  static const _rupee = '\u{20B9}';

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Row(
          children: [
            Expanded(child: _TaxCard(
              label: 'CGST Collected',
              value: '$_rupee${totals.cgstAmount.toStringAsFixed(2)}',
              color: const Color(0xFF2563EB),
            )),
            const SizedBox(width: 12),
            Expanded(child: _TaxCard(
              label: 'SGST Collected',
              value: '$_rupee${totals.sgstAmount.toStringAsFixed(2)}',
              color: const Color(0xFF059669),
            )),
            const SizedBox(width: 12),
            Expanded(child: _TaxCard(
              label: 'IGST Collected',
              value: '$_rupee${totals.igstAmount.toStringAsFixed(2)}',
              color: const Color(0xFF7C3AED),
            )),
          ],
        );
      },
    );
  }
}

class _TaxCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _TaxCard({
    required this.label, required this.value, required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: TextStyle(
                fontSize: 12, fontWeight: FontWeight.w500,
                color: Colors.grey.shade500,
              )),
              Container(
                width: 12, height: 12,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(
            fontSize: 22, fontWeight: FontWeight.w700,
            color: Colors.grey.shade900,
          )),
        ],
      ),
    );
  }
}

class _RecentInvoices extends StatelessWidget {
  final List<InvoiceRow> rows;
  const _RecentInvoices({required this.rows});

  static const _rupee = '\u{20B9}';

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Recent Invoices', style: TextStyle(
                  fontSize: 14, fontWeight: FontWeight.w600,
                  color: Colors.grey.shade900,
                )),
                if (rows.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: Text('${rows.length} total', style: TextStyle(
                      fontSize: 11, fontWeight: FontWeight.w600,
                      color: const Color(0xFF1E3A5F),
                    )),
                  ),
              ],
            ),
          ),
          if (rows.isEmpty)
            const Padding(
              padding: EdgeInsets.all(40),
              child: Column(
                children: [
                  Icon(Icons.receipt, size: 40,
                    color: Color(0x4D64748B)),
                  SizedBox(height: 8),
                  Text('No invoice data.',
                    style: TextStyle(color: Color(0xFF64748B))),
                  Text('Connect Google Sheets to populate.',
                    style: TextStyle(fontSize: 12,
                      color: Color(0x8064748B))),
                ],
              ),
            )
          else
            ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 280),
              child: ListView.separated(
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: rows.length > 8 ? 8 : rows.length,
                separatorBuilder: (_, __) =>
                  const Divider(height: 1, indent: 20, endIndent: 20),
                itemBuilder: (context, i) {
                  final row = rows[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 10),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      row.invoiceNumber.isNotEmpty
                                          ? row.invoiceNumber : 'N/A',
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.grey.shade900,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 6, vertical: 1),
                                    decoration: BoxDecoration(
                                      color: Colors.green.shade50,
                                      borderRadius: BorderRadius.circular(99),
                                    ),
                                    child: Text(
                                      '$_rupee${nf.format(row.invoiceTotal.round())}',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.green.shade800,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${row.buyerName.isNotEmpty ? row.buyerName : 'Unknown'} · ${row.invoiceDate.isNotEmpty ? row.invoiceDate : 'N/A'}',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.grey.shade500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

final nf = NumberFormat('#,##,##0', 'en_IN');
