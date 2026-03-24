/**
 * lib/api.js
 * Service layer abstraction for API configuration.
 * The useChat hook handles the primary /api/chat communication,
 * but this module is available for any custom fetch logic or interceptors.
 */

export const API_BASE = "/api";

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - fetch options
 */
export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response;
}
