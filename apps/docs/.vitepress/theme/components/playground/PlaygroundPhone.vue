<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  isValidJamaicanNumber,
  parsePhone,
  formatLocal,
  formatNational,
  formatE164,
  formatInternational,
  getCarrier,
  isMobile,
  isAreaCode876,
  isAreaCode658,
} from 'jamaica-phone'

const input = ref('')
const showCode = ref(false)

const parsed = computed(() => parsePhone(input.value))
const valid = computed(() => isValidJamaicanNumber(input.value))

const formats = computed(() => {
  if (!valid.value) return []
  try {
    return [
      { label: 'Local', value: formatLocal(input.value), desc: 'NXX-XXXX' },
      { label: 'National', value: formatNational(input.value), desc: '(876) NXX-XXXX' },
      { label: 'E.164', value: formatE164(input.value), desc: '+1876NXXXXXX' },
      { label: 'International', value: formatInternational(input.value), desc: '+1 (876) NXX-XXXX' },
    ]
  } catch { return [] }
})

const carrier = computed(() => valid.value ? getCarrier(input.value) : null)
const mobile = computed(() => valid.value ? isMobile(input.value) : null)
const areaCode = computed(() => {
  if (!valid.value) return null
  if (isAreaCode876(input.value)) return '876'
  if (isAreaCode658(input.value)) return '658'
  return null
})

const carrierColor: Record<string, string> = {
  flow: '#0066cc',
  digicel: '#e4002b',
  landline: '#6b7280',
  unknown: '#9ca3af',
}

const codeExample = computed(() => {
  const ph = input.value || '876-555-1234'
  return `import { parsePhone, formatE164, getCarrier } from 'jamaica-phone';

const parsed = parsePhone('${ph}');
// ${parsed ? JSON.stringify(parsed) : 'null'}

formatE164('${ph}');
// '${valid.value ? formatE164(input.value) : '+18765551234'}'

getCarrier('${ph}');
// '${carrier.value || 'unknown'}'`
})

function loadSample() {
  input.value = '876-555-1234'
}
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
          <div class="input-actions">
            <button class="btn btn-sm" @click="loadSample">Sample Number</button>
            <button class="btn btn-sm btn-ghost" @click="input = ''">Clear</button>
          </div>
        </div>
        <div class="input-field">
          <label>Phone Number</label>
          <input v-model="input" type="text" placeholder="e.g. 876-555-1234" class="text-input" />
          <span class="input-hint">Any Jamaican phone format (876 or 658 area code)</span>
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
          <div v-if="input.length > 0" class="result-card" :class="valid ? 'result-valid' : 'result-invalid'">
            <div class="result-icon">{{ valid ? '&#10003;' : '&#10007;' }}</div>
            <div class="result-body">
              <div class="result-label">Validation</div>
              <div class="result-value">{{ valid ? 'Valid Jamaican Number' : 'Invalid Number' }}</div>
            </div>
          </div>

          <!-- Format variants -->
          <div v-for="fmt in formats" :key="fmt.label" class="result-card">
            <div class="result-icon format-icon">{{ fmt.label[0] }}</div>
            <div class="result-body">
              <div class="result-label">{{ fmt.label }} <span class="text-dim">{{ fmt.desc }}</span></div>
              <div class="result-value mono">{{ fmt.value }}</div>
            </div>
          </div>

          <!-- Carrier & Type -->
          <div v-if="carrier" class="meta-row">
            <div class="meta-chip" :style="{ borderColor: carrierColor[carrier] || '#9ca3af' }">
              <span class="meta-dot" :style="{ background: carrierColor[carrier] || '#9ca3af' }"></span>
              {{ carrier }}
            </div>
            <div v-if="mobile !== null" class="meta-chip">
              {{ mobile ? 'Mobile' : 'Landline' }}
            </div>
            <div v-if="areaCode" class="meta-chip">
              Area Code {{ areaCode }}
            </div>
          </div>

          <!-- Parsed Object -->
          <div v-if="parsed" class="parsed-section">
            <h4>Parsed Object</h4>
            <div class="parsed-grid">
              <div class="parsed-item">
                <span class="parsed-key">countryCode</span>
                <span class="parsed-val mono">{{ parsed.countryCode }}</span>
              </div>
              <div class="parsed-item">
                <span class="parsed-key">areaCode</span>
                <span class="parsed-val mono">{{ parsed.areaCode }}</span>
              </div>
              <div class="parsed-item">
                <span class="parsed-key">localNumber</span>
                <span class="parsed-val mono">{{ parsed.localNumber }}</span>
              </div>
              <div class="parsed-item">
                <span class="parsed-key">isValid</span>
                <span class="parsed-val mono">{{ parsed.isValid }}</span>
              </div>
            </div>
          </div>

          <div v-if="input.length === 0" class="empty-state">
            <p>Enter a Jamaican phone number or click <strong>Sample Number</strong>.</p>
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
.input-actions { display: flex; gap: 8px; }
.btn { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: #fff; }
.btn:hover { background: var(--vp-c-brand-2); border-color: var(--vp-c-brand-2); }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-ghost { background: transparent; color: var(--vp-c-text-2); border-color: var(--vp-c-border); }
.btn-ghost:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
.input-field { display: flex; flex-direction: column; gap: 6px; }
.input-field label { font-size: 13px; font-weight: 500; color: var(--vp-c-text-2); }
.text-input { padding: 10px 14px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 16px; font-family: var(--vp-font-family-mono); outline: none; transition: border-color 0.15s ease; }
.text-input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.text-input::placeholder { color: var(--vp-c-text-3); }
.input-hint { font-size: 12px; color: var(--vp-c-text-3); }
.result-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 8px; }
.result-valid { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.result-invalid { border-color: #ef4444; background: rgba(239, 68, 68, 0.08); }
.result-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--vp-c-bg-mute); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); flex-shrink: 0; }
.result-valid .result-icon { background: var(--vp-c-brand-1); color: #fff; }
.result-invalid .result-icon { background: #ef4444; color: #fff; }
.format-icon { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.result-body { flex: 1; min-width: 0; }
.result-label { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.result-value { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.mono { font-family: var(--vp-font-family-mono); }
.text-dim { color: var(--vp-c-text-3); font-weight: 400; }
.meta-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.meta-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); text-transform: capitalize; }
.meta-dot { width: 8px; height: 8px; border-radius: 50%; }
.parsed-section { margin-top: 16px; }
.parsed-section h4 { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 0 0 10px 0; border: none; padding: 0; }
.parsed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.parsed-item { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 10px 12px; }
.parsed-key { display: block; font-size: 11px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.parsed-val { font-size: 14px; font-weight: 600; color: var(--vp-c-text-1); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
.empty-state { padding: 32px 16px; text-align: center; color: var(--vp-c-text-3); }
.empty-state p { margin: 0; font-size: 14px; }
</style>
