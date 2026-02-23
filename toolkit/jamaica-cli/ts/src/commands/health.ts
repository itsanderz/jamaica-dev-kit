import { Command } from 'commander';
import { getHospitals, getHealthCentres, getHealthFacilitiesByParish, getRegionalAuthorities, getRegionalAuthority, searchHealthFacilities, getHealthFacilityCount } from 'jamaica-health';
import { output, table, success } from '../utils/output.js';

export function registerHealthCommands(program: Command): void {
  const cmd = program.command('health').description('Jamaica health facilities directory');

  cmd.command('hospitals')
    .description('List all hospitals')
    .action(() => {
      const hospitals = getHospitals();
      table(['Name', 'Parish', 'Region', 'Specialization'],
        hospitals.map(h => [h.name, h.parish, h.region.toUpperCase(), h.specialization || '-']));
      success(`${hospitals.length} hospitals`);
    });

  cmd.command('centres')
    .description('List all health centres')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const centres = opts.parish
        ? getHealthFacilitiesByParish(opts.parish).filter(f => f.type === 'health-centre')
        : getHealthCentres();
      table(['Name', 'Parish', 'Region'],
        centres.map(c => [c.name, c.parish, c.region.toUpperCase()]));
      success(`${centres.length} health centres`);
    });

  cmd.command('rha')
    .description('Show Regional Health Authorities')
    .action(() => {
      const rhas = getRegionalAuthorities();
      table(['ID', 'Name', 'Parishes'],
        rhas.map(r => [r.id.toUpperCase(), r.name, r.parishes.join(', ')]));
    });

  cmd.command('search <query>')
    .description('Search health facilities by name')
    .action((query: string) => {
      const results = searchHealthFacilities(query);
      if (results.length === 0) { console.log(`No facilities found for: ${query}`); return; }
      table(['Name', 'Type', 'Parish'],
        results.map(f => [f.name, f.type, f.parish]));
    });
}
