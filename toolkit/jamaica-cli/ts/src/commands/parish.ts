import { Command } from 'commander';
import {
  getAllParishes,
  getParish,
  getParishByName,
  getDistanceKm,
  getParishesWithService,
  getTotalPopulation,
} from 'jamaica-parishes';
import { output, table } from '../utils/output.js';

export function registerParishCommands(program: Command): void {
  const parish = program
    .command('parish')
    .description('Jamaica parish data and lookups');

  parish
    .command('list')
    .description('List all 14 parishes')
    .action(() => {
      const parishes = getAllParishes();
      table(
        ['Code', 'Name', 'Capital', 'Population'],
        parishes.map((p) => [p.code, p.name, p.capital, p.population.toLocaleString()])
      );
    });

  parish
    .command('info <nameOrCode>')
    .description('Show details for a parish')
    .action((input: string) => {
      const p = getParish(input.toUpperCase()) ?? getParishByName(input);
      if (!p) {
        console.error(`Parish not found: ${input}`);
        process.exitCode = 1;
        return;
      }
      output({
        code: p.code,
        name: p.name,
        capital: p.capital,
        population: p.population,
        area_km2: p.area_km2,
        coordinates: p.coordinates,
      });
    });

  parish
    .command('distance <from> <to>')
    .description('Calculate distance between two parishes (km)')
    .action((from: string, to: string) => {
      const dist = getDistanceKm(from.toUpperCase() as any, to.toUpperCase() as any);
      if (dist === null) {
        console.error('Invalid parish code(s)');
        process.exitCode = 1;
        return;
      }
      output({ from: from.toUpperCase(), to: to.toUpperCase(), distance_km: Math.round(dist * 10) / 10 });
    });

  parish
    .command('service <type>')
    .description('List parishes with a specific service (nla, taj, pica, coj)')
    .action((type: string) => {
      const parishes = getParishesWithService(type as any);
      table(
        ['Code', 'Name', 'Capital'],
        parishes.map((p) => [p.code, p.name, p.capital])
      );
    });

  parish
    .command('population')
    .description('Show total Jamaica population')
    .action(() => {
      output({ total_population: getTotalPopulation() });
    });
}
