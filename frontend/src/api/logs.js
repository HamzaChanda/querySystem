const API_URL = 'http://localhost:4000/logs';

export async function fetchLogs(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function postLog(log) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error('Failed to post log');
  return res.json();
} 