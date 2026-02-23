import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createOpenDataClient,
  listDatasets,
  getDataset,
  searchDatastore,
  DATASETS,
  RESOURCES,
} from '../index';

// ---------------------------------------------------------------------------
// Mock fetch helper
// ---------------------------------------------------------------------------
function createMockFetch(responses: Record<string, any> = {}) {
  return vi.fn().mockImplementation((url: string) => {
    for (const [pattern, data] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(data),
        });
      }
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ success: false }),
    });
  });
}

const mockPackageList = {
  success: true,
  result: ['health-facilities', 'consumer-prices', 'interest-rates'],
};

const mockPackageShow = {
  success: true,
  result: {
    id: 'abc-123',
    name: 'health-facilities',
    title: 'Health Facilities',
    description: 'Health centres and hospitals in Jamaica',
    resources: [
      {
        id: 'res-001',
        name: 'Health Centres',
        description: 'Health centres with geospatial info',
        format: 'CSV',
        url: 'https://data.gov.jm/download/health.csv',
        size: 12345,
      },
    ],
    tags: [{ name: 'health' }, { name: 'facilities' }],
    organization: {
      id: 'org-001',
      name: 'moh',
      title: 'Ministry of Health',
    },
    license_id: 'ODC-BY',
    metadata_modified: '2024-01-15T10:00:00Z',
  },
};

const mockDatastoreSearch = {
  success: true,
  result: {
    records: [
      {
        CEN_NAME: 'Kingston Health Centre',
        PARISH: 'Kingston',
        HEALTH_ARE: 'KSA',
        ADDRESS: '10 North Street',
        TELEPHONE: '876-922-1234',
        Latitude: '18.0',
        Longitude: '-76.8',
      },
      {
        CEN_NAME: 'Spanish Town Health Centre',
        PARISH: 'St. Catherine',
        HEALTH_ARE: 'SCA',
        ADDRESS: '5 Main Street',
        TELEPHONE: '876-984-5678',
        Latitude: '18.01',
        Longitude: '-76.95',
      },
    ],
    fields: [
      { id: 'CEN_NAME', type: 'text' },
      { id: 'PARISH', type: 'text' },
      { id: 'HEALTH_ARE', type: 'text' },
      { id: 'ADDRESS', type: 'text' },
      { id: 'TELEPHONE', type: 'text' },
      { id: 'Latitude', type: 'text' },
      { id: 'Longitude', type: 'text' },
    ],
    total: 345,
    resource_id: ['9bac5276-5a25-41f2-b8ea-fe38d7eb3646'],
  },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
describe('DATASETS', () => {
  it('has health facilities', () => {
    expect(DATASETS.HEALTH_FACILITIES).toBe('health-facilities');
  });

  it('has consumer prices', () => {
    expect(DATASETS.CONSUMER_PRICES).toBe('consumer-prices');
  });

  it('has interest rates', () => {
    expect(DATASETS.INTEREST_RATES).toBe('interest-rates');
  });

  it('has GDP datasets', () => {
    expect(DATASETS.GDP_QUARTERLY).toBe('quarterly-gross-domestic-product-gdp');
    expect(DATASETS.GDP_ANNUAL).toBe('annual-gross-domestic-product-gdp');
  });
});

describe('RESOURCES', () => {
  it('has health centres geo resource ID', () => {
    expect(RESOURCES.HEALTH_CENTRES_GEO).toBe('9bac5276-5a25-41f2-b8ea-fe38d7eb3646');
  });
});

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
describe('createOpenDataClient', () => {
  describe('listDatasets', () => {
    it('returns dataset names', async () => {
      const fetchFn = createMockFetch({ package_list: mockPackageList });
      const client = createOpenDataClient({ fetchFn });

      const datasets = await client.listDatasets();
      expect(datasets).toEqual(['health-facilities', 'consumer-prices', 'interest-rates']);
    });

    it('throws on failure', async () => {
      const fetchFn = createMockFetch({
        package_list: { success: false, result: [] },
      });
      const client = createOpenDataClient({ fetchFn });

      await expect(client.listDatasets()).rejects.toThrow('Failed to list datasets');
    });
  });

  describe('getDataset', () => {
    it('returns dataset metadata', async () => {
      const fetchFn = createMockFetch({ package_show: mockPackageShow });
      const client = createOpenDataClient({ fetchFn });

      const ds = await client.getDataset('health-facilities');
      expect(ds.id).toBe('abc-123');
      expect(ds.name).toBe('health-facilities');
      expect(ds.title).toBe('Health Facilities');
      expect(ds.resources.length).toBe(1);
      expect(ds.resources[0].format).toBe('CSV');
      expect(ds.tags.length).toBe(2);
      expect(ds.organization?.title).toBe('Ministry of Health');
      expect(ds.license).toBe('ODC-BY');
    });

    it('handles missing organization', async () => {
      const fetchFn = createMockFetch({
        package_show: {
          success: true,
          result: { ...mockPackageShow.result, organization: null },
        },
      });
      const client = createOpenDataClient({ fetchFn });

      const ds = await client.getDataset('health-facilities');
      expect(ds.organization).toBeNull();
    });

    it('throws on dataset not found', async () => {
      const fetchFn = createMockFetch({});
      const client = createOpenDataClient({ fetchFn });

      await expect(client.getDataset('nonexistent')).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('returns search results', async () => {
      const fetchFn = createMockFetch({ 'datastore/search': mockDatastoreSearch });
      const client = createOpenDataClient({ fetchFn });

      const result = await client.search('9bac5276-...');
      expect(result.records.length).toBe(2);
      expect(result.total).toBe(345);
      expect(result.fields.length).toBe(7);
    });

    it('passes limit and offset', async () => {
      const fetchFn = createMockFetch({ 'datastore/search': mockDatastoreSearch });
      const client = createOpenDataClient({ fetchFn });

      await client.search('resource-id', { limit: 10, offset: 20 });
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object),
      );
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('offset=20'),
        expect.any(Object),
      );
    });

    it('passes filters as JSON', async () => {
      const fetchFn = createMockFetch({ 'datastore/search': mockDatastoreSearch });
      const client = createOpenDataClient({ fetchFn });

      await client.search('resource-id', { filters: { PARISH: 'Kingston' } });
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('filters='),
        expect.any(Object),
      );
    });

    it('passes query parameter', async () => {
      const fetchFn = createMockFetch({ 'datastore/search': mockDatastoreSearch });
      const client = createOpenDataClient({ fetchFn });

      await client.search('resource-id', { query: 'health' });
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('q=health'),
        expect.any(Object),
      );
    });
  });

  describe('getRecordCount', () => {
    it('returns total count', async () => {
      const fetchFn = createMockFetch({ 'datastore/search': mockDatastoreSearch });
      const client = createOpenDataClient({ fetchFn });

      const count = await client.getRecordCount('resource-id');
      expect(count).toBe(345);
    });
  });

  describe('fetchAll', () => {
    it('paginates through all records', async () => {
      const page1 = {
        success: true,
        result: {
          records: Array(500).fill({ CEN_NAME: 'Test' }),
          fields: [{ id: 'CEN_NAME', type: 'text' }],
          total: 600,
          resource_id: ['test'],
        },
      };
      const page2 = {
        success: true,
        result: {
          records: Array(100).fill({ CEN_NAME: 'Test' }),
          fields: [{ id: 'CEN_NAME', type: 'text' }],
          total: 600,
          resource_id: ['test'],
        },
      };

      let callCount = 0;
      const fetchFn = vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(callCount === 1 ? page1 : page2),
        });
      });

      const client = createOpenDataClient({ fetchFn });
      const records = await client.fetchAll('resource-id');
      expect(records.length).toBe(600);
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('options', () => {
    it('uses custom baseUrl', async () => {
      const fetchFn = createMockFetch({ package_list: mockPackageList });
      const client = createOpenDataClient({ fetchFn, baseUrl: 'https://custom.data.gov.jm' });

      await client.listDatasets();
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.data.gov.jm'),
        expect.any(Object),
      );
    });

    it('throws on HTTP error', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });
      const client = createOpenDataClient({ fetchFn });

      await expect(client.listDatasets()).rejects.toThrow('Open Data API error: HTTP 500');
    });
  });
});
