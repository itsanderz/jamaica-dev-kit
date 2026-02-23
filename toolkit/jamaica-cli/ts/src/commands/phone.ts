import { Command } from 'commander';
import {
  isValidJamaicanNumber,
  parsePhone,
  formatLocal,
  formatNational,
  formatE164,
  formatInternational,
  getCarrier,
  isMobile,
} from 'jamaica-phone';
import { output, success, error } from '../utils/output.js';

export function registerPhoneCommands(program: Command): void {
  const phone = program
    .command('phone')
    .description('Jamaica phone number utilities (+1-876/+1-658)');

  phone
    .command('validate <number>')
    .description('Validate a Jamaican phone number')
    .action((input: string) => {
      const valid = isValidJamaicanNumber(input);
      if (valid) {
        success(`Valid Jamaican number: ${formatNational(input)}`);
        output({ valid: true, formatted: formatNational(input), e164: formatE164(input) });
      } else {
        error(`Invalid number: ${input}`);
        output({ valid: false, input });
        process.exitCode = 1;
      }
    });

  phone
    .command('format <number>')
    .description('Show all format variants for a number')
    .action((input: string) => {
      if (!isValidJamaicanNumber(input)) {
        error(`Invalid number: ${input}`);
        process.exitCode = 1;
        return;
      }
      const formats = {
        local: formatLocal(input),
        national: formatNational(input),
        international: formatInternational(input),
        e164: formatE164(input),
      };
      output(formats);
    });

  phone
    .command('carrier <number>')
    .description('Detect carrier for a Jamaican number')
    .action((input: string) => {
      if (!isValidJamaicanNumber(input)) {
        error(`Invalid number: ${input}`);
        process.exitCode = 1;
        return;
      }
      const carrier = getCarrier(input);
      const mobile = isMobile(input);
      output({ number: formatNational(input), carrier, mobile });
      success(`Carrier: ${carrier} | Mobile: ${mobile ? 'Yes' : 'No'}`);
    });
}
