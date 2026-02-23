import { Command } from 'commander';
import * as c from 'jamaica-constants';
import { output, table } from '../utils/output.js';

export function registerConstantsCommands(program: Command): void {
  const cmd = program
    .command('constants')
    .description('Jamaica country constants and reference data');

  cmd
    .command('all')
    .description('Show all Jamaica constants')
    .action(() => {
      output({
        iso: { alpha2: c.COUNTRY_CODE, alpha3: c.ISO_ALPHA3, numeric: c.ISO_NUMERIC },
        telecom: { callingCode: c.CALLING_CODE, areaCodes: c.AREA_CODES },
        currency: { code: c.CURRENCY_CODE, symbol: c.CURRENCY_SYMBOL },
        time: { timezone: c.TIMEZONE, utcOffset: c.UTC_OFFSET, observesDST: c.OBSERVES_DST },
        locale: { locale: c.LOCALE, languages: c.LANGUAGES },
        internet: { tld: c.TLD },
        geography: {
          capital: c.CAPITAL,
          totalParishes: c.TOTAL_PARISHES,
          areaKm2: c.AREA_KM2,
          coordinates: c.COORDINATES,
          drivingSide: c.DRIVING_SIDE,
        },
        emergency: {
          police: c.EMERGENCY_NUMBER,
          ambulance: c.AMBULANCE_NUMBER,
          fire: c.FIRE_NUMBER,
        },
        national: {
          motto: c.MOTTO,
          flower: c.NATIONAL_FLOWER,
          bird: c.NATIONAL_BIRD,
          fruit: c.NATIONAL_FRUIT,
          tree: c.NATIONAL_TREE,
          dish: c.NATIONAL_DISH,
        },
        dates: {
          independence: c.INDEPENDENCE_DATE,
          emancipation: c.EMANCIPATION_DATE,
        },
        flag: c.FLAG_COLORS,
        government: {
          headOfState: c.HEAD_OF_STATE,
          type: c.GOVERNMENT_TYPE,
          unMemberSince: c.UN_MEMBER_SINCE,
          caricomMember: c.CARICOM_MEMBER,
        },
      });
    });

  cmd
    .command('emergency')
    .description('Show emergency contact numbers')
    .action(() => {
      table(
        ['Service', 'Number'],
        [
          ['Police', c.EMERGENCY_NUMBER],
          ['Ambulance', c.AMBULANCE_NUMBER],
          ['Fire', c.FIRE_NUMBER],
        ],
      );
    });

  cmd
    .command('symbols')
    .description('Show national symbols')
    .action(() => {
      table(
        ['Symbol', 'Value'],
        [
          ['Motto', c.MOTTO],
          ['National Flower', c.NATIONAL_FLOWER],
          ['National Bird', c.NATIONAL_BIRD],
          ['National Fruit', c.NATIONAL_FRUIT],
          ['National Tree', c.NATIONAL_TREE],
          ['National Dish', c.NATIONAL_DISH],
          ['Flag Colors', `Green ${c.FLAG_COLORS.green}, Gold ${c.FLAG_COLORS.gold}, Black ${c.FLAG_COLORS.black}`],
        ],
      );
    });
}
