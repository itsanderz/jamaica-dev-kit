// jamaica-banks — Jamaica banking institutions directory
// Commercial banks, building societies, credit unions, and branches

export type BankType = 'commercial' | 'merchant' | 'building-society' | 'credit-union';

export interface Bank {
  id: string;
  name: string;
  abbreviation: string;
  type: BankType;
  swift?: string;
  website?: string;
}

export interface Branch {
  name: string;
  bankId: string;
  parish: string;
  address?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const BANKS: readonly Bank[] = Object.freeze([
  // Commercial Banks (Bank of Jamaica Licensed)
  {
    id: 'ncb',
    name: 'National Commercial Bank',
    abbreviation: 'NCB',
    type: 'commercial' as const,
    swift: 'JABORJMK',
    website: 'https://www.jncb.com',
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank Jamaica',
    abbreviation: 'Scotia',
    type: 'commercial' as const,
    swift: 'NOSCJMKN',
    website: 'https://www.scotiabank.com/jm',
  },
  {
    id: 'jmmb',
    name: 'JMMB Bank (Jamaica)',
    abbreviation: 'JMMB',
    type: 'commercial' as const,
    swift: 'JMMBKMKN',
    website: 'https://www.jmmb.com',
  },
  {
    id: 'sagicor',
    name: 'Sagicor Bank Jamaica',
    abbreviation: 'Sagicor',
    type: 'commercial' as const,
    swift: 'SAJAJMKN',
    website: 'https://www.sagicorbank.com',
  },
  {
    id: 'fgb',
    name: 'First Global Bank',
    abbreviation: 'FGB',
    type: 'commercial' as const,
    swift: 'FGBLJMKN',
    website: 'https://www.firstglobal-bank.com',
  },
  {
    id: 'citibank',
    name: 'Citibank N.A.',
    abbreviation: 'Citi',
    type: 'commercial' as const,
    swift: 'CITIJMKX',
    website: 'https://www.citibank.com',
  },
  {
    id: 'bns',
    name: 'Bank of Nova Scotia Jamaica',
    abbreviation: 'BNS',
    type: 'commercial' as const,
    swift: 'NOSCJMKN',
  },

  // Merchant Banks
  {
    id: 'jn',
    name: 'JN Bank',
    abbreviation: 'JN',
    type: 'merchant' as const,
    swift: 'JNBSJMKN',
    website: 'https://www.jnbank.com',
  },

  // Building Societies
  {
    id: 'vm',
    name: 'VM Building Society',
    abbreviation: 'VM',
    type: 'building-society' as const,
    website: 'https://www.vmbs.com',
  },
  {
    id: 'jnbs',
    name: 'Jamaica National Building Society',
    abbreviation: 'JNBS',
    type: 'building-society' as const,
    website: 'https://www.jnbs.com',
  },

  // Credit Unions
  {
    id: 'cok',
    name: 'COK Sodality Co-operative Credit Union',
    abbreviation: 'COK',
    type: 'credit-union' as const,
    website: 'https://www.caborja.com',
  },
  {
    id: 'jtaccu',
    name: "Jamaica Teachers' Association Co-operative Credit Union",
    abbreviation: 'JTACCU',
    type: 'credit-union' as const,
  },
  {
    id: 'churches',
    name: 'Churches Co-operative Credit Union',
    abbreviation: 'Churches',
    type: 'credit-union' as const,
  },
  {
    id: 'cwj',
    name: 'C&WJ Co-operative Credit Union',
    abbreviation: 'C&WJ',
    type: 'credit-union' as const,
  },
]);

const BRANCHES: readonly Branch[] = Object.freeze([
  // NCB Branches
  { name: 'NCB Half Way Tree', bankId: 'ncb', parish: 'St. Andrew', address: 'Half Way Tree Road, Kingston 10' },
  { name: 'NCB New Kingston', bankId: 'ncb', parish: 'St. Andrew', address: '2 Knutsford Boulevard, Kingston 5' },
  { name: 'NCB King Street', bankId: 'ncb', parish: 'Kingston', address: '1-7 King Street, Kingston' },
  { name: 'NCB Spanish Town', bankId: 'ncb', parish: 'St. Catherine', address: 'Burke Road, Spanish Town' },
  { name: 'NCB Montego Bay', bankId: 'ncb', parish: 'St. James', address: 'Sam Sharpe Square, Montego Bay' },
  { name: 'NCB May Pen', bankId: 'ncb', parish: 'Clarendon', address: 'Main Street, May Pen' },
  { name: 'NCB Mandeville', bankId: 'ncb', parish: 'Manchester', address: 'Manchester Shopping Centre, Mandeville' },
  { name: 'NCB Ocho Rios', bankId: 'ncb', parish: 'St. Ann', address: 'Main Street, Ocho Rios' },
  { name: 'NCB Savanna-la-Mar', bankId: 'ncb', parish: 'Westmoreland', address: 'Great George Street, Savanna-la-Mar' },
  { name: 'NCB Port Antonio', bankId: 'ncb', parish: 'Portland', address: 'West Street, Port Antonio' },

  // Scotiabank Branches
  { name: 'Scotiabank Half Way Tree', bankId: 'scotiabank', parish: 'St. Andrew', address: 'Half Way Tree Road, Kingston 10' },
  { name: 'Scotiabank Duke Street', bankId: 'scotiabank', parish: 'Kingston', address: 'Duke Street, Kingston' },
  { name: 'Scotiabank Liguanea', bankId: 'scotiabank', parish: 'St. Andrew', address: '125-127 Old Hope Road, Kingston 6' },
  { name: 'Scotiabank Portmore', bankId: 'scotiabank', parish: 'St. Catherine', address: 'Portmore Town Centre' },
  { name: 'Scotiabank Montego Bay', bankId: 'scotiabank', parish: 'St. James', address: '6 Sam Sharpe Square, Montego Bay' },
  { name: 'Scotiabank Mandeville', bankId: 'scotiabank', parish: 'Manchester', address: '9 Manchester Road, Mandeville' },
  { name: 'Scotiabank Ocho Rios', bankId: 'scotiabank', parish: 'St. Ann', address: 'Main Street, Ocho Rios' },

  // JN Bank Branches
  { name: 'JN Half Way Tree', bankId: 'jn', parish: 'St. Andrew', address: '2 Belmont Road, Kingston 5' },
  { name: 'JN Duke Street', bankId: 'jn', parish: 'Kingston', address: 'Duke Street, Kingston' },
  { name: 'JN Portmore', bankId: 'jn', parish: 'St. Catherine', address: 'Portmore Town Centre' },
  { name: 'JN Montego Bay', bankId: 'jn', parish: 'St. James', address: 'Montego Bay' },
  { name: 'JN Mandeville', bankId: 'jn', parish: 'Manchester', address: 'Mandeville' },
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return all banks. */
export function getBanks(): Bank[] {
  return [...BANKS];
}

/** Look up a bank by its id or name (case-insensitive). Returns null when not found. */
export function getBank(idOrName: string): Bank | null {
  const needle = idOrName.toLowerCase();
  return (
    BANKS.find(
      (b) => b.id === needle || b.name.toLowerCase() === needle,
    ) ?? null
  );
}

/** Return all banks of the given type. */
export function getBanksByType(type: BankType): Bank[] {
  return BANKS.filter((b) => b.type === type);
}

/** Shorthand for `getBanksByType('commercial')`. */
export function getCommercialBanks(): Bank[] {
  return getBanksByType('commercial');
}

/** Return all branches across all banks. */
export function getBranches(): Branch[] {
  return [...BRANCHES];
}

/** Return branches belonging to a specific bank. */
export function getBankBranches(bankId: string): Branch[] {
  const id = bankId.toLowerCase();
  return BRANCHES.filter((b) => b.bankId === id);
}

/** Return branches located in the given parish (case-insensitive). */
export function getBranchesByParish(parish: string): Branch[] {
  const needle = parish.toLowerCase();
  return BRANCHES.filter((b) => b.parish.toLowerCase() === needle);
}

/** Return the SWIFT / BIC code for a bank, or null if unavailable. */
export function getSwiftCode(bankId: string): string | null {
  const bank = getBank(bankId);
  return bank?.swift ?? null;
}

/** Case-insensitive search across bank name and abbreviation. */
export function searchBanks(query: string): Bank[] {
  const needle = query.toLowerCase();
  return BANKS.filter(
    (b) =>
      b.name.toLowerCase().includes(needle) ||
      b.abbreviation.toLowerCase().includes(needle) ||
      b.id.includes(needle),
  );
}

/** Return the total number of banks in the directory. */
export function getBankCount(): number {
  return BANKS.length;
}

/** Return the total number of branches in the directory. */
export function getBranchCount(): number {
  return BRANCHES.length;
}
