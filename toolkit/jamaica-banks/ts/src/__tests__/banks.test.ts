import { describe, it, expect } from 'vitest';
import {
  getBanks,
  getBank,
  getBanksByType,
  getCommercialBanks,
  getBranches,
  getBankBranches,
  getBranchesByParish,
  getSwiftCode,
  searchBanks,
  getBankCount,
  getBranchCount,
  type Bank,
  type Branch,
  type BankType,
} from '../index';

// ---------------------------------------------------------------------------
// getBanks
// ---------------------------------------------------------------------------
describe('getBanks', () => {
  it('returns an array of all banks', () => {
    const banks = getBanks();
    expect(Array.isArray(banks)).toBe(true);
    expect(banks.length).toBe(14);
  });

  it('returns a fresh copy each time (not the same reference)', () => {
    const a = getBanks();
    const b = getBanks();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('each bank has required fields', () => {
    for (const bank of getBanks()) {
      expect(bank).toHaveProperty('id');
      expect(bank).toHaveProperty('name');
      expect(bank).toHaveProperty('abbreviation');
      expect(bank).toHaveProperty('type');
      expect(typeof bank.id).toBe('string');
      expect(typeof bank.name).toBe('string');
      expect(typeof bank.abbreviation).toBe('string');
      expect(['commercial', 'merchant', 'building-society', 'credit-union']).toContain(bank.type);
    }
  });
});

// ---------------------------------------------------------------------------
// getBank
// ---------------------------------------------------------------------------
describe('getBank', () => {
  it('finds NCB by id', () => {
    const bank = getBank('ncb');
    expect(bank).not.toBeNull();
    expect(bank!.name).toBe('National Commercial Bank');
    expect(bank!.abbreviation).toBe('NCB');
    expect(bank!.type).toBe('commercial');
    expect(bank!.swift).toBe('JABORJMK');
    expect(bank!.website).toBe('https://www.jncb.com');
  });

  it('finds Scotiabank by id', () => {
    const bank = getBank('scotiabank');
    expect(bank).not.toBeNull();
    expect(bank!.name).toBe('Scotiabank Jamaica');
    expect(bank!.swift).toBe('NOSCJMKN');
  });

  it('finds a bank by name (case-insensitive)', () => {
    const bank = getBank('national commercial bank');
    expect(bank).not.toBeNull();
    expect(bank!.id).toBe('ncb');
  });

  it('finds a bank by name with mixed case', () => {
    const bank = getBank('SAGICOR BANK JAMAICA');
    expect(bank).not.toBeNull();
    expect(bank!.id).toBe('sagicor');
  });

  it('returns null for unknown bank', () => {
    expect(getBank('nonexistent')).toBeNull();
    expect(getBank('')).toBeNull();
  });

  it('finds each bank by id', () => {
    const ids = ['ncb', 'scotiabank', 'jmmb', 'sagicor', 'fgb', 'citibank', 'bns', 'jn', 'vm', 'jnbs', 'cok', 'jtaccu', 'churches', 'cwj'];
    for (const id of ids) {
      expect(getBank(id)).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// getBanksByType
// ---------------------------------------------------------------------------
describe('getBanksByType', () => {
  it('returns commercial banks', () => {
    const banks = getBanksByType('commercial');
    expect(banks.length).toBe(7);
    for (const b of banks) {
      expect(b.type).toBe('commercial');
    }
  });

  it('returns merchant banks', () => {
    const banks = getBanksByType('merchant');
    expect(banks.length).toBe(1);
    expect(banks[0]!.id).toBe('jn');
  });

  it('returns building societies', () => {
    const banks = getBanksByType('building-society');
    expect(banks.length).toBe(2);
    for (const b of banks) {
      expect(b.type).toBe('building-society');
    }
  });

  it('returns credit unions', () => {
    const banks = getBanksByType('credit-union');
    expect(banks.length).toBe(4);
    for (const b of banks) {
      expect(b.type).toBe('credit-union');
    }
  });

  it('returns empty array for nonexistent type', () => {
    // @ts-expect-error — intentionally testing invalid input
    expect(getBanksByType('invalid')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getCommercialBanks
// ---------------------------------------------------------------------------
describe('getCommercialBanks', () => {
  it('is equivalent to getBanksByType("commercial")', () => {
    expect(getCommercialBanks()).toEqual(getBanksByType('commercial'));
  });

  it('returns 7 commercial banks', () => {
    expect(getCommercialBanks().length).toBe(7);
  });

  it('includes NCB and Scotiabank', () => {
    const ids = getCommercialBanks().map((b) => b.id);
    expect(ids).toContain('ncb');
    expect(ids).toContain('scotiabank');
  });
});

// ---------------------------------------------------------------------------
// getBranches
// ---------------------------------------------------------------------------
describe('getBranches', () => {
  it('returns all branches', () => {
    const branches = getBranches();
    expect(Array.isArray(branches)).toBe(true);
    expect(branches.length).toBe(22);
  });

  it('returns a fresh copy each time', () => {
    const a = getBranches();
    const b = getBranches();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('each branch has required fields', () => {
    for (const branch of getBranches()) {
      expect(branch).toHaveProperty('name');
      expect(branch).toHaveProperty('bankId');
      expect(branch).toHaveProperty('parish');
      expect(typeof branch.name).toBe('string');
      expect(typeof branch.bankId).toBe('string');
      expect(typeof branch.parish).toBe('string');
    }
  });
});

// ---------------------------------------------------------------------------
// getBankBranches
// ---------------------------------------------------------------------------
describe('getBankBranches', () => {
  it('returns 10 NCB branches', () => {
    const branches = getBankBranches('ncb');
    expect(branches.length).toBe(10);
    for (const b of branches) {
      expect(b.bankId).toBe('ncb');
    }
  });

  it('returns 7 Scotiabank branches', () => {
    const branches = getBankBranches('scotiabank');
    expect(branches.length).toBe(7);
    for (const b of branches) {
      expect(b.bankId).toBe('scotiabank');
    }
  });

  it('returns 5 JN Bank branches', () => {
    const branches = getBankBranches('jn');
    expect(branches.length).toBe(5);
    for (const b of branches) {
      expect(b.bankId).toBe('jn');
    }
  });

  it('returns empty array for bank with no branches', () => {
    expect(getBankBranches('citibank')).toEqual([]);
  });

  it('returns empty array for unknown bank', () => {
    expect(getBankBranches('nonexistent')).toEqual([]);
  });

  it('is case-insensitive', () => {
    expect(getBankBranches('NCB')).toEqual(getBankBranches('ncb'));
  });
});

// ---------------------------------------------------------------------------
// getBranchesByParish
// ---------------------------------------------------------------------------
describe('getBranchesByParish', () => {
  it('returns branches in St. Andrew', () => {
    const branches = getBranchesByParish('St. Andrew');
    expect(branches.length).toBeGreaterThan(0);
    for (const b of branches) {
      expect(b.parish).toBe('St. Andrew');
    }
  });

  it('returns branches in Kingston', () => {
    const branches = getBranchesByParish('Kingston');
    expect(branches.length).toBeGreaterThan(0);
    for (const b of branches) {
      expect(b.parish).toBe('Kingston');
    }
  });

  it('is case-insensitive', () => {
    expect(getBranchesByParish('st. andrew')).toEqual(getBranchesByParish('St. Andrew'));
  });

  it('returns branches in St. James (Montego Bay area)', () => {
    const branches = getBranchesByParish('St. James');
    expect(branches.length).toBeGreaterThanOrEqual(3); // NCB, Scotiabank, JN
  });

  it('returns empty for parish with no branches', () => {
    expect(getBranchesByParish('St. Thomas')).toEqual([]);
  });

  it('returns branches in Manchester', () => {
    const branches = getBranchesByParish('Manchester');
    expect(branches.length).toBeGreaterThanOrEqual(3); // NCB, Scotiabank, JN
  });
});

// ---------------------------------------------------------------------------
// getSwiftCode
// ---------------------------------------------------------------------------
describe('getSwiftCode', () => {
  it('returns SWIFT code for NCB', () => {
    expect(getSwiftCode('ncb')).toBe('JABORJMK');
  });

  it('returns SWIFT code for Scotiabank', () => {
    expect(getSwiftCode('scotiabank')).toBe('NOSCJMKN');
  });

  it('returns SWIFT code for JMMB', () => {
    expect(getSwiftCode('jmmb')).toBe('JMMBKMKN');
  });

  it('returns SWIFT code for Sagicor', () => {
    expect(getSwiftCode('sagicor')).toBe('SAJAJMKN');
  });

  it('returns SWIFT code for FGB', () => {
    expect(getSwiftCode('fgb')).toBe('FGBLJMKN');
  });

  it('returns SWIFT code for Citibank', () => {
    expect(getSwiftCode('citibank')).toBe('CITIJMKX');
  });

  it('returns SWIFT code for JN Bank', () => {
    expect(getSwiftCode('jn')).toBe('JNBSJMKN');
  });

  it('returns null for bank without SWIFT code', () => {
    expect(getSwiftCode('vm')).toBeNull();
    expect(getSwiftCode('cok')).toBeNull();
  });

  it('returns null for unknown bank', () => {
    expect(getSwiftCode('nonexistent')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// searchBanks
// ---------------------------------------------------------------------------
describe('searchBanks', () => {
  it('finds NCB by abbreviation', () => {
    const results = searchBanks('NCB');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((b) => b.id === 'ncb')).toBe(true);
  });

  it('finds banks by partial name', () => {
    const results = searchBanks('Scotia');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((b) => b.id === 'scotiabank')).toBe(true);
  });

  it('is case-insensitive', () => {
    const upper = searchBanks('SAGICOR');
    const lower = searchBanks('sagicor');
    expect(upper).toEqual(lower);
    expect(upper.length).toBeGreaterThanOrEqual(1);
  });

  it('returns empty array for no matches', () => {
    expect(searchBanks('xyznotabank')).toEqual([]);
  });

  it('finds credit unions by name fragment', () => {
    const results = searchBanks('Credit Union');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('finds JMMB by abbreviation', () => {
    const results = searchBanks('JMMB');
    expect(results.some((b) => b.id === 'jmmb')).toBe(true);
  });

  it('finds bank by id substring', () => {
    const results = searchBanks('citi');
    expect(results.some((b) => b.id === 'citibank')).toBe(true);
  });

  it('finds "Jamaica" across multiple banks', () => {
    const results = searchBanks('Jamaica');
    // NCB does not have "Jamaica" in name but Scotiabank Jamaica, JMMB Bank (Jamaica), Sagicor Bank Jamaica, etc.
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('finds VM by abbreviation', () => {
    const results = searchBanks('VM');
    expect(results.some((b) => b.id === 'vm')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getBankCount
// ---------------------------------------------------------------------------
describe('getBankCount', () => {
  it('returns 14', () => {
    expect(getBankCount()).toBe(14);
  });

  it('matches the length of getBanks()', () => {
    expect(getBankCount()).toBe(getBanks().length);
  });
});

// ---------------------------------------------------------------------------
// getBranchCount
// ---------------------------------------------------------------------------
describe('getBranchCount', () => {
  it('returns 22', () => {
    expect(getBranchCount()).toBe(22);
  });

  it('matches the length of getBranches()', () => {
    expect(getBranchCount()).toBe(getBranches().length);
  });
});

// ---------------------------------------------------------------------------
// Data integrity
// ---------------------------------------------------------------------------
describe('data integrity', () => {
  it('all branch bankIds reference a valid bank', () => {
    const bankIds = new Set(getBanks().map((b) => b.id));
    for (const branch of getBranches()) {
      expect(bankIds.has(branch.bankId)).toBe(true);
    }
  });

  it('all bank ids are unique', () => {
    const banks = getBanks();
    const ids = banks.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all SWIFT codes are uppercase and 8 or 11 characters', () => {
    for (const bank of getBanks()) {
      if (bank.swift) {
        expect(bank.swift).toBe(bank.swift.toUpperCase());
        expect([8, 11]).toContain(bank.swift.length);
      }
    }
  });

  it('all websites start with https://', () => {
    for (const bank of getBanks()) {
      if (bank.website) {
        expect(bank.website.startsWith('https://')).toBe(true);
      }
    }
  });

  it('commercial banks all have SWIFT codes', () => {
    for (const bank of getCommercialBanks()) {
      expect(bank.swift).toBeDefined();
      expect(typeof bank.swift).toBe('string');
    }
  });

  it('bank type distribution is correct', () => {
    expect(getBanksByType('commercial').length).toBe(7);
    expect(getBanksByType('merchant').length).toBe(1);
    expect(getBanksByType('building-society').length).toBe(2);
    expect(getBanksByType('credit-union').length).toBe(4);
  });
});
