/**
 * jamaica-open-data — Client for the Jamaica Open Data Portal (data.gov.jm).
 *
 * Provides typed access to the DKAN/CKAN datastore API for searching
 * datasets, fetching resources, and querying structured data.
 */

/* eslint-disable no-var */
declare var AbortController: { new(): { signal: unknown; abort(): void } };
declare function setTimeout(cb: () => void, ms: number): unknown;
declare function clearTimeout(id: unknown): void;
declare var URLSearchParams: { new(init?: Record<string, string>): { toString(): string; set(key: string, value: string): void } };
/* eslint-enable no-var */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Dataset {
  /** Dataset ID (UUID) */
  id: string;
  /** URL-friendly name */
  name: string;
  /** Display title */
  title: string;
  /** Description of the dataset */
  description: string;
  /** Data resources (files/APIs) */
  resources: Resource[];
  /** Tags/keywords */
  tags: Tag[];
  /** Organization/publisher */
  organization: Organization | null;
  /** License identifier */
  license: string;
  /** When the dataset was last modified */
  modified: string;
}

export interface Resource {
  /** Resource ID (UUID) */
  id: string;
  /** Resource name */
  name: string;
  /** Description */
  description: string;
  /** File format (CSV, XLS, JSON, etc.) */
  format: string;
  /** Download URL */
  url: string;
  /** File size in bytes */
  size: number;
}

export interface Tag {
  /** Tag name */
  name: string;
}

export interface Organization {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Display title */
  title: string;
}

export interface DatastoreSearchResult<T = Record<string, unknown>> {
  /** Array of data records */
  records: T[];
  /** Field definitions */
  fields: DatastoreField[];
  /** Total number of matching records */
  total: number;
  /** Resource ID queried */
  resourceId: string;
}

export interface DatastoreField {
  /** Field/column name */
  id: string;
  /** Data type (text, int, float, etc.) */
  type: string;
}

export interface SearchOptions {
  /** Maximum number of records to return (default: 100) */
  limit?: number;
  /** Number of records to skip (default: 0) */
  offset?: number;
  /** Filter conditions as key-value pairs */
  filters?: Record<string, string | number>;
  /** Full-text search query */
  query?: string;
  /** Field to sort by */
  sort?: string;
}

/** A fetch-compatible function signature */
export type FetchFn = (url: string, init?: Record<string, unknown>) => Promise<{ ok: boolean; status: number; text: () => Promise<string>; json: () => Promise<unknown> }>;

export interface ClientOptions {
  /** Base URL for the portal (default: "https://data.gov.jm") */
  baseUrl?: string;
  /** Custom fetch function */
  fetchFn?: FetchFn;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Known dataset IDs (pre-mapped for convenience)
// ---------------------------------------------------------------------------

/** Well-known dataset names on data.gov.jm */
export const DATASETS = {
  HEALTH_FACILITIES: 'health-facilities',
  CONSUMER_PRICES: 'consumer-prices',
  GDP_QUARTERLY: 'quarterly-gross-domestic-product-gdp',
  GDP_ANNUAL: 'annual-gross-domestic-product-gdp',
  INTEREST_RATES: 'interest-rates',
  NATIONAL_CONTRACTS: 'national-contracts',
  PUBLIC_FINANCE: 'public-finance',
  PUBLIC_DEBT: 'public-debt',
  CRIME_STATISTICS: 'crashes-and-road-accident-fatalities',
  ENERGY: 'energy-tables',
  ENROLLMENT: 'enrollment-parish',
  BUDGET: 'budget',
  CONSUMER_GROCERY_PRICES: 'consumer-grocery-prices',
  CONSUMER_PETROL_PRICES: 'consumer-petrol-prices',
  PARCEL_DATA: 'parcel-data',
  SURVEILLANCE_DATA: 'surveillance-data',
  VISITORS: 'visitors-country',
  FARMER_REPORTS: 'farmer-reports',
} as const;

/** Well-known resource IDs for commonly accessed datastore resources */
export const RESOURCES = {
  /** Health Centres with Geospatial information */
  HEALTH_CENTRES_GEO: '9bac5276-5a25-41f2-b8ea-fe38d7eb3646',
} as const;

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * Create a Jamaica Open Data Portal client.
 *
 * @example
 * ```typescript
 * const client = createOpenDataClient();
 *
 * // List all datasets
 * const datasets = await client.listDatasets();
 *
 * // Get a specific dataset
 * const health = await client.getDataset('health-facilities');
 *
 * // Query the datastore
 * const results = await client.search(RESOURCES.HEALTH_CENTRES_GEO, {
 *   limit: 10,
 *   filters: { PARISH: 'Kingston' },
 * });
 * ```
 */
export function createOpenDataClient(options: ClientOptions = {}) {
  const {
    baseUrl = 'https://data.gov.jm',
    fetchFn = typeof (globalThis as any).fetch === 'function' ? (globalThis as any).fetch as FetchFn : undefined,
    timeout = 30000,
  } = options;

  async function request<T>(path: string): Promise<T> {
    if (!fetchFn) {
      throw new Error('No fetch function available. Pass a custom fetchFn in options or use Node 18+.');
    }

    const url = `${baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetchFn(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'jamaica-open-data/0.1.0',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Open Data API error: HTTP ${response.status} for ${path}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    /**
     * List all dataset names on the portal.
     */
    async listDatasets(): Promise<string[]> {
      const data = await request<{ success: boolean; result: string[] }>('/api/3/action/package_list');
      if (!data.success) throw new Error('Failed to list datasets');
      return data.result;
    },

    /**
     * Get metadata for a specific dataset.
     */
    async getDataset(nameOrId: string): Promise<Dataset> {
      const data = await request<{ success: boolean; result: any }>(
        `/api/3/action/package_show?id=${encodeURIComponent(nameOrId)}`,
      );
      if (!data.success) throw new Error(`Dataset not found: ${nameOrId}`);

      const raw = data.result;
      return {
        id: raw.id,
        name: raw.name,
        title: raw.title,
        description: raw.description || raw.notes || '',
        resources: (raw.resources || []).map((r: any) => ({
          id: r.id,
          name: r.name || r.description || '',
          description: r.description || '',
          format: r.format || '',
          url: r.url || '',
          size: r.size || 0,
        })),
        tags: (raw.tags || []).map((t: any) => ({ name: t.name || t.display_name || '' })),
        organization: raw.organization
          ? {
              id: raw.organization.id,
              name: raw.organization.name,
              title: raw.organization.title,
            }
          : null,
        license: raw.license_id || raw.license_title || '',
        modified: raw.metadata_modified || raw.revision_timestamp || '',
      };
    },

    /**
     * Search the datastore for a specific resource.
     *
     * @example
     * ```typescript
     * const results = await client.search('9bac5276-...', {
     *   limit: 10,
     *   filters: { PARISH: 'Kingston' },
     * });
     * ```
     */
    async search<T = Record<string, unknown>>(
      resourceId: string,
      options: SearchOptions = {},
    ): Promise<DatastoreSearchResult<T>> {
      const { limit = 100, offset = 0, filters, query, sort } = options;

      const params = new URLSearchParams();
      params.set('resource_id', resourceId);
      params.set('limit', String(limit));
      params.set('offset', String(offset));

      if (filters) {
        params.set('filters', JSON.stringify(filters));
      }
      if (query) {
        params.set('q', query);
      }
      if (sort) {
        params.set('sort', sort);
      }

      const data = await request<{
        success: boolean;
        result: {
          records: T[];
          fields: DatastoreField[];
          total: number;
          resource_id: string[];
        };
      }>(`/api/action/datastore/search.json?${params.toString()}`);

      if (!data.success) throw new Error(`Datastore search failed for resource: ${resourceId}`);

      return {
        records: data.result.records,
        fields: data.result.fields,
        total: data.result.total,
        resourceId,
      };
    },

    /**
     * Fetch all records from a resource by paginating automatically.
     * Use with caution for large datasets.
     */
    async fetchAll<T = Record<string, unknown>>(
      resourceId: string,
      options: Omit<SearchOptions, 'limit' | 'offset'> = {},
    ): Promise<T[]> {
      const pageSize = 500;
      const allRecords: T[] = [];
      let offset = 0;

      while (true) {
        const result = await this.search<T>(resourceId, {
          ...options,
          limit: pageSize,
          offset,
        });

        allRecords.push(...result.records);

        if (allRecords.length >= result.total || result.records.length < pageSize) {
          break;
        }

        offset += pageSize;
      }

      return allRecords;
    },

    /**
     * Get the number of records in a resource.
     */
    async getRecordCount(resourceId: string): Promise<number> {
      const result = await this.search(resourceId, { limit: 0 });
      return result.total;
    },
  };
}

// ---------------------------------------------------------------------------
// Convenience functions (use a default client)
// ---------------------------------------------------------------------------

let defaultClient: ReturnType<typeof createOpenDataClient> | null = null;

function getDefaultClient(): ReturnType<typeof createOpenDataClient> {
  if (!defaultClient) {
    defaultClient = createOpenDataClient();
  }
  return defaultClient;
}

/**
 * List all dataset names on data.gov.jm.
 *
 * @example
 * ```typescript
 * const datasets = await listDatasets();
 * // ["national-contracts", "consumer-prices", ...]
 * ```
 */
export async function listDatasets(): Promise<string[]> {
  return getDefaultClient().listDatasets();
}

/**
 * Get metadata for a specific dataset.
 *
 * @example
 * ```typescript
 * const ds = await getDataset('health-facilities');
 * console.log(ds.title, ds.resources.length);
 * ```
 */
export async function getDataset(nameOrId: string): Promise<Dataset> {
  return getDefaultClient().getDataset(nameOrId);
}

/**
 * Search the datastore for records in a resource.
 *
 * @example
 * ```typescript
 * const { records, total } = await searchDatastore(RESOURCES.HEALTH_CENTRES_GEO, {
 *   filters: { PARISH: 'Kingston' },
 *   limit: 10,
 * });
 * ```
 */
export async function searchDatastore<T = Record<string, unknown>>(
  resourceId: string,
  options?: SearchOptions,
): Promise<DatastoreSearchResult<T>> {
  return getDefaultClient().search<T>(resourceId, options);
}

/**
 * Fetch all records from a resource.
 */
export async function fetchAllRecords<T = Record<string, unknown>>(
  resourceId: string,
  options?: Omit<SearchOptions, 'limit' | 'offset'>,
): Promise<T[]> {
  return getDefaultClient().fetchAll<T>(resourceId, options);
}

// ---------------------------------------------------------------------------
// Pre-built queries for common datasets
// ---------------------------------------------------------------------------

/** Health centre record from the geospatial dataset */
export interface HealthCentreRecord {
  CEN_NAME: string;
  PARISH: string;
  HEALTH_ARE: string;
  FACIL_TYPE: string;
  CENT_TYPE: number;
  ADDRESS: string;
  TELEPHONE: string;
  Latitude: string;
  Longitude: string;
}

/**
 * Fetch health centres with geospatial data.
 *
 * @example
 * ```typescript
 * const centres = await getHealthCentres({ parish: 'Kingston' });
 * ```
 */
export async function getHealthCentres(options?: {
  parish?: string;
  limit?: number;
}): Promise<HealthCentreRecord[]> {
  const filters: Record<string, string> = {};
  if (options?.parish) filters.PARISH = options.parish;

  const result = await searchDatastore<HealthCentreRecord>(RESOURCES.HEALTH_CENTRES_GEO, {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    limit: options?.limit || 500,
  });

  return result.records;
}
