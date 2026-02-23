# Phone Formatter

Parse and format Jamaican phone numbers (876 and 658 area codes). Detect carriers, check mobile vs landline, and output in four standard formats.

<PlaygroundPhone />

## API Reference

| Function | Description |
|----------|-------------|
| `isValidJamaicanNumber(phone)` | Validates any Jamaican phone format |
| `parsePhone(phone)` | Returns structured `ParsedPhone` object |
| `formatLocal(phone)` | Format as `NXX-XXXX` |
| `formatNational(phone)` | Format as `(876) NXX-XXXX` |
| `formatE164(phone)` | Format as `+1876NXXXXXX` |
| `formatInternational(phone)` | Format as `+1 (876) NXX-XXXX` |
| `getCarrier(phone)` | Best-guess carrier detection |
| `isMobile(phone)` | Best-guess mobile check |

## Install

```bash
npm install jamaica-phone
```
