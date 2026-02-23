# jamaica-gov-fees

Complete database of Jamaica government service fees across 10 agencies.

## Install

::: code-group
```bash [npm]
npm install jamaica-gov-fees
```
```bash [pip]
pip install jamaica-gov-fees
```
:::

## Agencies Covered

| Acronym | Agency |
|---------|--------|
| PICA | Passport, Immigration and Citizenship Agency |
| NIRA | National Identification and Registration Authority |
| TAJ | Tax Administration Jamaica |
| ITA | Island Traffic Authority |
| COJ | Companies Office of Jamaica |
| NLA | National Land Agency |
| NEPA | National Environment and Planning Agency |
| Police | Jamaica Constabulary Force |
| Trade Board | Trade Board Limited |
| Labour | Ministry of Labour |

## API Reference

### `searchFees(query: string): ServiceFee[]`

Search all fees by keyword.

```typescript
searchFees('passport');   // All passport-related fees
searchFees('driver');     // Driver's licence fees
searchFees('business');   // Business registration fees
```

### `getPassportFee(opts): PassportFee`

```typescript
getPassportFee({ type: 'standard', age: 'adult' });
// { jmd: 6500, days: 7, office: "kingston" }
```

### `getAllFees(): ServiceFee[]`

Returns all 60+ fees in the database.

### `getAgencies(): Agency[]`

Returns all 10 government agencies.
