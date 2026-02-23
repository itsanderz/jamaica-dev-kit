<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllFees, searchFees, getAgencies, type ServiceFee, type Agency } from 'jamaica-gov-fees'
import { formatJMD, addGCT, GCT_RATE } from 'jamaica-currency'

const query = ref('')
const selectedAgency = ref<string | null>(null)
const showCode = ref(false)

const agencies = computed(() => getAgencies())
const allFees = computed(() => getAllFees())

const results = computed(() => {
  let fees: ServiceFee[]
  if (query.value.trim()) {
    fees = searchFees(query.value)
  } else {
    fees = allFees.value
  }
  if (selectedAgency.value) {
    fees = fees.filter(f => f.agency === selectedAgency.value)
  }
  return fees
})

const agencyColors: Record<string, string> = {
  pica: '#2563eb',
  nira: '#7c3aed',
  taj: '#059669',
  ita: '#d97706',
  coj: '#dc2626',
  nla: '#0891b2',
  nepa: '#16a34a',
  police: '#1e40af',
  trade_board: '#9333ea',
  labour: '#ea580c',
}

function toggleAgency(id: string) {
  selectedAgency.value = selectedAgency.value === id ? null : id
}

const codeExample = computed(() =>
  `import { getAllFees, searchFees, getAgencies } from 'jamaica-gov-fees';
import { formatJMD, addGCT } from 'jamaica-currency';

// Get all fees
const fees = getAllFees();
// ${allFees.value.length} fees across ${agencies.value.length} agencies

// Search
const results = searchFees('${query.value || 'passport'}');
// ${query.value ? results.value.length + ' results' : '...'}

// Format with GCT
const fee = results[0];
formatJMD(fee.jmd);           // Fee amount
formatJMD(addGCT(fee.jmd));   // With GCT`
)
</script>

<template>
  <div class="playground">
    <div class="playground-panel">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input v-model="query" type="text" placeholder="Search fees..." class="search-input" />
          <span class="result-count">{{ results.length }} fees</span>
        </div>
        <button class="btn btn-sm btn-ghost" @click="showCode = !showCode">
          {{ showCode ? 'Hide Code' : 'View Code' }}
        </button>
      </div>

      <!-- Agency Pills -->
      <div class="agency-pills">
        <button v-for="a in agencies" :key="a.id" class="agency-pill"
          :class="{ active: selectedAgency === a.id }"
          :style="selectedAgency === a.id ? { background: agencyColors[a.id] || '#6b7280', borderColor: agencyColors[a.id] || '#6b7280', color: '#fff' } : {}"
          @click="toggleAgency(a.id)">
          {{ a.acronym || a.name }}
        </button>
      </div>

      <div v-if="showCode" class="code-block">
        <pre><code>{{ codeExample }}</code></pre>
      </div>

      <div v-else class="fee-grid">
        <div v-for="fee in results.slice(0, 30)" :key="fee.service + fee.agency" class="fee-card">
          <div class="fee-header">
            <span class="fee-agency" :style="{ color: agencyColors[fee.agency] || '#6b7280' }">
              {{ fee.agencyName }}
            </span>
            <span class="fee-amount mono">{{ formatJMD(fee.jmd) }}</span>
          </div>
          <div class="fee-service">{{ fee.service }}</div>
          <div v-if="fee.description" class="fee-desc">{{ fee.description }}</div>
          <div class="fee-footer">
            <span class="fee-gct">
              With GCT: <strong class="mono">{{ formatJMD(addGCT(fee.jmd)) }}</strong>
            </span>
            <span v-if="fee.note" class="fee-note">{{ fee.note }}</span>
          </div>
        </div>

        <div v-if="results.length > 30" class="more-indicator">
          + {{ results.length - 30 }} more fees...
        </div>

        <div v-if="results.length === 0" class="empty-state">
          <p>No fees match your search.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground { margin: 24px 0; }
.playground-panel { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 20px; }
.toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
.search-box { flex: 1; display: flex; align-items: center; gap: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 8px 14px; transition: border-color 0.15s ease; }
.search-box:focus-within { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.search-icon { color: var(--vp-c-text-3); flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--vp-c-text-1); outline: none; }
.search-input::placeholder { color: var(--vp-c-text-3); }
.result-count { font-size: 12px; color: var(--vp-c-text-3); white-space: nowrap; }
.btn { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-ghost { background: transparent; color: var(--vp-c-text-2); border-color: var(--vp-c-border); }
.btn-ghost:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
.agency-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.agency-pill { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); cursor: pointer; transition: all 0.15s ease; }
.agency-pill:hover { background: var(--vp-c-bg-mute); }
.agency-pill.active { color: #fff; }
.fee-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 600px; overflow-y: auto; }
@media (max-width: 768px) { .fee-grid { grid-template-columns: 1fr; } }
.fee-card { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 14px; transition: border-color 0.15s ease; }
.fee-card:hover { border-color: var(--vp-c-brand-1); }
.fee-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.fee-agency { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.fee-amount { font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); }
.fee-service { font-size: 14px; font-weight: 500; color: var(--vp-c-text-1); margin-bottom: 4px; line-height: 1.4; }
.fee-desc { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 8px; line-height: 1.4; }
.fee-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--vp-c-text-3); }
.fee-gct strong { color: var(--vp-c-text-2); }
.fee-note { font-style: italic; }
.mono { font-family: var(--vp-font-family-mono); }
.more-indicator { grid-column: 1 / -1; text-align: center; padding: 16px; color: var(--vp-c-text-3); font-size: 13px; }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
.empty-state { grid-column: 1 / -1; padding: 32px 16px; text-align: center; color: var(--vp-c-text-3); }
.empty-state p { margin: 0; font-size: 14px; }
</style>
