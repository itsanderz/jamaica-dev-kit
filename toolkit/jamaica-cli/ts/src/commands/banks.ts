import { Command } from 'commander';
import { getBanks, getBank, getBankBranches, searchBanks, getSwiftCode, getBankCount, getBranchCount } from 'jamaica-banks';
import { output, table, success, error } from '../utils/output.js';

export function registerBanksCommands(program: Command): void {
  const cmd = program.command('banks').description('Jamaica banking institutions directory');

  cmd.command('list')
    .description('List all banks and financial institutions')
    .action(() => {
      const banks = getBanks();
      table(['Name', 'Abbreviation', 'Type', 'SWIFT'],
        banks.map(b => [b.name, b.abbreviation, b.type, b.swift || '-']));
      success(`${getBankCount()} institutions, ${getBranchCount()} branches`);
    });

  cmd.command('branches <bank>')
    .description('List branches for a bank (by ID)')
    .action((bankId: string) => {
      const branches = getBankBranches(bankId);
      if (branches.length === 0) { console.log(`No branches found for: ${bankId}`); return; }
      table(['Name', 'Parish', 'Address'],
        branches.map(b => [b.name, b.parish, b.address || '-']));
    });

  cmd.command('swift <bank>')
    .description('Get SWIFT code for a bank')
    .action((bankId: string) => {
      const swift = getSwiftCode(bankId);
      if (swift) { success(`SWIFT code for ${bankId}: ${swift}`); }
      else { error(`No SWIFT code found for: ${bankId}`); process.exitCode = 1; }
    });

  cmd.command('search <query>')
    .description('Search banks by name')
    .action((query: string) => {
      const results = searchBanks(query);
      if (results.length === 0) { console.log(`No banks found for: ${query}`); return; }
      table(['Name', 'Type', 'SWIFT'],
        results.map(b => [b.name, b.type, b.swift || '-']));
    });
}
