'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  searchFees,
  getAllFees,
  getAgencies,
  getPassportFee,
  getVehicleRegistrationFee,
  getDriversLicenceFee,
  type ServiceFee,
  type Agency,
  type AgencyId,
} from 'jamaica-gov-fees';
import { isValidTRN, getTRNCheckDigit, formatTRN } from 'jamaica-trn';
import { formatJMD, addGCT } from 'jamaica-currency';
import { getNextHoliday, getWorkingDays } from 'jamaica-holidays';

// ---------------------------------------------------------------------------
// Agency color mapping
// ---------------------------------------------------------------------------

const AGENCY_COLORS: Record<AgencyId, { bg: string; text: string; pill: string }> = {
  pica: { bg: 'bg-blue-50', text: 'text-blue-700', pill: 'bg-blue-100 text-blue-700 border-blue-200' },
  nira: { bg: 'bg-purple-50', text: 'text-purple-700', pill: 'bg-purple-100 text-purple-700 border-purple-200' },
  taj: { bg: 'bg-red-50', text: 'text-red-700', pill: 'bg-red-100 text-red-700 border-red-200' },
  ita: { bg: 'bg-orange-50', text: 'text-orange-700', pill: 'bg-orange-100 text-orange-700 border-orange-200' },
  coj: { bg: 'bg-teal-50', text: 'text-teal-700', pill: 'bg-teal-100 text-teal-700 border-teal-200' },
  nla: { bg: 'bg-emerald-50', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  nepa: { bg: 'bg-lime-50', text: 'text-lime-700', pill: 'bg-lime-100 text-lime-700 border-lime-200' },
  police: { bg: 'bg-slate-50', text: 'text-slate-700', pill: 'bg-slate-100 text-slate-700 border-slate-200' },
  trade_board: { bg: 'bg-amber-50', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700 border-amber-200' },
  labour: { bg: 'bg-indigo-50', text: 'text-indigo-700', pill: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

const ACTIVE_PILL_COLORS: Record<AgencyId, string> = {
  pica: 'bg-blue-600 text-white border-blue-600',
  nira: 'bg-purple-600 text-white border-purple-600',
  taj: 'bg-red-600 text-white border-red-600',
  ita: 'bg-orange-600 text-white border-orange-600',
  coj: 'bg-teal-600 text-white border-teal-600',
  nla: 'bg-emerald-600 text-white border-emerald-600',
  nepa: 'bg-lime-600 text-white border-lime-600',
  police: 'bg-slate-600 text-white border-slate-600',
  trade_board: 'bg-amber-600 text-white border-amber-600',
  labour: 'bg-indigo-600 text-white border-indigo-600',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Fee Card
// ---------------------------------------------------------------------------

function FeeCard({ fee }: { fee: ServiceFee }) {
  const colors = AGENCY_COLORS[fee.agency] ?? { bg: 'bg-gray-50', text: 'text-gray-700', pill: 'bg-gray-100 text-gray-700 border-gray-200' };
  const withGct = addGCT(fee.jmd);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${colors.pill}`}>
          {fee.agencyName.length > 30 ? (fee.agency.toUpperCase()) : fee.agencyName}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {fee.service.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
      </h3>
      <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
        {fee.description}
      </p>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{formatJMD(fee.jmd)}</p>
          {fee.jmd > 0 && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              With GCT: {formatJMD(withGct)}
            </p>
          )}
        </div>
        {fee.note && (
          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-mute)] px-2 py-1 rounded-md max-w-[140px] text-right leading-tight">
            {fee.note}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Passport Calculator
// ---------------------------------------------------------------------------

function PassportCalculator() {
  const [type, setType] = useState<'new' | 'replacement'>('new');
  const [age, setAge] = useState<'adult' | 'minor'>('adult');
  const [speed, setSpeed] = useState<'standard' | 'rush_3day' | 'rush_1day' | 'same_day'>('standard');
  const [office, setOffice] = useState<'kingston' | 'regional'>('kingston');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const fee = getPassportFee({ type, age, speed, office });
      setResult(fee);
      setError(null);
    } catch (e) {
      setResult(null);
      setError((e as Error).message);
    }
  }, [type, age, speed, office]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as 'new' | 'replacement')}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="new">New Passport</option>
            <option value="replacement">Replacement</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Applicant</label>
          <select
            value={age}
            onChange={e => setAge(e.target.value as 'adult' | 'minor')}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="adult">Adult</option>
            <option value="minor">Minor</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Processing Speed</label>
          <select
            value={speed}
            onChange={e => setSpeed(e.target.value as 'standard' | 'rush_3day' | 'rush_1day' | 'same_day')}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="standard">Standard (7 days)</option>
            <option value="rush_3day">Rush (3 days)</option>
            <option value="rush_1day">Rush (1 day)</option>
            <option value="same_day">Same Day</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Office</label>
          <select
            value={office}
            onChange={e => setOffice(e.target.value as 'kingston' | 'regional')}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="kingston">Kingston</option>
            <option value="regional">Regional</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : result !== null ? (
        <div className="rounded-lg bg-[var(--brand-soft)] border border-[var(--brand)]/20 p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Passport Fee</p>
          <p className="text-2xl font-bold text-[var(--brand)]">{formatJMD(result)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">With GCT: {formatJMD(addGCT(result))}</p>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vehicle Registration Calculator
// ---------------------------------------------------------------------------

function VehicleCalculator() {
  const [cc, setCc] = useState(1500);

  let fee: number;
  try {
    fee = getVehicleRegistrationFee(cc);
  } catch {
    fee = 0;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
          Engine Displacement: <span className="font-bold text-[var(--text-primary)]">{cc.toLocaleString()} cc</span>
        </label>
        <input
          type="range"
          min={0}
          max={5000}
          step={50}
          value={cc}
          onChange={e => setCc(Number(e.target.value))}
          className="w-full h-2 bg-[var(--bg-mute)] rounded-full appearance-none cursor-pointer accent-[var(--brand)]"
        />
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
          <span>0 cc</span>
          <span>1,200 cc</span>
          <span>3,000 cc</span>
          <span>4,000 cc</span>
          <span>5,000 cc</span>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--brand-soft)] border border-[var(--brand)]/20 p-4">
        <p className="text-xs text-[var(--text-muted)] mb-1">24-Month Registration Fee</p>
        <p className="text-2xl font-bold text-[var(--brand)]">{formatJMD(fee)}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Bracket: {cc <= 1199 ? 'Up to 1,199 cc' : cc <= 2999 ? '1,200 - 2,999 cc' : cc <= 3999 ? '3,000 - 3,999 cc' : '4,000+ cc'}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Driver's Licence Calculator
// ---------------------------------------------------------------------------

function LicenceCalculator() {
  const [type, setType] = useState<'private' | 'general' | 'motorcycle'>('private');

  let fee: number;
  try {
    fee = getDriversLicenceFee(type);
  } catch {
    fee = 0;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Licence Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as 'private' | 'general' | 'motorcycle')}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
        >
          <option value="private">Private</option>
          <option value="general">General</option>
          <option value="motorcycle">Motorcycle</option>
        </select>
      </div>

      <div className="rounded-lg bg-[var(--brand-soft)] border border-[var(--brand)]/20 p-4">
        <p className="text-xs text-[var(--text-muted)] mb-1">Driver&apos;s Licence Fee</p>
        <p className="text-2xl font-bold text-[var(--brand)]">{formatJMD(fee)}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">With GCT: {formatJMD(addGCT(fee))}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TRN Validator
// ---------------------------------------------------------------------------

function TRNValidator() {
  const [input, setInput] = useState('');

  const raw = input.trim().replace(/-/g, '');
  const hasInput = raw.length > 0;
  const valid = hasInput ? isValidTRN(input) : null;
  const prefix8 = raw.length >= 8 ? raw.slice(0, 8) : null;
  const checkDigit = prefix8 ? getTRNCheckDigit(prefix8) : null;

  let formatted: string | null = null;
  try {
    if (raw.length === 9) {
      formatted = formatTRN(input);
    }
  } catch {
    formatted = null;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter a TRN (e.g. 123-456-789)"
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={11}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] pr-10"
        />
        {hasInput && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {valid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
      </div>

      {hasInput && (
        <div className={`rounded-lg border p-4 ${valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Valid</p>
              <p className={`font-semibold ${valid ? 'text-green-700' : 'text-red-700'}`}>
                {valid ? 'Yes' : 'No'}
              </p>
            </div>
            {formatted && (
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Formatted</p>
                <p className="font-mono font-semibold text-[var(--text-primary)]">{formatted}</p>
              </div>
            )}
            {checkDigit !== null && (
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Check Digit</p>
                <p className="font-mono font-semibold text-[var(--text-primary)]">{checkDigit}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Digits Entered</p>
              <p className="font-semibold text-[var(--text-primary)]">{raw.length} / 9</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Holiday Banner
// ---------------------------------------------------------------------------

function HolidayBanner() {
  const [processingDays, setProcessingDays] = useState(10);
  const nextHoliday = getNextHoliday();

  const today = new Date();
  const futureDate = new Date(today);
  let daysAdded = 0;
  while (daysAdded < processingDays) {
    futureDate.setDate(futureDate.getDate() + 1);
    const day = futureDate.getDay();
    if (day !== 0 && day !== 6) {
      daysAdded++;
    }
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const futureStr = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`;
  const workingDaysBetween = getWorkingDays(todayStr, futureStr);

  const estimatedDate = new Date(today);
  let wdCount = 0;
  while (wdCount < processingDays) {
    estimatedDate.setDate(estimatedDate.getDate() + 1);
    const dayStr = `${estimatedDate.getFullYear()}-${String(estimatedDate.getMonth() + 1).padStart(2, '0')}-${String(estimatedDate.getDate()).padStart(2, '0')}`;
    const day = estimatedDate.getDay();
    if (day !== 0 && day !== 6) {
      // Simple approximation using getWorkingDays for holiday awareness
      wdCount++;
    }
  }

  return (
    <div className="rounded-xl border border-[var(--brand)]/20 bg-gradient-to-r from-[var(--brand-soft)] to-transparent p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand)] flex items-center justify-center shrink-0">
          <CalendarIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          {nextHoliday ? (
            <>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Next Public Holiday</p>
              <p className="text-base font-semibold text-[var(--text-primary)]">{nextHoliday.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{nextHoliday.date}</p>
              {nextHoliday.note && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{nextHoliday.note}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No upcoming holidays found.</p>
          )}

          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Working Days Estimator</p>
            <div className="flex items-center gap-3">
              <label className="text-xs text-[var(--text-muted)] whitespace-nowrap">Processing days:</label>
              <input
                type="number"
                min={1}
                max={90}
                value={processingDays}
                onChange={e => setProcessingDays(Math.max(1, Math.min(90, Number(e.target.value))))}
                className="w-20 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
              />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              If you apply today, estimated completion in{' '}
              <span className="font-semibold text-[var(--brand)]">{workingDaysBetween} working days</span>{' '}
              (approx. {futureDate.toLocaleDateString('en-JM', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function GovServicesPortal() {
  const [query, setQuery] = useState('');
  const [activeAgencies, setActiveAgencies] = useState<Set<AgencyId>>(new Set());
  const [activeCalc, setActiveCalc] = useState<'passport' | 'vehicle' | 'licence' | null>(null);

  const agencies = useMemo(() => getAgencies(), []);
  const allFees = useMemo(() => getAllFees(), []);

  const filteredFees = useMemo(() => {
    let results: ServiceFee[];

    if (query.trim()) {
      results = searchFees(query.trim());
    } else {
      results = allFees;
    }

    if (activeAgencies.size > 0) {
      results = results.filter(f => activeAgencies.has(f.agency));
    }

    return results;
  }, [query, activeAgencies, allFees]);

  const toggleAgency = (id: AgencyId) => {
    setActiveAgencies(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Holiday Banner */}
      <HolidayBanner />

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search government services and fees..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Agency Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {agencies.map((agency: Agency) => {
          const isActive = activeAgencies.has(agency.id);
          const colors = AGENCY_COLORS[agency.id];
          return (
            <button
              key={agency.id}
              onClick={() => toggleAgency(agency.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                isActive
                  ? ACTIVE_PILL_COLORS[agency.id]
                  : colors?.pill ?? 'bg-gray-100 text-gray-700 border-gray-200'
              } hover:shadow-sm`}
            >
              {agency.acronym ?? agency.name}
            </button>
          );
        })}
        {activeAgencies.size > 0 && (
          <button
            onClick={() => setActiveAgencies(new Set())}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--text-muted)]">
        Showing {filteredFees.length} of {allFees.length} services
        {query && <> matching &ldquo;{query}&rdquo;</>}
        {activeAgencies.size > 0 && <> across {activeAgencies.size} {activeAgencies.size === 1 ? 'agency' : 'agencies'}</>}
      </p>

      {/* Fee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
        {filteredFees.map((fee, idx) => (
          <FeeCard key={`${fee.agency}-${fee.service}-${idx}`} fee={fee} />
        ))}
        {filteredFees.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-[var(--text-muted)] text-sm">No services found matching your criteria.</p>
            <button
              onClick={() => { setQuery(''); setActiveAgencies(new Set()); }}
              className="mt-3 text-sm text-[var(--brand)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Specialized Calculators */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Specialized Calculators</h2>

        {/* Tab buttons */}
        <div className="flex gap-2">
          {([
            { key: 'passport', label: 'Passport Fee' },
            { key: 'vehicle', label: 'Vehicle Registration' },
            { key: 'licence', label: "Driver's Licence" },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCalc(activeCalc === tab.key ? null : tab.key)}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                activeCalc === tab.key
                  ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeCalc === tab.key ? 'rotate-180' : ''}`} />
              </span>
            </button>
          ))}
        </div>

        {/* Active Calculator */}
        {activeCalc && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm">
            {activeCalc === 'passport' && (
              <>
                <h3 className="text-base font-semibold mb-4">Passport Fee Calculator</h3>
                <PassportCalculator />
              </>
            )}
            {activeCalc === 'vehicle' && (
              <>
                <h3 className="text-base font-semibold mb-4">Vehicle Registration Calculator</h3>
                <VehicleCalculator />
              </>
            )}
            {activeCalc === 'licence' && (
              <>
                <h3 className="text-base font-semibold mb-4">Driver&apos;s Licence Fee</h3>
                <LicenceCalculator />
              </>
            )}
          </div>
        )}
      </div>

      {/* TRN Validator */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">TRN Validator</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Validate a Jamaica Tax Registration Number (TRN). The check digit is verified using the weighted sum mod 11 algorithm.
          </p>
          <TRNValidator />
        </div>
      </div>
    </div>
  );
}
