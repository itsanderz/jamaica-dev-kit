import { Command } from 'commander';
import { getAirports, getAirport, getSeaports, getVehicleClasses, getRoadNetwork, getHighways, getLicencePlatePrefixes } from 'jamaica-transport';
import { output, table, success } from '../utils/output.js';

export function registerTransportCommands(program: Command): void {
  const cmd = program.command('transport').description('Jamaica transport infrastructure');

  cmd.command('airports')
    .description('List all airports and aerodromes')
    .action(() => {
      const airports = getAirports();
      table(['Name', 'IATA', 'ICAO', 'Parish', 'Type'],
        airports.map(a => [a.name, a.iata, a.icao, a.parish, a.type]));
    });

  cmd.command('airport <code>')
    .description('Look up airport by IATA or ICAO code')
    .action((code: string) => {
      const airport = getAirport(code);
      if (airport) { output(airport); }
      else { console.log(`No airport found for code: ${code}`); }
    });

  cmd.command('seaports')
    .description('List all seaports')
    .action(() => {
      const ports = getSeaports();
      table(['Name', 'Parish', 'Type', 'Operator'],
        ports.map(p => [p.name, p.parish, p.type, p.operator || '-']));
    });

  cmd.command('vehicles')
    .description('List vehicle classifications')
    .action(() => {
      const classes = getVehicleClasses();
      table(['Code', 'Name', 'Plate Prefix'],
        classes.map(v => [v.code, v.name, v.platePrefix || '-']));
    });

  cmd.command('roads')
    .description('Show road network statistics')
    .action(() => {
      const rn = getRoadNetwork();
      output(rn);
      success(`Total: ${rn.totalKm.toLocaleString()} km (${rn.pavedKm.toLocaleString()} paved, ${rn.unpavedKm.toLocaleString()} unpaved)`);
    });

  cmd.command('plates')
    .description('Show licence plate prefixes')
    .action(() => {
      const prefixes = getLicencePlatePrefixes();
      table(['Prefix', 'Vehicle Type', 'Description'],
        prefixes.map(p => [p.prefix, p.vehicleType, p.description]));
    });
}
