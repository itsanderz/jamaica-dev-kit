import { Command } from 'commander';
import { isValidTRN, formatTRN, unformatTRN, generateTestTRN, getTRNCheckDigit } from 'jamaica-trn';
import { output, success, error } from '../utils/output.js';

export function registerTrnCommands(program: Command): void {
  const trn = program
    .command('trn')
    .description('TRN (Tax Registration Number) utilities');

  trn
    .command('validate <trn>')
    .description('Validate a Jamaica TRN')
    .action((input: string) => {
      const valid = isValidTRN(input);
      if (valid) {
        output({ valid: true, formatted: formatTRN(input), raw: unformatTRN(input) });
        success(`Valid TRN: ${formatTRN(input)}`);
      } else {
        output({ valid: false, input });
        error(`Invalid TRN: ${input}`);
        process.exitCode = 1;
      }
    });

  trn
    .command('format <trn>')
    .description('Format a TRN as NNN-NNN-NNN')
    .action((input: string) => {
      const raw = unformatTRN(input);
      if (raw.length !== 9) {
        error('Input must be 9 digits');
        process.exitCode = 1;
        return;
      }
      output(formatTRN(input));
    });

  trn
    .command('generate')
    .description('Generate random test TRNs')
    .option('-n, --count <count>', 'Number of TRNs to generate', '1')
    .option('-f, --formatted', 'Output in NNN-NNN-NNN format')
    .action((opts: { count: string; formatted?: boolean }) => {
      const count = parseInt(opts.count, 10) || 1;
      const results: string[] = [];
      for (let i = 0; i < count; i++) {
        const raw = generateTestTRN();
        results.push(opts.formatted ? formatTRN(raw) : raw);
      }
      output(results.length === 1 ? results[0] : results);
    });

  trn
    .command('check-digit <digits>')
    .description('Compute the check digit for 8 digits')
    .action((digits: string) => {
      if (digits.length !== 8 || !/^\d{8}$/.test(digits)) {
        error('Provide exactly 8 digits');
        process.exitCode = 1;
        return;
      }
      const check = getTRNCheckDigit(digits);
      if (check === null) {
        error('Invalid combination — no valid check digit exists');
        process.exitCode = 1;
      } else {
        output({ digits, checkDigit: check, trn: formatTRN(digits + check) });
        success(`Check digit: ${check} → TRN: ${formatTRN(digits + check)}`);
      }
    });
}
