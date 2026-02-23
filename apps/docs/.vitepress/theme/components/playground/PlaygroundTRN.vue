<script setup lang="ts">
import { ref, computed } from 'vue'
import { isValidTRN, formatTRN, unformatTRN, getTRNCheckDigit, generateTestTRN } from 'jamaica-trn'

const input = ref('')
const showCode = ref(false)

const raw = computed(() => {
  try { return unformatTRN(input.value) } catch { return input.value.replace(/\D/g, '') }
})

const isValid = computed(() => isValidTRN(input.value))

const formatted = computed(() => {
  try { return formatTRN(input.value) } catch { return null }
})

const checkDigit = computed(() => {
  const digits = raw.value
  if (digits.length >= 8) {
    return getTRNCheckDigit(digits.slice(0, 8))
  }
  return null
})

const digitBreakdown = computed(() => {
  const digits = raw.value
  if (digits.length < 8) return null
  const weights = [3, 7, 1, 3, 7, 1, 3, 7]
  return digits.slice(0, 8).split('').map((d, i) => ({
    digit: d,
    weight: weights[i],
    product: parseInt(d) * weights[i],
  }))
})

function generate() {
  input.value = generateTestTRN()
}

function clear() {
  input.value = ''
}

const codeExample = computed(() => {
  const trn = input.value || '123-456-784'
  return `import { isValidTRN, formatTRN, generateTestTRN } from 'jamaica-trn';

// Validate
isValidTRN('${trn}'); // ${isValidTRN(trn)}

// Format
${formatted.value ? `formatTRN('${raw.value}'); // '${formatted.value}'` : `// Invalid TRN — cannot format`}

// Generate test TRNs
const testTRN = generateTestTRN();`
})
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <!-- Input Panel -->
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
          <div class="input-actions">
            <button class="btn btn-sm" @click="generate">Generate Test TRN</button>
            <button class="btn btn-sm btn-ghost" @click="clear">Clear</button>
          </div>
        </div>
        <div class="input-field">
          <label>TRN Number</label>
          <input
            v-model="input"
            type="text"
            placeholder="e.g. 123-456-784 or 123456784"
            maxlength="11"
            class="text-input"
          />
          <span class="input-hint">Enter a 9-digit TRN with or without dashes</span>
        </div>
      </div>

      <!-- Output Panel -->
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
          <!-- Validation Status -->
          <div v-if="input.length > 0" class="result-card" :class="isValid ? 'result-valid' : 'result-invalid'">
            <div class="result-icon">{{ isValid ? '&#10003;' : '&#10007;' }}</div>
            <div class="result-body">
              <div class="result-label">Validation</div>
              <div class="result-value">{{ isValid ? 'Valid TRN' : 'Invalid TRN' }}</div>
            </div>
          </div>

          <!-- Formatted -->
          <div v-if="formatted" class="result-card">
            <div class="result-icon">&#35;</div>
            <div class="result-body">
              <div class="result-label">Formatted</div>
              <div class="result-value mono">{{ formatted }}</div>
            </div>
          </div>

          <!-- Raw Digits -->
          <div v-if="raw.length > 0" class="result-card">
            <div class="result-icon">0</div>
            <div class="result-body">
              <div class="result-label">Raw Digits</div>
              <div class="result-value mono">{{ raw }}</div>
            </div>
          </div>

          <!-- Check Digit -->
          <div v-if="checkDigit !== null" class="result-card">
            <div class="result-icon">&#10004;</div>
            <div class="result-body">
              <div class="result-label">Check Digit (9th)</div>
              <div class="result-value mono">{{ checkDigit }}</div>
            </div>
          </div>

          <!-- Digit Breakdown -->
          <div v-if="digitBreakdown" class="breakdown-section">
            <h4>Check Digit Calculation</h4>
            <div class="breakdown-table">
              <div class="breakdown-header">
                <span>Digit</span>
                <span>Weight</span>
                <span>Product</span>
              </div>
              <div v-for="(item, i) in digitBreakdown" :key="i" class="breakdown-row">
                <span class="mono">{{ item.digit }}</span>
                <span class="mono text-dim">&times; {{ item.weight }}</span>
                <span class="mono">{{ item.product }}</span>
              </div>
              <div class="breakdown-row breakdown-total">
                <span>Sum</span>
                <span></span>
                <span class="mono">{{ digitBreakdown.reduce((s, r) => s + r.product, 0) }}</span>
              </div>
              <div class="breakdown-row breakdown-total">
                <span>mod 10</span>
                <span></span>
                <span class="mono">{{ digitBreakdown.reduce((s, r) => s + r.product, 0) % 10 }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="input.length === 0" class="empty-state">
            <p>Type a TRN or click <strong>Generate Test TRN</strong> to get started.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  margin: 24px 0;
}

.playground-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .playground-grid {
    grid-template-columns: 1fr;
  }
}

.playground-input,
.playground-output {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
}

.input-header,
.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.input-header h3,
.output-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

.btn-ghost {
  background: transparent;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-border);
}

.btn-ghost:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.text-input {
  padding: 10px 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-family: var(--vp-font-family-mono);
  outline: none;
  transition: border-color 0.15s ease;
}

.text-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.text-input::placeholder {
  color: var(--vp-c-text-3);
}

.input-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.result-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  margin-bottom: 8px;
}

.result-valid {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.result-invalid {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.result-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.result-valid .result-icon {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.result-invalid .result-icon {
  background: #ef4444;
  color: #fff;
}

.result-body {
  flex: 1;
  min-width: 0;
}

.result-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}

.result-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.mono {
  font-family: var(--vp-font-family-mono);
}

.text-dim {
  color: var(--vp-c-text-3);
}

.breakdown-section {
  margin-top: 16px;
}

.breakdown-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 10px 0;
  border: none;
  padding: 0;
}

.breakdown-table {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

.breakdown-header,
.breakdown-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 8px 14px;
  font-size: 13px;
}

.breakdown-header {
  background: var(--vp-c-bg-mute);
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.breakdown-row {
  border-top: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.breakdown-total {
  font-weight: 600;
  background: var(--vp-c-bg-soft);
}

.code-block {
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: var(--vp-c-text-3);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
