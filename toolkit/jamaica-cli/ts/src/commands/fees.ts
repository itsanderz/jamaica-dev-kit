import { Command } from 'commander';
import {
  getAllFees,
  searchFees,
  getPassportFee,
  getDriversLicenceFee,
  getAgencies,
} from 'jamaica-gov-fees';
import { output, table } from '../utils/output.js';

export function registerFeesCommands(program: Command): void {
  const feesCmd = program
    .command('fees')
    .description('Jamaica government service fees');

  feesCmd
    .command('search <query>')
    .description('Search all government fees')
    .action((query: string) => {
      const results = searchFees(query);
      if (results.length === 0) {
        console.log(`No fees found for: ${query}`);
        return;
      }
      table(
        ['Agency', 'Service', 'Type', 'JMD'],
        results.map((f) => [
          f.agency,
          f.service,
          f.type || '-',
          f.jmd ? `J$${f.jmd.toLocaleString()}` : f.jmd_range || '-',
        ])
      );
    });

  feesCmd
    .command('passport')
    .description('Passport fee schedule')
    .action(() => {
      const types = ['standard', 'expedited'] as const;
      const ages = ['adult', 'child'] as const;
      const rows: string[][] = [];
      for (const age of ages) {
        for (const type of types) {
          const fee = getPassportFee({ type, age });
          if (fee) {
            rows.push([age, type, fee.jmd ? `J$${fee.jmd.toLocaleString()}` : '-', `${fee.days || '-'} days`]);
          }
        }
      }
      table(['Age', 'Type', 'Fee', 'Processing'], rows);
    });

  feesCmd
    .command('licence')
    .description("Driver's licence fees")
    .action(() => {
      const types = ['general', 'provisional', 'renewal'] as const;
      const rows: string[][] = [];
      for (const type of types) {
        const fee = getDriversLicenceFee(type);
        if (fee) {
          rows.push([type, fee.jmd ? `J$${fee.jmd.toLocaleString()}` : '-']);
        }
      }
      table(['Type', 'Fee'], rows);
    });

  feesCmd
    .command('agencies')
    .description('List all government agencies')
    .action(() => {
      const agencies = getAgencies();
      table(
        ['ID', 'Name', 'Acronym'],
        agencies.map((a) => [a.id, a.name, a.acronym || '-'])
      );
    });
}
