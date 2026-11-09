const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  stats: () => get("/stats"),
  blocks: (limit = 10) => get(`/blocks?limit=${limit}`),
  block: (id) => get(`/blocks/${id}`),
  transactions: (limit = 10) => get(`/transactions?limit=${limit}`),
  transaction: (hash) => get(`/transactions/${hash}`),
  address: (addr) => get(`/addresses/${addr}`),
};