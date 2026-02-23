# jamaica-currency

JMD currency formatting, parsing, conversion, and GCT (General Consumption Tax) calculations.

## Install

::: code-group
```bash [npm]
npm install jamaica-currency
```
```bash [pip]
pip install jamaica-currency
```
:::

## API Reference

### `formatJMD(amount: number): string`

```typescript
formatJMD(1500);    // "J$1,500.00"
formatJMD(0.5);     // "J$0.50"
```

### `parseJMD(str: string): number | null`

```typescript
parseJMD('J$1,500.00');  // 1500
parseJMD('$5000');       // 5000
```

### `addGCT(amount: number): number`

Add 15% General Consumption Tax.

```typescript
addGCT(10000);  // 11500
```

### `formatWithGCT(amount: number): GCTBreakdown`

```typescript
formatWithGCT(10000);
// { base: "J$10,000.00", gct: "J$1,500.00", total: "J$11,500.00" }
```

### `jmdToUSD(amount: number, rate?: number): number`

Convert JMD to USD (default rate: J$155.47 = US$1).

### Constants

- `GCT_RATE` = `0.15` (15%)
- `TELECOM_GCT_RATE` = `0.25` (25%)
- `DEFAULT_EXCHANGE_RATE` = `155.47`
