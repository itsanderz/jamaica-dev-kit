import { Command } from 'commander';
import { parseAddress, extractParish, isKingstonAddress, getKingstonSector, formatAddress } from 'jamaica-addresses';
import { output, success } from '../utils/output.js';

export function registerAddressCommands(program: Command): void {
  const addr = program
    .command('address')
    .description('Jamaica address parsing and normalization');

  addr
    .command('parse <address>')
    .description('Parse an informal Jamaican address')
    .action((input: string) => {
      const parsed = parseAddress(input);
      output(parsed);
    });

  addr
    .command('parish <address>')
    .description('Extract parish from an address')
    .action((input: string) => {
      const parish = extractParish(input);
      if (parish) {
        success(`Parish: ${parish}`);
        output({ address: input, parish });
      } else {
        console.error('Could not determine parish');
        process.exitCode = 1;
      }
    });

  addr
    .command('format <address>')
    .description('Format an address into standard form')
    .action((input: string) => {
      const parsed = parseAddress(input);
      const formatted = formatAddress(parsed);
      output(formatted);
    });
}
