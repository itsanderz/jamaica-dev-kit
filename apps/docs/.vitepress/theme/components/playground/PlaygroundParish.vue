<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getAllParishes,
  getParish,
  getDistanceKm,
  getTotalPopulation,
  getParishesWithService,
  type Parish,
  type ParishCode,
  PARISH_CODES,
} from 'jamaica-parishes'

const selectedCode = ref<ParishCode>('KIN')
const compareCode = ref<ParishCode>('SJA')
const showCode = ref(false)

const parishes = computed(() => getAllParishes())
const selected = computed(() => getParish(selectedCode.value))
const totalPop = computed(() => getTotalPopulation())

const distance = computed(() => {
  try { return getDistanceKm(selectedCode.value, compareCode.value).toFixed(1) } catch { return null }
})

const popPercent = computed(() =>
  selected.value ? ((selected.value.population / totalPop.value) * 100).toFixed(1) : '0'
)

const services = computed(() => {
  if (!selected.value) return []
  const sc = selected.value.service_centers
  return [
    { name: 'NLA', available: sc.nla },
    { name: 'TAJ', available: sc.taj },
    { name: 'PICA', available: sc.pica },
    { name: 'COJ', available: sc.coj },
  ]
})

const popBars = computed(() => {
  const sorted = [...parishes.value].sort((a, b) => b.population - a.population)
  const max = sorted[0]?.population || 1
  return sorted.map(p => ({
    name: p.name,
    code: p.code,
    pop: p.population,
    width: (p.population / max) * 100,
    isSelected: p.code === selectedCode.value,
  }))
})

const codeExample = computed(() =>
  `import { getParish, getDistanceKm, getAllParishes } from 'jamaica-parishes';

const parish = getParish('${selectedCode.value}');
// { name: '${selected.value?.name}', population: ${selected.value?.population}, ... }

getDistanceKm('${selectedCode.value}', '${compareCode.value}');
// ${distance.value} km

getAllParishes().length;
// 14`
)
</script>

<template>
  <div class="playground">
    <div class="playground-grid">
      <div class="playground-input">
        <div class="input-header">
          <h3>Select Parish</h3>
        </div>

        <div class="parish-grid">
          <button v-for="p in parishes" :key="p.code" class="parish-btn"
            :class="{ active: p.code === selectedCode }"
            @click="selectedCode = p.code as ParishCode">
            <span class="parish-code">{{ p.code }}</span>
            <span class="parish-name">{{ p.name }}</span>
            <span class="parish-pop">{{ (p.population / 1000).toFixed(0) }}k</span>
          </button>
        </div>

        <!-- Distance Calculator -->
        <div class="distance-section">
          <h4>Distance Calculator</h4>
          <div class="distance-row">
            <select v-model="selectedCode" class="select-input">
              <option v-for="p in parishes" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <span class="distance-arrow">to</span>
            <select v-model="compareCode" class="select-input">
              <option v-for="p in parishes" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
          </div>
          <div v-if="distance" class="distance-result">
            <span class="distance-value mono">{{ distance }} km</span>
            <span class="distance-note">straight-line distance between capitals</span>
          </div>
        </div>
      </div>

      <div class="playground-output">
        <div class="output-header">
          <h3>{{ selected?.name || 'Parish Details' }}</h3>
          <button class="btn btn-sm btn-ghost" @click="showCode = !showCode">
            {{ showCode ? 'Hide Code' : 'View Code' }}
          </button>
        </div>

        <div v-if="showCode" class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>

        <div v-else-if="selected">
          <!-- Key Stats -->
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-num mono">{{ selected.population.toLocaleString() }}</div>
              <div class="stat-lbl">Population</div>
            </div>
            <div class="stat-item">
              <div class="stat-num mono">{{ selected.area_km2.toLocaleString() }}</div>
              <div class="stat-lbl">Area (km&sup2;)</div>
            </div>
            <div class="stat-item">
              <div class="stat-num mono">{{ selected.density_per_km2.toLocaleString() }}</div>
              <div class="stat-lbl">Density/km&sup2;</div>
            </div>
            <div class="stat-item">
              <div class="stat-num mono">{{ selected.urban_pct }}%</div>
              <div class="stat-lbl">Urban</div>
            </div>
          </div>

          <!-- Capital & Pop share -->
          <div class="result-card">
            <div class="result-body">
              <div class="result-label">Capital</div>
              <div class="result-value">{{ selected.capital }}</div>
            </div>
            <div class="pop-share">{{ popPercent }}% of total</div>
          </div>

          <!-- Services -->
          <h4 class="section-title">Government Services</h4>
          <div class="service-grid">
            <div v-for="s in services" :key="s.name" class="service-badge" :class="{ 'service-yes': s.available }">
              {{ s.name }}
            </div>
          </div>

          <!-- Internet & Mobile -->
          <h4 class="section-title">Connectivity</h4>
          <div class="connectivity-grid">
            <div class="conn-item">
              <span class="conn-label">Broadband</span>
              <span class="conn-value">{{ selected.internet.broadband_level }}</span>
            </div>
            <div class="conn-item">
              <span class="conn-label">Fibre</span>
              <span class="conn-value">{{ selected.internet.fibre_connected ? 'Yes' : 'No' }}</span>
            </div>
            <div class="conn-item">
              <span class="conn-label">Mobile</span>
              <span class="conn-value">{{ selected.mobile_coverage.quality }}</span>
            </div>
            <div class="conn-item">
              <span class="conn-label">Providers</span>
              <span class="conn-value">{{ selected.internet.providers.join(', ') }}</span>
            </div>
          </div>

          <!-- Economy -->
          <h4 class="section-title">Economy</h4>
          <div class="economy-tags">
            <span v-for="e in selected.economy" :key="e" class="eco-tag">{{ e }}</span>
          </div>

          <!-- Population Chart -->
          <h4 class="section-title">Population Comparison</h4>
          <div class="pop-chart">
            <div v-for="bar in popBars" :key="bar.code" class="pop-row" :class="{ 'pop-active': bar.isSelected }">
              <span class="pop-name">{{ bar.name }}</span>
              <div class="pop-bar-track">
                <div class="pop-bar-fill" :style="{ width: bar.width + '%' }"></div>
              </div>
              <span class="pop-num mono">{{ (bar.pop / 1000).toFixed(0) }}k</span>
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
.parish-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 20px; }
.parish-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); cursor: pointer; transition: all 0.15s ease; text-align: left; }
.parish-btn:hover { border-color: var(--vp-c-brand-1); }
.parish-btn.active { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); }
.parish-code { font-size: 10px; font-weight: 700; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); min-width: 30px; }
.parish-btn.active .parish-code { color: var(--vp-c-brand-1); }
.parish-name { font-size: 12px; font-weight: 500; color: var(--vp-c-text-1); flex: 1; }
.parish-pop { font-size: 11px; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); }
.distance-section { margin-top: 4px; }
.distance-section h4 { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 0 0 10px 0; border: none; padding: 0; }
.distance-row { display: flex; align-items: center; gap: 8px; }
.select-input { flex: 1; padding: 8px 12px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 13px; outline: none; cursor: pointer; }
.select-input:focus { border-color: var(--vp-c-brand-1); }
.distance-arrow { color: var(--vp-c-text-3); font-size: 13px; }
.distance-result { margin-top: 10px; text-align: center; }
.distance-value { font-size: 28px; font-weight: 700; color: var(--vp-c-brand-1); }
.distance-note { display: block; font-size: 11px; color: var(--vp-c-text-3); margin-top: 2px; }
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.stat-item { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 10px 8px; text-align: center; }
.stat-num { font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); }
.stat-lbl { font-size: 10px; color: var(--vp-c-text-3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.3px; }
.result-card { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); margin-bottom: 12px; }
.result-body { flex: 1; }
.result-label { font-size: 12px; color: var(--vp-c-text-3); }
.result-value { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.pop-share { font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); }
.section-title { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 16px 0 8px 0; border: none; padding: 0; }
.service-grid { display: flex; gap: 6px; flex-wrap: wrap; }
.service-badge { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; background: var(--vp-c-bg-mute); color: var(--vp-c-text-3); border: 1px solid var(--vp-c-border); }
.service-yes { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.connectivity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.conn-item { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 8px 12px; }
.conn-label { display: block; font-size: 10px; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.3px; }
.conn-value { font-size: 13px; font-weight: 500; color: var(--vp-c-text-1); text-transform: capitalize; }
.economy-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.eco-tag { padding: 4px 10px; border-radius: 20px; font-size: 12px; background: var(--jd-gold-soft); color: #b8860b; border: 1px solid rgba(254, 209, 0, 0.3); }
.dark .eco-tag { color: var(--jd-gold); }
.pop-chart { max-height: 280px; overflow-y: auto; }
.pop-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
.pop-active .pop-name { color: var(--vp-c-brand-1); font-weight: 600; }
.pop-name { font-size: 11px; color: var(--vp-c-text-2); min-width: 80px; white-space: nowrap; }
.pop-bar-track { flex: 1; height: 12px; background: var(--vp-c-bg-mute); border-radius: 3px; overflow: hidden; }
.pop-bar-fill { height: 100%; background: var(--vp-c-brand-soft); border-radius: 3px; transition: width 0.3s ease; }
.pop-active .pop-bar-fill { background: var(--vp-c-brand-1); }
.pop-num { font-size: 11px; color: var(--vp-c-text-3); min-width: 32px; text-align: right; }
.mono { font-family: var(--vp-font-family-mono); }
.code-block { background: var(--vp-code-block-bg); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 16px; overflow-x: auto; }
.code-block pre { margin: 0; }
.code-block code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.6; color: var(--vp-c-text-1); }
</style>
