# CLI

The Jamaica CLI gives you instant access to all toolkit functions from your terminal — 18 command groups covering identity, finance, geography, social services, and live data.

## Install

```bash
npm install -g jamaica-cli
```

## Commands

### TRN

```bash
# Validate a TRN
jamaica trn validate 123-456-784

# Generate test TRNs
jamaica trn generate -n 5 -f

# Format a TRN
jamaica trn format 123456784
```

### Phone

```bash
# Validate a phone number
jamaica phone validate 876-555-1234

# See all format variants
jamaica phone format 8765551234

# Detect carrier
jamaica phone carrier 8765551234
```

### Parish

```bash
# List all 14 parishes
jamaica parish list

# Get parish details
jamaica parish info Kingston

# Distance between parishes
jamaica parish distance KIN SJA

# Total population
jamaica parish population
```

### Currency

```bash
# Format as JMD
jamaica currency format 15000

# Convert to USD
jamaica currency convert 10000 --to usd

# GCT breakdown
jamaica currency gct 10000
```

### Fees

```bash
# Search all fees
jamaica fees search passport

# Passport fee schedule
jamaica fees passport

# Driver's licence fees
jamaica fees licence

# List all agencies
jamaica fees agencies
```

### Address

```bash
# Parse an address
jamaica address parse "123 Hope Road, Kingston 6"

# Extract parish
jamaica address parish "Montego Bay, St. James"
```

### Holidays

```bash
# List holidays for a year
jamaica holidays list 2025

# Check if a date is a public holiday
jamaica holidays check 2025-08-06

# Working days between dates
jamaica holidays workdays 2025-01-01 2025-01-31
```

### Tax

```bash
# Calculate income tax
jamaica tax income 3000000

# Full payroll breakdown
jamaica tax payroll 250000

# Show tax brackets
jamaica tax brackets

# Show tax threshold
jamaica tax threshold
```

### Schools

```bash
# List all schools in a parish
jamaica schools list --parish Kingston

# Search for a school
jamaica schools search "Kingston College"

# Count schools by parish
jamaica schools count

# List universities
jamaica schools universities
```

### Health

```bash
# List hospitals
jamaica health hospitals

# Health centres by parish
jamaica health centres --parish Kingston

# Regional health authorities
jamaica health rhas
```

### Banks

```bash
# List all banks
jamaica banks list

# Get branches for a bank
jamaica banks branches ncb

# Get SWIFT code
jamaica banks swift ncb

# Search banks
jamaica banks search "national"
```

### Constituencies

```bash
# List all 63 constituencies
jamaica constituencies list

# Constituencies in a parish
jamaica constituencies parish Kingston

# Search
jamaica constituencies search "western"
```

### Transport

```bash
# List airports
jamaica transport airports

# List seaports
jamaica transport seaports

# Road network stats
jamaica transport roads

# Vehicle classes
jamaica transport vehicles
```

### Emergency

```bash
# Emergency numbers
jamaica emergency numbers

# Police stations by parish
jamaica emergency police --parish Kingston

# Fire stations
jamaica emergency fire

# Disaster shelters by parish
jamaica emergency shelters --parish Portland
```

### Places

```bash
# List towns
jamaica places towns

# Places in a parish
jamaica places list --parish Kingston

# Search places
jamaica places search "Mandeville"
```

### BOJ Exchange Rates

```bash
# Show fallback exchange rates
jamaica boj rates

# Fetch live rates from Bank of Jamaica
jamaica boj rates --live

# Get specific currency rate
jamaica boj rate USD

# Convert currency
jamaica boj convert 100 USD JMD
jamaica boj convert 15000 JMD USD

# List supported currencies
jamaica boj currencies
```

### Open Data

```bash
# List datasets from data.gov.jm
jamaica open-data datasets

# Get dataset details
jamaica open-data dataset health-centres-geospatial

# Fetch health centres
jamaica open-data health-centres
jamaica open-data health-centres --parish Kingston

# List known dataset identifiers
jamaica open-data known-datasets
```

### Constants

```bash
# Show country metadata
jamaica constants info

# Emergency numbers
jamaica constants emergency

# National symbols
jamaica constants symbols
```

## Global Options

```bash
# JSON output (for scripting)
jamaica --json parish list

# Version
jamaica --version
```
