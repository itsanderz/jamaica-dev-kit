import { Command } from 'commander';
import {
  formatJMD,
  parseJMD,
  formatUSD,
  jmdToUSD,
  usdToJMD,
  addGCT,
  removeGCT,
  formatWithGCT,
  GCT_RATE,
  DEFAULT_EXCHANGE_RATE,
} from 'jamaica-currency';
import { output, success } from '../utils/output.js';

export function registerCurrencyCommands(program: Command): void {
  const curr = program
    .command('currency')
    .description('JMD currency formatting and conversion');

  curr
    .command('format <amount>')
    .description('Format a number as JMD')
    .action((amount: string) => {
      const num = parseFloat(amount);
      if (isNaN(num)) {
        console.error('Invalid amount');
        process.exitCode = 1;
        return;
      }
      output(formatJMD(num));
    });

  curr
    .command('parse <string>')
    .description('Parse a JMD string to a number')
    .action((input: string) => {
      const num = parseJMD(input);
      if (num === null) {
        console.error(`Cannot parse: ${input}`);
        process.exitCode = 1;
        return;
      }
      output({ input, value: num, formatted: formatJMD(num) });
    });

  curr
    .command('convert <amount>')
    .description('Convert between JMD and USD')
    .option('--to <currency>', 'Target currency (usd or jmd)', 'usd')
    .option('--rate <rate>', `Exchange rate (default: ${DEFAULT_EXCHANGE_RATE})`)
    .action((amount: string, opts: { to: string; rate?: string }) => {
      const num = parseFloat(amount);
      if (isNaN(num)) {
        console.error('Invalid amount');
        process.exitCode = 1;
        return;
      }
      const rate = opts.rate ? parseFloat(opts.rate) : undefined;
      if (opts.to.toLowerCase() === 'usd') {
        const usd = jmdToUSD(num, rate);
        output({ jmd: formatJMD(num), usd: formatUSD(usd), rate: rate ?? DEFAULT_EXCHANGE_RATE });
      } else {
        const jmd = usdToJMD(num, rate);
        output({ usd: formatUSD(num), jmd: formatJMD(jmd), rate: rate ?? DEFAULT_EXCHANGE_RATE });
      }
    });

  curr
    .command('gct <amount>')
    .description('Calculate GCT breakdown')
    .action((amount: string) => {
      const num = parseFloat(amount);
      if (isNaN(num)) {
        console.error('Invalid amount');
        process.exitCode = 1;
        return;
      }
      const breakdown = formatWithGCT(num);
      output(breakdown);
    });
}
