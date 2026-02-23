import { Command } from 'commander';
import { calculatePayroll, calculateIncomeTax, getIncomeTaxBrackets, getTaxThreshold } from 'jamaica-tax';
import { output, table, success, error } from '../utils/output.js';

export function registerTaxCommands(program: Command): void {
  const cmd = program.command('tax').description('Jamaica tax calculations — income tax, payroll, NIS, NHT');

  cmd.command('brackets')
    .description('Show income tax brackets')
    .action(() => {
      const brackets = getIncomeTaxBrackets();
      table(['Min (J$)', 'Max (J$)', 'Rate', 'Label'],
        brackets.map(b => [
          `J$${b.min.toLocaleString()}`,
          b.max ? `J$${b.max.toLocaleString()}` : 'No limit',
          `${(b.rate * 100).toFixed(1)}%`,
          b.label
        ]));
      success(`Tax threshold: J$${getTaxThreshold().toLocaleString()}`);
    });

  cmd.command('income <annual-income>')
    .description('Calculate income tax on annual income (J$)')
    .action((incomeStr: string) => {
      const income = parseFloat(incomeStr.replace(/,/g, ''));
      if (isNaN(income)) { error('Invalid income amount'); process.exitCode = 1; return; }
      const result = calculateIncomeTax(income);
      output(result);
      success(`Tax: J$${result.tax.toLocaleString()} (effective rate: ${(result.effectiveRate * 100).toFixed(2)}%)`);
    });

  cmd.command('payroll <gross-pay>')
    .description('Calculate full payroll deductions for monthly gross pay')
    .option('-p, --period <period>', 'Pay period: monthly, fortnightly, weekly, annual', 'monthly')
    .action((grossStr: string, opts: { period: string }) => {
      const gross = parseFloat(grossStr.replace(/,/g, ''));
      if (isNaN(gross)) { error('Invalid amount'); process.exitCode = 1; return; }
      const period = opts.period as 'monthly' | 'fortnightly' | 'weekly' | 'annual';
      const result = calculatePayroll(gross, period);
      output(result);
      table(['Deduction', 'Amount (J$)'], [
        ['Income Tax', `J$${result.incomeTax.toLocaleString()}`],
        ['NIS', `J$${result.nis.toLocaleString()}`],
        ['NHT', `J$${result.nht.toLocaleString()}`],
        ['Education Tax', `J$${result.educationTax.toLocaleString()}`],
        ['Total Deductions', `J$${result.totalDeductions.toLocaleString()}`],
        ['Net Pay', `J$${result.netPay.toLocaleString()}`],
      ]);
      success(`Net pay: J$${result.netPay.toLocaleString()} from J$${result.grossPay.toLocaleString()} gross`);
    });
}
