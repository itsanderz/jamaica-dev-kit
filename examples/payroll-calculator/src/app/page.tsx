'use client';

import { useState, useMemo } from 'react';
import { calculatePayroll, calculateIncomeTax, getIncomeTaxBrackets, ANNUAL_THRESHOLD } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';
import { isValidTRN } from 'jamaica-trn';

type Period = 'monthly' | 'fortnightly' | 'weekly' | 'annual';

const PERIOD_LABELS: Record<Period, string> = {
  monthly: 'Monthly',
  fortnightly: 'Fortnightly',
  weekly: 'Weekly',
  annual: 'Annual',
};

const PERIODS_PER_YEAR: Record<Period, number> = {
  annual: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

const PRESET_SALARIES = [
  { label: '80K/mo', value: 80_000 },
  { label: '150K/mo', value: 150_000 },
  { label: '250K/mo', value: 250_000 },
  { label: '500K/mo', value: 500_000 },
  { label: '1M/mo', value: 1_000_000 },
];

export default function PayrollPage() {
  const [salary, setSalary] = useState(150_000);
  const [period, setPeriod] = useState<Period>('monthly');
  const [trn, setTrn] = useState('');

  const trnStatus = useMemo(() => {
    if (trn.trim().length === 0) return 'empty';
    const raw = trn.replace(/-/g, '').replace(/\s/g, '');
    if (raw.length < 9) return 'incomplete';
    return isValidTRN(trn) ? 'valid' : 'invalid';
  }, [trn]);

  const payroll = useMemo(() => calculatePayroll(salary, period), [salary, period]);

  const annualized = payroll.annualized;
  const taxBreakdown = useMemo(() => calculateIncomeTax(annualized), [annualized]);
  const brackets = useMemo(() => getIncomeTaxBrackets(), []);

  // Bar chart segments for the stacked bar
  const barSegments = useMemo(() => {
    const gross = payroll.grossPay;
    if (gross === 0) return [];
    return [
      { label: 'Income Tax', value: payroll.incomeTax, color: '#ef4444' },
      { label: 'NIS', value: payroll.nis, color: '#f59e0b' },
      { label: 'NHT', value: payroll.nht, color: '#8b5cf6' },
      { label: 'Ed. Tax', value: payroll.educationTax, color: '#3b82f6' },
      { label: 'Net Pay', value: payroll.netPay, color: '#009B3A' },
    ];
  }, [payroll]);

  const effectiveRate = annualized > 0 ? (taxBreakdown.tax / annualized) * 100 : 0;

  // Bracket visualization data
  const bracketBars = useMemo(() => {
    const result: { label: string; rate: string; amount: number; width: number; color: string }[] = [];
    const income = annualized;
    if (income <= 0) return result;

    const b = brackets;
    const colors = ['#10b981', '#f59e0b', '#ef4444'];

    for (let i = 0; i < b.length; i++) {
      const bracket = b[i];
      const low = bracket.min;
      const high = bracket.max ?? Infinity;
      const inBracket = Math.max(0, Math.min(income, high) - low);
      if (inBracket > 0 || i === 0) {
        result.push({
          label: bracket.label,
          rate: `${(bracket.rate * 100).toFixed(0)}%`,
          amount: inBracket,
          width: income > 0 ? (inBracket / income) * 100 : 0,
          color: colors[i] || '#6b7280',
        });
      }
    }
    return result;
  }, [annualized, brackets]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
      {/* -------- LEFT: Input Panel -------- */}
      <div className="space-y-6">
        {/* Salary Input Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Gross Salary ({PERIOD_LABELS[period]})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--text-muted)]">
                J$
              </span>
              <input
                type="number"
                min={0}
                max={2_000_000}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-lg font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Range slider */}
          <div>
            <input
              type="range"
              min={0}
              max={2_000_000}
              step={5000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--brand)]"
              style={{
                background: `linear-gradient(to right, var(--brand) ${(salary / 2_000_000) * 100}%, var(--bg-mute) ${(salary / 2_000_000) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] mt-1 font-mono">
              <span>J$0</span>
              <span>J$2,000,000</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESET_SALARIES.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSalary(preset.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  salary === preset.value
                    ? 'bg-[var(--brand)] text-white shadow-sm'
                    : 'bg-[var(--bg-mute)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pay Period Selector */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Pay Period
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  period === p
                    ? 'bg-[var(--brand)] text-white shadow-sm'
                    : 'bg-[var(--bg-mute)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* TRN Input */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            TRN <span className="text-[var(--text-muted)] font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="NNN-NNN-NNN"
              maxLength={11}
              value={trn}
              onChange={(e) => setTrn(e.target.value)}
              className={`w-full px-3 py-2.5 pr-10 rounded-lg border bg-[var(--bg-soft)] font-mono text-sm focus:outline-none focus:ring-2 transition-shadow ${
                trnStatus === 'valid'
                  ? 'border-emerald-500 focus:ring-emerald-500/30'
                  : trnStatus === 'invalid'
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-[var(--border)] focus:ring-[var(--brand)]'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
              {trnStatus === 'valid' && (
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {trnStatus === 'invalid' && (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
          </div>
          {trnStatus === 'valid' && (
            <p className="text-xs text-emerald-600 mt-1.5">Valid TRN</p>
          )}
          {trnStatus === 'invalid' && (
            <p className="text-xs text-red-500 mt-1.5">Invalid TRN -- check digit mismatch</p>
          )}
        </div>

        {/* Effective Tax Rate */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 text-center">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Effective Tax Rate
          </p>
          <p className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--brand)' }}>
            {effectiveRate.toFixed(2)}%
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            on annualized income of {formatJMD(annualized, { decimals: 0 })}
          </p>
        </div>
      </div>

      {/* -------- RIGHT: Results Panel -------- */}
      <div className="space-y-6">
        {/* Stacked Deductions Bar */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Pay Breakdown</h2>
          <div className="h-10 rounded-lg overflow-hidden flex">
            {barSegments.map((seg) => {
              const pct = payroll.grossPay > 0 ? (seg.value / payroll.grossPay) * 100 : 0;
              return (
                <div
                  key={seg.label}
                  className="h-full transition-all duration-500 ease-out relative group"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: seg.color,
                    minWidth: pct > 0 ? '2px' : '0',
                  }}
                  title={`${seg.label}: ${formatJMD(seg.value)} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {barSegments.map((seg) => {
              const pct = payroll.grossPay > 0 ? (seg.value / payroll.grossPay) * 100 : 0;
              return (
                <div key={seg.label} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span>{seg.label}</span>
                  <span className="font-mono text-[var(--text-muted)]">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Deductions Table */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
            Employee Deductions
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Deduction
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Rate
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-red-500" />
                  Income Tax (PAYE)
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">25-30%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.incomeTax)}</td>
              </tr>
              <tr>
                <td className="py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-amber-500" />
                  NIS
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">3.00%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.nis)}</td>
              </tr>
              <tr>
                <td className="py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-purple-500" />
                  NHT
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">2.00%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.nht)}</td>
              </tr>
              <tr>
                <td className="py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-blue-500" />
                  Education Tax
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">2.25%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.educationTax)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--border)]">
                <td className="py-3 font-semibold">Total Deductions</td>
                <td />
                <td className="py-3 text-right font-mono font-bold text-red-500">
                  -{formatJMD(payroll.totalDeductions)}
                </td>
              </tr>
              <tr className="border-t border-[var(--border)]">
                <td className="py-3 font-semibold text-base">Net Pay</td>
                <td />
                <td className="py-3 text-right font-mono font-bold text-lg" style={{ color: 'var(--brand)' }}>
                  {formatJMD(payroll.netPay)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Employer Contributions Table */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
            Employer Contributions
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Contribution
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Rate
                </th>
                <th className="text-right py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="py-2.5">NIS (Employer)</td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">3.00%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.employerNIS)}</td>
              </tr>
              <tr>
                <td className="py-2.5">NHT (Employer)</td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">3.00%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.employerNHT)}</td>
              </tr>
              <tr>
                <td className="py-2.5">Education Tax (Employer)</td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">3.50%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.employerEducationTax)}</td>
              </tr>
              <tr>
                <td className="py-2.5">HEART/NTA</td>
                <td className="py-2.5 text-right font-mono text-[var(--text-muted)]">3.00%</td>
                <td className="py-2.5 text-right font-mono font-medium">{formatJMD(payroll.employerHEART)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--border)]">
                <td className="py-3 font-semibold">Total Employer Contributions</td>
                <td />
                <td className="py-3 text-right font-mono font-bold text-[var(--text-secondary)]">
                  {formatJMD(payroll.totalEmployerContributions)}
                </td>
              </tr>
              <tr className="border-t border-[var(--border)]">
                <td className="py-3 font-semibold text-base">Total Cost to Employer</td>
                <td />
                <td className="py-3 text-right font-mono font-bold text-lg text-[var(--text-primary)]">
                  {formatJMD(payroll.totalCostToEmployer)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Tax Bracket Visualization */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
            Income Tax Brackets
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Annual threshold: {formatJMD(ANNUAL_THRESHOLD, { decimals: 0 })}
          </p>
          <div className="space-y-3">
            {bracketBars.map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-secondary)] truncate pr-2">{bar.label}</span>
                  <span className="font-mono text-[var(--text-muted)] flex-shrink-0">
                    {formatJMD(bar.amount, { decimals: 0 })}
                  </span>
                </div>
                <div className="h-6 bg-[var(--bg-mute)] rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-500 ease-out flex items-center px-2"
                    style={{
                      width: `${Math.max(bar.width, bar.amount > 0 ? 3 : 0)}%`,
                      backgroundColor: bar.color,
                    }}
                  >
                    {bar.width > 12 && (
                      <span className="text-[10px] font-bold text-white">{bar.rate}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bracket details from taxBreakdown */}
          {taxBreakdown.brackets.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Tax by Bracket
              </h3>
              <div className="space-y-2">
                {taxBreakdown.brackets.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      {b.bracket} bracket
                      <span className="text-[var(--text-muted)] ml-1.5 text-xs">
                        on {formatJMD(b.taxableInThisBracket, { decimals: 0 })}
                      </span>
                    </span>
                    <span className="font-mono font-medium">{formatJMD(b.tax)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--border)] font-semibold">
                  <span>Total Annual Income Tax</span>
                  <span className="font-mono">{formatJMD(taxBreakdown.tax)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
