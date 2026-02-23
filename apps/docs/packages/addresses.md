# jamaica-addresses

Parse and normalize informal Jamaican addresses.

## Install

::: code-group
```bash [npm]
npm install jamaica-addresses
```
```bash [pip]
pip install jamaica-addresses
```
:::

## API Reference

### `parseAddress(address: string): ParsedAddress`

```typescript
parseAddress('123 Hope Road, Kingston 6');
// { parish: "Kingston", kingstonSector: 6, streetName: "Hope Road", streetNumber: "123" }

parseAddress('Lot 5, Rose Hall, St. James');
// { parish: "St. James", community: "Rose Hall", lotNumber: "5" }
```

### `extractParish(address: string): string | null`

```typescript
extractParish('Montego Bay, St. James');  // "St. James"
extractParish('Half Way Tree');            // "St. Andrew"
```

### `isKingstonAddress(address: string): boolean`

### `getKingstonSector(address: string): number | null`

Kingston has 20 postal sectors (Kingston 1-20).

```typescript
getKingstonSector('Kingston 6');  // 6
getKingstonSector('Kingston');    // null
```
