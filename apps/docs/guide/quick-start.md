# Quick Start

## Validate a TRN

::: code-group
```typescript [TypeScript]
import { isValidTRN, formatTRN, generateTestTRN } from 'jamaica';

// Validate
isValidTRN('123-456-784');  // true
isValidTRN('000-000-000');  // false

// Format
formatTRN('123456784');  // "123-456-784"

// Generate test TRNs
generateTestTRN();  // "847293651" (random valid TRN)
```

```python [Python]
from jamaica import is_valid_trn, format_trn, generate_test_trn

is_valid_trn("123-456-784")  # True
format_trn("123456784")       # "123-456-784"
generate_test_trn()            # Random valid TRN
```
:::

## Format Currency

::: code-group
```typescript [TypeScript]
import { formatJMD, addGCT, jmdToUSD, formatWithGCT } from 'jamaica';

formatJMD(5000);           // "J$5,000.00"
addGCT(10000);             // 11500 (15% GCT)
jmdToUSD(15547);           // 100 (at default rate)
formatWithGCT(10000);      // { base: "J$10,000.00", gct: "J$1,500.00", total: "J$11,500.00" }
```

```python [Python]
from jamaica import format_jmd, add_gct, jmd_to_usd, format_with_gct

format_jmd(5000)           # "J$5,000.00"
add_gct(10000)             # 11500.0
jmd_to_usd(15547)          # 100.0
```
:::

## Look Up Government Fees

::: code-group
```typescript [TypeScript]
import { searchFees, getPassportFee, getAgencies } from 'jamaica';

// Search fees
const results = searchFees('passport');

// Get specific fees
const fee = getPassportFee({ type: 'standard', age: 'adult' });
// { jmd: 6500, days: 7, office: "kingston" }

// List agencies
const agencies = getAgencies();
// TAJ, PICA, NIRA, NLA, ... (10 agencies)
```

```python [Python]
from jamaica import search_fees, get_passport_fee, get_agencies

results = search_fees("passport")
fee = get_passport_fee(type="standard", age="adult")
agencies = get_agencies()
```
:::

## Parse Addresses

::: code-group
```typescript [TypeScript]
import { parseAddress, extractParish } from 'jamaica';

const parsed = parseAddress('123 Hope Road, Kingston 6');
// { parish: "Kingston", kingstonSector: 6, streetName: "Hope Road", streetNumber: "123" }

extractParish('Montego Bay, St. James');  // "St. James"
```

```python [Python]
from jamaica import parse_address, extract_parish

parsed = parse_address("123 Hope Road, Kingston 6")
extract_parish("Montego Bay, St. James")  # "St. James"
```
:::

## Check Holidays

::: code-group
```typescript [TypeScript]
import { getHolidays, isBusinessDay, getWorkingDays } from 'jamaica';

const holidays2025 = getHolidays(2025);  // 10 public holidays

isBusinessDay('2025-12-25');  // false (Christmas)
isBusinessDay('2025-01-02');  // true (regular Thursday)

getWorkingDays('2025-01-01', '2025-01-31');  // working days in January
```

```python [Python]
from jamaica import get_holidays, is_business_day, get_working_days

holidays = get_holidays(2025)
is_business_day("2025-12-25")  # False
get_working_days("2025-01-01", "2025-01-31")
```
:::
