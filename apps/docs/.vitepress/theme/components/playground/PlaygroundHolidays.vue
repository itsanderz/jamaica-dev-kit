<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getHolidays,
  isPublicHoliday,
  getNextHoliday,
  isBusinessDay,
  getWorkingDays,
} from 'jamaica-holidays'

const year = ref(new Date().getFullYear())
const checkDate = ref('')
const rangeFrom = ref('')
const rangeTo = ref('')
const showCode = ref(false)

const holidays = computed(() => getHolidays(year.value))

const dateCheck = computed(() => {
  if (!checkDate.value) return null
  return {
    isHoliday: isPublicHoliday(checkDate.value),
    isWorkday: isBusinessDay(checkDate.value),
  }
})

const workingDays = computed(() => {
  if (!rangeFrom.value || !rangeTo.value) return null
  try { return getWorkingDays(rangeFrom.value, rangeTo.value) } catch { return null }
})

const nextHoliday = computed(() => {
  try { return getNextHoliday() } catch { return null }
})

const monthGroups = computed(() => {
  const groups: Record<string, typeof holidays.value> = {}
  for (const h of holidays.value) {
    const month = new Date(h.date + 'T00:00:00').toLocaleString('en', { month: 'long' })
    if (!groups[month]) groups[month] = []
    groups[month].push(h)
  }
  return groups
})

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-JM', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

const codeExample = computed(() =>
  `import { getHolidays, isPublicHoliday, getWorkingDays } from 'jamaica-holidays';

// Get holidays for ${year.value}
const holidays = getHolidays(${year.value});
// ${holidays.value.length} public holidays

// Check a specific date
isPublicHoliday('${checkDate.value || '2025-08-06'}');
// ${checkDate.value ? dateCheck.value?.isHoliday : true}

// Count working days
getWorkingDays('${rangeFrom.value || '2025-01-01'}', '${rangeTo.value || '2025-01-31'}');
// ${workingDays.value ?? 23}`
)
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Input</h3>
        </div>

        <div class="input-field">
          <label>Year</label>
          <div class="year-nav">
            <button class="nav-btn" @click="year--">&lt;</button>
            <span class="year-display mono">{{ year }}</span>
            <button class="nav-btn" @click="year++">></button>
          </div>
        </div>

        <div class="input-field">
          <label>Check Date</label>
          <input v-model="checkDate" type="date" class="text-input" />
        </div>

        <div v-if="dateCheck" class="check-result">
          <div class="meta-chip" :class="dateCheck.isHoliday ? 'chip-holiday' : ''">
            {{ dateCheck.isHoliday ? 'Public Holiday' : 'Not a Holiday' }}
          </div>
          <div class="meta-chip" :class="dateCheck.isWorkday ? 'chip-workday' : 'chip-off'">
            {{ dateCheck.isWorkday ? 'Business Day' : 'Non-Business Day' }}
          </div>
        </div>

        <div class="divider"></div>

        <div class="input-field">
          <label>Working Days Calculator</label>
          <div class="range-inputs">
            <input v-model="rangeFrom" type="date" class="text-input" placeholder="From" />
            <span class="range-arrow">to</span>
            <input v-model="rangeTo" type="date" class="text-input" placeholder="To" />
          </div>
        </div>

        <div v-if="workingDays !== null" class="result-card result-valid">
          <div class="result-icon">W</div>
          <div class="result-body">
            <div class="result-label">Working Days</div>
            <div class="result-value mono">{{ workingDays }}</div>
          </div>
        </div>

        <!-- Next Holiday -->
        <div v-if="nextHoliday" class="next-holiday">
          <span class="next-label">Next Holiday:</span>
          <strong>{{ nextHoliday.name }}</strong>
          <span class="text-dim">{{ formatDate(nextHoliday.date) }}</span>
        </div>
      </div>

      <div class="playground-output">
        <div class="output-header">
          <h3>{{ year }} Holidays ({{ holidays.length }})</h3>
          <button class="btn btn-sm btn-ghost" @click="showCode = !showCode">
            {{ showCode ? 'Hide Code' : 'View Code' }}
          </button>
        </div>

        <div v-if="showCode" class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>

        <div v-else class="holiday-timeline">
          <div v-for="(group, month) in monthGroups" :key="month" class="month-group">
            <div class="month-label">{{ month }}</div>
            <div v-for="h in group" :key="h.date" class="holiday-item">
              <div class="holiday-date mono">{{ formatDate(h.date) }}</div>
              <div class="holiday-info">
                <span class="holiday-name">{{ h.name }}</span>
                <div class="holiday-tags">
                  <span v-if="h.moveable" class="tag tag-moveable">moveable</span>
                  <span v-if="h.note" class="tag tag-note">{{ h.note }}</span>
                </div>
              </div>
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
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-ghost { background: transparent; color: var(--vp-c-text-2); border-color: var(--vp-c-border); }
.btn-ghost:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
.input-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.input-field label { font-size: 13px; font-weight: 500; color: var(--vp-c-text-2); }
.text-input { padding: 10px 14px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 14px; outline: none; transition: border-color 0.15s ease; width: 100%; box-sizing: border-box; }
.text-input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.year-nav { display: flex; align-items: center; gap: 12px; }
.nav-btn { width: 32px; height: 32px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; }
.nav-btn:hover { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.year-display { font-size: 24px; font-weight: 700; color: var(--vp-c-text-1); }
.check-result { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.meta-chip { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); }
.chip-holiday { background: var(--jd-gold-soft); border-color: var(--jd-gold); color: #b8860b; }
.dark .chip-holiday { color: var(--jd-gold); }
.chip-workday { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.chip-off { background: rgba(239, 68, 68, 0.08); border-color: #ef4444; color: #ef4444; }
.divider { height: 1px; background: var(--vp-c-border); margin: 4px 0 16px 0; }
.range-inputs { display: flex; align-items: center; gap: 8px; }
.range-arrow { color: var(--vp-c-text-3); font-size: 13px; flex-shrink: 0; }
.result-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 8px; }
.result-valid { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.result-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--vp-c-brand-1); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #fff; flex-shrink: 0; }
.result-body { flex: 1; }
.result-label { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.result-value { font-size: 18px; font-weight: 700; color: var(--vp-c-text-1); }
.next-holiday { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 8px; background: var(--jd-gold-soft); border: 1px solid rgba(254, 209, 0, 0.3); font-size: 13px; color: var(--vp-c-text-1); margin-top: 8px; }
.next-label { color: var(--vp-c-text-3); }
.text-dim { color: var(--vp-c-text-3); }
.mono { font-family: var(--vp-font-family-mono); }
.holiday-timeline { max-height: 600px; overflow-y: auto; }
.month-group { margin-bottom: 16px; }
.month-label { font-size: 12px; font-weight: 600; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; padding-left: 4px; }
.holiday-item { display: flex; gap: 12px; padding: 10px 12px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 4px; transition: border-color 0.15s ease; }
.holiday-item:hover { border-color: var(--vp-c-brand-1); }
.holiday-date { font-size: 12px; color: var(--vp-c-text-3); white-space: nowrap; min-width: 100px; padding-top: 2px; }
.holiday-info { flex: 1; }
.holiday-name { font-size: 14px; font-weight: 500; color: var(--vp-c-text-1); }
.holiday-tags { display: flex; gap: 4px; margin-top: 4px; }
.tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; }
.tag-moveable { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.tag-note { background: var(--jd-gold-soft); color: #b8860b; }
.dark .tag-note { color: var(--jd-gold); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
</style>
