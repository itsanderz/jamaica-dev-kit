# jamaica-holidays

Jamaica public holidays, Easter calculation, and business day utilities.

## Install

::: code-group
```bash [npm]
npm install jamaica-holidays
```
```bash [pip]
pip install jamaica-holidays
```
:::

## API Reference

### `getHolidays(year: number): Holiday[]`

Returns all 10 public holidays for a year, sorted by date.

```typescript
getHolidays(2025);
// [
//   { date: "2025-01-01", name: "New Year's Day", moveable: false },
//   { date: "2025-03-05", name: "Ash Wednesday", moveable: true },
//   { date: "2025-04-18", name: "Good Friday", moveable: true },
//   ...
// ]
```

### `isPublicHoliday(date: Date | string): boolean`

```typescript
isPublicHoliday('2025-12-25');  // true (Christmas)
isPublicHoliday('2025-07-04');  // false
```

### `isBusinessDay(date: Date | string): boolean`

Returns `false` for weekends and public holidays.

```typescript
isBusinessDay('2025-01-01');  // false (New Year's, also a Wednesday)
isBusinessDay('2025-01-02');  // true (regular Thursday)
isBusinessDay('2025-01-04');  // false (Saturday)
```

### `getWorkingDays(from, to): number`

Count business days between two dates (inclusive of start, exclusive of end).

```typescript
getWorkingDays('2025-01-06', '2025-01-13');  // 5 (full work week)
```

### `getNextHoliday(from?): Holiday | null`

```typescript
getNextHoliday('2025-08-07');
// { date: "2025-10-20", name: "National Heroes Day", moveable: true }
```

## Jamaica Public Holidays

| Holiday | Date | Moveable |
|---------|------|----------|
| New Year's Day | January 1 | No |
| Ash Wednesday | 46 days before Easter | Yes |
| Good Friday | 2 days before Easter | Yes |
| Easter Monday | Day after Easter | Yes |
| Labour Day | May 23 | No |
| Emancipation Day | August 1 | No |
| Independence Day | August 6 | No |
| National Heroes Day | 3rd Monday of October | Yes |
| Christmas Day | December 25 | No |
| Boxing Day | December 26 | No |
