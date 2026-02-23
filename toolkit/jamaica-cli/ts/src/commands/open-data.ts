import { Command } from 'commander';
import { DATASETS, RESOURCES, listDatasets, getDataset, getHealthCentres, type HealthCentreRecord } from 'jamaica-open-data';
import { output, table, success, error } from '../utils/output.js';

export function registerOpenDataCommands(program: Command): void {
  const cmd = program.command('open-data').description('Jamaica Open Data Portal (data.gov.jm)');

  cmd.command('datasets')
    .description('List all available datasets')
    .action(async () => {
      try {
        const datasets = await listDatasets();
        output(datasets);
        for (const name of datasets) {
          console.log(`  ${name}`);
        }
        success(`${datasets.length} datasets available on data.gov.jm`);
      } catch (e) {
        error(`Failed to fetch datasets: ${e instanceof Error ? e.message : 'unknown error'}`);
        process.exitCode = 1;
      }
    });

  cmd.command('dataset <name>')
    .description('Get details about a specific dataset')
    .action(async (name: string) => {
      try {
        const dataset = await getDataset(name);
        output(dataset);
        console.log(`  Title: ${dataset.title}`);
        console.log(`  Description: ${dataset.description}`);
        console.log(`  Resources: ${dataset.resources.length}`);
        for (const resource of dataset.resources) {
          console.log(`    - ${resource.name} (${resource.format})`);
        }
        if (dataset.tags.length > 0) {
          console.log(`  Tags: ${dataset.tags.map((t: { name: string }) => t.name).join(', ')}`);
        }
        success(`Dataset: ${dataset.title}`);
      } catch (e) {
        error(`Failed to fetch dataset: ${e instanceof Error ? e.message : 'unknown error'}`);
        process.exitCode = 1;
      }
    });

  cmd.command('health-centres')
    .description('Fetch health centres from Open Data Portal')
    .option('-p, --parish <parish>', 'Filter by parish')
    .action(async (opts: { parish?: string }) => {
      try {
        const centres = await getHealthCentres(opts.parish ? { parish: opts.parish } : undefined);
        table(
          ['Name', 'Parish', 'Address', 'Phone'],
          centres.map((c: HealthCentreRecord) => [
            c.CEN_NAME || '-',
            c.PARISH || '-',
            c.ADDRESS || '-',
            c.TELEPHONE || '-',
          ]),
        );
        success(`${centres.length} health centres${opts.parish ? ` in ${opts.parish}` : ''}`);
      } catch (e) {
        error(`Failed to fetch health centres: ${e instanceof Error ? e.message : 'unknown error'}`);
        process.exitCode = 1;
      }
    });

  cmd.command('known-datasets')
    .description('List well-known dataset identifiers')
    .action(() => {
      const entries = Object.entries(DATASETS);
      table(
        ['Key', 'Dataset Name'],
        entries.map(([key, value]) => [key, String(value)]),
      );
      success(`${entries.length} known dataset identifiers`);
    });

  cmd.command('known-resources')
    .description('List well-known resource IDs')
    .action(() => {
      const entries = Object.entries(RESOURCES);
      table(
        ['Key', 'Resource ID'],
        entries.map(([key, value]) => [key, String(value)]),
      );
      success(`${entries.length} known resource IDs`);
    });
}
