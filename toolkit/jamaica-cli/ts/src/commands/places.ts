import { Command } from 'commander';
import { getPlaces, getPlacesByParish, getTowns, searchPlaces, getPlaceCount, getPlaceCountByParish } from 'jamaica-places';
import { table, success } from '../utils/output.js';

export function registerPlacesCommands(program: Command): void {
  const cmd = program.command('places').description('Jamaica places directory — towns, communities, districts');

  cmd.command('list')
    .description('List all places')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const items = opts.parish ? getPlacesByParish(opts.parish) : getPlaces();
      table(['Name', 'Type', 'Parish', 'Population'],
        items.map(p => [p.name, p.type, p.parish, p.population?.toLocaleString() || '-']));
      success(`${items.length} places`);
    });

  cmd.command('towns')
    .description('List all towns and cities')
    .action(() => {
      const towns = getTowns();
      table(['Name', 'Parish', 'Population'],
        towns.map(t => [t.name, t.parish, t.population?.toLocaleString() || '-']));
      success(`${towns.length} towns and cities`);
    });

  cmd.command('search <query>')
    .description('Search places by name')
    .action((query: string) => {
      const results = searchPlaces(query);
      if (results.length === 0) { console.log(`No places found for: ${query}`); return; }
      table(['Name', 'Type', 'Parish'],
        results.map(p => [p.name, p.type, p.parish]));
    });

  cmd.command('count')
    .description('Show place count by parish')
    .action(() => {
      const counts = getPlaceCountByParish();
      table(['Parish', 'Places'],
        Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([p, c]) => [p, c.toString()]));
      success(`Total: ${getPlaceCount()} places`);
    });
}
