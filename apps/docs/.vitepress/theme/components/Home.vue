<script setup lang="ts">
import { ref, onMounted } from 'vue'

const copied = ref(false)

async function copyInstall() {
  try {
    await navigator.clipboard.writeText('npm install jamaica')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})

const categories = [
  {
    label: 'Identity',
    color: '#61AFEF',
    title: 'Identity & Validation',
    desc: 'TRN check-digit verification, phone number validation for +1-876/658, and informal address parsing with parish extraction.',
    packages: ['jamaica-trn', 'jamaica-phone', 'jamaica-addresses', 'jamaica-constants'],
  },
  {
    label: 'Finance',
    color: '#00C44A',
    title: 'Financial Tools',
    desc: 'JMD currency formatting, GCT calculations, full PAYE payroll with NIS/NHT/Education Tax, bank directory with SWIFT codes, and 60+ government fees.',
    packages: ['jamaica-currency', 'jamaica-tax', 'jamaica-banks', 'jamaica-gov-fees'],
  },
  {
    label: 'Geography',
    color: '#FED100',
    title: 'Geographic Data',
    desc: 'All 14 parishes with populations and coordinates, 200+ towns and communities, 63 electoral constituencies, airports, seaports, and road network stats.',
    packages: ['jamaica-parishes', 'jamaica-places', 'jamaica-constituencies', 'jamaica-transport'],
  },
  {
    label: 'Social',
    color: '#E06C75',
    title: 'Public Services',
    desc: 'Schools and universities, hospitals and health centres, police and fire stations, disaster shelters, public holidays, and business day calculations.',
    packages: ['jamaica-schools', 'jamaica-health', 'jamaica-emergency', 'jamaica-holidays'],
  },
  {
    label: 'DX',
    color: '#C678DD',
    title: 'Developer Experience',
    desc: 'Framework integrations for Zod validation schemas, React hooks with real-time feedback, and Express middleware for API servers.',
    packages: ['jamaica-zod', 'jamaica-react', 'jamaica-express'],
  },
  {
    label: 'Live Data',
    color: '#56B6C2',
    title: 'Live Data & APIs',
    desc: 'Bank of Jamaica exchange rates with caching, and a typed client for the Jamaica Open Data Portal with 31+ government datasets.',
    packages: ['jamaica-boj', 'jamaica-open-data'],
  },
]

const allPackages = [
  { name: 'jamaica-trn', desc: 'TRN validation & formatting', link: '/packages/trn' },
  { name: 'jamaica-phone', desc: 'Phone number validation', link: '/packages/phone' },
  { name: 'jamaica-addresses', desc: 'Address parsing', link: '/packages/addresses' },
  { name: 'jamaica-constants', desc: 'Country metadata & codes', link: '/packages/constants' },
  { name: 'jamaica-currency', desc: 'JMD formatting & GCT', link: '/packages/currency' },
  { name: 'jamaica-tax', desc: 'PAYE, NIS, NHT payroll', link: '/packages/tax' },
  { name: 'jamaica-banks', desc: 'Banks, branches, SWIFT', link: '/packages/banks' },
  { name: 'jamaica-gov-fees', desc: 'Government service fees', link: '/packages/gov-fees' },
  { name: 'jamaica-parishes', desc: '14 parishes with geo data', link: '/packages/parishes' },
  { name: 'jamaica-places', desc: 'Towns & communities', link: '/packages/places' },
  { name: 'jamaica-constituencies', desc: '63 electoral constituencies', link: '/packages/constituencies' },
  { name: 'jamaica-transport', desc: 'Airports, seaports, roads', link: '/packages/transport' },
  { name: 'jamaica-schools', desc: 'Schools & universities', link: '/packages/schools' },
  { name: 'jamaica-health', desc: 'Health facilities & RHAs', link: '/packages/health' },
  { name: 'jamaica-emergency', desc: 'Emergency services', link: '/packages/emergency' },
  { name: 'jamaica-holidays', desc: 'Holidays & business days', link: '/packages/holidays' },
  { name: 'jamaica-zod', desc: 'Zod validation schemas', link: '/packages/zod' },
  { name: 'jamaica-react', desc: 'React hooks & inputs', link: '/packages/react' },
  { name: 'jamaica-express', desc: 'Express middleware', link: '/packages/express' },
  { name: 'jamaica-boj', desc: 'BOJ exchange rates', link: '/packages/boj' },
  { name: 'jamaica-open-data', desc: 'Open Data Portal client', link: '/packages/open-data' },
]
</script>

<template>
  <div class="landing">

    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-grid"></div>
        <div class="hero-aurora"></div>
        <div class="hero-glow hero-glow--green"></div>
        <div class="hero-glow hero-glow--gold"></div>
      </div>

      <div class="hero-content">
        <span class="hero-badge hero-anim" style="--anim-delay: 0s">
          <span class="hero-badge-dot"></span>
          Open Source · TypeScript & Python
        </span>

        <h1 class="hero-title hero-anim" style="--anim-delay: 0.1s">
          The developer toolkit<br />for Jamaica
        </h1>

        <p class="hero-subtitle hero-anim" style="--anim-delay: 0.2s">
          21 production-ready packages for identity validation, financial calculations,
          geographic data, public services, developer experience, and live data. 1,000+ tests.
        </p>

        <div class="hero-actions hero-anim" style="--anim-delay: 0.3s">
          <a href="/guide/getting-started" class="btn btn--primary">
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="https://github.com/jamaica-digital/jamaica" class="btn btn--ghost" target="_blank">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            Star on GitHub
          </a>
        </div>

        <div class="hero-install hero-anim" style="--anim-delay: 0.4s">
          <span class="hero-install-prompt">$</span>
          <code class="hero-install-cmd">npm install jamaica</code>
          <button class="hero-install-copy" @click="copyInstall" :title="copied ? 'Copied!' : 'Copy'">
            <svg v-if="!copied" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ============ CODE PREVIEW ============ -->
    <section class="preview reveal-on-scroll">
      <div class="preview-inner">
        <div class="terminal">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot terminal-dot--red"></span>
              <span class="terminal-dot terminal-dot--yellow"></span>
              <span class="terminal-dot terminal-dot--green"></span>
            </div>
            <div class="terminal-title">app.ts</div>
            <div class="terminal-spacer"></div>
          </div>
          <pre class="terminal-code"><code><span class="t-kw">import</span> { <span class="t-fn">isValidTRN</span>, <span class="t-fn">formatTRN</span> } <span class="t-kw">from</span> <span class="t-str">'jamaica/trn'</span>
<span class="t-kw">import</span> { <span class="t-fn">calculatePayroll</span> } <span class="t-kw">from</span> <span class="t-str">'jamaica/tax'</span>
<span class="t-kw">import</span> { <span class="t-fn">formatJMD</span> } <span class="t-kw">from</span> <span class="t-str">'jamaica/currency'</span>
<span class="t-kw">import</span> { <span class="t-fn">getParish</span> } <span class="t-kw">from</span> <span class="t-str">'jamaica/parishes'</span>

<span class="t-cm">// Validate a Taxpayer Registration Number</span>
<span class="t-kw">const</span> trn = <span class="t-str">'123-456-784'</span>
<span class="t-fn">isValidTRN</span>(trn)              <span class="t-cm">// true</span>

<span class="t-cm">// Calculate full payroll deductions</span>
<span class="t-kw">const</span> payroll = <span class="t-fn">calculatePayroll</span>(<span class="t-num">250_000</span>)
<span class="t-fn">formatJMD</span>(payroll.netPay)    <span class="t-cm">// "J$196,925.00"</span>
<span class="t-fn">formatJMD</span>(payroll.incomeTax) <span class="t-cm">// "J$33,533.33"</span>

<span class="t-cm">// Look up parish data</span>
<span class="t-kw">const</span> parish = <span class="t-fn">getParish</span>(<span class="t-str">'Kingston'</span>)
parish.population            <span class="t-cm">// 89_057</span>
parish.capital               <span class="t-cm">// "Kingston"</span></code></pre>
        </div>
      </div>
    </section>

    <!-- ============ STATS ============ -->
    <section class="stats reveal-on-scroll">
      <div class="stats-inner">
        <div class="stats-item">
          <span class="stats-value">21</span>
          <span class="stats-label">Packages</span>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-item">
          <span class="stats-value">1,000+</span>
          <span class="stats-label">Tests</span>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-item">
          <span class="stats-value">2</span>
          <span class="stats-label">Languages</span>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-item">
          <span class="stats-value">0</span>
          <span class="stats-label">Dependencies</span>
        </div>
      </div>
    </section>

    <!-- ============ FEATURES ============ -->
    <section class="features reveal-on-scroll">
      <div class="features-inner">
        <div class="section-header">
          <h2 class="section-title">Everything you need</h2>
          <p class="section-subtitle">
            From TRN validation to payroll calculations, parish data to emergency services.
            One install, every tool.
          </p>
        </div>

        <div class="features-grid">
          <div
            v-for="(cat, i) in categories"
            :key="cat.label"
            class="feature-card stagger-card"
            :style="{ '--reveal-delay': i * 80 + 'ms' }"
          >
            <div class="feature-label" :style="{ color: cat.color }">
              <span class="feature-label-dot" :style="{ background: cat.color }"></span>
              {{ cat.label }}
            </div>
            <h3 class="feature-title">{{ cat.title }}</h3>
            <p class="feature-desc">{{ cat.desc }}</p>
            <div class="feature-packages">
              <span v-for="pkg in cat.packages" :key="pkg" class="feature-pkg">{{ pkg }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ALL PACKAGES ============ -->
    <section class="packages reveal-on-scroll">
      <div class="packages-inner">
        <div class="section-header">
          <h2 class="section-title">21 packages</h2>
          <p class="section-subtitle">
            Data packages, framework integrations, live data clients, and the unified <code>jamaica</code> meta-package.
            TypeScript and Python. Fully typed.
          </p>
        </div>

        <div class="packages-grid">
          <a
            v-for="(pkg, i) in allPackages"
            :key="pkg.name"
            :href="pkg.link"
            class="pkg-card stagger-card"
            :style="{ '--reveal-delay': i * 40 + 'ms' }"
          >
            <span class="pkg-name">{{ pkg.name }}</span>
            <span class="pkg-desc">{{ pkg.desc }}</span>
            <svg class="pkg-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ PLAYGROUND ============ -->
    <section class="playground-section reveal-on-scroll">
      <div class="playground-inner">
        <div class="section-header">
          <h2 class="section-title">Try it live</h2>
          <p class="section-subtitle">
            8 interactive playgrounds — experiment with every toolkit function directly in your browser.
            No installation required.
          </p>
        </div>

        <div class="playground-grid">
          <a href="/playground/trn" class="playground-card">
            <span class="playground-card-icon">#</span>
            <span class="playground-card-title">TRN Validator</span>
            <span class="playground-card-desc">Validate, format, and generate test TRNs</span>
          </a>
          <a href="/playground/phone" class="playground-card">
            <span class="playground-card-icon">P</span>
            <span class="playground-card-title">Phone Formatter</span>
            <span class="playground-card-desc">Parse and format Jamaican phone numbers</span>
          </a>
          <a href="/playground/currency" class="playground-card">
            <span class="playground-card-icon">$</span>
            <span class="playground-card-title">Currency & GCT</span>
            <span class="playground-card-desc">Format JMD, calculate GCT, convert to USD</span>
          </a>
          <a href="/playground/payroll" class="playground-card">
            <span class="playground-card-icon">%</span>
            <span class="playground-card-title">Payroll Calculator</span>
            <span class="playground-card-desc">PAYE, NIS, NHT, education tax breakdown</span>
          </a>
          <a href="/playground/address" class="playground-card">
            <span class="playground-card-icon">A</span>
            <span class="playground-card-title">Address Parser</span>
            <span class="playground-card-desc">Parse informal addresses into components</span>
          </a>
          <a href="/playground/fees" class="playground-card">
            <span class="playground-card-icon">G</span>
            <span class="playground-card-title">Government Fees</span>
            <span class="playground-card-desc">Search 60+ fees across 10 agencies</span>
          </a>
          <a href="/playground/holidays" class="playground-card">
            <span class="playground-card-icon">H</span>
            <span class="playground-card-title">Public Holidays</span>
            <span class="playground-card-desc">Holiday calendar and business day counter</span>
          </a>
          <a href="/playground/parishes" class="playground-card">
            <span class="playground-card-icon">M</span>
            <span class="playground-card-title">Parish Explorer</span>
            <span class="playground-card-desc">14 parishes with stats and distance calculator</span>
          </a>
        </div>

        <div class="playground-cta">
          <a href="/playground/" class="btn btn--primary">
            Open Playground
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ SECTORS ============ -->
    <section class="sectors reveal-on-scroll">
      <div class="sectors-inner">
        <div class="section-header">
          <h2 class="section-title">Built for every industry</h2>
          <p class="section-subtitle">
            9 sector guides with complete code examples. Whether you're building fintech,
            government services, healthcare, or diaspora apps — we've got you covered.
          </p>
        </div>

        <div class="sectors-grid">
          <a href="/sectors/fintech" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 14h4"/></svg>
            </div>
            <h4 class="sector-name">Fintech</h4>
            <p class="sector-desc">Currency formatting, GCT calculations, bank directory, SWIFT codes, and exchange rate integration.</p>
          </a>
          <a href="/sectors/government" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><path d="M9 10h1"/><path d="M14 10h1"/><path d="M9 14h1"/><path d="M14 14h1"/></svg>
            </div>
            <h4 class="sector-name">Government</h4>
            <p class="sector-desc">TRN validation, government fees lookup, holiday calendars, constituency data, and public service directories.</p>
          </a>
          <a href="/sectors/health" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h4 class="sector-name">Healthcare</h4>
            <p class="sector-desc">Hospital and health centre directory, regional health authorities, nearest facility lookup, and emergency contacts.</p>
          </a>
          <a href="/sectors/education" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>
            </div>
            <h4 class="sector-name">Education</h4>
            <p class="sector-desc">School directory with types and levels, university data, parish-based filtering, and search across institutions.</p>
          </a>
          <a href="/sectors/ecommerce" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            </div>
            <h4 class="sector-name">E-commerce</h4>
            <p class="sector-desc">JMD currency handling, GCT tax calculation, address parsing, phone validation, and delivery parish routing.</p>
          </a>
          <a href="/sectors/hr-payroll" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
            </div>
            <h4 class="sector-name">HR & Payroll</h4>
            <p class="sector-desc">Full PAYE income tax, NIS, NHT, Education Tax, HEART contributions, and complete payroll breakdown.</p>
          </a>
          <a href="/sectors/logistics" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <h4 class="sector-name">Logistics</h4>
            <p class="sector-desc">Address parsing, delivery zone routing, community-level routing, transport infrastructure, and driver management.</p>
          </a>
          <a href="/sectors/civic-tech" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h4 class="sector-name">Civic Tech</h4>
            <p class="sector-desc">Constituency lookup, government fee calculators, open data integration, and citizen engagement tools.</p>
          </a>
          <a href="/sectors/diaspora" class="sector-card">
            <div class="sector-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </div>
            <h4 class="sector-name">Diaspora</h4>
            <p class="sector-desc">Remittance calculators, multi-currency exchange rates, recipient verification, and homeland connection tools.</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="cta reveal-on-scroll">
      <div class="cta-inner">
        <div class="cta-glow"></div>
        <h2 class="cta-title">Start building today</h2>
        <p class="cta-subtitle">
          One command. Every tool you need for Jamaica applications.
        </p>
        <div class="cta-actions">
          <a href="/guide/getting-started" class="btn btn--primary btn--lg">
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="/playground/" class="btn btn--ghost btn--lg">
            Try Playground
          </a>
        </div>
        <div class="cta-examples">
          <span class="cta-examples-label">Example Apps:</span>
          <a href="https://github.com/jamaica-digital/jamaica/tree/main/examples/payroll-calculator" class="cta-example-link">Payroll Calculator</a>
          <a href="https://github.com/jamaica-digital/jamaica/tree/main/examples/parish-dashboard" class="cta-example-link">Parish Dashboard</a>
          <a href="https://github.com/jamaica-digital/jamaica/tree/main/examples/gov-services-portal" class="cta-example-link">Gov Services</a>
          <a href="https://github.com/jamaica-digital/jamaica/tree/main/examples/checkout-demo" class="cta-example-link">Checkout Demo</a>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ================================================================
   LANDING PAGE — Jamaica Developer Kit
   Inspired by Linear + OpenAI + Stripe, adapted with Jamaica brand
   ================================================================ */

/* ===== LAYOUT ===== */
.landing {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--landing-text);
  background: var(--landing-bg);
}

/* ===== SECTION DEFAULTS ===== */
.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 64px;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -1.2px;
  line-height: 1.15;
  color: var(--landing-text);
  margin: 0 0 16px;
}

.section-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: var(--landing-text-secondary);
  margin: 0;
}

.section-subtitle code {
  background: var(--landing-card-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: var(--landing-green);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  padding: 12px 24px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: var(--landing-green);
  color: #fff;
}

.btn--primary:hover {
  background: var(--landing-green-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 155, 58, 0.35);
}

.btn--ghost {
  background: transparent;
  color: var(--landing-text-secondary);
  border: 1px solid var(--landing-border);
}

.btn--ghost:hover {
  color: var(--landing-text);
  border-color: var(--landing-text-tertiary);
  transform: translateY(-1px);
}

.btn--lg {
  font-size: 16px;
  padding: 14px 32px;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 60px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--landing-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--landing-border) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.hero-glow--green {
  width: 600px;
  height: 600px;
  background: rgba(0, 155, 58, 0.12);
  top: -150px;
  left: -100px;
}

.hero-glow--gold {
  width: 500px;
  height: 500px;
  background: rgba(254, 209, 0, 0.08);
  bottom: -100px;
  right: -50px;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 720px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--landing-green);
  background: rgba(0, 155, 58, 0.08);
  border: 1px solid rgba(0, 155, 58, 0.15);
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 32px;
  letter-spacing: 0.3px;
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--landing-green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hero-title {
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -2.5px;
  line-height: 1.05;
  margin: 0 0 24px;
  background: linear-gradient(135deg, var(--landing-green) 0%, var(--landing-green-light) 40%, var(--landing-gold) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 19px;
  line-height: 1.7;
  color: var(--landing-text-secondary);
  max-width: 560px;
  margin: 0 auto 40px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.hero-install {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--landing-code-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px 12px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.hero-install-prompt {
  color: var(--landing-green);
  user-select: none;
}

.hero-install-cmd {
  color: #e8e8ed;
}

.hero-install-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: #8a8a9a;
  cursor: pointer;
  transition: all 0.15s ease;
}

.hero-install-copy:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #e8e8ed;
}

/* ===== CODE PREVIEW ===== */
.preview {
  padding: 0 24px 100px;
  display: flex;
  justify-content: center;
}

.preview-inner {
  width: 100%;
  max-width: 720px;
}

.terminal {
  background: var(--landing-code-bg);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 80px rgba(0, 155, 58, 0.03);
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-dot--red { background: #ff5f57; }
.terminal-dot--yellow { background: #febc2e; }
.terminal-dot--green { background: #28c840; }

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #5a5a6a;
  font-family: 'Inter', sans-serif;
}

.terminal-spacer {
  width: 44px;
}

.terminal-code {
  padding: 24px;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  line-height: 1.75;
  color: #abb2bf;
  overflow-x: auto;
}

.terminal-code code {
  font-family: inherit;
}

/* Syntax colors */
.t-kw { color: #c678dd; }
.t-fn { color: #61afef; }
.t-str { color: #98c379; }
.t-num { color: #d19a66; }
.t-cm { color: #5c6370; font-style: italic; }

/* ===== STATS ===== */
.stats {
  padding: 0 24px 100px;
}

.stats-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 0;
  border-top: 1px solid var(--landing-border);
  border-bottom: 1px solid var(--landing-border);
}

.stats-item {
  flex: 1;
  text-align: center;
}

.stats-value {
  display: block;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--landing-text);
}

.stats-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--landing-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.stats-divider {
  width: 1px;
  height: 40px;
  background: var(--landing-border);
}

/* ===== FEATURES ===== */
.features {
  padding: 100px 24px;
}

.features-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-card {
  background: var(--landing-card-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.25s ease;
}

.feature-card:hover {
  background: var(--landing-card-hover);
  border-color: rgba(0, 155, 58, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.feature-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
}

.feature-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.feature-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--landing-text);
  margin: 0 0 12px;
}

.feature-desc {
  font-size: 15px;
  line-height: 1.65;
  color: var(--landing-text-secondary);
  margin: 0 0 20px;
}

.feature-packages {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-pkg {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--landing-text-tertiary);
  background: var(--landing-bg);
  border: 1px solid var(--landing-border);
  border-radius: 6px;
  padding: 4px 10px;
}

/* ===== ALL PACKAGES ===== */
.packages {
  padding: 0 24px 100px;
}

.packages-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.pkg-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--landing-card-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.pkg-card:hover {
  background: var(--landing-card-hover);
  border-color: rgba(0, 155, 58, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.pkg-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--landing-text);
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 6px;
}

.pkg-desc {
  font-size: 13px;
  color: var(--landing-text-tertiary);
  line-height: 1.5;
}

.pkg-arrow {
  position: absolute;
  top: 20px;
  right: 16px;
  color: var(--landing-text-tertiary);
  opacity: 0;
  transition: all 0.2s ease;
  transform: translateX(-4px);
}

.pkg-card:hover .pkg-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--landing-green);
}

/* ===== PLAYGROUND ===== */
.playground-section {
  padding: 100px 24px;
  background: var(--landing-bg-subtle);
  border-top: 1px solid var(--landing-border);
  border-bottom: 1px solid var(--landing-border);
}

.playground-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.playground-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.playground-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--landing-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.playground-card:hover {
  border-color: rgba(0, 155, 58, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.playground-card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--landing-card-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--landing-green);
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 12px;
}

.playground-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--landing-text);
  margin-bottom: 4px;
}

.playground-card-desc {
  font-size: 12px;
  color: var(--landing-text-tertiary);
  line-height: 1.5;
}

.playground-cta {
  text-align: center;
  margin-top: 40px;
}

/* ===== SECTORS ===== */
.sectors {
  padding: 100px 24px;
  background: var(--landing-bg-subtle);
  border-top: 1px solid var(--landing-border);
  border-bottom: 1px solid var(--landing-border);
}

.sectors-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sector-card {
  display: block;
  padding: 28px;
  background: var(--landing-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 14px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.sector-card:hover {
  border-color: rgba(0, 155, 58, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.sector-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--landing-card-bg);
  border: 1px solid var(--landing-card-border);
  border-radius: 10px;
  margin-bottom: 20px;
  color: var(--landing-green);
}

.sector-name {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--landing-text);
  margin: 0 0 10px;
}

.sector-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--landing-text-secondary);
  margin: 0;
}

/* ===== CTA ===== */
.cta {
  padding: 120px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 155, 58, 0.06) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(80px);
  pointer-events: none;
}

.cta-inner {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
}

.cta-title {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -1.5px;
  color: var(--landing-text);
  margin: 0 0 16px;
}

.cta-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: var(--landing-text-secondary);
  margin: 0 0 40px;
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.cta-examples {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.cta-examples-label {
  font-size: 13px;
  color: var(--landing-text-tertiary);
  font-weight: 500;
}

.cta-example-link {
  font-size: 13px;
  color: var(--landing-green);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.cta-example-link:hover {
  color: var(--landing-green-light);
  text-decoration: underline;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .packages-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .playground-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sectors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 80px 20px 60px;
  }

  .hero-title {
    font-size: 44px;
    letter-spacing: -1.5px;
  }

  .hero-subtitle {
    font-size: 17px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .playground-grid {
    grid-template-columns: 1fr;
  }

  .sectors-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 32px;
  }

  .cta-title {
    font-size: 32px;
  }

  .stats-inner {
    flex-wrap: wrap;
    gap: 24px;
  }

  .stats-divider {
    display: none;
  }

  .stats-item {
    min-width: 120px;
  }

  .terminal-code {
    font-size: 12px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 36px;
  }

  .packages-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== AURORA BACKGROUND ===== */
.hero-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 30% 20%, rgba(0, 155, 58, 0.12), transparent),
    radial-gradient(ellipse 60% 40% at 70% 80%, rgba(254, 209, 0, 0.08), transparent),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0, 155, 58, 0.05), transparent);
  filter: blur(60px);
  animation: aurora-shift 12s ease-in-out infinite alternate;
}

@keyframes aurora-shift {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(20px, -10px); }
}

/* ===== HERO ENTRANCE ===== */
.hero-anim {
  opacity: 0;
  transform: translateY(24px);
  animation: hero-fade-up 0.7s ease-out forwards;
  animation-delay: var(--anim-delay, 0s);
}

@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== SCROLL REVEALS ===== */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ===== STAGGERED CARD REVEALS ===== */
.reveal-on-scroll.revealed .stagger-card {
  animation: card-pop 0.5s ease-out both;
  animation-delay: var(--reveal-delay, 0ms);
}

.stagger-card {
  opacity: 0;
}

.reveal-on-scroll.revealed .stagger-card {
  opacity: 1;
}

@keyframes card-pop {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .hero-anim {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .hero-aurora {
    animation: none;
  }

  .reveal-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .stagger-card {
    opacity: 1;
    animation: none;
  }

  .reveal-on-scroll.revealed .stagger-card {
    animation: none;
  }

  .hero-badge-dot {
    animation: none;
  }
}
</style>
