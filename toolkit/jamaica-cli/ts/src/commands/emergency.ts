import { Command } from 'commander';
import { getEmergencyNumbers, getPoliceStations, getPoliceStationsByParish, getFireStations, getFireStationsByParish, getDisasterShelters, getSheltersByParish, getStationCount, getShelterCount } from 'jamaica-emergency';
import { output, table, success } from '../utils/output.js';

export function registerEmergencyCommands(program: Command): void {
  const cmd = program.command('emergency').description('Jamaica emergency services directory');

  cmd.command('numbers')
    .description('Show emergency contact numbers')
    .action(() => {
      const numbers = getEmergencyNumbers();
      table(['Service', 'Number'], [
        ['Police', numbers.police],
        ['Ambulance', numbers.ambulance],
        ['Fire', numbers.fire],
        ['Disaster Preparedness (ODPEM)', numbers.disasterPreparedness],
        ['Coast Guard', numbers.coastGuard],
      ]);
    });

  cmd.command('police')
    .description('List police stations')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const stations = opts.parish ? getPoliceStationsByParish(opts.parish) : getPoliceStations();
      table(['Name', 'Parish', 'Division'],
        stations.map(s => [s.name, s.parish, s.division || '-']));
      success(`${stations.length} police stations`);
    });

  cmd.command('fire')
    .description('List fire stations')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const stations = opts.parish ? getFireStationsByParish(opts.parish) : getFireStations();
      table(['Name', 'Parish'],
        stations.map(s => [s.name, s.parish]));
      success(`${stations.length} fire stations`);
    });

  cmd.command('shelters')
    .description('List disaster shelters')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action((opts: { parish?: string }) => {
      const shelters = opts.parish ? getSheltersByParish(opts.parish) : getDisasterShelters();
      table(['Name', 'Parish', 'Type'],
        shelters.map(s => [s.name, s.parish, s.type]));
      success(`${shelters.length} shelters`);
    });
}
