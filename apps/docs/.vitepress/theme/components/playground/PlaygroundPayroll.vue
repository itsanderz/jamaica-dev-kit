<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  calculatePayroll,
  calculateIncomeTax,
  getIncomeTaxBrackets,
  ANNUAL_THRESHOLD,
  MONTHLY_THRESHOLD,
  NIS_EMPLOYEE_RATE,
  NIS_EMPLOYER_RATE,
  NHT_EMPLOYEE_RATE,
  NHT_EMPLOYER_RATE,
  EDUCATION_TAX_EMPLOYEE_RATE,
  EDUCATION_TAX_EMPLOYER_RATE,
  HEART_NTA_RATE,
} from 'jamaica-tax'
import { formatJMD } from 'jamaica-currency'

const salary = ref(250000)
const period = ref<'monthly' | 'fortnightly' | 'weekly' | 'annual'>('monthly')
const showCode = ref(false)

const payroll = computed(() => calculatePayroll(salary.value, period.value))
const taxBreakdown = computed(() => calculateIncomeTax(payroll.value.annualized))
const brackets = computed(() => getIncomeTaxBrackets())

const deductions = computed(() => [
  { label: 'Income Tax (PAYE)', amount: payroll.value.incomeTax, color: '#ef4444' },
  { label: 'NIS', amount: payroll.value.nis, color: '#f59e0b' },
  { label: 'NHT', amount: payroll.value.nht, color: '#8b5cf6' },
  { label: 'Education Tax', amount: payroll.value.educationTax, color: '#3b82f6' },
])

const employerCosts = computed(() => [
  { label: 'Employer NIS', amount: payroll.value.employerNIS, rate: NIS_EMPLOYER_RATE },
  { label: 'Employer NHT', amount: payroll.value.employerNHT, rate: NHT_EMPLOYER_RATE },
  { label: 'Employer Ed. Tax', amount: payroll.value.employerEducationTax, rate: EDUCATION_TAX_EMPLOYER_RATE },
  { label: 'HEART/NTA', amount: payroll.value.employerHEART, rate: HEART_NTA_RATE },
])

const barSegments = computed(() => {
  const total = payroll.value.grossPay
  if (total === 0) return []
  return [
    ...deductions.value.map(d => ({
      label: d.label.split(' ')[0],
      width: (d.amount / total) * 100,
      color: d.color,
    })),
    {
      label: 'Net',
      width: (payroll.value.netPay / total) * 100,
      color: '#10b981',
    },
  ]
})

const effectiveRate = computed(() =>
  payroll.value.grossPay > 0
    ? ((payroll.value.totalDeductions / payroll.value.grossPay) * 100).toFixed(1)
    : '0.0'
)

const codeExample = computed(() =>
  `import { calculatePayroll } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';

const result = calculatePayroll(${salary.value}, '${period.value}');

formatJMD(result.netPay);     // '${formatJMD(payroll.value.netPay)}'
formatJMD(result.incomeTax);  // '${formatJMD(payroll.value.incomeTax)}'
result.totalDeductions;       // ${payroll.value.totalDeductions.toFixed(2)}
result.totalCostToEmployer;   // ${payroll.value.totalCostToEmployer.toFixed(2)}`
)
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
          <button class="btn btn-sm btn-ghost" @click="salary = 250000; period = 'monthly'">Reset</button>
        </div>

        <div class="input-field">
          <label>Gross Salary</label>
          <input v-model.number="salary" type="number" min="0" step="10000" class="text-input" />
        </div>

        <div class="slider-field">
          <input type="range" v-model.number="salary" min="0" max="2000000" step="5000" class="range-input" />
          <div class="range-labels">
            <span>J$0</span>
            <span>J$2,000,000</span>
          </div>
        </div>

        <div class="input-field">
          <label>Pay Period</label>
          <div class="period-row">
            <button v-for="p in ['monthly', 'fortnightly', 'weekly', 'annual'] as const" :key="p"
              class="preset-btn" :class="{ active: period === p }" @click="period = p">
              {{ p }}
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stat-card stat-net">
            <div class="stat-label">Net Pay</div>
            <div class="stat-value">{{ formatJMD(payroll.netPay) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Effective Rate</div>
            <div class="stat-value">{{ effectiveRate }}%</div>
          </div>
        </div>
      </div>

      <div class="playground-output">
        <div class="output-header">
          <h3>Payroll Breakdown</h3>
          <button class="btn btn-sm btn-ghost" @click="showCode = !showCode">
            {{ showCode ? 'Hide Code' : 'View Code' }}
          </button>
        </div>

        <div v-if="showCode" class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>

        <div v-else>
          <!-- Stacked Bar -->
          <div class="bar-container">
            <div class="stacked-bar">
              <div v-for="seg in barSegments" :key="seg.label" class="bar-seg"
                :style="{ width: Math.max(seg.width, 2) + '%', background: seg.color }"
                :title="`${seg.label}: ${seg.width.toFixed(1)}%`">
              </div>
            </div>
            <div class="bar-legend">
              <span v-for="seg in barSegments" :key="seg.label" class="legend-item">
                <span class="legend-dot" :style="{ background: seg.color }"></span>
                {{ seg.label }}
              </span>
            </div>
          </div>

          <!-- Employee Deductions -->
          <h4 class="section-title">Employee Deductions</h4>
          <div class="deduction-list">
            <div v-for="d in deductions" :key="d.label" class="deduction-row">
              <div class="deduction-left">
                <span class="deduction-dot" :style="{ background: d.color }"></span>
                <span>{{ d.label }}</span>
              </div>
              <span class="mono">{{ formatJMD(d.amount) }}</span>
            </div>
            <div class="deduction-row deduction-total">
              <span>Total Deductions</span>
              <span class="mono">{{ formatJMD(payroll.totalDeductions) }}</span>
            </div>
            <div class="deduction-row deduction-net">
              <span>Net Pay</span>
              <span class="mono">{{ formatJMD(payroll.netPay) }}</span>
            </div>
          </div>

          <!-- Employer Costs -->
          <h4 class="section-title">Employer Contributions</h4>
          <div class="deduction-list">
            <div v-for="c in employerCosts" :key="c.label" class="deduction-row">
              <div class="deduction-left">
                <span class="rate-badge">{{ (c.rate * 100).toFixed(1) }}%</span>
                <span>{{ c.label }}</span>
              </div>
              <span class="mono">{{ formatJMD(c.amount) }}</span>
            </div>
            <div class="deduction-row deduction-total">
              <span>Total Employer Cost</span>
              <span class="mono">{{ formatJMD(payroll.totalCostToEmployer) }}</span>
            </div>
          </div>

          <!-- Tax Brackets -->
          <h4 class="section-title">Tax Brackets (Annualized: {{ formatJMD(payroll.annualized) }})</h4>
          <div class="bracket-list">
            <div v-for="b in taxBreakdown.brackets" :key="b.bracket" class="bracket-row">
              <div class="bracket-info">
                <span class="bracket-name">{{ b.bracket }}</span>
                <span class="bracket-taxable">Taxable: {{ formatJMD(b.taxableInThisBracket) }}</span>
              </div>
              <span class="mono bracket-tax">{{ formatJMD(b.tax) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground { margin: 24px 0; }
.playground-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
@media (max-width: 768px) { .playground-grid { grid-template-columns: 1fr; } }
.playground-input, .playground-output { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 20px; }
.input-header, .output-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.input-header h3, .output-header h3 { margin: 0; font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); border: none; padding: 0; }
.btn { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: #fff; }
.btn:hover { background: var(--vp-c-brand-2); }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-ghost { background: transparent; color: var(--vp-c-text-2); border-color: var(--vp-c-border); }
.btn-ghost:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
.input-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.input-field label { font-size: 13px; font-weight: 500; color: var(--vp-c-text-2); }
.text-input { padding: 10px 14px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 16px; font-family: var(--vp-font-family-mono); outline: none; transition: border-color 0.15s ease; width: 100%; box-sizing: border-box; }
.text-input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.slider-field { margin-bottom: 16px; }
.range-input { width: 100%; height: 6px; -webkit-appearance: none; appearance: none; background: var(--vp-c-border); border-radius: 3px; outline: none; }
.range-input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--vp-c-brand-1); cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.range-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--vp-c-text-3); margin-top: 4px; }
.period-row { display: flex; gap: 6px; flex-wrap: wrap; }
.preset-btn { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); cursor: pointer; transition: all 0.15s ease; text-transform: capitalize; }
.preset-btn:hover, .preset-btn.active { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
.stat-card { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 12px; text-align: center; }
.stat-net { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.stat-label { font-size: 11px; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-size: 18px; font-weight: 700; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.bar-container { margin-bottom: 16px; }
.stacked-bar { display: flex; height: 24px; border-radius: 6px; overflow: hidden; }
.bar-seg { transition: width 0.3s ease; min-width: 2px; }
.bar-legend { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--vp-c-text-3); }
.legend-dot { width: 8px; height: 8px; border-radius: 2px; }
.section-title { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 16px 0 8px 0; border: none; padding: 0; }
.deduction-list { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; overflow: hidden; }
.deduction-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; font-size: 13px; color: var(--vp-c-text-2); border-top: 1px solid var(--vp-c-border); }
.deduction-row:first-child { border-top: none; }
.deduction-left { display: flex; align-items: center; gap: 8px; }
.deduction-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.deduction-total { font-weight: 600; color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.deduction-net { font-weight: 700; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.rate-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: var(--vp-c-bg-mute); color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); }
.bracket-list { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; overflow: hidden; }
.bracket-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-top: 1px solid var(--vp-c-border); }
.bracket-row:first-child { border-top: none; }
.bracket-info { display: flex; flex-direction: column; gap: 2px; }
.bracket-name { font-size: 13px; font-weight: 500; color: var(--vp-c-text-1); }
.bracket-taxable { font-size: 11px; color: var(--vp-c-text-3); }
.bracket-tax { font-size: 14px; font-weight: 600; color: var(--vp-c-text-1); }
.mono { font-family: var(--vp-font-family-mono); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
</style>
