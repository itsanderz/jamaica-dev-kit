# Currency & GCT

Format Jamaican dollars, calculate General Consumption Tax (15%), and convert between JMD and USD. Visualize the GCT breakdown with an interactive amount slider.

<PlaygroundCurrency />

## API Reference

| Function | Description |
|----------|-------------|
| `formatJMD(amount, options?)` | Format as `J$1,234.56` |
| `parseJMD(formatted)` | Parse formatted string back to number |
| `formatUSD(amount)` | Format as `US$1,234.56` |
| `jmdToUSD(jmd, rate?)` | Convert JMD to USD |
| `usdToJMD(usd, rate?)` | Convert USD to JMD |
| `addGCT(amount, rate?)` | Add 15% GCT to base amount |
| `removeGCT(total, rate?)` | Extract base from GCT-inclusive total |
| `formatWithGCT(amount)` | Returns `{ base, gct, total }` all formatted |

## Install

```bash
npm install jamaica-currency
```
