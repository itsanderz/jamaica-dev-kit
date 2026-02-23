'use client';

import { useState, useMemo } from 'react';
import {
  getAllParishes,
  getDistanceKm,
  getTotalPopulation,
  type Parish,
  type ParishCode,
} from 'jamaica-parishes';
import { getSchoolsByParish } from 'jamaica-schools';
import {
  getHospitalsByParish,
  getHealthCentresByParish,
} from 'jamaica-health';
import {
  getPoliceStationsByParish,
  getFireStationsByParish,
} from 'jamaica-emergency';
import { getPlacesByParish } from 'jamaica-places';
import { getBranchesByParish } from 'jamaica-banks';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-JM');
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function ParishDashboard() {
  const parishes = useMemo(() => getAllParishes(), []);
  const totalPop = useMemo(() => getTotalPopulation(), []);

  const [selected, setSelected] = useState<ParishCode | null>(null);
  const [distFrom, setDistFrom] = useState<ParishCode>('KIN');
  const [distTo, setDistTo] = useState<ParishCode>('SJA');

  const selectedParish = useMemo(
    () => (selected ? parishes.find((p) => p.code === selected) ?? null : null),
    [selected, parishes],
  );

  /* Distance calculation */
  const distance = useMemo(() => {
    if (distFrom === distTo) return 0;
    return getDistanceKm(distFrom, distTo);
  }, [distFrom, distTo]);

  /* Parish detail data */
  const detail = useMemo(() => {
    if (!selectedParish) return null;
    const name = selectedParish.name;
    return {
      schools: getSchoolsByParish(name),
      hospitals: getHospitalsByParish(name),
      healthCentres: getHealthCentresByParish(name),
      policeStations: getPoliceStationsByParish(name),
      fireStations: getFireStationsByParish(name),
      places: getPlacesByParish(name),
      branches: getBranchesByParish(name),
    };
  }, [selectedParish]);

  /* Population bar chart data, sorted descending */
  const popChart = useMemo(
    () => [...parishes].sort((a, b) => b.population - a.population),
    [parishes],
  );
  const maxPop = popChart[0]?.population ?? 1;

  return (
    <div className="space-y-10">
      {/* ------ Header summary ------ */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Jamaica&apos;s 14 Parishes</h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Total population: <span className="font-semibold text-[var(--brand)]">{fmtNum(totalPop)}</span>.
          Click a parish to explore details.
        </p>
      </section>

      {/* ------ Two-column layout ------ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        {/* ====== LEFT: Parish card grid ====== */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {parishes.map((p) => (
              <button
                key={p.code}
                onClick={() => setSelected(selected === p.code ? null : p.code)}
                className={`
                  text-left rounded-xl border p-3 transition-all hover:shadow-md cursor-pointer
                  ${
                    selected === p.code
                      ? 'border-[var(--brand)] bg-[var(--brand-soft)] shadow-md'
                      : 'border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--brand)]/40'
                  }
                `}
              >
                <div className="text-[10px] font-mono text-[var(--text-muted)] mb-1">{p.code}</div>
                <div className="text-sm font-semibold leading-tight mb-1 truncate">{p.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{fmtPop(p.population)}</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">{p.capital}</div>
              </button>
            ))}
          </div>

          {/* ====== Population comparison bar chart ====== */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Population Comparison</h3>
            <div className="space-y-2">
              {popChart.map((p) => {
                const pct = (p.population / maxPop) * 100;
                return (
                  <div key={p.code} className="flex items-center gap-3">
                    <button
                      onClick={() => setSelected(p.code)}
                      className="w-28 text-right text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] truncate cursor-pointer"
                    >
                      {p.name}
                    </button>
                    <div className="flex-1 h-5 bg-[var(--bg-mute)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background:
                            selected === p.code
                              ? 'var(--brand)'
                              : 'linear-gradient(90deg, var(--brand), #00C44A)',
                          opacity: selected === p.code ? 1 : 0.6,
                        }}
                      />
                    </div>
                    <span className="w-16 text-xs font-mono text-[var(--text-muted)]">
                      {fmtPop(p.population)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ====== Distance Calculator ====== */}
          <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-6">
            <h3 className="text-lg font-semibold mb-4">Distance Calculator</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">From</label>
                <select
                  value={distFrom}
                  onChange={(e) => setDistFrom(e.target.value as ParishCode)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  {parishes.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[var(--text-muted)] text-lg pb-2">&#8594;</span>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">To</label>
                <select
                  value={distTo}
                  onChange={(e) => setDistTo(e.target.value as ParishCode)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  {parishes.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg bg-[var(--brand-soft)] px-4 py-2">
                <span className="text-2xl font-bold text-[var(--brand)] font-mono">
                  {distance.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--text-muted)] ml-1">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====== RIGHT: Detail panel ====== */}
        <div className="min-w-0">
          {!selectedParish ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] p-10 text-center text-sm text-[var(--text-muted)]">
              Select a parish to view details
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-6 space-y-6 sticky top-20">
              {/* Parish header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{selectedParish.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--brand-soft)] text-[var(--brand)]">
                    {selectedParish.code}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Capital: {selectedParish.capital}
                </p>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Population" value={fmtNum(selectedParish.population)} />
                <StatCard label="Area" value={`${fmtNum(selectedParish.area_km2)} km\u00B2`} />
                <StatCard label="Density" value={`${selectedParish.density_per_km2.toFixed(1)}/km\u00B2`} />
                <StatCard label="Urban %" value={`${selectedParish.urban_pct}%`} />
              </div>

              {/* Government services */}
              <div>
                <SectionTitle>Government Services</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <ServiceBadge label="NLA" active={selectedParish.service_centers.nla} />
                  <ServiceBadge label="TAJ" active={selectedParish.service_centers.taj} />
                  <ServiceBadge label="PICA" active={selectedParish.service_centers.pica} />
                  <ServiceBadge label="COJ" active={selectedParish.service_centers.coj} />
                </div>
              </div>

              {/* Connectivity */}
              <div>
                <SectionTitle>Connectivity</SectionTitle>
                <div className="text-sm space-y-1 text-[var(--text-secondary)]">
                  <p>
                    Broadband:{' '}
                    <span className="font-medium text-[var(--text-primary)]">
                      {selectedParish.internet.broadband_level.replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p>
                    Fibre:{' '}
                    <span className={`font-medium ${selectedParish.internet.fibre_connected ? 'text-[var(--brand)]' : 'text-red-400'}`}>
                      {selectedParish.internet.fibre_connected ? 'Connected' : 'No'}
                    </span>
                  </p>
                  <p>
                    Mobile quality:{' '}
                    <span className="font-medium text-[var(--text-primary)]">
                      {selectedParish.mobile_coverage.quality.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Economy */}
              <div>
                <SectionTitle>Economy</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {selectedParish.economy.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--bg-mute)] text-[var(--text-secondary)] border border-[var(--border)]"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              {detail && (
                <div>
                  <SectionTitle>
                    Hospitals ({detail.hospitals.length}) &amp; Health Centres ({detail.healthCentres.length})
                  </SectionTitle>
                  <ul className="text-sm space-y-1 text-[var(--text-secondary)]">
                    {detail.hospitals.map((h) => (
                      <li key={h.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {h.name}
                      </li>
                    ))}
                    {detail.healthCentres.map((h) => (
                      <li key={h.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        {h.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schools */}
              {detail && (
                <div>
                  <SectionTitle>Schools ({detail.schools.length})</SectionTitle>
                  <div className="text-sm text-[var(--text-secondary)] space-y-1 max-h-32 overflow-y-auto">
                    {detail.schools.map((s) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency services */}
              {detail && (
                <div>
                  <SectionTitle>
                    Emergency Services
                  </SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat
                      label="Police Stations"
                      value={detail.policeStations.length}
                      color="blue"
                    />
                    <MiniStat
                      label="Fire Stations"
                      value={detail.fireStations.length}
                      color="red"
                    />
                  </div>
                  <ul className="mt-2 text-sm space-y-1 text-[var(--text-secondary)]">
                    {detail.policeStations.map((s) => (
                      <li key={s.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        {s.name}
                      </li>
                    ))}
                    {detail.fireStations.map((s) => (
                      <li key={s.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Banks */}
              {detail && (
                <div>
                  <SectionTitle>Bank Branches ({detail.branches.length})</SectionTitle>
                  <ul className="text-sm space-y-1 text-[var(--text-secondary)]">
                    {detail.branches.map((b) => (
                      <li key={b.name} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {b.name}
                      </li>
                    ))}
                    {detail.branches.length === 0 && (
                      <li className="text-[var(--text-muted)] italic">No branches listed</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Places / Towns */}
              {detail && (
                <div>
                  <SectionTitle>Places &amp; Towns ({detail.places.length})</SectionTitle>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {detail.places.map((p) => (
                      <span
                        key={p.name}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border border-[var(--border)] ${
                          p.type === 'city'
                            ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                            : p.type === 'town'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                              : 'bg-[var(--bg-mute)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{label}</div>
      <div className="text-base font-semibold font-mono">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
      {children}
    </h4>
  );
}

function ServiceBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        active
          ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
          : 'bg-[var(--bg-mute)] text-[var(--text-muted)]'
      }`}
    >
      {label}
    </span>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'red';
}) {
  const bg = color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20';
  const text = color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className={`rounded-lg p-3 ${bg}`}>
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{label}</div>
      <div className={`text-xl font-bold font-mono ${text}`}>{value}</div>
    </div>
  );
}
