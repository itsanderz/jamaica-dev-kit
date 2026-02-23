import { Command } from 'commander';
import { registerTrnCommands } from './commands/trn.js';
import { registerPhoneCommands } from './commands/phone.js';
import { registerParishCommands } from './commands/parish.js';
import { registerCurrencyCommands } from './commands/currency.js';
import { registerFeesCommands } from './commands/fees.js';
import { registerAddressCommands } from './commands/address.js';
import { registerHolidaysCommands } from './commands/holidays.js';
import { registerConstantsCommands } from './commands/constants.js';
import { registerTaxCommands } from './commands/tax.js';
import { registerSchoolsCommands } from './commands/schools.js';
import { registerHealthCommands } from './commands/health.js';
import { registerBanksCommands } from './commands/banks.js';
import { registerConstituenciesCommands } from './commands/constituencies.js';
import { registerTransportCommands } from './commands/transport.js';
import { registerEmergencyCommands } from './commands/emergency.js';
import { registerPlacesCommands } from './commands/places.js';
import { registerBojCommands } from './commands/boj.js';
import { registerOpenDataCommands } from './commands/open-data.js';
import { setJsonMode } from './utils/output.js';

const program = new Command()
  .name('jamaica')
  .description('Jamaica Developer Toolkit CLI')
  .version('0.1.0')
  .option('--json', 'Output results as JSON')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.json) setJsonMode(true);
  });

registerTrnCommands(program);
registerPhoneCommands(program);
registerParishCommands(program);
registerCurrencyCommands(program);
registerFeesCommands(program);
registerAddressCommands(program);
registerHolidaysCommands(program);
registerConstantsCommands(program);
registerTaxCommands(program);
registerSchoolsCommands(program);
registerHealthCommands(program);
registerBanksCommands(program);
registerConstituenciesCommands(program);
registerTransportCommands(program);
registerEmergencyCommands(program);
registerPlacesCommands(program);
registerBojCommands(program);
registerOpenDataCommands(program);

program.parse();
