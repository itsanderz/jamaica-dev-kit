import { Command } from 'commander';
import { getHolidays, isPublicHoliday, getNextHoliday, isBusinessDay, getWorkingDays } from 'jamaica-holidays';
import { output, table, success, error } from '../utils/output.js';

export function registerHolidaysCommands(program: Command): void {
  const hol = program
    .command('holidays')
    .description('Jamaica public holidays and business day utilities');

  hol
    .command('list [year]')
    .description('List all public holidays for a year (default: current year)')
    .action((yearStr?: string) => {
      const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
      if (isNaN(year)) {
        error('Invalid year');
        process.exitCode = 1;
        return;
      }
      const holidays = getHolidays(year);
      table(
        ['Date', 'Name', 'Type'],
        holidays.map((h) => [h.date, h.name, h.moveable ? 'Moveable' : 'Fixed']),
      );
    });

  hol
    .command('check <date>')
    .description('Check if a date (YYYY-MM-DD) is a public holiday or business day')
    .action((dateStr: string) => {
      const isHoliday = isPublicHoliday(dateStr);
      const isBiz = isBusinessDay(dateStr);
      output({ date: dateStr, isPublicHoliday: isHoliday, isBusinessDay: isBiz });
      if (isHoliday) {
        success(`${dateStr} is a public holiday`);
      } else if (!isBiz) {
        success(`${dateStr} is a weekend (not a business day)`);
      } else {
        success(`${dateStr} is a regular business day`);
      }
    });

  hol
    .command('next [from]')
    .description('Get the next upcoming public holiday (from YYYY-MM-DD or today)')
    .action((fromStr?: string) => {
      const next = fromStr ? getNextHoliday(fromStr) : getNextHoliday();
      if (next) {
        output(next);
        success(`Next holiday: ${next.name} on ${next.date}`);
      } else {
        error('No upcoming holiday found');
      }
    });

  hol
    .command('working-days <from> <to>')
    .description('Count working days between two dates (YYYY-MM-DD)')
    .action((from: string, to: string) => {
      const count = getWorkingDays(from, to);
      output({ from, to, workingDays: count });
      success(`${count} working days from ${from} to ${to}`);
    });
}
