# Public Holidays

Browse Jamaican public holidays by year, check if any date is a holiday or business day, and count working days between dates. Handles moveable feasts (Easter-dependent) and Sunday substitution rules.

<PlaygroundHolidays />

## API Reference

| Function | Description |
|----------|-------------|
| `getHolidays(year)` | All public holidays for a year |
| `isPublicHoliday(date)` | Check if a date is a public holiday |
| `isBusinessDay(date)` | Check if not weekend and not holiday |
| `getWorkingDays(from, to)` | Count business days between two dates |
| `getNextHoliday(from?)` | Get the next upcoming holiday |
| `getEasterSunday(year)` | Calculate Easter Sunday date |

## Install

```bash
npm install jamaica-holidays
```
