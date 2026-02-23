<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  parseAddress,
  extractParish,
  isKingstonAddress,
  getKingstonSector,
  normalizeAddress,
} from 'jamaica-addresses'

const input = ref('')
const showCode = ref(false)

const parsed = computed(() => input.value.trim() ? parseAddress(input.value) : null)
const parish = computed(() => input.value.trim() ? extractParish(input.value) : null)
const isKingston = computed(() => input.value.trim() ? isKingstonAddress(input.value) : false)
const sector = computed(() => input.value.trim() ? getKingstonSector(input.value) : null)
const normalized = computed(() => {
  if (!parsed.value) return null
  try { return normalizeAddress(parsed.value) } catch { return null }
})

const fields = computed(() => {
  if (!parsed.value) return []
  const p = parsed.value
  const items = []
  if (p.streetNumber) items.push({ label: 'Street Number', value: p.streetNumber })
  if (p.streetName) items.push({ label: 'Street Name', value: p.streetName })
  if (p.unit) items.push({ label: 'Unit', value: p.unit })
  if (p.community) items.push({ label: 'Community', value: p.community })
  if (p.district) items.push({ label: 'District', value: p.district })
  if (p.parish) items.push({ label: 'Parish', value: p.parish })
  if (p.kingstonSector) items.push({ label: 'Kingston Sector', value: String(p.kingstonSector) })
  return items
})

const samples = [
  '123 Hope Road, Kingston 6',
  'Lot 45, Blue Mountain View, St. Andrew',
  '7 Main Street, Montego Bay, St. James',
  'Mandeville, Manchester',
  'Unit 3B, Ocean Village, Ocho Rios, St. Ann',
]

function loadSample(s: string) {
  input.value = s
}

const codeExample = computed(() => {
  const addr = input.value || '123 Hope Road, Kingston 6'
  return `import { parseAddress, extractParish, isKingstonAddress } from 'jamaica-addresses';

const parsed = parseAddress('${addr}');
// ${parsed.value ? JSON.stringify(parsed.value, null, 2) : '...'}

extractParish('${addr}');
// ${parish.value ? `'${parish.value}'` : 'null'}

isKingstonAddress('${addr}');
// ${isKingston.value}`
})
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
          <button class="btn btn-sm btn-ghost" @click="input = ''">Clear</button>
        </div>
        <div class="input-field">
          <label>Jamaican Address</label>
          <textarea v-model="input" rows="3" placeholder="e.g. 123 Hope Road, Kingston 6" class="text-input textarea"></textarea>
          <span class="input-hint">Enter any informal Jamaican address</span>
        </div>
        <div class="samples-section">
          <label>Try a sample:</label>
          <div class="sample-list">
            <button v-for="s in samples" :key="s" class="sample-btn" @click="loadSample(s)">
              {{ s }}
            </button>
          </div>
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
          <!-- Parsed Fields as Chips -->
          <div v-if="fields.length > 0" class="chip-grid">
            <div v-for="f in fields" :key="f.label" class="chip-card">
              <span class="chip-label">{{ f.label }}</span>
              <span class="chip-value">{{ f.value }}</span>
            </div>
          </div>

          <!-- Parish Detection -->
          <div v-if="parish" class="result-card result-valid">
            <div class="result-icon">P</div>
            <div class="result-body">
              <div class="result-label">Detected Parish</div>
              <div class="result-value">{{ parish }}</div>
            </div>
          </div>

          <!-- Kingston Info -->
          <div v-if="isKingston" class="meta-row">
            <div class="meta-chip meta-kingston">Kingston Address</div>
            <div v-if="sector" class="meta-chip">Sector {{ sector }}</div>
          </div>

          <!-- Normalized -->
          <div v-if="normalized" class="result-card">
            <div class="result-icon">N</div>
            <div class="result-body">
              <div class="result-label">Normalized</div>
              <div class="result-value">{{ normalized }}</div>
            </div>
          </div>

          <div v-if="!input.trim()" class="empty-state">
            <p>Type an address or select a sample to parse it.</p>
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
.text-input { padding: 10px 14px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 15px; outline: none; transition: border-color 0.15s ease; width: 100%; box-sizing: border-box; font-family: var(--vp-font-family-base); }
.textarea { resize: vertical; min-height: 72px; line-height: 1.5; }
.text-input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.text-input::placeholder { color: var(--vp-c-text-3); }
.input-hint { font-size: 12px; color: var(--vp-c-text-3); }
.samples-section { display: flex; flex-direction: column; gap: 8px; }
.samples-section label { font-size: 13px; font-weight: 500; color: var(--vp-c-text-2); }
.sample-list { display: flex; flex-direction: column; gap: 4px; }
.sample-btn { text-align: left; padding: 8px 12px; border-radius: 8px; font-size: 13px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); cursor: pointer; transition: all 0.15s ease; }
.sample-btn:hover { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.chip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chip-card { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 8px 12px; }
.chip-label { display: block; font-size: 10px; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.chip-value { font-size: 14px; font-weight: 600; color: var(--vp-c-text-1); }
.result-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 8px; }
.result-valid { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.result-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--vp-c-bg-mute); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); flex-shrink: 0; }
.result-valid .result-icon { background: var(--vp-c-brand-1); color: #fff; }
.result-body { flex: 1; min-width: 0; }
.result-label { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.result-value { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.meta-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
.meta-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); }
.meta-kingston { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); white-space: pre-wrap; }
.empty-state { padding: 32px 16px; text-align: center; color: var(--vp-c-text-3); }
.empty-state p { margin: 0; font-size: 14px; }
</style>
