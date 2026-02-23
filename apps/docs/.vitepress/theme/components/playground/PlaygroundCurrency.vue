<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  formatJMD,
  formatUSD,
  jmdToUSD,
  usdToJMD,
  addGCT,
  removeGCT,
  formatWithGCT,
  GCT_RATE,
  DEFAULT_EXCHANGE_RATE,
} from 'jamaica-currency'

const amount = ref(10000)
const showCode = ref(false)

const jmd = computed(() => formatJMD(amount.value))
const usd = computed(() => formatUSD(jmdToUSD(amount.value)))
const gctBreakdown = computed(() => formatWithGCT(amount.value))
const withGCT = computed(() => addGCT(amount.value))
const withoutGCT = computed(() => removeGCT(amount.value))

const gctPercent = computed(() => (GCT_RATE * 100).toFixed(0))
const gctAmount = computed(() => amount.value * GCT_RATE)
const barWidth = computed(() => (gctAmount.value / withGCT.value) * 100)

const codeExample = computed(() =>
  `import { formatJMD, formatWithGCT, jmdToUSD } from 'jamaica-currency';

formatJMD(${amount.value});
// '${jmd.value}'

formatWithGCT(${amount.value});
// { base: '${gctBreakdown.value.base}', gct: '${gctBreakdown.value.gct}', total: '${gctBreakdown.value.total}' }

jmdToUSD(${amount.value});
// ${jmdToUSD(amount.value).toFixed(3)}`
)
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
          <button class="btn btn-sm btn-ghost" @click="amount = 10000">Reset</button>
        </div>
        <div class="input-field">
          <label>Amount (JMD)</label>
          <input v-model.number="amount" type="number" min="0" step="100" class="text-input" />
        </div>
        <div class="slider-field">
          <input type="range" v-model.number="amount" min="0" max="1000000" step="500" class="range-input" />
          <div class="range-labels">
            <span>J$0</span>
            <span>J$1,000,000</span>
          </div>
        </div>
        <div class="preset-row">
          <button v-for="v in [1000, 5000, 25000, 100000, 500000]" :key="v" class="preset-btn" :class="{ active: amount === v }" @click="amount = v">
            {{ formatJMD(v, { decimals: 0 }) }}
          </button>
        </div>
      </div>

      <div class="playground-output">
        <div class="output-header">
          <h3>Result</h3>
          <button class="btn btn-sm btn-ghost" @click="showCode = !showCode">
            {{ showCode ? 'Hide Code' : 'View Code' }}
          </button>
        </div>

        <div v-if="showCode" class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>

        <div v-else>
          <!-- JMD Formatted -->
          <div class="result-card">
            <div class="result-icon" style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);">$</div>
            <div class="result-body">
              <div class="result-label">JMD Formatted</div>
              <div class="result-value mono">{{ jmd }}</div>
            </div>
          </div>

          <!-- USD Equivalent -->
          <div class="result-card">
            <div class="result-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">$</div>
            <div class="result-body">
              <div class="result-label">USD Equivalent <span class="text-dim">(rate: {{ DEFAULT_EXCHANGE_RATE }})</span></div>
              <div class="result-value mono">{{ usd }}</div>
            </div>
          </div>

          <!-- GCT Breakdown -->
          <div class="gct-section">
            <h4>GCT Breakdown ({{ gctPercent }}%)</h4>
            <div class="gct-bar">
              <div class="gct-bar-base" :style="{ width: (100 - barWidth) + '%' }">
                <span>Base</span>
              </div>
              <div class="gct-bar-tax" :style="{ width: barWidth + '%' }">
                <span>GCT</span>
              </div>
            </div>
            <div class="gct-details">
              <div class="gct-row">
                <span>Base amount</span>
                <span class="mono">{{ gctBreakdown.base }}</span>
              </div>
              <div class="gct-row">
                <span>GCT ({{ gctPercent }}%)</span>
                <span class="mono">{{ gctBreakdown.gct }}</span>
              </div>
              <div class="gct-row gct-total">
                <span>Total with GCT</span>
                <span class="mono">{{ gctBreakdown.total }}</span>
              </div>
            </div>
          </div>

          <!-- Reverse GCT -->
          <div class="result-card">
            <div class="result-icon">&#8722;</div>
            <div class="result-body">
              <div class="result-label">If {{ jmd }} includes GCT, base is:</div>
              <div class="result-value mono">{{ formatJMD(withoutGCT) }}</div>
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
.preset-row { display: flex; gap: 6px; flex-wrap: wrap; }
.preset-btn { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); cursor: pointer; transition: all 0.15s ease; font-family: var(--vp-font-family-mono); }
.preset-btn:hover, .preset-btn.active { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.result-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 8px; }
.result-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--vp-c-bg-mute); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); flex-shrink: 0; }
.result-body { flex: 1; min-width: 0; }
.result-label { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.result-value { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.mono { font-family: var(--vp-font-family-mono); }
.text-dim { color: var(--vp-c-text-3); font-weight: 400; }
.gct-section { margin: 16px 0; }
.gct-section h4 { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 0 0 10px 0; border: none; padding: 0; }
.gct-bar { display: flex; height: 32px; border-radius: 8px; overflow: hidden; border: 1px solid var(--vp-c-border); }
.gct-bar-base { background: var(--vp-c-brand-soft); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: var(--vp-c-brand-1); min-width: 40px; }
.gct-bar-tax { background: var(--jd-gold-soft); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #b8860b; min-width: 30px; }
.dark .gct-bar-tax { color: var(--jd-gold); }
.gct-details { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; margin-top: 8px; overflow: hidden; }
.gct-row { display: flex; justify-content: space-between; padding: 10px 14px; font-size: 13px; color: var(--vp-c-text-2); border-top: 1px solid var(--vp-c-border); }
.gct-row:first-child { border-top: none; }
.gct-total { font-weight: 600; color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
</style>
