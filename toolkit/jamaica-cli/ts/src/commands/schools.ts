import { Command } from 'commander';
import { getSchools, getSchoolsByParish, getUniversities, searchSchools, getSchoolCount, getSchoolCountByParish } from 'jamaica-schools';
import { output, table, success, error } from '../utils/output.js';

export function registerSchoolsCommands(program: Command): void {
  const cmd = program.command('schools').description('Jamaica schools and universities directory');

  cmd.command('list')
    .description('List all schools')
    .option('-p, --parish <parish>', 'Filter by parish')
    .option('-t, --type <type>', 'Filter by type (primary, secondary, tertiary, etc.)')
    .action((opts: { parish?: string; type?: string }) => {
      let schools = opts.parish ? getSchoolsByParish(opts.parish) : getSchools();
      if (opts.type) {
        schools = schools.filter(s => s.type === opts.type);
      }
      table(['Name', 'Type', 'Level', 'Ownership', 'Parish'],
        schools.map(s => [s.name, s.type, s.level, s.ownership, s.parish]));
      success(`${schools.length} schools found`);
    });

  cmd.command('universities')
    .description('List all universities')
    .action(() => {
      const unis = getUniversities();
      table(['Name', 'Ownership', 'Parish'],
        unis.map(u => [u.name, u.ownership, u.parish]));
    });

  cmd.command('search <query>')
    .description('Search schools by name')
    .action((query: string) => {
      const results = searchSchools(query);
      if (results.length === 0) { console.log(`No schools found for: ${query}`); return; }
      table(['Name', 'Type', 'Parish'],
        results.map(s => [s.name, s.type, s.parish]));
    });

  cmd.command('count')
    .description('Show school count by parish')
    .action(() => {
      const counts = getSchoolCountByParish();
      table(['Parish', 'Count'],
        Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([p, c]) => [p, c.toString()]));
      success(`Total: ${getSchoolCount()} schools`);
    });
}
