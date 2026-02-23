# Government Fees

Search and browse 60+ Jamaican government service fees across 10 agencies — PICA, TAJ, NLA, NIRA, and more. Every fee includes GCT calculation.

<PlaygroundFees />

## API Reference

| Function | Description |
|----------|-------------|
| `getAllFees()` | Complete flat list of all service fees |
| `searchFees(query)` | Full-text search across all fees |
| `getAgencies()` | List all 10 government agencies |
| `getPassportFee(options)` | Passport fee by type, age, speed, office |
| `getVehicleRegistrationFee(cc)` | Vehicle registration by engine CC |
| `getDriversLicenceFee(type)` | Driver's licence fee |
| `getBusinessRegistrationFee(type)` | Business registration fee |
| `getVitalRecordFee(type, speed)` | Birth/death/marriage certificate fee |
| `getPoliceRecordFee(speed)` | Police record fee |

## Install

```bash
npm install jamaica-gov-fees jamaica-currency
```
