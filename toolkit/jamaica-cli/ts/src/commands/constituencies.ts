import { Command } from 'commander';
import { getConstituencies, getConstituencyByParish, searchConstituencies, getConstituencyCount, getConstituencyCountByParish } from 'jamaica-constituencies';
import { table, success } from '../utils/output.js';

export function registerConstituenciesCommands(program: Command): void {
  const cmd = program.command('constituencies').description('Jamaica electoral constituencies');

  cmd.command('list')
    .description('List all 63 constituencies')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const items = opts.parish ? getConstituencyByParish(opts.parish) : getConstituencies();
      table(['Name', 'Parish'], items.map(c => [c.name, c.parish]));
      success(`${items.length} constituencies`);
    });

  cmd.command('count')
    .description('Show constituency count by parish')
    .action(() => {
      const counts = getConstituencyCountByParish();
      table(['Parish', 'Constituencies'],
        Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([p, c]) => [p, c.toString()]));
      success(`Total: ${getConstituencyCount()} constituencies`);
    });

  cmd.command('search <query>')
    .description('Search constituencies by name')
    .action((query: string) => {
      const results = searchConstituencies(query);
      if (results.length === 0) { console.log(`No constituencies found for: ${query}`); return; }
      table(['Name', 'Parish'], results.map(c => [c.name, c.parish]));
    });
}
