import { Command } from 'commander';
import {
  getFallbackRates,
  getFallbackRate,
  getSupportedCurrencies,
  getExchangeRates,
  getExchangeRate,
  convertToJMD,
  convertFromJMD,
  type CurrencyCode,
  type ExchangeRate,
} from 'jamaica-boj';
import { output, table, success, error } from '../utils/output.js';

export function registerBojCommands(program: Command): void {
  const cmd = program.command('boj').description('Bank of Jamaica exchange rates');

  cmd.command('rates')
    .description('Show exchange rates (live or fallback)')
    .option('--live', 'Fetch live rates from BOJ (requires internet)')
    .action(async (opts: { live?: boolean }) => {
      if (opts.live) {
        try {
          const response = await getExchangeRates();
          table(
            ['Currency', 'Name', 'Buy', 'Sell', 'Mid'],
            response.rates.map((r: ExchangeRate) => [r.currency, r.name, r.buy.toFixed(2), r.sell.toFixed(2), r.mid.toFixed(2)]),
          );
          success(`${response.rates.length} rates (source: ${response.source})`);
        } catch (e) {
          error('Failed to fetch live rates — showing fallback rates');
          showFallbackRates();
        }
      } else {
        showFallbackRates();
      }
    });

  cmd.command('rate <currency>')
    .description('Get rate for a specific currency (e.g., USD, GBP, CAD)')
    .option('--live', 'Fetch live rate from BOJ')
    .action(async (currency: string, opts: { live?: boolean }) => {
      const code = currency.toUpperCase() as CurrencyCode;
      const supported = getSupportedCurrencies();
      if (!supported.includes(code)) {
        error(`Unsupported currency: ${code}. Supported: ${supported.join(', ')}`);
        process.exitCode = 1;
        return;
      }

      if (opts.live) {
        try {
          const rate = await getExchangeRate(code);
          output({
            currency: rate.currency,
            name: rate.name,
            buy: rate.buy,
            sell: rate.sell,
            mid: rate.mid,
          });
          success(`${rate.currency} — Buy: ${rate.buy.toFixed(2)}, Sell: ${rate.sell.toFixed(2)}`);
        } catch {
          error('Failed to fetch live rate — showing fallback');
          const rate = getFallbackRate(code);
          if (rate) {
            success(`${rate.currency} (fallback) — Buy: ${rate.buy.toFixed(2)}, Sell: ${rate.sell.toFixed(2)}`);
          }
        }
      } else {
        const rate = getFallbackRate(code);
        if (rate) {
          output({
            currency: rate.currency,
            name: rate.name,
            buy: rate.buy,
            sell: rate.sell,
            mid: rate.mid,
            source: 'fallback',
          });
          success(`${rate.currency} (fallback) — Buy: ${rate.buy.toFixed(2)}, Sell: ${rate.sell.toFixed(2)}`);
        } else {
          error(`No rate found for: ${code}`);
          process.exitCode = 1;
        }
      }
    });

  cmd.command('convert <amount> <from> <to>')
    .description('Convert between JMD and foreign currency (e.g., 1000 USD JMD)')
    .option('--live', 'Use live rates')
    .action(async (amountStr: string, from: string, to: string, opts: { live?: boolean }) => {
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        error('Amount must be a positive number');
        process.exitCode = 1;
        return;
      }

      const fromCode = from.toUpperCase();
      const toCode = to.toUpperCase();

      if (fromCode === 'JMD' && toCode !== 'JMD') {
        // JMD to foreign
        const currency = toCode as CurrencyCode;
        if (opts.live) {
          try {
            const result = await convertFromJMD(amount, currency);
            success(`J$${amount.toFixed(2)} = ${currency} ${result.toFixed(2)}`);
          } catch {
            error('Failed to fetch live rate');
            process.exitCode = 1;
          }
        } else {
          const rate = getFallbackRate(currency);
          if (rate) {
            const result = amount / rate.sell;
            success(`J$${amount.toFixed(2)} = ${currency} ${result.toFixed(2)} (fallback rate)`);
          } else {
            error(`Unsupported currency: ${currency}`);
            process.exitCode = 1;
          }
        }
      } else if (fromCode !== 'JMD' && toCode === 'JMD') {
        // Foreign to JMD
        const currency = fromCode as CurrencyCode;
        if (opts.live) {
          try {
            const result = await convertToJMD(amount, currency);
            success(`${currency} ${amount.toFixed(2)} = J$${result.toFixed(2)}`);
          } catch {
            error('Failed to fetch live rate');
            process.exitCode = 1;
          }
        } else {
          const rate = getFallbackRate(currency);
          if (rate) {
            const result = amount * rate.sell;
            success(`${currency} ${amount.toFixed(2)} = J$${result.toFixed(2)} (fallback rate)`);
          } else {
            error(`Unsupported currency: ${currency}`);
            process.exitCode = 1;
          }
        }
      } else {
        error('One of the currencies must be JMD (e.g., "100 USD JMD" or "15000 JMD USD")');
        process.exitCode = 1;
      }
    });

  cmd.command('currencies')
    .description('List all supported currencies')
    .action(() => {
      const rates = getFallbackRates();
      table(
        ['Code', 'Name'],
        rates.map((r: ExchangeRate) => [r.currency, r.name]),
      );
      success(`${rates.length} currencies supported`);
    });
}

function showFallbackRates() {
  const rates = getFallbackRates();
  table(
    ['Currency', 'Name', 'Buy', 'Sell', 'Mid'],
    rates.map((r: ExchangeRate) => [r.currency, r.name, r.buy.toFixed(2), r.sell.toFixed(2), r.mid.toFixed(2)]),
  );
  success(`${rates.length} currencies (source: fallback — use --live for current rates)`);
}
