const API_BASE =
  process.env.NEXT_PUBLIC_ADDRESSING_API_URL || "http://localhost:8002";

export interface LocationResponse {
  plus_code: string;
  latitude: number;
  longitude: number;
  parish?: string;
  formatted_address?: string;
  locality?: string;
}

export interface Parish {
  name: string;
  capital: string;
  population: number;
  latitude: number;
  longitude: number;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `API error ${res.status}: ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return res.json() as Promise<T>;
}

/**
 * Encode latitude/longitude into a Plus Code.
 */
export function encode(
  lat: number,
  lng: number
): Promise<LocationResponse> {
  return apiFetch<LocationResponse>(
    `/api/v1/encode?latitude=${lat}&longitude=${lng}`
  );
}

/**
 * Decode a Plus Code into coordinates and location info.
 */
export function decode(plusCode: string): Promise<LocationResponse> {
  return apiFetch<LocationResponse>(
    `/api/v1/decode?plus_code=${encodeURIComponent(plusCode)}`
  );
}

/**
 * Geocode a text address to coordinates and Plus Code.
 */
export function geocode(address: string): Promise<LocationResponse> {
  return apiFetch<LocationResponse>(
    `/api/v1/geocode?address=${encodeURIComponent(address)}`
  );
}

/**
 * Reverse geocode coordinates to an address and Plus Code.
 */
export function reverse(
  lat: number,
  lng: number
): Promise<LocationResponse> {
  return apiFetch<LocationResponse>(
    `/api/v1/reverse?latitude=${lat}&longitude=${lng}`
  );
}

/**
 * Retrieve list of Jamaican parishes with metadata.
 */
export function getParishes(): Promise<Parish[]> {
  return apiFetch<Parish[]>(`/api/v1/parishes`);
}
