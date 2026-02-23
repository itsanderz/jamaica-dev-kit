const API_BASE_URL =
  process.env.NEXT_PUBLIC_AI_ASSISTANT_API_URL || "http://localhost:8001";

export interface ChatResponse {
  response: string;
  session_id: string;
  sources?: string[];
}

export interface Agency {
  id: string;
  name: string;
  description?: string;
}

export interface Fee {
  id: string;
  agency_id: string;
  service: string;
  amount: number;
  currency: string;
  description?: string;
}

/**
 * Send a chat message to the AI assistant backend.
 */
export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch the list of government agencies.
 */
export async function getAgencies(): Promise<Agency[]> {
  const res = await fetch(`${API_BASE_URL}/api/agencies`);

  if (!res.ok) {
    throw new Error(`Agencies request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch fees for a specific government agency.
 */
export async function getFees(agencyId: string): Promise<Fee[]> {
  const res = await fetch(`${API_BASE_URL}/api/agencies/${agencyId}/fees`);

  if (!res.ok) {
    throw new Error(`Fees request failed with status ${res.status}`);
  }

  return res.json();
}
